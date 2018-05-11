import { YangGenerator } from "./yang.generator";
import { Argv } from "yargs";

export class YangFeatureGenerator extends YangGenerator
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('with-component', { type: 'boolean', default: false, describe: 'Create an empty component' })
            .option('with-styles', { type: 'boolean', default: false, describe: 'Create a style file for the component' })
            .option('with-template', { type: 'boolean', default: false, describe: 'Create a template file for the component' })
        ;
    }


    _initializing() {
        super._initializing();

        this.props['component'] = this.options['with-component'] || false;
        this.props['template'] = this.options['with-template'] || false;
        this.props['styles'] = this.options['with-styles'] || false;
    }


    async _writing(): Promise<void> {
        await super._writing();

        let ngOpts = [
            '--name', this.props['name']
        ];

        if (this.props.component) ngOpts.push('--component');
        if (this.props.template) ngOpts.push('--template');
        if (this.props.styles) ngOpts.push('--styles');

        this.spawnCommandSync('ng', ['g', 'yang-schematics:feature', ...ngOpts]);
    }
}
