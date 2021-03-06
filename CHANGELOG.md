# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="5.1.2"></a>
## [5.1.2](https://github.com/mselerin/yang-cli/compare/v5.1.1...v5.1.2) (2018-09-07)


### Bug Fixes

* unit test ([b3e05cd](https://github.com/mselerin/yang-cli/commit/b3e05cd))



<a name="5.1.1"></a>
## [5.1.1](https://github.com/mselerin/yang-cli/compare/v5.1.0...v5.1.1) (2018-09-07)



<a name="5.1.0"></a>
# [5.1.0](https://github.com/mselerin/yang-cli/compare/v5.0.0...v5.1.0) (2018-08-31)



<a name="5.0.0"></a>
# [5.0.0](https://github.com/mselerin/yang-cli/compare/v4.0.0...v5.0.0) (2018-06-26)


### Features

* removed the YangSimpleGenerateCommand -> need yang-schematics@2.x ([26f242c](https://github.com/mselerin/yang-cli/commit/26f242c))


### BREAKING CHANGES

* YangSimpleGenerateCommand removed



<a name="4.0.0"></a>
# [4.0.0](https://github.com/mselerin/yang-cli/compare/v3.1.0...v4.0.0) (2018-06-25)


### Bug Fixes

* travis build ([d117d2c](https://github.com/mselerin/yang-cli/commit/d117d2c))


### Features

* command aliases ([2c9da2d](https://github.com/mselerin/yang-cli/commit/2c9da2d))
* simplified call of schematics (just pass the arguments to ng-cli) ([824f372](https://github.com/mselerin/yang-cli/commit/824f372))
* yang help command ([28491b6](https://github.com/mselerin/yang-cli/commit/28491b6), [6b523ba](https://github.com/mselerin/yang-cli/commit/6b523ba))


### BREAKING CHANGES

* Simplified commands



<a name="3.1.0"></a>
# [3.1.0](https://github.com/mselerin/yang-cli/compare/v3.0.2...v3.1.0) (2018-05-17)


### Features

* check plugin availability before running (same as the 'new' command) ([ada583a](https://github.com/mselerin/yang-cli/commit/ada583a))
* 'new' command based on the 'ng-new' schematic from yang-schematics ([e259398](https://github.com/mselerin/yang-cli/commit/e259398))
* 'new' command check for @angular/cli and yang-schematics. If not present, propose to install-it automatically. ([3f4b52e](https://github.com/mselerin/yang-cli/commit/3f4b52e))
* quiet option for 'new' command (usefull for unit-testing) ([9e12354](https://github.com/mselerin/yang-cli/commit/9e12354))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/mselerin/yang-cli/compare/v3.0.1...v3.0.2) (2018-05-14)

* update version for yang-schematics



<a name="3.0.1"></a>
## [3.0.1](https://github.com/mselerin/yang-cli/compare/v3.0.0...v3.0.1) (2018-05-11)


### Bug Fixes

* detection of schematic name with yang plugin ([9516ed1](https://github.com/mselerin/yang-cli/commit/9516ed1))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/mselerin/yang-cli/compare/v2.0.1...v3.0.0) (2018-05-11)


### Features

* Using yang-schematics ([#13](https://github.com/mselerin/yang-cli/issues/13)) ([5a2b048](https://github.com/mselerin/yang-cli/commit/5a2b048))
* call external schematics with yang xxx (also works with yang [@org](https://github.com/org)/schematics) ([7bb9e9d](https://github.com/mselerin/yang-cli/commit/7bb9e9d))


### Bug Fixes

* npmignore ([51a934b](https://github.com/mselerin/yang-cli/commit/51a934b))
* travis config ([6aa74c2](https://github.com/mselerin/yang-cli/commit/6aa74c2))


### Code Refactoring

* generator -> command ([340ce57](https://github.com/mselerin/yang-cli/commit/340ce57))


### BREAKING CHANGES

* bye-bye generator, welcome command :-)
* Yang is now just a runner for yang-schematics. No more plugin command available (rewrite the plugin with schematics)





<a name="2.0.1"></a>
## [2.0.1](https://github.com/mselerin/yang-cli/compare/v2.0.0...v2.0.1) (2018-05-11)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/mselerin/yang-cli/compare/v1.3.0...v2.0.0) (2018-05-08)


### Bug Fixes

* e2e base test ([cd188b5](https://github.com/mselerin/yang-cli/commit/cd188b5))
* Feature routing based on path alias ([fcc6b66](https://github.com/mselerin/yang-cli/commit/fcc6b66))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/mselerin/yang-cli/compare/v1.2.3...v1.3.0) (2018-04-03)



<a name="1.2.3"></a>
## [1.2.3](https://github.com/mselerin/yang-cli/compare/v1.2.2...v1.2.3) (2018-04-03)



<a name="1.2.2"></a>
## [1.2.2](https://github.com/mselerin/yang-cli/compare/v1.2.1...v1.2.2) (2018-03-12)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/mselerin/yang-cli/compare/v1.2.0...v1.2.1) (2018-02-23)


### Bug Fixes

* Remove --dir options for the 'new' generator. See https://github.com/angular/angular-cli/issues/9655 ([4c6c2e5](https://github.com/mselerin/yang-cli/commit/4c6c2e5))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/mselerin/yang-cli/compare/v1.1.0...v1.2.0) (2018-02-06)


### Bug Fixes

* remove prepublish, replace by prepack ([ac52220](https://github.com/mselerin/yang-cli/commit/ac52220))
* Removing apiUrl from config ([728dff4](https://github.com/mselerin/yang-cli/commit/728dff4))
* TSLint ([22f7ea6](https://github.com/mselerin/yang-cli/commit/22f7ea6))


### Features

* Add skip-git flag to generate a new app ([243caf1](https://github.com/mselerin/yang-cli/commit/243caf1))
* Log on delete file ([c547735](https://github.com/mselerin/yang-cli/commit/c547735))
* Supports plugin with scoped name ([5e10c2a](https://github.com/mselerin/yang-cli/commit/5e10c2a))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/mselerin/yang-cli/compare/v1.0.0...v1.1.0) (2018-01-15)


### Bug Fixes

* Add tsconfig.json (which simply extends tsconfig.app.json) for IntelliJ TypeScript Service ([4501441](https://github.com/mselerin/yang-cli/commit/4501441))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/mselerin/yang-cli/compare/v0.11.2...v1.0.0) (2018-01-12)



<a name="0.11.2"></a>
## [0.11.2](https://github.com/mselerin/yang-cli/compare/v0.11.1...v0.11.2) (2018-01-10)



<a name="0.11.1"></a>
## [0.11.1](https://github.com/mselerin/yang-cli/compare/v0.11.0...v0.11.1) (2018-01-10)



<a name="0.11.0"></a>
# [0.11.0](https://github.com/mselerin/yang-cli/compare/v0.10.0...v0.11.0) (2018-01-08)



<a name="0.10.0"></a>
# [0.10.0](https://github.com/mselerin/yang-cli/compare/v0.9.5...v0.10.0) (2018-01-05)



<a name="0.9.5"></a>
## [0.9.5](https://github.com/mselerin/yang-cli/compare/v0.9.4...v0.9.5) (2018-01-05)



<a name="0.9.4"></a>
## [0.9.4](https://github.com/mselerin/yang-cli/compare/v0.9.3...v0.9.4) (2018-01-05)



<a name="0.9.3"></a>
## [0.9.3](https://github.com/mselerin/yang-cli/compare/v0.9.1...v0.9.3) (2017-11-27)



<a name="0.9.1"></a>
## [0.9.1](https://github.com/mselerin/yang-cli/compare/v0.9.0...v0.9.1) (2017-11-03)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/mselerin/yang-cli/compare/v0.8.1...v0.9.0) (2017-11-03)



<a name="0.8.1"></a>
## [0.8.1](https://github.com/mselerin/yang-cli/compare/v0.8.0...v0.8.1) (2017-10-24)



<a name="0.8.0"></a>
# [0.8.0](https://github.com/mselerin/yang-cli/compare/v0.7.2...v0.8.0) (2017-10-24)



<a name="0.7.2"></a>
## [0.7.2](https://github.com/mselerin/yang-cli/compare/v0.7.1...v0.7.2) (2017-10-24)



<a name="0.7.1"></a>
## [0.7.1](https://github.com/mselerin/yang-cli/compare/v0.7.0...v0.7.1) (2017-10-24)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/mselerin/yang-cli/compare/v0.6.0...v0.7.0) (2017-10-24)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/mselerin/yang-cli/compare/v0.5.0...v0.6.0) (2017-10-24)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/mselerin/yang-cli/compare/v0.4.0...v0.5.0) (2017-10-19)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/mselerin/yang-cli/compare/v0.3.3...v0.4.0) (2017-10-19)



<a name="0.3.3"></a>
## [0.3.3](https://github.com/mselerin/yang-cli/compare/v0.3.2...v0.3.3) (2017-10-19)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/mselerin/yang-cli/compare/v0.3.1...v0.3.2) (2017-10-19)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/mselerin/yang-cli/compare/v0.3.0...v0.3.1) (2017-10-19)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/mselerin/yang-cli/compare/v0.2.0...v0.3.0) (2017-10-19)



<a name="0.2.0"></a>
# 0.2.0 (2017-10-19)



