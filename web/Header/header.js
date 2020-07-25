import './header.scss'

const Header = {
    before_render: async () => {
        const header = document.createElement('header')
        header.className = 'header'

        return header
    },
    render: async () => {
        const view = `
            <div class="brand">
                <h1>SPMod</h1>
            </div>
        `

        return view
    }
}

export default Header

