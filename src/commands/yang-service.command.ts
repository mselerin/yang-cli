import { YangCommand } from './yang.command';
import { Argv } from 'yargs';
import { YangUtils } from '../helpers/yang-utils';

export class YangServiceCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('without-spec', { type: 'boolean', default: false, describe: 'Does not create a spec file' })
        ;
    }


    async run(options: any = {}): Promise<void> {
        let ngOpts = [
            '--name', options.name
        ];

        if (!options['without-spec']) ngOpts.push('--spec');

        YangUtils.runNgCli(['g', 'yang-schematics:service', ...ngOpts]);
    }
}
