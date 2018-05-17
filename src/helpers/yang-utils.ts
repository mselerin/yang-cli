import * as _ from 'lodash';
import * as spawn from 'cross-spawn';
import { YangCommand } from '@app/commands/yang.command';
import * as core from '@angular-devkit/core/node';
import * as inquirer from 'inquirer';

const commandExists = require('command-exists').sync;

export class YangUtils
{
    static PKG = require('../../package.json');

    static runCommand(command: YangCommand, options: any): Promise<void> {
        return command.run(options);
    }

    static runNgCli(args: string[], opt?: any): any {
        return YangUtils.spawnCommandSync('ng', args, opt);
    }

    static spawnCommandSync(command: string, args: string[], opt?: any): any {
        return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }

    static commandExists(command: string): boolean {
        return commandExists(command);
    }

    static packageInstalled(name: string, basedir = process.cwd()): boolean
    {
        try {
            core.resolve(name, {
                basedir,
                checkLocal: true,
                checkGlobal: true,
                resolvePackageJson: true,
                preserveSymlinks: true
            });

            return true;
        }
        catch (e) {
            // Retry with another basedir
            if (basedir !== process.argv[1]) {
                return YangUtils.packageInstalled(name, process.argv[1]);
            }

            return false;
        }
    }

    static async askForPackageInstallation(name: string): Promise<any> {
        const questions = [
            {
                type: 'confirm',
                name: 'install',
                message: 'Install it ?',
                default: false
            }
        ];

        return await inquirer.prompt(questions);
    }
}
