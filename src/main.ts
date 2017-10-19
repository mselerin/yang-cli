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
    static PKG = require('../package.json');

    public static main()
    {
        console.log(`< ${chalk.blue('YANG')} ${chalk.yellow(Main.version)} >`);

        Yargs
            .command(['new [name]'], 'Scaffold a new application', (argv) => argv,
                (args) => YangUtils.runGenerator(YangAppGenerator, args)
            )

            .command('component [name]', 'Create a new component', (argv) => argv,
                (args) => YangUtils.runGenerator(YangComponentGenerator, args)
            )

            .command('directive [name]', 'Create a new directive', (argv) => argv,
                (args) => YangUtils.runGenerator(YangDirectiveGenerator, args)
            )

            .command('feature [name]', 'Create a new feature', (argv) => argv,
                (args) => YangUtils.runGenerator(YangFeatureGenerator, args)
            )

            .command('pipe [name]', 'Create a new pipe', (argv) => argv,
                (args) => YangUtils.runGenerator(YangPipeGenerator, args)
            )

            .command('service [name]', 'Create a new service', (argv) => argv,
                (args) => YangUtils.runGenerator(YangServiceGenerator, args)
            )

            .command('plugin <name> [cmd]', 'Run a Yang Plugin', (argv) => argv,
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

                    return YangUtils.runGenerator(cmd, args);
                }
            )

            .help()
            .argv;
    }

    static get version(): string {
        return Main.PKG.version;
    }
}

Main.main();
