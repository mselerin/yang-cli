import * as _ from "lodash";
import * as path from "path";
import * as stackTrace from "stack-trace";
import * as spawn from "cross-spawn";
import chalk from "chalk";
import TsSimpleAst, {SourceFile} from "ts-simple-ast";
import {dasherize, classify} from "../helpers/string-utils";
import {YangUtils} from "../helpers/yang-utils";
import {Argv} from "yargs";
import {FileUtils} from "../helpers/file-utils";

export class YangGenerator
{
    protected options: any;
    protected props: any;
    private _templateRoot: string;
    private _root: string;
    private _projectRoot: string;

    constructor() {
        // On est dans dist/src/generators, repositionner la source à src/generators
        let callSite = stackTrace.get().find((callSite) => callSite.getFunctionName() === this.constructor.name);
        let dirs = path.dirname(callSite.getFileName()).split(path.sep);
        dirs[dirs.lastIndexOf('dist')] = '.';

        this._templateRoot = path.join(dirs.join(path.sep), 'templates');
    }


    static yargs(yargs: Argv): Argv {
        return yargs
            .option('debug', { type: 'boolean', describe: 'Debug mode' })
            .option('dir', { type: 'string', describe: 'Target directory' })
        ;
    }


    async _run(options: any = {}) {
        this.options = options;
        this.props = {};

        await this.initializing();
        await this.prompting();
        await this.configuring();
        await this.writing();
        await this.conflicts();
        await this.install();
        await this.end();
    }


    _initializing() {
        this.root = this.options['root'] || '.';
        this.props['dir'] = this.options['dir'] || '';
        this.props['name'] = this.options['name'];
    }


    _prompting() {
        if (!this.hasPrompt) {
            return;
        }
    }


    _configuring() {}


    async _writing(): Promise<void> {
        this.props['dasherize_name'] = dasherize(this.props.name);
        this.props['classify_name'] = classify(this.props.name);
    }

    async _conflicts() {}
    async _install() {}
    async _end() {}


    async _composeWith(generator: YangGenerator, options: any = {}): Promise<void> {
        if (!options) options = {};

        if (!options['root'])
            options['root'] = this.root;

        options['force'] = this.options['force'];
        await YangUtils.runGenerator(generator, options);
    }


    async _copyTemplates() {
        // Copy all files
        await FileUtils.copy(
            this.templatePath(),
            this.destinationPath(this.directory),
            {
                globOptions: {
                    dot: true
                }
            }
        );

        // Overwrite with templated files
        await FileUtils.copyTpl(
            //this.templatePath('**/*.{json,js,ts,html,css,scss,md}'),
            this.templatePath(),
            this.destinationPath(this.directory),
            this.props,
            null,
            {
                globOptions: {
                    dot: true
                }
            }
        );
    }


    _copyTemplate(tplName: string) {
        FileUtils.copyTpl(
            this.templatePath(tplName),
            this.destinationPath(this.directory),
            this.props
        );
    }


    _getSourceFile(file: string): SourceFile {
        let ast = new TsSimpleAst({ useVirtualFileSystem: true });

        let sourceFile = ast.getSourceFile(file);
        if (!sourceFile) {
            let content = FileUtils.read(file);
            sourceFile = ast.createSourceFile(file, content);
        }

        return sourceFile;
    }


    get projectRoot(): string {
        if (!this._projectRoot) {
            let root = this.root;
            root = (root.length === 0 || root.endsWith('/') ? root : root + '/');

            let ndx = 0;
            while (!FileUtils.exists(this.destinationPath(`${root}package.json`)) && (++ndx) < 20)
                root = '../' + root;

            if (ndx === 20)
                root = '';

            this._projectRoot = root;
        }

        return this._projectRoot;
    }


    get root(): string {
        if (!this._root)
            this._root = './';

        return this._root;
    }

    set root(root: string) {
        this._root = root;
        this._projectRoot = null;
    }

    get directory(): string {
        return this.props['dir'];
    }

    get hasPrompt(): boolean {
        return this.options['prompt'] === true;
    }

    get isDry(): boolean {
        return this.options['dry'] === true;
    }

    get generatorName(): string {
        return this.constructor.name;
    }

    get debug(): boolean {
        return this.options['debug'] === true;
    }


    _debug(str: string) {
        if (this.debug)
            console.log(chalk.grey(str));
    }



    templatePath(p: string = ''): string {
        return path.join(this._templateRoot, p);
    }


    destinationPath(p?: string): string {
        // TODO
        return p;
    }


    spawnCommand(command: string, args: string[], opt?: any): any {
        return spawn(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }

    spawnCommandSync(command: string, args: string[], opt?: any): any {
        return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }


    /*
     * Déclaration de toutes les méthodes yeoman.
     * Les générateurs qui implémentent celui-ci doivent inclure ceci :
         initializing() { return super.initializing(); }
         prompting() { return super.prompting(); }
         configuring() { return super.configuring(); }
         writing() { return super.writing(); }
         conflicts() { return super.conflicts(); }
         install() { return super.install(); }
         end() { return super.end(); }
     */
    initializing() {
        this._debug(` > ${this.generatorName} - initializing`);
        return this._initializing();
    }

    prompting() {
        this._debug(` > ${this.generatorName} - prompting`);
        return this._prompting();
    }

    configuring() {
        this._debug(` > ${this.generatorName} - configuring`);
        return this._configuring();
    }

    writing() {
        this._debug(` > ${this.generatorName} - writing`);
        return this._writing();
    }

    conflicts() {
        this._debug(` > ${this.generatorName} - conflicts`);
        return this._conflicts();
    }

    install() {
        this._debug(` > ${this.generatorName} - install`);
        return this._install();
    }

    end() {
        this._debug(` > ${this.generatorName} - end`);
        return this._end();
    }
}
