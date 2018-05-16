import * as _ from 'lodash';
import * as spawn from 'cross-spawn';
import { YangCommand } from '../commands/yang.command';

const commandExists = require('command-exists').sync;

export class YangUtils
{
    static runCommand(command: YangCommand, options: any): Promise<void> {
        return command.run(options);
    }

    static runNgCli(args: string[], opt?: any): any {
        return YangUtils.spawnCommandSync('ng', args, opt);
    }

    static spawnCommandSync(command: string, args: string[], opt?: any): any {
        return spawn.sync(command, args, _.defaults(opt, {stdio: 'inherit'}));
    }

    static commandExists(command: string): boolean {
        return commandExists(command);
    }
}
