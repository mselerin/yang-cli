import * as path from "path";
import * as fs from "fs";

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
}
