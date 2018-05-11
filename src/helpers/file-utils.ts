import * as path from "path";
import * as fs from "fs";

export class FileUtils
{
    static exists(file: string): boolean {
        fs.existsSync(path.resolve(file));
        return fs.existsSync(path.resolve(file));
    }
}
