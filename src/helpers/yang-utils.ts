import * as Environment from 'yeoman-environment';
import chalk from 'chalk';
import {YangGenerator} from "../generators/yang.generator";
import {StringUtils} from "./string-utils";
import {requireg} from "./requireg";

export class YangUtils
{
    static MAIN_FILE = "src/main.ts";
    static CORE_MODULE_FILE = "src/app/core/core.module.ts";
    static SERVICE_MODULE_FILE = "src/app/core/core.services.ts";
    static SHARED_MODULE_FILE = "src/app/shared/shared.module.ts";
    static FEATURES_MODULE_FILE = "src/app/features/features.module.ts";
    static ROUTING_MODULE_FILE = "src/app/app-routing.module.ts";

    static runGenerator(Generator: typeof YangGenerator, props?: any): Promise<void>
    {
        console.log(chalk.grey(`With ${Generator.name}`));

        if (!props) props = {};

        // Always force mode
        props['force'] = true;

        const env = Environment.createEnv();
        let g = env.instantiate(Generator, {
            arguments: props.arguments,
            options: props
        });

        return new Promise<void>(resolve => {
            g.run(() => resolve());
        });
    }


    static loadPlugin(pluginName: string): any {
        const packageName = `yang-plugin-${pluginName}`;
        try {
            return requireg(packageName);
        }
        catch (err) {
            return null;
        }
    }

    static getPluginCommand(plugin: any, pluginCmd: string): any {
        if (plugin) {
            if (pluginCmd) {
                // Retrouver la commande
                const realPluginCmd = `Yang${StringUtils.classify(pluginCmd)}Generator`;
                return plugin[realPluginCmd];
            }
            else {
                // Le premier objet
                return (Object.keys(plugin).length > 0 ? plugin[Object.keys(plugin)[0]] : null);
            }
        }

        return null;
    }
}
