module.exports = {
    name: 'spmod-web',
    script: 'src/server.js',
    error_file: 'logs/error.log',
    out_file: 'logs/info.log',
    env_development: {
        NODE_ENV: "development",
        watch: ["src/"],
    },
    env_production: {
        NODE_ENV: "production",
        exec_mode: "cluster",
        instances: 2,
        watch: false
    }
}