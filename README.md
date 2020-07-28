# spmod-web
web application for downloading and displaying builds from AWS S3.

## Getting Started
### Prerequisites

What things you need to install the software and how to install them

* Node.js (12.18.3 or above)
* NPM
* Nginx

### Installing
#### Prerequisites
1. Clone spmod-web repository
```git clone https://github.com/FFx0q/spmod-web.git```

#### Install
1. Enter repository dir
2. Run build command
```npm run start:prod```
3. Setup nginx as reverse proxy
```
location ~ / {
    proxy_pass https://127.0.0.1:8080/
}
```
## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/FFx0q/spmod-web/tags). 

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details