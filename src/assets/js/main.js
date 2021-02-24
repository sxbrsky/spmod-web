const apiUrl = 'https://build.spmod.eu'

const getCache = key  => {
    const getFromApi = async key => {
        return fetch(`${apiUrl}/builds/${key}`)
            .then(res => res.json())
            .then(res => {
                localStorage.setItem(res.build, JSON.stringify(res))
                return res
            })
            .catch(error => { throw error })
    }
    
    const getFromStorage = key => new Promise((resolve, reject) => {
        const data = localStorage.getItem(key)

        try {
            resolve(JSON.parse(data))
        } catch (error) {
            reject(error)
        }
    })

    return localStorage.getItem(key) ? getFromStorage(key) : getFromApi(key)
}

const buildHTML = build => {
    document.querySelector("#info").innerHTML = build.map(b => `
    <div class="build-header">
        <h3>Build: <span>${b.build}</span></h3>
        <h3>Commit: <a href=https://github.com/Amaroq7/SPmod/commit/${b.commit}>${b.commit}</a></h3>
    </div>
    <div class="build-files">
        <h3>Files: </h3>
        ${b.files.map(f => `
            <div class="build-files--item">
                <i class="fas fa-file-archive"></i>
                <a href="/build/${f.file}" download>${f.file} (${(f.size / 1024).toFixed(2)} MB)</a>
            </div>
        `).join('')}
    </div>
`).join('')
}
window.onload = async ev => {
    const res = await fetch(`${apiUrl}/builds/latest`)
    const latest = await res.json()

    buildHTML([latest])
}

window.onclick = async ev => {
    const match = ev.target.matches('.builds-list--item') || ev.target.matches('.builds-list--item > span')

    if (match) {
        const { id } = ev.target
        const data = await getCache(id).catch(error => console.error(error))
        
        buildHTML([data])

    }
}
