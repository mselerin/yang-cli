import { YangCommand } from "./yang.command";
import { Argv } from "yargs";
import { YangUtils } from '../helpers/yang-utils';

export class YangFeatureCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('with-component', { type: 'boolean', default: false, describe: 'Create an empty component' })
            .option('with-styles', { type: 'boolean', default: false, describe: 'Create a style file for the component' })
            .option('with-template', { type: 'boolean', default: false, describe: 'Create a template file for the component' })
        ;
    }

    async run(options: any = {}): Promise<void> {
        let ngOpts = [
            '--name', options.name
        ];

        if (options['with-component']) ngOpts.push('--component');
        if (options['with-template']) ngOpts.push('--template');
        if (options['with-styles']) ngOpts.push('--styles');

        YangUtils.spawnCommandSync('ng', ['g', 'yang-schematics:feature', ...ngOpts]);
    }
}
