import { YangCommand } from "./yang.command";
import { YangUtils } from '../helpers/yang-utils';

export class YangPluginCommand extends YangCommand
{
    async run(options: any = {}): Promise<void> {
        let argv = [...process.argv].slice(2);
        let schematicName: string = argv[0];
        let fullSchematicName: string = schematicName;
        if (schematicName.startsWith('@')) {
            fullSchematicName = schematicName.substring(0, schematicName.lastIndexOf('/'))
                + '/yang-schematics:'
                + schematicName.substring(schematicName.lastIndexOf('/') + 1);
        }

        YangUtils.spawnCommandSync('ng', ['g', fullSchematicName, ...argv]);
    }
}
