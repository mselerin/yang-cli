import * as _ from 'lodash';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import { YangCommand } from '../commands/yang.command';
import * as core from '@angular-devkit/core/node';
import * as inquirer from 'inquirer';

const commandExists = require('command-exists').sync;

export class YangUtils
{
    static PKG = require('../../package.json');
    static GLOBAL_NODE_MODULES = YangUtils.getGlobalNodeModulesPath();

    static getGlobalNodeModulesPath(): string {
        const isWin32 = process.platform === 'win32';
        const nodeCmd = isWin32 ? 'npm.cmd' : 'npm';
        const result = spawn.sync(nodeCmd, ['root', '-g'], { cwd: path.resolve('/'), encoding: 'utf8' });
        const nodePath = result.stdout.replace(/[\r\n]+/g, '');

        return path.resolve(nodePath);
    }


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
            const paths = [
                YangUtils.GLOBAL_NODE_MODULES
            ];

            core.resolve(name, {
                basedir,
                paths: paths,
                checkLocal: true,
                checkGlobal: true,
                resolvePackageJson: true
            });

            return true;
        }
        catch (e) {
            return false;
        }
    }

    static async askForPackageInstallation(name: string): Promise<any> {
        const questions = [
            {
                type: 'confirm',
                name: 'install',
                message: `Install ${name} ?`,
                default: false
            }
        ];

        return await inquirer.prompt(questions);
    }
}
