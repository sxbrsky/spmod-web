const storage = require('../storage')

module.exports = [
  {
    method: 'GET',
    path: '/api/builds',
    handler: async (req, h) => {
      const builds = storage.find()

      return h.response(builds).code(200)
    }
  }, {
    method: 'GET',
    path: '/api/builds/{id}',
    handler: async (req, h) => {
      const id = req.params.id
      const build = storage.findOne(id)

      if (build === null) {
        return h.response('Not found').code(404)
      }

      return h.response(build).code(200)
    }
  }
]
