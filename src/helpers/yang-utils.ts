import * as _ from 'lodash';
import * as Environment from 'yeoman-environment';
import chalk from 'chalk';
import {YangGenerator} from "../generators/yang.generator";
import requireg = require('requireg');
import {StringUtils} from "./string-utils";

export class YangUtils
{
    static CORE_MODULE_FILE = "app/core/core.module.ts";
    static SERVICE_MODULE_FILE = "app/core/core.services.ts";
    static SHARED_MODULE_FILE = "app/shared/shared.module.ts";
    static FEATURES_MODULE_FILE = "app/features/features.module.ts";
    static ROUTING_MODULE_FILE = "app/app-routing.module.ts";

    static runGenerator(Generator: typeof YangGenerator, props: any, context?: YangGenerator): Promise<void>
    {
        console.log(chalk.grey(`With ${Generator.name}`));

        const kebabName = _.kebabCase(Generator.name);
        const env = Environment.createEnv();

        let g = env.instantiate(Generator, {
            options: props,
            arguments: props.arguments
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
                const realPluginCmd = `Yang${StringUtils.pascalCase(pluginCmd)}Generator`;
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
