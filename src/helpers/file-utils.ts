import * as _ from "lodash";
import * as path from "path";
import * as fs from "fs";
import chalk from "chalk";
import {dasherize} from "./string-utils";

const rcopy = require("recursive-copy");
const through = require('through2');
const ejs = require('ejs');

export class FileUtils
{
    static logCRUD(file: string): void {
        let crud = chalk.green(_.padStart('create', 8));
        if (FileUtils.exists(file))
            crud = chalk.yellow(_.padStart('update', 8));

        console.log(`${crud} ${file}`);
    }


    static read(file: string): string {
        return fs.readFileSync(file, { encoding: 'utf8' });
    }

    static write(file: string, content: string): void {
        FileUtils.logCRUD(file);
        fs.writeFileSync(file, content);
    }

    static readJSON(file: string): any {
        return JSON.parse(FileUtils.read(file));
    }

    static writeJSON(file: string, data: any): void {
        FileUtils.write(file, JSON.stringify(data, null, 2));
    }

    static exists(file: string): boolean {
        fs.existsSync(path.resolve(file));
        return fs.existsSync(path.resolve(file));
    }



    static async copy(from: string, to: string, context: any = {}, opts: any = {}): Promise<void>
    {
        let copyOptions = {
            overwrite: true,
            expand: true,
            dot: true,
            rename: (filePath) => {
                filePath = filePath.replace(/(#name#)/g, dasherize(context.name));
                return filePath;
            },
            transform: (src, dest, stats) => {
                FileUtils.logCRUD(dest);
            }
        };

        await rcopy(from, to, _.defaults(opts, copyOptions));
    }


    static async copyTpl(from: string, to: string, context: any = {}, opts: any = {}): Promise<void>
    {
        let copyOptions = {
            overwrite: true,
            expand: true,
            dot: true,
            rename: (filePath) => {
                filePath = filePath.replace(/(#name#)/g, dasherize(context.name));
                return filePath;
            },
            transform: (src, dest, stats) => {
                FileUtils.logCRUD(dest);

                let content: string = FileUtils.read(src);
                content = ejs.render(content, context);

                return through.obj((data, encoding, callback) => {
                    callback(null, content);
                });
            }
        };

        await rcopy(from, to, _.defaults(opts, copyOptions));
    }
}
