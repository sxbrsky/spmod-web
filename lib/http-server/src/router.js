class Router {
    constructor() {
        this.routes = []
    }

    dispatch (path, method) {
        const replaced = path.replace(/[0-9]{1,10}/g, ':id')

        const route = this.routes.filter(r => r.path === replaced && r.method === method)[0]
        const match = {}
        
        if (route) {
            match.path = route.path
            match.handler = route.handler
            const param = path.match(/[0-9]{1,10}/g)

            match.params = {
                ':id': param ? param[0] : null
            }
        }
        return match ? match : null
    }

    route (method, path, handler) {
        this.routes.push({ method, path, handler })
    }

    get (path, handler) {
        this.routes.push({ method: 'GET', path, handler })
    }

    post (path, handler) {
        this.routes.push({ method: 'POST', path, handler })
    }
}

module.exports = Router