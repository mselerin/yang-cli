import {YangGenerator} from "../yang.generator";
import * as path from "path";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import chalk from "chalk";
import {dasherize, classify} from "../../helpers/string-utils";

export class YangComponentGenerator extends YangGenerator
{
    _initCli(): void {
        super._initCli();

        this.option('feature', { type: String });
        this.option('shared', { type: Boolean, default: false });
        this.option('flat', { type: Boolean, default: false });
        this.option('with-styles', { type: Boolean, default: false });
        this.option('with-template', { type: Boolean, default: false });
    }


    _initializing() {
        super._initializing();
        this.props['feature'] = this.options['feature'];
        this.props['shared'] = this.options['shared'] || false;
        this.props['flat'] = this.options['flat'];
        this.props['styles'] = this.options['with-styles'] || false;
        this.props['template'] = this.options['with-template'] || false;
    }


    _configuring() {
        super._configuring();

        if (this.props['dir'] && this.props['shared']) {
            // throw new Error('--dir option cannot be used with --shared option');
            console.log(chalk.bgRed(`--shared option cannot be used with --dir option`));
            process.exit();
        }

        if (this.props['dir'] && this.props['feature']) {
            // throw new Error('--dir option cannot be used with --feature option');
            console.log(chalk.bgRed(`--feature option cannot be used with --dir option`));
            process.exit();
        }

        if (this.props['name'].includes('/')) {
            // Smart detect if shared or feature_name
            let nameArgs: string[] = this.props['name'].split('/');
            let classifier: string = nameArgs.shift();

            if ('shared' === classifier) {
                this.props['shared'] = true;
                this.props['feature'] = null;
                this.props['name'] = nameArgs.join('/');
            }

            else {
                // First argument is a feature name
                this.props['shared'] = false;
                this.props['feature'] = classifier;
                this.props['name'] = nameArgs.join('/');
            }
        }


        if (this.props['shared'])
            this.props['dir'] = `${this.projectRoot}src/app/shared/components`;

        if (this.props['feature']) {
            this.props['dir'] = `${this.projectRoot}src/app/features/${this.props['feature']}`;
            if (!this.props['flat'])
                this.props['dir'] += `/${this.props['name']}`;
        }

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
            const file = `${this.projectRoot}${YangUtils.SHARED_MODULE_FILE}`;
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${classify(this.props.name)}Component`, `./components/${dasherize(this.props.name)}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Component`);
            this.fs.write(file, sourceFile.getFullText());
        }

        else if (this.props.feature)
        {
            let compDir = this.props.dir.substring(`${this.projectRoot}src/`.length);

            if (compDir.startsWith(`app/features/${this.props['feature']}`))
                compDir = compDir.substring(`app/features/${this.props['feature']}`.length);

            const file = `${this.projectRoot}src/app/features/${this.props.feature}/${this.props.feature}.module.ts`;
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${classify(this.props.name)}Component`, `.${compDir}/${dasherize(this.props.name)}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Component`);
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
