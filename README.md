[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/yang-cli.svg)](https://www.npmjs.com/package/yang-cli)
[![Build Status](https://travis-ci.org/mselerin/yang-cli.svg?branch=master)](https://travis-ci.org/mselerin/yang-cli)

# Yang Cli
> Yet Another Angular Generator

## Installation
> _(You have pre-installed [node.js](https://nodejs.org/), right ?)_

Install Yang-Cli using [yarn](https://yarnpkg.com/) `yarn global add yang-cli` or using [npm](https://www.npmjs.com/) `npm install -g yang-cli`.


## Usage
Yang-Cli is just a wrapper around [yang-schematics](https://github.com/mselerin/yang-schematics).  
It's main purpose is to avoid commands like `ng g yang-schematics:xxx` and write those as `yang xxx`  




## Commands
### New
`yang new my-awesome-project`
Scaffold a brand new application.

This will create a new folder `my-awesome-project` containing a fresh Angular application.
Just go inside this folder, install dependencies and run the project :
```bash
cd my-awesome-project
yarn
yarn start
```

Browse to http://localhost:4200.  
That's all !

***


### Feature
`yang feature my-super-feature`
Generates a complete feature under app/features.

##### Options
* `--with-component` : Add a new 'my-super-feature' component. Options from the 'component' generator are available.
***


### Component
`yang component my-nice-component`
Generates a stub component under the current directory.

`yang component my-shared-component --shared`
OR `yang component shared/my-shared-component` 
Generates a stub component under `app/shared/components`.

`yang component my-feature-component --feature my-super-feature`
OR `yang component my-super-feature/my-feature-component`
Generates a stub component under `app/features/my-super-feature/my-feature-component`.



##### Options
* `--with-styles` : Add a `name.component.scss`
* `--with-template` : Add a `name.component.html`
* `--flat` : Does not create a sub-folder for the component
***


### Directive
`yang directive my-small-directive`
Generates a stub directive under app/shared/directives.
***


### Module
`yang module my-modularized-module`
Generates a stub module.
***


### Service
`yang service my-cool-service`
Generates a stub service under app/services.
***


### Plugin
`yang plugin fantastic`
Call an external plugin installed globally.
***


## Global options
```
--force : Always overwrite files (never ask)
--help : Show help (no way !)
```

## License
MIT © [Michel Selerin]()


[npm-image]: https://badge.fury.io/js/yang-cli.svg
[npm-url]: https://npmjs.org/package/yang-cli
[travis-image]: https://travis-ci.org/mselerin/yang-cli.svg?branch=master
[travis-url]: https://travis-ci.org/mselerin/yang-cli
[daviddm-image]: https://david-dm.org/mselerin/yang-cli.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mselerin/yang-cli
