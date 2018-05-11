import { YangGenerator } from "./yang.generator";

export class YangPluginGenerator extends YangGenerator
{
    async _writing(): Promise<void> {
        await super._writing();

        let argv = [...process.argv].slice(2);
        let schematicName: string = argv[0];
        let fullSchematicName: string = schematicName;
        if (schematicName.startsWith('@')) {
            fullSchematicName = schematicName.substring(0, schematicName.lastIndexOf('/'))
                + '/yang-schematics:'
                + schematicName.substring(schematicName.lastIndexOf('/') + 1);
        }

        this.spawnCommandSync('ng', ['g', fullSchematicName, ...argv]);
    }
}
