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

const { AotPlugin } = require('@ngtools/webpack');
const ENABLE_AOT = false; //profileConfig.production;


const PATHS = { };
PATHS.root         = path.join(__dirname, './');
PATHS.dist         = path.join(PATHS.root, `dist/${PROFILE}`);
PATHS.node_modules = path.join(PATHS.root, 'node_modules');
PATHS.app          = path.join(PATHS.root, 'app');


const baseOutputName = `[name]-${APP_VERSION}-[chunkhash:12]`;
const extractCSS = new ExtractTextPlugin({
   filename: `${baseOutputName}.css`
});


const isInPath = (module, p, ignores) => {
   let inPath = false;
   if (module.userRequest) {
      inPath = (module.userRequest.indexOf(p) === 0);

      // Vérification des ignores
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
      'polyfills': path.join(PATHS.app, 'polyfills.ts'),
      'main': path.join(PATHS.app, 'main.ts')
   },


   output: {
      path: PATHS.dist,
      publicPath: '',
      filename: `${baseOutputName}.js`
   },


   resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.js'],
      alias: {
         'app': PATHS.app
      }
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
               use: ['css-loader', 'sass-loader']
            }),
            exclude: [/\.component\.s?css$/]
         },

         {
            test: /\.s?css$/,
            loaders: ['to-string-loader', 'css-loader', 'sass-loader'],
            include: [/\.component\.s?css$/]
         },

         { test: /\.json/, loader: 'json-loader' },
         { test: /\.html$/, loader: 'html-loader' },

         {
            test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            query: {
               name: `[path][name].[ext]`
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

      // Plugin AOT pour Angular
      new AotPlugin({
         tsConfigPath: './tsconfig.json',
         mainPath: "app/main.ts",
         skipCodeGeneration: !ENABLE_AOT // AOT really happens here (false = enabled)
      }),

      // Permet de séparer le code applicatif des librairies externes
      new CommonsChunkPlugin({
         name: 'vendor',
         chunks: ['main'],
         minChunks: (module) => isInPath(module, PATHS.node_modules, ['@angular'])
      }),

      // Sortir Angular hors du vendor-modules
      new CommonsChunkPlugin({
         name: 'angular',
         chunks: ['vendor', 'main'],
         minChunks: (module) => isInPath(module, path.join(PATHS.node_modules, '@angular'))
      }),

      // Faire un fichier pour la partie "webpack" (manifest)
      new CommonsChunkPlugin({
         name: 'manifest',
         minChunks: null
      }),

      extractCSS,

      // Recopier tout sauf ce qui est déjà pris en compte
      new CopyWebpackPlugin([
         // Copie de la config avec un search-replace
         {
            from: 'app/resources/config/*.json',
            to: '',
            transform: (content) => {
               // Regex permettant de remplacer tous les @{xxx} par ce qui se trouve dans le profileConfig
               return content.toString().replace(/@\{(\w*?)}/g, (match, p1) => profileConfig[p1]);
            }
         },

         {
            from: 'app',
            to: 'app',
            ignore: ['*.ts', '*.scss', '*.css', '*.html']
         }
      ]),

      new HtmlWebpackPlugin({
         filename: 'index.html',
         template: 'app/index.html',
         favicon: 'app/favicon.png',
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
         stats: config.stats
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
