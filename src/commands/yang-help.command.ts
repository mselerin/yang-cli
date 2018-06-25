import * as path from 'path';
import chalk from 'chalk';
import { YangCommand } from './yang.command';
import { YangUtils } from '../helpers/yang-utils';

export class YangHelpCommand extends YangCommand
{
  async run(options: any = {}): Promise<void> {
    let ysPath = YangUtils.getPackagePath('yang-schematics');
    if (ysPath) {
      let collectionPath = path.resolve(ysPath, '..', 'src', 'collection.json');
      let collection = require(collectionPath);

      console.log(`Available Yang Schematics:`);

      Object.keys(collection.schematics)
        .forEach(s => {
          if (!collection.schematics[s].hidden) {
            let schem = collection.schematics[s];
            console.log(chalk.green(`   ${s}`));

            if (schem.description)
              console.log(`      ${schem.description}`);
          }
        });

      console.log();
      console.log(chalk.yellow('To see help for a schematic run:'));
      console.log(chalk.blue('  yang <schematic> --help'));
    }
  }
}
