const storage = require('../store')

module.exports = {
    init: app => {
        app.get('/', async (req, res) => {
            res.render('build/index', {
                builds: storage.find()
            })
        })

        app.get('/builds/:build' , async (req, res) => {
            const { build } = req.params
            const result = storage.findOne(build)

            res.render('build/view', {
                builds: storage.find(),
                build: result
            });
        })
    }
}