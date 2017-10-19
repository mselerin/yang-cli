import * as _ from 'lodash';

export class StringUtils
{
    static findLast(str: string, re = /[a-z0-9]/i, startNdx: number = -1): number
    {
        if (startNdx < 0 || startNdx > str.length) {
            startNdx = str.length - 1;
        }

        let found = false;
        while (!found && startNdx >= 0) {
            found = re.test(str.charAt(startNdx));
            if (!found)
                startNdx--;
        }

        return startNdx;
    }


    static findLastLetterOrDigit(str: string, startNdx: number = -1): number {
        return StringUtils.findLast(str, /[a-z0-9]/i, startNdx)
    }


    static kebabCase(str: string): string {
        return _.kebabCase(str);
    }

    static camelCase(str: string): string {
        return _.camelCase(str);
    }

    static pascalCase(str: string): string {
        return _.upperFirst(_.camelCase(str));
    }
}
