const storage = require('../storage')

const all = (req, res) => {
    const builds = storage.find()

    if (!builds) {
        res.status(404)
        res.send('Not found')

        return res
    }

    return res.status(200).json(builds)
}

const get = (req, res) => {
    const id = req.params[':id']
    const build = storage.findOne(id)

    if (!build) {
        res.status(404)
        res.send('Not found')

        return res
    }

    return res.status(200).json(build)
}

module.exports = {
    getBuilds: all,
    getBuild: get
}