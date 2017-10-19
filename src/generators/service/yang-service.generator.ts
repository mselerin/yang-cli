import {YangGenerator} from "../yang.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";

export class YangServiceGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = this.options['dir'];

        if (!this.props['dir'])
            this.props['dir'] = `${this.projectRoot}app/services`;
    }



    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();

        // Update files
        let file = `${this.projectRoot}${YangUtils.SERVICE_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${this.props.pascalName}Service`, `app/core/services/${this.props.kebabName}.service`);

        CodeUtils.insertInVariableArray(sourceFile, "PROVIDERS", `    ${this.props.pascalName}Service`);
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
