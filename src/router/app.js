const renderer = require('../template')
const storage = require('../store')

module.exports = app => {
    app.get('/', async (req, res) => {
        const builds = storage.find()
        const html = renderer('home', builds)

        res.status(200).send(html)
    })

    app.get('/builds/:build', async (req, res) => {
        const { build } = req.params

        const data = storage.findOne(build)
        if (!data) {
            return res.status(404).send(renderer('errors/404', build))
        }

        const html = renderer('build', data)

        res.status(200).send(html)
    })
}