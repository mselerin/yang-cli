import { YangGenerator } from "../generators/yang.generator";

export class YangUtils
{
    static runGenerator(generator: YangGenerator, options: any): Promise<void> {
        return generator.run(options);
    }
}
