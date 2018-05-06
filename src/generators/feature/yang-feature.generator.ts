import * as path from "path";
import {YangGenerator} from "../yang.generator";
import {YangComponentGenerator} from "../component/yang-component.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import {dasherize, classify} from "../../helpers/string-utils";
import {FileUtils} from "../../helpers/file-utils";
import {Argv} from "yargs";

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


    _configuring() {
        super._configuring();
        this.props['dir'] = this.props['dir'] || path.join(this.projectRoot, 'src', 'app', 'features', dasherize(this.props.name));
    }



    async _writing(): Promise<void> {
        await super._writing();
        await this.copyTemplates();

        this.updateRouting();

        if (this.props['component']) {
            await this.composeWith(new YangComponentGenerator(), {
                'name': this.props.name,
                'feature': this.props.name,
                'with-template': this.props.template,
                'with-styles': this.props.styles,
                'flat': true
            });
        }
    }


    updateRouting(): void {
        // Ajouter la route
        const file = path.join(this.projectRoot, YangUtils.FEATURES_MODULE_FILE);
        const sourceFile = CodeUtils.getSourceFile(file);

        CodeUtils.insertInVariableArray(sourceFile, "FEATURES_ROUTES",
            `    { path: '${dasherize(this.props.name)}', loadChildren: '@app/features/${dasherize(this.props.name)}/${dasherize(this.props.name)}.module#${classify(this.props.name)}Module' }`
        );

        FileUtils.write(file, sourceFile.getFullText());
    }
}
