import * as Yargs from 'yargs';
import chalk from 'chalk';
import {YangUtils} from "./helpers/yang-utils";
import {YangAppGenerator} from "./generators/app/yang-app.generator";
import {YangFeatureGenerator} from "./generators/feature/yang-feature.generator";
import {YangComponentGenerator} from "./generators/component/yang-component.generator";
import {YangDirectiveGenerator} from "./generators/directive/yang-directive.generator";
import {YangPipeGenerator} from "./generators/pipe/yang-pipe.generator";
import {YangServiceGenerator} from "./generators/service/yang-service.generator";

export class Main
{
    static PKG = require('../../package.json');

    public static main()
    {
        console.log(`< ${chalk.blue('YANG')} ${chalk.yellow(Main.version)} >`);

        Yargs
            .command(['new [name]'], 'Scaffold a new application',
                YangAppGenerator.yargs,
                (args) => YangUtils.runGenerator(new YangAppGenerator(), args)
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

            .command('plugin <name> [cmd]', 'Run a Yang plugin', (yargs) => yargs,
                (args) => {
                    const pluginName = args['name'];
                    const pluginCmd = args['cmd'];

                    const plugin = YangUtils.loadPlugin(pluginName);
                    if (!plugin) {
                        console.log(chalk.bgRed(`Plugin ${pluginName} not found`));
                        return;
                    }

                    const cmd = YangUtils.getPluginCommand(plugin, pluginCmd);
                    if (!cmd) {
                        console.log(chalk.bgRed(`Plugin command ${pluginCmd} not found`));
                        return;
                    }

                    //return YangUtils.runGenerator(cmd, args);
                }
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
