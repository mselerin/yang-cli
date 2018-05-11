import { YangGenerator } from "./yang.generator";
import { Argv } from "yargs";

export class YangComponentGenerator extends YangGenerator
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
        ;
    }


    _initializing() {
        super._initializing();
        this.props['feature'] = this.options['feature'];
        this.props['shared'] = this.options['shared'] || false;
        this.props['flat'] = this.options['flat'] || false;
        this.props['spec'] = !this.options['without-spec'];
        this.props['styles'] = this.options['with-styles'] || false;
        this.props['template'] = this.options['with-template'] || false;
        this.props['routing'] = this.options['with-routing'] || false;
    }


    async _writing(): Promise<void> {
        await super._writing();

        let ngOpts = [
            '--name', this.props['name']
        ];

        if (this.props.flat) ngOpts.push('--flat');
        if (this.props.shared) ngOpts.push('--shared');
        if (this.props.feature) ngOpts.push('--feature', this.props.feature);

        if (this.props.spec) ngOpts.push('--spec');
        if (this.props.template) ngOpts.push('--template');
        if (this.props.styles) ngOpts.push('--styles');
        if (this.props.routing) ngOpts.push('--routing');

        this.spawnCommandSync('ng', ['g', 'yang-schematics:component', ...ngOpts]);
    }
}
