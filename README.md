# spmod-web
A web application that, upon receiving a notification from AWS SNS, downloads specific files in a notification from AWS S3. The downloaded files are stored on the server and displayed on the page ready for download.

Live demo: [Here](https://build.spmod.eu/)
## Prerequisites
What things you need to install the software and how to install them

* [node.js](https://nodejs.org/en/) (12.18.3 or above)
* npm
* [gulp](https://gulpjs.com/)

## Installation
### Prerequisites
1. Clone spmod-web repository ```git clone https://github.com/sxbrsky/spmod-web.git```
2. Enter repository dir
3. Rename ```config/config.example.json``` to ```config/config.json``` and edit if necessary

### Install
1. Install dependencies
```npm install```
2. Start server
```npm run prod```

### Notes
```npm install``` automatically calls ```gulp build``` which prepares all the assets such as javascript and css

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/sxbrsky/spmod-web/tags). 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details