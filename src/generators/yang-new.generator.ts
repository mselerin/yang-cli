import { YangGenerator } from "./yang.generator";
import * as path from "path";
import chalk from "chalk";
import { Argv } from "yargs";
import { FileUtils } from "../helpers/file-utils";

const commandExists = require('command-exists').sync;

export class YangNewGenerator extends YangGenerator
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
            , '--inline-style'
            , '--inline-template'
            , '--skip-install'
        ];

        if (this.skipGit)
            ngOpts.push('--skip-git');

        this.spawnCommandSync('ng', ngOpts);

        // Call yang-schematics:init
        this.spawnCommandSync('ng', ['g', 'yang-schematics:init'], { cwd: this.props['dir']});


        // git commit
        if (!this.skipGit) {
            if (commandExists('git')) {
                let spawnOpts = { cwd: this.root, stdio: 'ignore' };
                this.spawnCommandSync('git', ['add', '.'], spawnOpts);
                this.spawnCommandSync('git', ['commit', '-m', 'refactor: Yang Initialization'], spawnOpts);
            }
        }
    }


    async _install() {
        await super._install();

        if (this.options.install)
            this.spawnCommandSync("yarn", [], { cwd: this.props['dir']});
    }
}
