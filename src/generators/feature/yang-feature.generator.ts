import {YangGenerator} from "../yang.generator";
import {YangComponentGenerator} from "../component/yang-component.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";

export class YangFeatureGenerator extends YangGenerator
{
    _initCli(): void {
        super._initCli();
        this.option('routing', { type: Boolean, default: true });
        this.option('component', { type: Boolean, default: false });
        this.option('template', { type: Boolean, default: false });
        this.option('styles', { type: Boolean, default: false });
    }


    _configuring() {
        super._configuring();

        this.props['dir'] = this.options['dir'] || `${this.projectRoot}app/features/${this.props.kebabName}`;
        this.props['component'] = this.options['component'] || false;
        this.props['template'] = this.options['template'] || false;
        this.props['styles'] = this.options['styles'] || false;
    }



    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();

        this._updateFeatures();
        this._updateRouting();

        await this._composeWith(YangComponentGenerator, {
            dir: this.props.dir,
            name: this.props.name,
            feature: this.props.name,
            template: this.props.template,
            styles: this.props.styles
        });
    }


    _updateFeatures(): void {
        // Ajouter l'import et le module
        const file = `${this.projectRoot}${YangUtils.FEATURES_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${this.props.pascalName}Module`, `./${this.props.kebabName}/${this.props.kebabName}.module`);

        CodeUtils.insertInVariableArray(sourceFile, "MODULES", `   ${this.props.pascalName}Module`);
        this.fs.write(file, sourceFile.getFullText());
    }


    _updateRouting(): void {
        // Ajouter la route
        const file = `${this.projectRoot}${YangUtils.ROUTING_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${this.props.pascalName}Routes`, `app/features/${this.props.kebabName}/${this.props.kebabName}-routing.module`);

        CodeUtils.insertInVariableArray(sourceFile, "FEATURES_ROUTES", `    ...${this.props.pascalName}Routes`);
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
