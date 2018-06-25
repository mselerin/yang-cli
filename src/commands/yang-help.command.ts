import { YangCommand } from './yang.command';
import { YangUtils } from '../helpers/yang-utils';

export class YangHelpCommand extends YangCommand
{
  async run(options: any = {}): Promise<void> {
    YangUtils.runNgCli('g', '--help', []);
  }
}
