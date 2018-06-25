import { Argv } from 'yargs';
import { YangUtils } from '../helpers/yang-utils';

export abstract class YangCommand
{
  static yargs(yargs: Argv): Argv {
    return yargs;
  }

  abstract async run(options: any): Promise<void>;
}


export class YangSimpleGenerateCommand extends YangCommand
{
  constructor(protected schematicName: string) {
    super();
  }

  async run(options: any = {}): Promise<void> {
    let ngOpts = ['--name', ...YangUtils.prepareNgOptions()];
    YangUtils.runNgCli('g', `yang-schematics:${this.schematicName}`, ngOpts);
  }
}
