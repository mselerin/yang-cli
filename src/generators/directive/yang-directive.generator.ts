import {YangGenerator} from "../yang.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import {classify, dasherize} from "../../helpers/string-utils";

export class YangDirectiveGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = this.options['dir'];

        if (!this.props['dir'])
            this.props['dir'] = `${this.projectRoot}src/app/shared/directives`;
    }


    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();

        // Update files
        let file = `${this.projectRoot}${YangUtils.SHARED_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${classify(this.props.name)}Directive`, `./directives/${dasherize(this.props.name)}.directive`);

        CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Directive`);
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
