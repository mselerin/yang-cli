import * as path from "path";
import {YangGenerator} from "../yang.generator";
import {CodeUtils} from "../../helpers/code-utils";
import {YangUtils} from "../../helpers/yang-utils";
import chalk from "chalk";
import {dasherize, classify} from "../../helpers/string-utils";
import {FileUtils} from "../../helpers/file-utils";
import {Argv} from "yargs";

export class YangComponentGenerator extends YangGenerator
{
    static yargs(yargs: Argv): Argv {
        return super.yargs(yargs)
            .option('feature', { type: 'string', describe: 'Feature name' })
            .option('shared', { type: 'boolean', default: false, describe: 'Shared component' })
            .option('flat', { type: 'boolean', default: false, describe: 'Does not create a sub-directory for the component' })
            .option('with-styles', { type: 'boolean', default: false, describe: 'Create a style file' })
            .option('with-template', { type: 'boolean', default: false, describe: 'Create a template file' })
        ;
    }


    _initializing() {
        super._initializing();
        this.props['feature'] = this.options['feature'];
        this.props['shared'] = this.options['shared'] || false;
        this.props['flat'] = this.options['flat'] || false;
        this.props['styles'] = this.options['with-styles'] || false;
        this.props['template'] = this.options['with-template'] || false;
    }


    _configuring() {
        super._configuring();

        if (this.props['dir'] && this.props['shared']) {
            // throw new Error('--dir option cannot be used with --shared option');
            console.log(chalk.bgRed(`--shared option cannot be used with --dir option`));
            process.exit(1);
        }

        if (this.props['dir'] && this.props['feature']) {
            // throw new Error('--dir option cannot be used with --feature option');
            console.log(chalk.bgRed(`--feature option cannot be used with --dir option`));
            process.exit(1);
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


        if (this.props['shared']) {
            this.props['dir'] = path.join(this.projectRoot, 'src', 'app', 'shared', 'components');
            if (!this.props['flat'])
                this.props['dir'] = path.join(this.props['dir'], dasherize(this.props.name));
        }

        if (this.props['feature']) {
            this.props['dir'] = path.join(this.projectRoot, 'src', 'app', 'features', dasherize(this.props['feature']));
            if (!this.props['flat'])
                this.props['dir'] = path.join(this.props['dir'], dasherize(this.props.name));
        }

        if (!this.props['dir'])
            this.props['dir'] = '';
    }


    async _writing(): Promise<void> {
        await super._writing();

        // Copy templates
        await FileUtils.copyTpl(
            this.templatePath(),
            this.destinationPath(this.props.dir),
            this.props,
            { filter: [ '**/#name#.component.ts' ] }
        );

        if (this.props.template) {
            await FileUtils.copyTpl(
                this.templatePath(),
                this.destinationPath(this.props.dir),
                this.props,
                { filter: [ '**/#name#.component.html' ] }
            );
        }

        if (this.props.styles) {
            await FileUtils.copyTpl(
                this.templatePath(),
                this.destinationPath(this.props.dir),
                this.props,
                { filter: [ '**/#name#.component.scss' ] }
            );
        }


        // Update files
        if (this.props.shared)
        {
            let compDir = `./components`;
            if (!this.props['flat'])
                compDir += `/${dasherize(this.props.name)}`;

            const file = path.join(this.projectRoot, YangUtils.SHARED_MODULE_FILE);
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${classify(this.props.name)}Component`, `${compDir}/${dasherize(this.props.name)}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Component`);
            FileUtils.write(file, sourceFile.getFullText());
        }

        else if (this.props.feature)
        {
            let compDir = `.`;
            if (!this.props['flat'])
                compDir += `/${dasherize(this.props.name)}`;

            const file = path.join(this.projectRoot, 'src', 'app', 'features', dasherize(this.props.feature), `${dasherize(this.props.feature)}.module.ts`);
            const sourceFile = this._getSourceFile(file);

            CodeUtils.addImport(sourceFile,
                `${classify(this.props.name)}Component`, `${compDir}/${dasherize(this.props.name)}.component`);

            CodeUtils.insertInVariableArray(sourceFile, "DECLARATIONS", `   ${classify(this.props.name)}Component`);
            FileUtils.write(file, sourceFile.getFullText());
        }
    }
}
