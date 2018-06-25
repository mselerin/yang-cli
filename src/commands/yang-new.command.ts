import { YangCommand } from './yang.command';
import * as path from 'path';
import { Argv } from 'yargs';
import { YangUtils } from '../helpers/yang-utils';

export class YangNewCommand extends YangCommand
{
  static yargs(yargs: Argv): Argv {
    return super.yargs(yargs)
      .option('install', { type: 'boolean', default: false, describe: 'Install dependencies' })
      .option('skip-git', { type: 'boolean', default: false, describe: 'Skip git' })
      ;
  }


  async run(options: any = {}): Promise<void> {
    if (!await YangUtils.ensurePackage('@angular/cli', options['quiet'])) {
      process.exit(1);
      return;
    }

    if (!await YangUtils.ensurePackage('yang-schematics', options['quiet'])) {
      process.exit(1);
      return;
    }

    const name = options['name'] || path.basename(process.cwd());
    const skipGit = options['skip-git'] || false;
    const skipInstall = !options['install'] || true;

    let ngOpts = ['new', name, '--directory', name, '--collection', 'yang-schematics'];

    if (skipGit)
      ngOpts.push('--skip-git');

    if (skipInstall)
      ngOpts.push('--skip-install');

    YangUtils.runNgCli('new', name, ngOpts);
  }
}
