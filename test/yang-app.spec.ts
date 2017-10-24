import rimraf = require("rimraf");
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as chai from 'chai';
import {YangUtils} from "../src/helpers/yang-utils";
import {YangAppGenerator} from "../src/generators/app/yang-app.generator";

chai.use(require('chai-fs'));

const assert = chai.assert;
const DEFAULT_NAME = "test-yang-cli";
const TMP_DIR = path.join(os.tmpdir(), DEFAULT_NAME);


function testApp(props: any) {
    props['force'] = true;

    let name = props['name'] || DEFAULT_NAME;
    const ROOT_DIR = path.join(TMP_DIR, name);

    before(async () => {
        if (!fs.existsSync(TMP_DIR))
            fs.mkdirSync(TMP_DIR);

        process.chdir(TMP_DIR);
        await YangUtils.runGenerator(YangAppGenerator, props);
    });


    it('should create a new app', () => {
        assert.isDirectory(ROOT_DIR);
    });

    it('should contains package.json and app directory', () => {
        assert.directoryInclude(
            ROOT_DIR,
            ['package.json', 'app']
        );
    });

    it('should contains a home feature', () => {
        assert.directoryInclude(
            path.join(ROOT_DIR, 'app', 'features', 'home'),
            ['home.module.ts', 'home-routing.module.ts', 'home.component.ts']
        );
    });


    after(() => {
        rimraf.sync(TMP_DIR);
    });
}


describe('yang new', () => {
    describe('no arguments', () => {
        testApp({});
    });

    describe('with specitic name', () => {
        testApp({
            'name': 'awesome-project'
        });
    });
});