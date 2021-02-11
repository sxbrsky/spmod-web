module.exports = builds => `
    <table>
        <thead>
            <tr>
                <th>Build</th>
                <th>Commit</th>
            </tr>
        </thead>
        <tbody>
            ${builds.map(b => `
                <tr>
                    <td>
                        <i class="fas fa-folder"></i>
                        <a href=/builds/${b.build}>${b.build}</a>
                    </td>
                    <td>
                        <a href=https://github.com/Amaroq7/SPmod/commit/${b.commit}>${b.commit}</a>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
`