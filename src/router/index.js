module.exports = app => {
    require('./app')(app)
    require('./aws')(app)
}