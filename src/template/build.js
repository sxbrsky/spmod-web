module.exports = build => `
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
                    <a href='/'>Parent directory</a>
                </td>
                <td><td />
            </tr>
            ${build.files.map(f => `
            <tr>
                <td>
                    <i class="fas fa-file-archive"></i>
                    <a href=/static/builds/${f.file} download>${f.file}</a>
                </td>
                <td>${f.size} kb</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
`