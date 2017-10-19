import {YangGenerator} from "../yang.generator";
import * as _ from 'lodash';
import * as path from "path";
import {Questions} from "inquirer";
import {YangFeatureGenerator} from "../feature/yang-feature.generator";
import {YangHomeGenerator} from "../home/yang-home.generator";

export class YangAppGenerator extends YangGenerator
{
    _initCli(): void {
        super._initCli();

        this.option('install', {
            description: "Install dependencies",
            type: Boolean,
            default: false
        });
    }


    _initializing() {
        super._initializing();
        this.props['name'] = this.options['name'] || path.basename(process.cwd());
        this.props['description'] = this.props.name;
        this.props['authorName'] = this.user.git.name();
        this.props['authorEmail'] = this.user.git.email();
        this.props['authorUrl'] = '';
    }


    _prompting(): Promise<any> {
        super._prompting();

        if (!this.hasPrompt) {
            return;
        }

        let prompts: Questions = [
            {
                type    : 'input',
                name    : 'name',
                message : 'Your project name',
                default : this.props.name
            },

            {
                type    : 'input',
                name    : 'description',
                message : 'Your project description',
                default : this.props.description
            },

            {
                type    : 'input',
                name    : 'authorName',
                message : 'Author\'s Name',
                default : this.props.authorName
            },

            {
                type    : 'input',
                name    : 'authorEmail',
                message : 'Author\'s Email',
                default : this.props.authorEmail
            },

            {
                type    : 'input',
                name    : 'authorUrl',
                message : 'Author\'s Homepage',
                default : this.props.authorUrl
            }
        ];

        return this.prompt(prompts).then((props) => {
            _.merge(this.props, props);
        });
    }

    _configuring() {
        super._configuring();
        this.props['dir'] = this.options['dir'] || `./${this.props['name']}`;
    }


    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();

        await this._composeWith(YangFeatureGenerator, {
            dir: this.props['dir'],
            name: 'home',
            component: true,
            template: true,
            styles: true
        });

        // Recopier les templates du home
        await this._composeWith(YangHomeGenerator, {
            dir: this.props['dir']
        });
    }


    async _install() {
        await super._install();

        if (this.options['install'])
            this.spawnCommand("yarn", [], { cwd: this.props['dir']});
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
