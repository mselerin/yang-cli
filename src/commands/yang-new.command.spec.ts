import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as chai from "chai";
import {YangUtils} from "@app/helpers/yang-utils";
import {YangNewCommand} from "./yang-new.command";

chai.use(require('chai-fs'));

const assert = (chai.assert as any);
const DEFAULT_NAME = "test-yang-cli";
const TMP_DIR = path.join(os.tmpdir(), DEFAULT_NAME);
const TIMEOUT = 10000;


function testApp(props: any) {
    let name = props['name'] || DEFAULT_NAME;
    const ROOT_DIR = path.join(TMP_DIR, name);

    before(async () => {
        if (fs.existsSync(ROOT_DIR))
            fs.removeSync(ROOT_DIR);

        if (!fs.existsSync(TMP_DIR))
            fs.ensureDirSync(TMP_DIR);

        process.chdir(TMP_DIR);
        await YangUtils.runCommand(new YangNewCommand(), props);
    });


    it('should create a new app', () => {
        assert.isDirectory(ROOT_DIR);
    });

    it('should contains package.json and src directory', () => {
        assert.directoryInclude(
            ROOT_DIR,
            ['package.json', 'src']
        );
    });

    it('should contains a home feature', () => {
        assert.directoryInclude(
            path.join(ROOT_DIR, 'src', 'app', 'features', 'home'),
            ['home.module.ts', 'home-routing.module.ts', 'home.component.ts', 'home.component.spec.ts']
        );
    });


    // after(() => {
    //     fs.removeSync(TMP_DIR);
    // });
}


describe('yang new', function () {
    this.timeout(TIMEOUT);

    describe('no arguments', function () {
        testApp({});
    });

    describe('with specific name', () => {
        testApp({
            'name': 'awesome-project'
        });
    });
});
