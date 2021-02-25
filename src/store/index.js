const fs = require('fs')
const { join } = require('path')
const config = require('../config')

const builds = []

if (!fs.existsSync(config.buildsDir)) {
    fs.mkdir(config.buildsDir, error => {
        if (error) {
            console.error(error)
        }
    })
}

fs.readdir(config.buildsDir, (error, files) => {
    if (error) {
        console.error(error)
        return
    }
    
    files.forEach(file => {
        const fileInfo = getFileInfo(file)

        if (fileInfo !== null) {
            setBuildToCache(fileInfo)
        }
    })
})

fs.watch(config.buildsDir, { encoding: 'utf8' }, (event, filename) => {
    const fullPath = join(config.buildsDir, filename)
    
    if (fs.existsSync(fullPath) && event === 'change') {
        const fileInfo = getFileInfo(filename)
        setBuildToCache(fileInfo)
    
        return
    }
    
    if (event === 'rename') removeBuildFromCache(filename)
})

const setBuildToCache = file => {
    const build = builds.filter(b => b.build === file.build)[0]

    if (build) {
        const index = builds.indexOf(build)
        builds[index]['files'].push({ file: file.file, size: file.size })
    } else {
        builds.unshift({
            build: file.build,
            commit: file.commit,
            files: [{ file: file.file, size: file.size }]
        })

        if (builds.length > 6) {
            builds.pop().files.forEach(file => fs.unlinkSync(join(config.buildsDir, file.file)))
        }
    }
}

const getFileInfo = file => {
    if (!file.startsWith('spmod')) {
        return null
    }
    
const stat = fs.statSync(join(config.buildsDir, file))
    const fileParts = file.split('-')
    
    const build = fileParts[2]
    const commit = fileParts[3]
    
    return { build, commit, file, size: Math.ceil(stat.size / 1024) }
}

const removeBuildFromCache = file => {
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

exports.find = () => builds
exports.findOne = build => builds.filter(b => b.build === build)[0]