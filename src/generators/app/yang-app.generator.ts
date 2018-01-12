import {YangGenerator} from "../yang.generator";
import * as path from "path";
import * as extend from "deep-extend";
import chalk from "chalk";
import {EOL} from 'os';
import {Argv} from "yargs";
import {YangFeatureGenerator} from "../feature/yang-feature.generator";
import {YangHomeGenerator} from "../home/yang-home.generator";
import {FileUtils} from "../../helpers/file-utils";

const commandExists = require('command-exists').sync;

export class YangAppGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['name'] = this.options['name'] || path.basename(process.cwd());
        this.props['description'] = this.props.name;
    }


    _configuring() {
        super._configuring();
        this.props['dir'] = this.options['dir'] || `./${this.props['name']}`;

        // Surcharge de la racine pour ce répertoire
        this.root = this.directory;

        // Si le répertoire n'est pas vide : STOP
        if (FileUtils.exists(this.destinationPath(`${this.projectRoot}package.json`))) {
            console.log(chalk.bgRed(`Directory [${this.projectRoot}] is not empty !`));
            process.exit(1);
        }
    }


    async _writing(): Promise<void> {

        // Launch angular-cli
        if (!commandExists('ng')) {
            console.log(chalk.bgRed(`Angular CLI not available. Install it with 'npm i -g @angular/cli' or 'yarn global add @angular/cli'.`));
            process.exit(1);
        }

        this.spawnCommandSync('ng', ['new', this.props.name
            , '--style', 'scss'
            , '--directory', this.root
            , '--inline-style'
            , '--inline-template'
            // , '--skip-git'
            , '--skip-commit'
            , '--skip-install'
        ]);

        await super._writing();
        await this.copyTemplates();

        this.updatePolyfills();
        this.updatePackageJson();
        this.updateGitIgnore();

        await this.composeWith(new YangFeatureGenerator(), {
            'name': 'home',
            'with-component': true,
            'with-template': true,
            'with-styles': true
        });

        // Recopier les templates du home
        await this.composeWith(new YangHomeGenerator());

        // Faire le git commit
        if (commandExists('git')) {
            let spawnOpts = { cwd: this.root, stdio: 'ignore' };
            this.spawnCommandSync('git', ['add', '.'], spawnOpts);
            this.spawnCommandSync('git', ['commit', '-m', 'chore: initial commit from yang-cli'], spawnOpts);
        }
    }


    async _install() {
        await super._install();

        if (this.options['install'])
            this.spawnCommandSync("yarn", [], { cwd: this.props['dir']});
    }



    updatePolyfills(): void {
        const file = path.join(this.root, 'src', 'polyfills.ts');
        let content = FileUtils.read(file);
        content += `import 'whatwg-fetch';${EOL}`;

        FileUtils.write(file, content);
    }


    updatePackageJson(): void {
        const file = path.join(this.root, 'package.json');
        const pkg = FileUtils.readJSON(file);

        extend(pkg, {
            scripts: {
                "prebuild": "node prebuild.js",
                "prestart": "node prebuild.js"
            },
            dependencies: {
                "whatwg-fetch": "2.0.3",
                "@ngx-translate/core": "9.0.2",
                "lodash": "4.17.4",
                "moment": "2.20.1"
            },
            devDependencies: {
                "@types/lodash": "4.14.92"
            }
        });

        FileUtils.writeJSON(file, pkg);
    }


    updateGitIgnore(): void {
        const file = path.join(this.root, '.gitignore');
        let content = FileUtils.read(file);
        content += `${EOL}# Custom Files${EOL}`;
        content += `/src/assets/app-manifest.json${EOL}`;

        FileUtils.write(file, content);
    }
}
