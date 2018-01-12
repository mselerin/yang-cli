import {YangGenerator} from "../yang.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import {classify, dasherize} from "../../helpers/string-utils";
import {FileUtils} from "../../helpers/file-utils";

export class YangPipeGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = this.options['dir'];

        if (!this.props['dir'])
            this.props['dir'] = `${this.projectRoot}src/app/shared/pipes`;
    }



    async _writing(): Promise<void> {
        await super._writing();
        await this._copyTemplates();

        // Update files
        let file = `${this.projectRoot}${YangUtils.SHARED_MODULE_FILE}`;
        const sourceFile = this._getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${classify(this.props.name)}Pipe`, `./pipes/${dasherize(this.props.name)}.pipe`);

        CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Pipe`);
        FileUtils.write(file, sourceFile.getFullText());
    }
}
