import { YangCommand } from "./yang.command";
import * as path from "path";
import chalk from "chalk";
import { Argv } from "yargs";
import { YangUtils } from '../helpers/yang-utils';

const commandExists = require('command-exists').sync;

export class YangNewCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('skip-git', { type: 'boolean', default: false, describe: 'Skip git' })
        ;
    }


    async run(options: any = {}): Promise<void> {
        if (!commandExists('ng')) {
            console.log(chalk.bgRed(`Angular CLI not available. Install it with 'npm i -g @angular/cli' or 'yarn global add @angular/cli'.`));
            process.exit(1);
        }

        const name = options['name'] || path.basename(process.cwd());
        const dir = `./${name}`;
        const skipGit = options['skip-git'] || false;

        let ngOpts = ['new', name
            , '--style', 'scss'
            , '--inline-style'
            , '--inline-template'
            , '--skip-install'
        ];

        if (skipGit)
            ngOpts.push('--skip-git');

        YangUtils.spawnCommandSync('ng', ngOpts);

        // Call yang-schematics:init
        YangUtils.spawnCommandSync('ng', ['g', 'yang-schematics:init'], { cwd: dir});


        // git commit
        if (!skipGit) {
            if (commandExists('git')) {
                let spawnOpts = { cwd: dir, stdio: 'ignore' };
                YangUtils.spawnCommandSync('git', ['add', '.'], spawnOpts);
                YangUtils.spawnCommandSync('git', ['commit', '-m', 'refactor: Yang Initialization'], spawnOpts);
            }
        }

        if (options.install)
            YangUtils.spawnCommandSync("yarn", [], { cwd: dir});
    }
}
