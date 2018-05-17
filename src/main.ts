import * as Yargs from 'yargs';
import chalk from 'chalk';
import { YangUtils } from './helpers/yang-utils';
import { YangNewCommand } from './commands/yang-new.command';
import { YangFeatureCommand } from './commands/yang-feature.command';
import { YangComponentCommand } from './commands/yang-component.command';
import { YangDirectiveCommand } from './commands/yang-directive.command';
import { YangPipeCommand } from './commands/yang-pipe.command';
import { YangServiceCommand } from './commands/yang-service.command';
import { YangPluginCommand } from './commands/yang-plugin.command';

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

            .command('component <name>', 'Create a new component',
                YangComponentCommand.yargs,
                (args) => YangUtils.runCommand(new YangComponentCommand(), args)
            )

            .command('directive <name>', 'Create a new directive',
                YangDirectiveCommand.yargs,
                (args) => YangUtils.runCommand(new YangDirectiveCommand(), args)
            )

            .command('feature <name>', 'Create a new feature',
                YangFeatureCommand.yargs,
                (args) => YangUtils.runCommand(new YangFeatureCommand(), args)
            )

            .command('pipe <name>', 'Create a new pipe',
                YangPipeCommand.yargs,
                (args) => YangUtils.runCommand(new YangPipeCommand(), args)
            )

            .command('service <name>', 'Create a new service',
                YangServiceCommand.yargs,
                (args) => YangUtils.runCommand(new YangServiceCommand(), args)
            )

            .command('$0 <schematic>', 'Run another yang-schematics',
                YangPluginCommand.yargs,
                (args) => YangUtils.runCommand(new YangPluginCommand(), args)
            )

            .demandCommand(1, 'You need one command before moving on')
            .help()
            .argv;
    }

    static get version(): string {
        return YangUtils.PKG.version;
    }
}

Main.main();
