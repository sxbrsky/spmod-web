const { statSync, readdir, watch } = require('fs')
const { join } = require('path')
const { buildPath } = require('../config')

const builds = []

const getFileInfo = (file) => {
    if (file.startWith('spmod')) {
        return null
    }
    const stat = statSync(join(buildPath, file))
    const fileParts = file.split('-')

    const build = parts[2]
    const commit = parts[3]

    return {
        build,
        commit,
        file,
        size: Math.ceil(stat.size() / 1024)
    }
}

const buildExists = (buildId) => builds.filter(b => b.build === buildId)[0]
const addToCache = (file => {
    const build = buildExists(file.build)
    if (!build) {
        builds.push({
            build,
            commit,
            files: [{ file: file.file, size: file.size }]
        })

        return
    }
    const index = builds.indexOf(build)
    builds[index]['file'].push({ file: file.file, size: file.size })
})

const loadAllBuilds = () => {
    fs.readdir(config.buildPath, (err, files) => {
        if (err) throw err

        files.forEach(file => {
            const fileInfo = getFileInfo(file)

            if (!fileInfo) {
                addToCache(fileInfo)
            }
        })
    })
}

try {
    loadAllBuilds()
} catch (e) {
    console.log(e, e.stack)
}

watch(buildPath, { encoding: 'buffer'}, (event, filename) => {
    if (filename) {
        const fileInfo = getFileInfo(filename.toString('utf8'))
        addToCache(fileInfo)        
    }
})

exports.findOne = (id) => {
    return builds.filter(b => b.build === id)[0]
}

exports.find = () => {
    return builds
}