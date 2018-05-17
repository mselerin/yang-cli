import { YangCommand } from './yang.command';
import { YangUtils } from '@app/helpers/yang-utils';
import chalk from 'chalk';
import { Argv } from 'yargs';

export class YangPluginCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return yargs;
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

        YangUtils.runNgCli(['g', fullSchematicName, ...argv]);
    }
}
