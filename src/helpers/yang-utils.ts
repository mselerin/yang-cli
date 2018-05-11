import * as _ from 'lodash';
import * as spawn from 'cross-spawn';
import { YangCommand } from '../commands/yang.command';

export class YangUtils
{
    static runCommand(command: YangCommand, options: any): Promise<void> {
        return command.run(options);
    }

    static spawnCommandSync(command: string, args: string[], opt?: any): any {
        return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }
}
