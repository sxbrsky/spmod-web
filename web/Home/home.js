const getBuilds = async () => {
    try {
        const response = await fetch(`https://localhost:8080/builds`)
        const json = await response.json()

        return json
    } catch (e) {
        throw e
    }
}

const Home = {
    render: async () => {
        const builds = await getBuilds()
        const view = `
            <table>
            <thead>
                <tr>
                    <th>Build</th>
                    <th>Commit</th>
                </tr>
            </thead>
            <tbody>
                ${ builds.map( b => 
                    `<tr>
                        <td>
                            <i class="far fa-folder"></i> 
                            <a href='#/b/${b.build}'>${b.build}</a>
                        </td>
                        <td>
                            <a href="https://github.com/Amaroq7/SPmod/commit/${b.commit}">#${b.commit}</a>
                        </td>
                    </tr>`
                ).join('\n')}
            </tbody>
            </table>
        `
        return view
    } 
}

export default Home