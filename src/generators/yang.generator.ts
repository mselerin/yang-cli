import * as Generator from 'yeoman-generator';
import * as rename from "gulp-rename";
import * as path from "path";
import * as stackTrace from "stack-trace";
import chalk from "chalk";
import TsSimpleAst, {SourceFile} from "ts-simple-ast";
import {StringUtils} from "../helpers/string-utils";
import {YangUtils} from "../helpers/yang-utils";

export class YangGenerator extends Generator
{
    protected props: any;
    private _root: string;
    private _projectRoot: string;

    constructor(args: any, opts: any) {
        super(args, opts);
        this.props = {};

        // On est dans dist/generators, repositionner la source à src/generators
        let callSite = stackTrace.get().find((callSite) => callSite.getFunctionName() === this.constructor.name);
        let dirs = path.dirname(callSite.getFileName()).split(path.sep);
        dirs[dirs.lastIndexOf('dist')] = 'src';

        this.sourceRoot(path.join(dirs.join(path.sep), 'templates'));
        this._initCli();
    }


    _initCli(): void {
        this.argument('name', { type: String, required: false });

        this.option('debug', { type: Boolean, default: false });
        this.option('root', { type: String, default: '' });
        this.option('dir', { type: String });
        this.option('prompt', { type: Boolean, default: false });

        // TODO dry run
        // this.option('dry', {
        //     description: "Don't use the default, ask everything",
        //     type: Boolean,
        //     default: false
        // });
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


    _configuring() {
        this.props['kebabName'] = StringUtils.kebabCase(this.props.name);
        this.props['pascalName'] = StringUtils.pascalCase(this.props.name);
    }


    async _writing(): Promise<void> {
        // Templated filename
        this.registerTransformStream(rename((path) => {
            path.basename = path.basename.replace(/(#name#)/g, this.props.kebabName);
            path.dirname = path.dirname.replace(/(#name#)/g, this.props.kebabName);
        }));
    }

    async _conflicts() {}
    async _install() {}
    async _end() {}


    async _commitFiles(): Promise<void> {
        let _writeFiles: Function = this['_writeFiles'].bind(this);

        return new Promise<void>(resolve => {
            _writeFiles(() => resolve());
        });
    }


    async _composeWith(generator: typeof YangGenerator, props: any = {}): Promise<void> {
        await this._commitFiles();
        if (!props) props = {};

        if (!props['root'])
            props['root'] = this.root;

        props['force'] = this.options['force'];
        await YangUtils.runGenerator(generator, props);
    }


    _copyTemplates() {
        // Copy all files
        this.fs.copy(
            this.templatePath(),
            this.destinationPath(this.directory),
            {
                globOptions: {
                    dot: true
                }
            }
        );

        // Overwrite with templated files
        this.fs.copyTpl(
            this.templatePath('**/*.{json,js,ts,html,css,scss,md}'),
            this.destinationPath(this.directory),
            this.props
        );
    }


    _copyTemplate(tplName: string) {
        this.fs.copyTpl(
            this.templatePath(tplName),
            this.destinationPath(this.directory),
            this.props
        );
    }


    _getSourceFile(file: string): SourceFile {
        let ast = new TsSimpleAst();
        let content = this.fs.read(file);
        return ast.addSourceFileFromText(file, content);
    }


    get projectRoot(): string {
        if (!this._projectRoot) {
            let root = this.root;
            root = (root.length === 0 || root.endsWith('/') ? root : root + '/');

            let ndx = 0;
            while (!this.fs.exists(this.destinationPath(`${root}package.json`)) && (++ndx) < 20)
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
