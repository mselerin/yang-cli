import * as _ from 'lodash';
import * as chalk from 'chalk';
import * as Environment from 'yeoman-environment';
import {YangGenerator} from "../generators/yang.generator";

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
}
