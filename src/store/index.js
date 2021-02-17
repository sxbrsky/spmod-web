const fs = require('fs')
const { join } = require('path')
const { path } = require('../config')

const builds = []
fs.readdir(path.buildPath, (error, files) => {
    if (error) {
        console.error(error)
        return
    }

    files.forEach(file => {
        const fileInfo = getFileInfo(file)
        if (fileInfo !== null) {
            addToCache(fileInfo)
        }
    })
})

const getFileInfo = file => {
    if (!file.startsWith('spmod')) {
        return null
    }

    const stat = fs.statSync(join(path.buildPath, file))
    const fileParts = file.split('-')

    const build = fileParts[2]
    const commit = fileParts[3]

    return { build, commit, file, size: Math.ceil(stat.size / 1024) }
}

const addToCache = file => {
    const build = builds.filter(b => b.build === file.build)
    if (build.length > 0) {
        try {
            const index = builds.indexOf(build[0])
            builds[index]['files'].push({ file: file.file, size: file.size })
        } catch (error) {
            console.error(error)
        }
    } else {
        builds.push({
            build: file.build,
            commit: file.commit,
            files: [{ file: file.file, size: file.size }]
        })
    }
}

const removeFromCache = file => {
    builds.forEach(build => {
        const toRemove = build.files.filter(b => b.file === file)[0]
        const index = build.files.indexOf(toRemove)

        if (index > -1) {
            build.files.splice(index, 1)
        }
        if (build.files.length === 0) {
            const buildIndex = builds.indexOf(build)
            builds.splice(buildIndex, 1)
        }
    })
}

if (!fs.existsSync(path.buildPath)) {
    fs.mkdir(path.buildPath, error => {
        if (error) {
            console.error(error)
        }
    })
}

fs.watch(path.buildPath, { encoding: 'utf8' }, (event, filename) => {
    const fullPath = join(path.buildPath, filename)

    if (fs.existsSync(fullPath) && event === 'change') {
        const fileInfo = getFileInfo(filename)
        addToCache(fileInfo)

        return
    }

    removeFromCache(fullPath)
})

exports.findOne = (build) => builds.filter(b => b.build === build)[0]
exports.find = () => builds
