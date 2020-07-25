import { parseRequestUrl } from './Utils'

import Header from './Header/header'
import Footer from './Footer/footer'

import Builds from './Builds/builds'
import Home from './Home/home'

import 'normalize.css'
import './spmod.scss'

const routes = {
    '/' : Home,
    '/b/:id' : Builds
}

const router = async () => {
    const header = null || document.querySelector("#app > header")
    const content = null || document.querySelector("#app > main")
    const footer = null || document.querySelector("#app > footer")

    const req = parseRequestUrl()
    const url = (req.resource ? '/' + req.resource : '/') + (req.id ? '/:id' : '') + (req.verb ? '/' + req.verb : '')

    const page = routes[url]

    header.innerHTML = await Header.render()
    content.innerHTML = await page.render()
    footer.innerHTML = await Footer.render()
}

window.onload = async (e) => {
    e.preventDefault()

    const app = null || document.querySelector("#app")

    const content = document.createElement('main')
    content.className = 'container'

    const header = await Header.before_render()
    const footer = await Footer.before_render()

    app.appendChild(header)
    app.appendChild(content)
    app.appendChild(footer)

}
window.addEventListener("hashchange", router)
window.addEventListener('load', router)