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
    private skipGit: boolean = false;

    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('skip-git', { type: 'boolean', default: false, describe: 'Skip git' })
        ;
    }

    _initializing(): void {
        super._initializing();
        this.props['name'] = this.options['name'] || path.basename(process.cwd());
        this.props['description'] = this.props.name;
        this.skipGit = this.options['skip-git'] || false;
    }


    _configuring(): void {
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
        await super._writing();

        // Launch angular-cli
        if (!commandExists('ng')) {
            console.log(chalk.bgRed(`Angular CLI not available. Install it with 'npm i -g @angular/cli' or 'yarn global add @angular/cli'.`));
            process.exit(1);
        }


        let ngOpts = ['new', this.props.name
            , '--style', 'scss'
            //, '--directory', this.root
            , '--inline-style'
            , '--inline-template'
            , '--skip-install'
        ];

        if (this.skipGit)
            ngOpts.push('--skip-git');


        this.spawnCommandSync('ng', ngOpts);

        await this.copyTemplates();

        this.updatePolyfills();
        this.updatePackageJson();
        this.updateTsConfig();

        await this.composeWith(new YangFeatureGenerator(), {
            'name': 'home',
            'with-component': true,
            'with-template': true,
            'with-styles': true
        });

        // Recopier les templates du home
        await this.composeWith(new YangHomeGenerator());

        // Faire le git commit
        if (!this.skipGit) {
            this.updateGitIgnore();

            if (commandExists('git')) {
                let spawnOpts = { cwd: this.root, stdio: 'ignore' };
                this.spawnCommandSync('git', ['add', '.'], spawnOpts);
                this.spawnCommandSync('git', ['commit', '-m', 'chore: initial commit from yang-cli'], spawnOpts);
            }
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

        // Add dependencies
        extend(pkg, {
            scripts: {
                "prebuild": "node prebuild.js",
                "prestart": "node prebuild.js"
            },
            dependencies: {
                "whatwg-fetch": "2.0.4",
                "@ngx-translate/core": "10.0.1",
                "rxjs-compat": "6.1.0"
            }
        });


        // Remove ^ and ~ dependencies
        this.fixDepsVersions(pkg.dependencies);
        this.fixDepsVersions(pkg.devDependencies);

        FileUtils.writeJSON(file, pkg);
    }


    fixDepsVersions(deps: any): void {
        for (let key in deps) {
            let value: string = deps[key];
            if (value.startsWith('^') || value.startsWith('~'))
                value = value.substring(1);

            deps[key] = value;
        }
    }


    updateTsConfig(): void {
        const file = path.join(this.root, 'tsconfig.json');
        let config = FileUtils.readJSON(file);

        extend(config.compilerOptions, {
            "paths": {
                "@app/*": ["src/app/*"],
                "@env/*": ["src/environments/*"]
            }
        });

        FileUtils.writeJSON(file, config);
    }


    updateGitIgnore(): void {
        const file = path.join(this.root, '.gitignore');
        let content = FileUtils.read(file);
        content += `${EOL}# Custom Files${EOL}`;
        content += `*.iml${EOL}`;
        content += `/src/assets/app-manifest.json${EOL}`;

        FileUtils.write(file, content);
    }
}
