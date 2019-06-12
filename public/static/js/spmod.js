const parseRequestURL = () => {
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/")
    let request = {
        resource    : null,
        id          : null,
        verb        : null
    }
    request.resource    = r[1]
    request.id          = r[2]
    request.verb        = r[3]

    return request
}

const builds = [
    {
        build: 310,
        files: [
            'spmod-linux-v0.2.0-alpha-clang9-static.tar.xz',
            'spmod-linux-v0.2.0-alpha-gcc9-dynamic.tar.xz'
        ]
    },
    {
        build: 320,
        files: [
            'spmod-linux-v0.2.0-alpha-clang9-static.tar.xz',
            'spmod-linux-v0.2.0-alpha-gcc9-dynamic.tar.xz'
        ]
    }
]

const renderMainPage = () => {
    let view = ''

    builds.forEach(b => {
        let url = `<td><i class="fas fa-folder"></i><a href='#/b/${b.build}'>${b.build}/</a></td>`
        view += `<tr>${url}<td>-</td></tr>`
    })

    return view
}

const renderBuildPage = (id) => {   
    const build = builds.filter(b => 310 === b.build )[0]
    let view = `<tr><td><i class="fas fa-level-up-alt"></i><a href='/'>Parent directory</a></td><td></td></tr>`
    
    build.files.forEach(file => {
        view += `<tr><td><i class="far fa-file-archive"></i> <a href='${file}' download>${file}</td><td>-</td></tr>`
    })

    return view
}

const app = () => {
    const table = document.querySelector("#builds > tbody")

    let req = parseRequestURL()
    let url = (req.resource ? '/' + req.resource : '/') + (req.id ? '/:id' : '') + (req.verb ? '/' + req.verb : '')
    let page

    if (url === '/') {
        page = renderMainPage()
    } else if ( url === '/b/:id') {
        page = renderBuildPage(req.id)
    }

    table.innerHTML = page
}



window.addEventListener("hashchange", app)
window.addEventListener('load', app)