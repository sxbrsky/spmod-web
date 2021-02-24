module.exports = builds => `
    <div class="builds">
        <div class="builds-list">
            ${builds.map(b => `
                <div class="builds-list--item" id=${b.build}>
                    <i class="fas fa-folder"></i>
                    <span id=${b.build}>${b.build}</span>
                </div>
            `).join("")}
        </div>
        <div class="build-info" id="info">
        </div>
    </div>
`