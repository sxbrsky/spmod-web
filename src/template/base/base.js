const header = require('./headers')()
const footer = require('./footer')()

module.exports = data => `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            
            <link rel="stylesheet" href="/static/css/spmod.css" />
        
            <title>SPMod.eu - Builds</title>
        </head>
        <body>
            <div id="root">${header}${data}${footer}</div>
        </body>
    </html>
`