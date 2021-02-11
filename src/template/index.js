module.exports = (template, data) => {
    const childTemplateData = require(`./${template}`)(data)
    const parentData = require('./base/base')(childTemplateData)

    return parentData
}