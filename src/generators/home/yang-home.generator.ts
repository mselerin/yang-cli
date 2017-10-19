import {YangGenerator} from "../yang.generator";

export class YangHomeGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = `${this.projectRoot}app/features/home`;
    }


    async _writing(): Promise<void> {
        await super._writing();
        this._copyTemplates();
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
