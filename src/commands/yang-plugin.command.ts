import { YangCommand } from './yang.command';
import { YangUtils } from '../helpers/yang-utils';
import chalk from 'chalk';
import { Argv } from 'yargs';

export class YangPluginCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('quiet', { type: 'boolean', default: false, describe: 'Do not ask questions (usefull for tests)' })
        ;
    }

    async run(options: any = {}): Promise<void> {
        let argv = [...process.argv].slice(3);

        let schematicName: string = options.schematic;
        if (!schematicName) {
            console.log(chalk.bgRed(`No schematic name provided`));
            process.exit(1);
        }

        let fullSchematicName: string = schematicName;
        if (schematicName.startsWith('@')) {
            fullSchematicName = schematicName.substring(0, schematicName.lastIndexOf('/'))
                + '/yang-schematics:'
                + schematicName.substring(schematicName.lastIndexOf('/') + 1);
        }
        else {
            fullSchematicName = 'yang-schematics:' + schematicName;
        }

        let packageName = fullSchematicName.substring(0, fullSchematicName.indexOf(':'));

        if (!YangUtils.packageInstalled(packageName)) {
            console.log(chalk`{redBright ${packageName} not available}`);

            let install = false;
            if (!options['quiet']) {
                const answers = await YangUtils.askForPackageInstallation(packageName);
                install = answers.install;
            }

            if (install) {
                YangUtils.spawnCommandSync('npm', ['install', '-g', packageName]);
            }
            else {
                console.log(chalk`{white.bold Cannot continue. Install it with '{blue.bold npm i -g ${packageName}}'.}`);
                process.exit(1);
                return;
            }
        }

        YangUtils.runNgCli(['g', fullSchematicName, ...argv]);
    }
}
