const { readFileSync } = require('fs')
const { resolve, join } = require('path')

const rootPath = resolve(__dirname, '..', '..')

function loadCertFiles(baseConfig) {
    let config = {https: {}}
    if (baseConfig && baseConfig.https) {
        ['key', 'cert', 'ca'].forEach(key => {
            if (baseConfig.https[key]) {
                config.https[key] = readFileSync(join(rootPath, baseConfig.https[key]))
            }
        })
    }
    return config
}

function buildDirs(baseConfig) {
    let config = {}
    if (baseConfig && baseConfig.dirs) {
        Object.keys(baseConfig.dirs).forEach(key => {
            if (baseConfig.dirs[key]) {
                config[key] = join(rootPath, baseConfig.dirs[key])
            }
        })
    }
    return config
}

function build () {
    const baseConfig = require(join(rootPath, `config/config.json`))
    const config = {}

    Object.keys(baseConfig).forEach(key => {
        if (key !== 'https' && key !== 'dirs') {
            config[key] = baseConfig[key]
        }
    })

    Object.assign(config, loadCertFiles(baseConfig), buildDirs(baseConfig))

    return config
}

module.exports = build()