import * as _ from 'lodash';
import * as path from 'path';
import * as spawn from 'cross-spawn';
import { YangCommand } from '../commands/yang.command';
import * as core from '@angular-devkit/core/node';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

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

  static runNgCli(cmd: string, schematic: string, args: string[], spawnOpts?: any): any {
    return YangUtils.spawnCommandSync('ng', [cmd, schematic, ...args], spawnOpts);
  }

  static spawnCommandSync(command: string, args: string[], opt?: any): any {
    return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
  }



  static async ensurePackage(name: string, quiet: boolean = false): Promise<boolean> {
    if (!YangUtils.packageInstalled(name)) {
      console.log(chalk`{redBright ${name} not available}`);

      let install = false;
      if (!quiet) {
        const answers = await YangUtils.askForPackageInstallation(name);
        install = answers.install;
      }

      const cmdOpts = ['install', name, '-g'];

      if (install) {
        YangUtils.spawnCommandSync('npm', cmdOpts);
      }
      else {
        console.log(chalk`{white.bold Cannot continue. Install it with '{blue.bold npm ${cmdOpts.join(' ')}}'.}`);
        return false;
      }
    }

    return true;
  }


  static packageInstalled(name: string, basedir = process.cwd()): boolean {
    return (!!YangUtils.getPackagePath(name, basedir));
  }


  static getPackagePath(name: string, basedir = process.cwd()): string
  {
    try {
      const paths = [
        YangUtils.GLOBAL_NODE_MODULES
      ];

      return core.resolve(name, {
        basedir,
        paths: paths,
        checkLocal: true,
        checkGlobal: true,
        resolvePackageJson: true
      });
    }
    catch (e) {
      return null;
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


  static prepareNgOptions(): any {
    return [...process.argv].slice(3);
  }
}
