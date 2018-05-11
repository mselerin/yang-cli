import { YangGenerator } from "./yang.generator";
import { Argv } from 'yargs';

export class YangPipeGenerator extends YangGenerator
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('without-spec', { type: 'boolean', default: false, describe: 'Does not create a spec file' })
            ;
    }


    _initializing() {
        super._initializing();
        this.props['spec'] = !this.options['without-spec'];
    }


    async _writing(): Promise<void> {
        await super._writing();

        let ngOpts = [
            '--name', this.props['name']
        ];

        if (this.props.spec) ngOpts.push('--spec');

        this.spawnCommandSync('ng', ['g', 'yang-schematics:pipe', ...ngOpts]);
    }
}
