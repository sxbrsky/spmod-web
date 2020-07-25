import './footer.scss'

const Footer = {
    before_render: async () => {
        const footer = document.createElement('footer')
        footer.className = 'header'

        return footer
    },
    render: async () => {
        const view = `
            <span>© Copyright 2019 - 2020 <a href="https://github.com/FFx0q">FFx0q</a></span>
        `

        return view
    }
}

export default Footer