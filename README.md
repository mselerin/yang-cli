[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/yang-cli.svg)](https://www.npmjs.com/package/yang-cli)
[![Build Status](https://travis-ci.org/mselerin/yang-cli.svg?branch=master)](https://travis-ci.org/mselerin/yang-cli)

# Yang Cli
> Yet Another Angular Generator

## Installation
> _(You have pre-installed [node.js](https://nodejs.org/), right ?)_

Install Yang-Cli using [npm](https://www.npmjs.com/) `npm install -g yang-cli`.


## Usage
Yang-Cli is just a wrapper around @angular/cli and [yang-schematics](https://github.com/mselerin/yang-schematics).  
It's main purpose is to avoid commands like `ng g yang-schematics:xxx` and write those as `yang xxx`  

Every cli parameters are passed 'as-is' to @angular/cli.

The first parameter is the Yang schematic short-name (ex: 'component' for 'yang-schematic:component'). 
If this name contains a slash ('/'), the cli assume you want to call a yang-schematic extension.
For example the command `yang @corp/stuff` is a shortcut for `ng g @corp/yang-schematic:stuff`.


## Available schematics
Just read the [yang-schematics](https://github.com/mselerin/yang-schematics) docs ;-)


## Special Commands
### New
`yang new my-awesome-project`
Scaffold a brand new application.

This will create a new folder `my-awesome-project` containing a fresh Angular application.
Just go inside this folder, install dependencies and run the project :
```bash
cd my-awesome-project
npm install
npm run start
```

Browse to http://localhost:4200.  
That's all !

***


### Help
`yang help`
Print all available schematics.

***


## License
MIT © [Michel Selerin]()


[npm-image]: https://badge.fury.io/js/yang-cli.svg
[npm-url]: https://npmjs.org/package/yang-cli
[travis-image]: https://travis-ci.org/mselerin/yang-cli.svg?branch=master
[travis-url]: https://travis-ci.org/mselerin/yang-cli
[daviddm-image]: https://david-dm.org/mselerin/yang-cli.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mselerin/yang-cli
