const fs = require('fs')
const { join } = require('path')
const config = require('../config')

const builds = []

const loadAllBuilds = () => {
    fs.readdir(config.buildPath, (err, files) => {
        if (err) throw err

        files.forEach(file => {
            if (!file.startsWith('spmod')) return

            let stat = fs.statSync(join(config.buildPath, file))

            let parts = file.split('-')
            let commit = parts[3]
            let build = parts[2]

            const isExists = builds.filter(b => b.build === build)[0]

            if (!isExists) {
                builds.push({
                    build,
                    commit,
                    files: [{
                        file,
                        size: stat.size / 1024.0
                    }]
                })
            } else {
                const index = builds.indexOf(isExists)

                builds[index]['files'].push({file, size: stat.size / 1024})
            }
        })
    })
}
try {
    loadAllBuilds()
} catch (e) {
    console.log(e.message)
}

exports.findOne = (id) => {
    return builds.filter(b => b.build === id)[0]
}

exports.find = () => {
    return builds
}
