import { YangCommand } from './yang.command';
import { YangUtils } from '../helpers/yang-utils';

export class YangNewCommand extends YangCommand
{
  async run(options: any = {}): Promise<void> {
    if (!await YangUtils.ensurePackage('@angular/cli', options['quiet'])) {
      process.exit(1);
      return;
    }

    if (!await YangUtils.ensurePackage('yang-schematics', options['quiet'])) {
      process.exit(1);
      return;
    }

    const ngOpts = [...YangUtils.prepareNgOptions(), '--collection', 'yang-schematics'];
    const name = ngOpts.shift();

    YangUtils.runNgCli('new', name, ngOpts);
  }
}
