import { YangCommand } from './yang.command';
import * as path from 'path';
import chalk from 'chalk';
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
        if (!YangUtils.commandExists('ng')) {
            console.log(chalk`{redBright @angular/cli not available}`);

            const answers = await YangUtils.askForPackageInstallation('@angular/cli');
            if (answers.install) {
                YangUtils.spawnCommandSync('npm', ['install', '-g', '@angular/cli']);
            }
            else {
                console.log(chalk`{white.bold Cannot continue. Install it with '{blue.bold npm i -g @angular/cli}'.}`);
                process.exit(1);
                return;
            }
        }

        if (!YangUtils.packageInstalled('yang-schematics')) {
            console.log(chalk`{redBright yang-schematics not available}`);

            const pkg = YangUtils.PKG;
            const yangSchematicsVersion = pkg.peerDependencies['yang-schematics'];

            const answers = await YangUtils.askForPackageInstallation('@angular/cli');
            if (answers.install) {
                YangUtils.spawnCommandSync('npm', ['install', '-g', `yang-schematics@${yangSchematicsVersion}`]);
            }
            else {
                console.log(chalk`{white.bold Cannot continue. Install it with '{blue.bold npm i -g yang-schematics@${yangSchematicsVersion}}'.}`);
                process.exit(1);
                return;
            }
        }

        const name = options['name'] || path.basename(process.cwd());
        const skipGit = options['skip-git'] || false;
        const skipInstall = !options['install'] || true;

        let ngOpts = ['new', name, '--directory', name, '--collection', 'yang-schematics'];

        if (skipGit)
            ngOpts.push('--skip-git');

        if (skipInstall)
            ngOpts.push('--skip-install');

        YangUtils.runNgCli(ngOpts);
    }
}
