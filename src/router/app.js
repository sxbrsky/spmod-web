const renderer = require('../template')
const storage = require('../store')
const config = require('../config')

module.exports = app => {
    app.get('/', async (req, res) => {
        const builds = storage.find()
        const html = renderer('home', builds)

        res.push(`${config.path.staticPath}/static/css/main.css`)
        res.html(html)
    })

    app.get('/builds/:build', async (req, res) => {
        const { build } = req.params

        const data = storage.findOne(build)
        const html = renderer('build', data)

        res.status(200)
        res.html(html)
    })
}