import * as _ from "lodash";
import * as path from "path";
import * as stackTrace from "stack-trace";
import * as spawn from "cross-spawn";
import chalk from "chalk";
import {Argv} from "yargs";
import {dasherize, classify} from "../helpers/string-utils";
import {YangUtils} from "../helpers/yang-utils";
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


    async run(options: any = {}): Promise<void> {
        this.options = options;
        this.props = {};

        await this.runInitializing();
        await this.runPrompting();
        await this.runConfiguring();
        await this.runWriting();
        await this.runConflicts();
        await this.runInstall();
        await this.runEnd();
    }


    _initializing(): void {
        this.root = this.options['root'] || '.';
        this.props['dir'] = this.options['dir'] || '';
        this.props['name'] = this.options['name'];
    }


    _prompting(): void {
        if (!this.hasPrompt) {
            return;
        }
    }


    _configuring(): void {}


    async _writing(): Promise<void> {
        this.props['dasherize_name'] = dasherize(this.props.name);
        this.props['classify_name'] = classify(this.props.name);
    }

    async _conflicts(): Promise<void> {}
    async _install(): Promise<void> {}
    async _end(): Promise<void> {}


    composeWith(generator: YangGenerator, options: any = {}): Promise<void> {
        if (!options) options = {};

        if (!options['root'])
            options['root'] = this.root;

        options['force'] = this.options['force'];
        return YangUtils.runGenerator(generator, options);
    }


    async copyTemplates(): Promise<void> {
        // Copy all files
        await FileUtils.copy(
            this.templatePath(),
            this.destinationPath(this.directory),
            this.props,
            {
                filter: [
                    '**/*',
                    '!**/*.{json,js,ts,html,css,scss,md}'
                ]
            }
        );

        // Overwrite with templated files
        await FileUtils.copyTpl(
            this.templatePath(),
            this.destinationPath(this.directory),
            this.props,
            { filter: [ '**/*.{json,js,ts,html,css,scss,md}' ] }
        );
    }


    async copyTemplate(tplName: string) {
        await FileUtils.copyTpl(
            this.templatePath(),
            this.destinationPath(this.directory),
            this.props,
            { filter: [ '**/' + tplName ] }
        );
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


    trace(str: string) {
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


    spawnCommandSync(command: string, args: string[], opt?: any): any {
        return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }




    runInitializing() {
        this.trace(` > ${this.generatorName} - initializing`);
        return this._initializing();
    }

    runPrompting() {
        this.trace(` > ${this.generatorName} - prompting`);
        return this._prompting();
    }

    runConfiguring() {
        this.trace(` > ${this.generatorName} - configuring`);
        return this._configuring();
    }

    runWriting() {
        this.trace(` > ${this.generatorName} - writing`);
        return this._writing();
    }

    runConflicts() {
        this.trace(` > ${this.generatorName} - conflicts`);
        return this._conflicts();
    }

    runInstall() {
        this.trace(` > ${this.generatorName} - install`);
        return this._install();
    }

    runEnd() {
        this.trace(` > ${this.generatorName} - end`);
        return this._end();
    }
}
