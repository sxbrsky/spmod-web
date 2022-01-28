const { readdir, mkdir, watch, statSync, unlinkSync, existsSync } = require('fs')
const { join } = require('path')

const builds = []

/**
 * @param {string} buildsDir
 * @param {number} maxBuildsOnPage
 */
exports.init = (buildsDir, maxBuildsOnPage) => {
    if (existsSync(buildsDir)) {
        mkdir(buildsDir, err => {
            if (err) {
                console.error(err.message)
            }
        })
    }

    watch(buildsDir, { encoding: 'utf8' }, (event, filename) => {
        const fullPath = join(buildsDir, filename)

        switch (event) {
            case 'rename': removeBuildFromCache(filename)
            case 'change': {
                if (existsSync(fullPath)) {
                    const file = getFileInformation(filename)
                    return setBuildToCache(file)
                }
            }
        }
    })

    readdir(buildsDir, (error, files) => {
        if (error) {
            return console.error(error)
        }

        files.forEach(file => {
            const fileInfo = getFileInformation(file)

            if (fileInfo !== null) {
                setBuildToCache(fileInfo)
            }
        })
    })

    const getFileInformation = file => {
        if (!file.startsWith('spmod')) {
            return null;
        }

        const stat = statSync(join(buildsDir, file))
        const parts = file.split('-')

        return {
            build: parts[2],
            commit: parts[3],
            file: file,
            size: Math.ceil((stat.size / 1024) / 1024)
        }
    }

    const setBuildToCache = file => {
        const build = builds.filter(build => build.name === file.build)[0]

        if (build) { 
            const idx = builds.indexOf(build)
            builds[idx]['files'].push({
                file: file.file,
                size: file.size
            });
        } else {
            builds.unshift({
                build: file.build,
                commit: file.commit,
                files: [{
                    file: file.file, 
                    size: file.size 
                }]
            })

            if (builds.length > maxBuildsOnPage) {
                builds.pop().files.forEach(file => unlinkSync(join(buildsDir, file.file)))
            }
        }
    }

    const removeBuildFromCache = file => {
        builds.forEach(build => {
            const toRemove = build.files.filter(f => f.file === file)[0]
            const idx = build.files.indexOf(toRemove)
        
            if (idx > -1) {
                build.files.splice(index, 1)
            }

            if (build.files.length === 0) {
                const bIdx = builds.indexOf(build)
                builds.splice(bIdx, 1)
            }
        })
    }
}

exports.find = () => builds,
exports.findOne = build => builds.filter(b => b.build === build)[0]
