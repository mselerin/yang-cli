import * as path from "path";
import * as fs from "fs";
import {dasherize} from "./string-utils";

const rcopy = require("recursive-copy");
const through = require('through2');
const ejs = require('ejs');

export class FileUtils
{
    static read(path: string): string {
        return fs.readFileSync(path, { encoding: 'utf8' });
    }

    static write(path: string, content: string): void {
        fs.writeFileSync(path, content);
    }

    static readJSON(path: string): any {
        return JSON.parse(FileUtils.read(path));
    }

    static writeJSON(path: string, data: any): void {
        FileUtils.write(path, JSON.stringify(data, null, 2));
    }

    static exists(path: string): boolean {
        return fs.existsSync(path);
    }


    static async copy(from: string, to: string, opts?: any): Promise<void> {
        // TODO
        console.log('copy', from, to);

        let copyOptions = {
            overwrite: true,
            expand: true,
            dot: true
        };

        await rcopy(from, to, copyOptions);
    }


    static async copyTpl(from: string, to: string, context: any = {}, tplSettings?: any, opts?: any): Promise<void> {
        // TODO
        console.log('copyTpl', from, to);

        let copyOptions = {
            overwrite: true,
            expand: true,
            dot: true,
            filter: [
                '**/*.{json,js,ts,html,css,scss,md}'
            ],
            rename: (filePath) => {
                filePath = filePath.replace(/(#name#)/g, dasherize(context.name))
                console.log(' > ' + filePath);
                return filePath;
            },
            // transform: (src, dest, stats) => {
            //     return through((chunk, enc, done) => {
            //         let output = chunk.toString().toUpperCase();
            //         done(null, output);
            //     });
            // }
        };

        await rcopy(from, to, copyOptions);
    }
}
