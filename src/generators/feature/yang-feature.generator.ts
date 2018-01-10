import {YangGenerator} from "../yang.generator";
import {YangComponentGenerator} from "../component/yang-component.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import {dasherize, classify} from "../../helpers/string-utils";

export class YangFeatureGenerator extends YangGenerator
{
    _initCli(): void {
        super._initCli();
        this.option('with-component', { type: Boolean, default: false });
        this.option('with-template', { type: Boolean, default: false });
        this.option('with-styles', { type: Boolean, default: false });
    }


    _initializing() {
        super._initializing();

        this.props['component'] = this.options['with-component'] || false;
        this.props['template'] = this.options['with-template'] || false;
        this.props['styles'] = this.options['with-styles'] || false;
    }


    _configuring() {
        super._configuring();
        this.props['dir'] = this.props['dir'] || `${this.projectRoot}src/app/features/${dasherize(this.props.name)}`;
    }



    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();

        // this._updateFeatures();
        this._updateRouting();

        if (this.props['component']) {
            await this._composeWith(YangComponentGenerator, {
                'name': this.props.name,
                'feature': this.props.name,
                'with-template': this.props.template,
                'with-styles': this.props.styles,
                'flat': true
            });
        }
    }


    // _updateFeatures(): void {
    //     // Ajouter l'import et le module
    //     const file = `${this.projectRoot}${YangUtils.FEATURES_MODULE_FILE}`;
    //     const sourceFile = this._getSourceFile(file);
    //
    //     CodeUtils.addImport(sourceFile,
    //         `${classify(this.props.name)}Module`, `./${dasherize(this.props.name)}/${dasherize(this.props.name)}.module`);
    //
    //     CodeUtils.insertInVariableArray(sourceFile, "MODULES", `   ${classify(this.props.name)}Module`);
    //     this.fs.write(file, sourceFile.getFullText());
    // }


    _updateRouting(): void {
        // Ajouter la route
        const file = `${this.projectRoot}${YangUtils.FEATURES_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.insertInVariableArray(sourceFile, "FEATURES_ROUTES",
            `    { path: '${dasherize(this.props.name)}', loadChildren: 'app/features/${dasherize(this.props.name)}/${dasherize(this.props.name)}.module#${classify(this.props.name)}Module' }`
        );

        this.fs.write(file, sourceFile.getFullText());
    }



    // Declaration du runLoop yeoman
    initializing() { return super.initializing(); }
    prompting() { return super.prompting(); }
    configuring() { return super.configuring(); }
    writing() { return super.writing(); }
    conflicts() { return super.conflicts(); }
    install() { return super.install(); }
    end() { return super.end(); }
}
