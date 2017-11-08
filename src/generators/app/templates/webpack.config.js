const APP_VERSION = process.env['npm_package_version'];

const getProfile = () => {
    let profile = process.env['PROFILE'] || 'dev';
    let script = process.env['npm_lifecycle_event'];

    if (script.startsWith('build:')) {
        profile = script.substring(6);
    }

    return profile;
};

const PROFILE = getProfile();
const profileConfig = require('./webpack-profiles.config')[PROFILE];

const path = require('path');
const merge = require('webpack-merge');

const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

const AngularNamedLazyChunksWebpackPlugin = require('angular-named-lazy-chunks-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const ENABLE_AOT = false; //profileConfig.production;


const PATHS = { };
PATHS.root         = path.join(__dirname, './');
PATHS.dist         = path.join(PATHS.root, `dist/${PROFILE}`);
PATHS.node_modules = path.join(PATHS.root, 'node_modules');
PATHS.src          = path.join(PATHS.root, 'src');
PATHS.app          = path.join(PATHS.src, 'app');
PATHS.assets       = path.join(PATHS.src, 'assets');


const baseOutputName = `[name]-${APP_VERSION}-[chunkhash:12]`;
const extractCSS = new ExtractTextPlugin({
    filename: `${baseOutputName}.css`
});


const isInPath = (module, p, ignores) => {
    let inPath = false;
    if (module.userRequest) {
        inPath = (module.userRequest.indexOf(p) === 0);

        if (inPath && ignores) {
            let hasIgnore = ignores.some((ignore) => {
                return (module.userRequest.indexOf(path.join(p, ignore)) === 0);
            });

            inPath = (hasIgnore ? false : inPath);
        }
    }

    return inPath;
};


let config = {
    devtool: false,

    entry: {
        'polyfills': path.join(PATHS.src, 'polyfills.ts'),
        'main': path.join(PATHS.src, 'main.ts')
    },


    output: {
        path: PATHS.dist,
        publicPath: '',
        filename: `${baseOutputName}.js`
    },


    resolve: {
        modules: ['node_modules'],
        extensions: ['.ts', '.js']
    },


    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['@ngtools/webpack'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },

            {
                test: /\.s?css$/,
                loader: extractCSS.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
                }),
                exclude: [/\.component\.s?css$/]
            },

            {
                test: /\.s?css$/,
                loaders: ['to-string-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap'],
                include: [/\.component\.s?css$/]
            },

            { test: /\.json/, loader: 'json-loader' },
            { test: /\.html$/, loader: 'html-loader', options: {attrs: []} },

            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },

    plugins: [
        new NoEmitOnErrorsPlugin(),
        new HashedModuleIdsPlugin(),

        new DefinePlugin({
            PROFILE_CONFIG: JSON.stringify(profileConfig)
        }),

        // Write third-party module in a specific file
        new CommonsChunkPlugin({
            name: 'vendor',
            chunks: ['main'],
            minChunks: (module) => isInPath(module, PATHS.node_modules, ['@angular'])
        }),

        // Write Angular outside vendor-modules
        new CommonsChunkPlugin({
            name: 'angular',
            chunks: ['vendor', 'main'],
            minChunks: (module) => isInPath(module, path.join(PATHS.node_modules, '@angular'))
        }),

        // Webpack specific fragments
        new CommonsChunkPlugin({
            name: 'manifest',
            minChunks: null
        }),

        // Angular Compilation
        new AngularNamedLazyChunksWebpackPlugin(),
        new AngularCompilerPlugin({
            tsConfigPath: path.join(PATHS.src, 'tsconfig.app.json'),
            mainPath: path.join(PATHS.src, 'main.ts'),
            skipCodeGeneration: !ENABLE_AOT // AOT really happens here (false = enabled)
        }),

        extractCSS,

        new CopyWebpackPlugin([
            // Config copy with search-replace for @{token}
            {
                context: 'src',
                from: 'assets/config/*.json',
                to: '',
                transform: (content) => {
                    // Regex permettant de remplacer tous les @{xxx} par ce qui se trouve dans le profileConfig
                    return content.toString().replace(/@\{(\w*?)}/g, (match, p1) => profileConfig[p1]);
                }
            },

            {
                context: 'src',
                from: '',
                to: '',
                ignore: ['*.ts', '*.scss', '*.css', '*.html']
            }
        ]),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(PATHS.src, 'index.html'),
            favicon: path.join(PATHS.src, 'favicon.png'),
            inject: true,
            minify: false
        })
    ],

    stats: {
        colors: true,
        hash: false,
        version: false,
        assets: true,
        cached: false,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        reasons: false,
        source: false,
        maxModules: 0
    }

};


if ('dev' === PROFILE) {
    config = merge(config, {
        devtool: 'cheap-module-eval-source-map',

        devServer: {
            port: 3000,
            inline: false,
            hot: false,
            stats: config.stats,
            proxy: profileConfig.proxy
        }
    });
}

else {
    config = merge(config, {
        plugins: [
            new ProgressPlugin(),
            new CleanWebpackPlugin([PATHS.dist], { root: PATHS.root }),

            new UglifyJsPlugin({
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    warnings: false
                }
            })
        ]
    });
}

module.exports = config;
