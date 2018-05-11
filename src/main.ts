import * as Yargs from 'yargs';
import { Argv } from 'yargs';
import chalk from 'chalk';
import { YangUtils } from "./helpers/yang-utils";
import { YangNewGenerator } from "./generators/yang-new.generator";
import { YangFeatureGenerator } from "./generators/yang-feature.generator";
import { YangComponentGenerator } from "./generators/yang-component.generator";
import { YangDirectiveGenerator } from "./generators/yang-directive.generator";
import { YangPipeGenerator } from "./generators/yang-pipe.generator";
import { YangServiceGenerator } from "./generators/yang-service.generator";
import { YangPluginGenerator } from './generators/yang-plugin.generator';

export class Main
{
    static PKG = require('../../package.json');

    public static main()
    {
        console.log(`< ${chalk.blue('YANG')} ${chalk.yellow(Main.version)} >`);

        Yargs
            .command(['new [name]'], 'Scaffold a new application',
                YangNewGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangNewGenerator(), args)
            )

            .command('component <name>', 'Create a new component',
                YangComponentGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangComponentGenerator(), args)
            )

            .command('directive <name>', 'Create a new directive',
                YangDirectiveGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangDirectiveGenerator(), args)
            )

            .command('feature <name>', 'Create a new feature',
                YangFeatureGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangFeatureGenerator(), args)
            )

            .command('pipe <name>', 'Create a new pipe',
                YangPipeGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangPipeGenerator(), args)
            )

            .command('service <name>', 'Create a new service',
                YangServiceGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangServiceGenerator(), args)
            )

            .command('*', 'Default command',
                (yargs: Argv) => yargs,
                (args) => YangUtils.runGenerator(new YangPluginGenerator(), args)
            )

            .demandCommand(1, 'You need one command before moving on')
            .help()
            .argv;
    }

    static get version(): string {
        return Main.PKG.version;
    }
}

Main.main();
