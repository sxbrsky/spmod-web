const storage = require('../storage')

module.exports = {
    all: (req, res) => {
        const builds = storage.getBuilds()

        return res.status(200).json(builds)
    },
    get: (req, res) => {
        const id = req.params[':id']
        const build = storage.getBuild(id)

        if (!build) {
            return res.status(404).send('Not found')
        }

        return res.status(200).json(build)
    }
}