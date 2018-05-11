import { YangCommand } from "./yang.command";
import { YangUtils } from '../helpers/yang-utils';
import chalk from 'chalk';

export class YangPluginCommand extends YangCommand
{
    async run(options: any = {}): Promise<void> {
        let argv = [...process.argv].slice(2);
        let schematicName: string = argv[0];
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

        YangUtils.spawnCommandSync('ng', ['g', fullSchematicName, ...argv]);
    }
}
