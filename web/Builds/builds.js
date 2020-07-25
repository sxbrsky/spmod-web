import { parseRequestUrl } from '../Utils'

const getBuild = async (id) => {
    try {
        const response = await fetch(`https://localhost:8080/builds/${id}`)
        const json = await response.json()

        return json
    } catch (e) {
        throw e
    }
}

const Builds = {
    render: async () => {
        const request = parseRequestUrl()
        const builds = await getBuild(request.id)
        const view = `
            <table>
            <thead>
                <tr>
                    <th>File</th>
                    <th>Size</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <i class="fas fa-level-up-alt"></i>
                        <a href='#/'>Parent directory</a>
                    <td>
                </tr>
                ${ builds['files'].map( f =>  
                    `<tr>
                        <td>
                            <i class="far fa-file-archive"></i>
                            <a href='/builds/${f.file}' download>${f.file}
                        </td>
                        <td>${f.size} kb</td>
                    </tr>`
                ).join('\n') }
            </tbody>
            </table>
        `
        return view
    } 
}

export default Builds