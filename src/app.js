const path = require('path')
const express = require('express')
const { engine } = require('express-handlebars')
const morgan = require('morgan')
const config = require('./config')

const app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.text())
app.use(morgan('combined'))

app.use(express.static(config.staticDir))
app.use('/uploads/build', express.static(config.buildsDir))

app.engine('.hbs', engine({
    defaultLayout: 'base',
    extname: '.hbs',
    layoutsDir: path.join(__dirname),
    partialsDir: path.join(__dirname)
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname))

//require('./aws').init(app)
require('./build').init(app)

module.exports = app