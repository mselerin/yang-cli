import { Argv } from "yargs";

export abstract class YangCommand
{
    static yargs(yargs: Argv): Argv {
        return yargs;
    }

    abstract async run(options: any): Promise<void>;
}
