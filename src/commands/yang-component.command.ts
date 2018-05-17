import { YangCommand } from './yang.command';
import { Argv } from 'yargs';
import { YangUtils } from '@app/helpers/yang-utils';

export class YangComponentCommand extends YangCommand
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('feature', { type: 'string', describe: 'Feature name' })
            .option('shared', { type: 'boolean', default: false, describe: 'Shared component' })
            .option('flat', { type: 'boolean', default: false, describe: 'Does not create a sub-directory for the component' })
            .option('without-spec', { type: 'boolean', default: false, describe: 'Does not create a spec file' })
            .option('with-styles', { type: 'boolean', default: false, describe: 'Create a style file' })
            .option('with-template', { type: 'boolean', default: false, describe: 'Create a template file' })
            .option('with-routing', { type: 'boolean', default: false, describe: 'Create a route for this component (feature-component only)' })
            .option('route', { type: 'string', describe: 'Route name for the component' })
        ;
    }

    async run(options: any = {}): Promise<void> {
        let ngOpts = [
            '--name', options.name
        ];

        if (options.flat) ngOpts.push('--flat');
        if (options.shared) ngOpts.push('--shared');
        if (options.feature) ngOpts.push('--feature', options.feature);

        if (!options['without-spec']) ngOpts.push('--spec');
        if (options['with-styles']) ngOpts.push('--styles');
        if (options['with-template']) ngOpts.push('--template');
        if (options['with-routing']) ngOpts.push('--template');
        if (options.route) ngOpts.push('--route', options.route);

        YangUtils.runNgCli(['g', 'yang-schematics:component', ...ngOpts]);
    }
}
