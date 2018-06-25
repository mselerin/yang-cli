import * as Yargs from 'yargs';
import chalk from 'chalk';
import { YangUtils } from './helpers/yang-utils';
import { YangNewCommand } from './commands/yang-new.command';
import { YangGenericCommand } from './commands/yang-generic.command';
import { YangSimpleGenerateCommand } from './commands/yang.command';
import { YangHelpCommand } from './commands/yang-help.command';

export class Main
{
  public static main()
  {
    console.log(`< ${chalk.blue('YANG')} ${chalk.yellow(Main.version)} >`);

    Yargs
      .command(['new [name]'], 'Scaffold a new application',
        YangNewCommand.yargs,
        (args) => YangUtils.runCommand(new YangNewCommand(), args)
      )

      .command(['component [name]', 'c'], 'Create a new component',
        YangSimpleGenerateCommand.yargs,
        (args) => YangUtils.runCommand(new YangSimpleGenerateCommand('component'), args)
      )

      .command(['help'], 'Get help',
        YangHelpCommand.yargs,
        (args) => YangUtils.runCommand(new YangHelpCommand(), args)
      )

      .command('$0 <schematic>', 'Run another yang-schematics',
        YangGenericCommand.yargs,
        (args) => YangUtils.runCommand(new YangGenericCommand(), args)
      )

      .demandCommand(1, 'You need one command before moving on')
      .help(false)
      .argv;
  }

  static get version(): string {
    return YangUtils.PKG.version;
  }
}

Main.main();
