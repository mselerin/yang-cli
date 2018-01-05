import {SpawnSyncReturns} from "child_process";

const fs   = require('fs');
const path = require('path');
const resolve = require('resolve').sync;
const rc = require('rc');
const spawnSync = require('child_process').spawnSync;
const isWin32 = process.platform === 'win32';


const RESOLVERS = [
    nativeResolve,
    nodePathResolve,
    userHomeResolve,
    nodeModulesResolve,
    yarnModulesResolve,
    prefixResolve,
    execPathResolve
];


function resolveFn(module, basePath, dirname = '') {
    try {
        return resolve(module, {
            basedir: path.join(basePath, dirname)
        })
    } catch (e) {}
}

// resolve using native require() function
// if NODE_PATH is defined, a global module should be natively resolved
function nativeResolve(module, dirname) {
    try {
        //return require.resolve(module, dirname);
        return require.resolve(module);
    } catch (e) {}
}

// See: http://nodejs.org/docs/latest/api/modules.html#modules_loading_from_the_global_folders
// required?
function nodePathResolve(module, dirname) {
    let i, modulePath;
    let nodePath = process.env.NODE_PATH;

    if (!nodePath) { return; }

    let nodePaths = nodePath.split(path.delimiter).map((nodepath) => path.normalize(nodepath));
    for (i = 0; i < nodePaths.length; i++) {
        if (modulePath = resolveFn(module, dirname || nodePaths[i])) {
            break;
        }
    }

    return modulePath;
}


function userHomeResolve(module) {
    let i, modulePath;
    let homePath = isWin32 ? process.env['USERPROFILE'] : process.env['HOME'];

    let paths = [
        'node_modules',
        'node_libraries',
        'node_packages'
    ];

    for (i = 0; i < paths.length; i++) {
        if (modulePath = resolveFn(module, homePath, paths[i])) {
            break;
        }
    }

    return modulePath
}

// See: https://npmjs.org/doc/files/npm-folders.html#prefix-Configuration
// it uses execPath to discover the default prefix on *nix and %APPDATA% on Windows
function prefixResolve(module) {
    let modulePath, dirname;
    let prefix = rc('npm').prefix;

    if (isWin32) {
        prefix = prefix || path.join(process.env.APPDATA, 'npm');
        dirname = prefix
    }
    else {
        prefix = prefix || path.join(path.dirname(process.execPath), '..');
        dirname = path.join(prefix, 'lib')
    }

    dirname = path.join(dirname, 'node_modules');
    modulePath = resolveFn(module, dirname);

    return modulePath;
}

// Resolves packages using the node installation path
// Useful for resolving global packages such as npm when the prefix has been overriden by the user
function execPathResolve(module) {
    let modulePath, dirname;
    let execPath = path.dirname(process.execPath);

    if (isWin32) {
        dirname = execPath;
    }
    else {
        dirname = path.join(execPath, '..', 'lib');
    }

    dirname = path.join(dirname, 'node_modules');
    modulePath = resolveFn(module, dirname);

    return modulePath;
}

function nodeModulesResolve(module) {
    let i, modulePath;
    let nodeModulesStr = process.env['NODE_MODULES'];

    if (typeof nodeModulesStr === 'string') {
        let nodeModules = nodeModulesStr.split(path.delimiter);
        for (i = 0; i < nodeModules.length; i++) {
            if (modulePath = resolveFn(module, nodeModules[i])) {
                break;
            }
        }
    }

    return modulePath;
}


function yarnModulesResolve(module) {
    let i, modulePath;

    // Retrieve yarn global path
    let yarnCmd = isWin32 ? 'yarn.cmd' : 'yarn';
    let result = spawnSync(yarnCmd, ['global', 'dir'], { encoding: 'utf8' });
    let yarnPath = result.stdout;
    yarnPath = yarnPath.replace(/[\r\n]+/g, '');

    let nodeModulesStr = path.join(yarnPath, 'node_modules');

    if (typeof nodeModulesStr === 'string') {
        let nodeModules = nodeModulesStr.split(path.delimiter);
        for (i = 0; i < nodeModules.length; i++) {
            if (modulePath = resolveFn(module, nodeModules[i])) {
                break;
            }
        }
    }

    return modulePath;
}



export function requireg(module) {
    try {
        return require(resolveg(module));
    } catch (e) {
        throw new Error("Could not require module '"+ module +"'");
    }
}


function resolveg(module, dirname = '') {
    let i, resolver, modulePath;
    for (i = 0; i < RESOLVERS.length; i++) {
        resolver = RESOLVERS[i];
        if (modulePath = resolver(module, dirname)) {
            break;
        }
    }

    return modulePath;
}
