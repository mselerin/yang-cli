# Yang
> Yet Another Angular Generator - powered by Yeoman & Webpack

## Installation
> _(You have pre-installed [node.js](https://nodejs.org/), right ?)_

Install Yang using [yarn](https://yarnpkg.com/) `yarn global add yang-cli` or using [npm](https://www.npmjs.com/) `npm install -g yang-cli`.


## Usage
Generate your new project inside any folder:

```bash
yang my-awesome-project
```

This will create a new folder `my-awesome-project` containing a fresh Angular application.
Just go inside this folder, install dependencies and run the project :
```bash
cd my-awesome-project
yarn
yarn start
```

Browse to http://localhost:3000.
That's all !


## Commands
### App
`yang app my-awesome-project`
Scaffold a brand new application.
***


### Feature
`yang feature my-super-feature`
Generates a complete feature under app/features.

##### Options
* styles : Add a `name.component.scss`
***


### Component
`yang component my-nice-component`
Generates a stub component under the current directory.

`yang component my-shared-component --shared`
Generates a stub component under `app/shared/components`.

`yang component my-feature-component --feature my-super-feature`
Generates a stub component under `app/features/my-super-feature/my-feature-component`.

##### Options
* styles : Add a `name.component.scss`
***


### Directive
`yang directive my-small-directive`
Generates a stub directive under app/shared/directives.
***


### Service
`yang service my-cool-service`
Generates a stub service under app/services.
***



## License
MIT © [Michel Selerin]()


[npm-image]: https://badge.fury.io/js/yang-cli.svg
[npm-url]: https://npmjs.org/package/yang-cli
[travis-image]: https://travis-ci.org/mselerin/yang-cli.svg?branch=master
[travis-url]: https://travis-ci.org/mselerin/yang-cli
[daviddm-image]: https://david-dm.org/mselerin/yang-cli.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mselerin/yang-cli
