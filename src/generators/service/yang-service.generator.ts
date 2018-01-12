import {YangGenerator} from "../yang.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import {classify, dasherize} from "../../helpers/string-utils";
import {FileUtils} from "../../helpers/file-utils";

export class YangServiceGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = this.options['dir'];

        if (!this.props['dir'])
            this.props['dir'] = `${this.projectRoot}src/app/core/services`;
    }



    async _writing(): Promise<void> {
        await super._writing();
        await this.copyTemplates();

        // Update files
        let file = `${this.projectRoot}${YangUtils.SERVICE_MODULE_FILE}`;
        const sourceFile = CodeUtils.getSourceFile(file);

        CodeUtils.addImport(sourceFile,
            `${classify(this.props.name)}Service`, `./services/${dasherize(this.props.name)}.service`);

        CodeUtils.insertInVariableArray(sourceFile, "PROVIDERS", `    ${classify(this.props.name)}Service`);
        FileUtils.write(file, sourceFile.getFullText());
    }
}
