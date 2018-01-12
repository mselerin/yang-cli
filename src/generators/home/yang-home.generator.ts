import {YangGenerator} from "../yang.generator";

export class YangHomeGenerator extends YangGenerator
{
    _initializing() {
        super._initializing();
        this.props['dir'] = `${this.projectRoot}src/app/features/home`;
    }


    async _writing(): Promise<void> {
        await super._writing();
        await this.copyTemplates();
    }
}
