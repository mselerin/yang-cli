import {YangGenerator} from "../yang.generator";
import * as path from "path";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";

export class YangComponentGenerator extends YangGenerator
{
    _initCli(): void {
        super._initCli();

        this.option('feature', { type: String });
        this.option('styles', { type: Boolean, default: false });
        this.option('template', { type: Boolean, default: false });
        this.option('shared', { type: Boolean, default: false });
    }


    _initializing() {
        super._initializing();
        this.props['shared'] = this.options['shared'] || false;
        this.props['styles'] = this.options['styles'] || false;
        this.props['template'] = this.options['template'] || false;
        this.props['feature'] = this.options['feature'];
        this.props['dir'] = this.options['dir'];

        if (!this.props['dir'] && this.props['shared'])
            this.props['dir'] = `${this.projectRoot}src/app/shared/components`;

        if (!this.props['dir'] && this.props['feature'])
            this.props['dir'] = `${this.projectRoot}src/app/features/${this.props['feature']}/${this.props['name']}`;

        if (!this.props['dir'])
            this.props['dir'] = '';
    }


    async _writing(): Promise<void> {
        await super._writing();

        // Copy templates
        this.fs.copyTpl(
            this.templatePath('#name#.component.ts'),
            this.destinationPath(path.join(this.props.dir, '#name#.component.ts')),
            this.props
        );

        if (this.props.template) {
            this.fs.copyTpl(
                this.templatePath('#name#.component.html'),
                this.destinationPath(path.join(this.props.dir, '#name#.component.html')),
                this.props
            );
        }

        if (this.props.styles) {
            this.fs.copyTpl(
                this.templatePath('#name#.component.scss'),
                this.destinationPath(path.join(this.props.dir, '#name#.component.scss')),
                this.props
            );
        }


        // Update files
        if (this.props.shared)
        {
            let file = `${this.projectRoot}${YangUtils.SHARED_MODULE_FILE}`;
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${this.props.pascalName}Component`, `./components/${this.props.kebabName}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${this.props.pascalName}Component`);
            this.fs.write(file, sourceFile.getFullText());
        }

        else if (this.props.feature)
        {
            let file = `${this.projectRoot}src/app/features/${this.props.feature}/${this.props.feature}.module.ts`;
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${this.props.pascalName}Component`, `./${this.props.kebabName}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${this.props.pascalName}Component`);
            this.fs.write(file, sourceFile.getFullText());
        }
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
