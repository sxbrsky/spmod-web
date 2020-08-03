const fs = require('fs')
const { join } = require('path')
const { buildPath } = require('../config')

const builds = []

const getFileInfo = (file) => {
  if (!file.startsWith('spmod')) {
    return null
  }

  const stat = fs.statSync(join(buildPath, file))
  const fileParts = file.split('-')

  const build = fileParts[2]
  const commit = fileParts[3]

  return {
    build,
    commit,
    file,
    size: Math.ceil(stat.size / 1024)
  }
}

const buildExists = (buildId) => builds.filter(b => b.build === buildId)[0]
const addToCache = file => {
  const build = buildExists(file.build)

  if (!build) {
    builds.push({
      build: file.build,
      commit: file.commit,
      files: [{ file: file.file, size: file.size }]
    })

    return
  }
  const index = builds.indexOf(build)
  builds[index].file.push({ file: file.file, size: file.size })
}

const loadAllBuilds = () => {
  fs.readdir(buildPath, (err, files) => {
    if (err) throw err

    files.forEach(file => {
      const fileInfo = getFileInfo(file)

      if (fileInfo !== null) {
        addToCache(fileInfo)
      }
    })
  })
}

try {
  if (!fs.existsSync(buildPath)) {
    fs.mkdir(buildPath, err => console.log(err, err.stack))
  }

  loadAllBuilds()
} catch (e) {
  console.log(e, e.stack)
}

fs.watch(buildPath, { encoding: 'utf-8' }, (event, filename) => {
  const fullPath = join(buildPath, filename)
  if (fs.existsSync(fullPath)) {
    const fileInfo = getFileInfo(filename)
    addToCache(fileInfo)

    return
  }
  removeFromCache(filename)
})


const removeFromCache = (file) => {
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

exports.findOne = (id) => {
  return builds.filter(b => b.build === id)[0]
}

exports.find = () => {
  return builds
}
