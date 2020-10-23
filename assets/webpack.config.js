// const path = require('path');
// const glob = require('glob');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// module.exports = (env, options) => {
//   const devMode = options.mode !== 'production';

//   return {
//     optimization: {
//       minimizer: [
//         new TerserPlugin({ cache: true, parallel: true, sourceMap: devMode }),
//         new OptimizeCSSAssetsPlugin({})
//       ]
//     },
//     entry: {
//       'app': glob.sync('./vendor/**/*.js').concat(['./js/app.js'])
//     },
//     output: {
//       filename: '[name].js',
//       path: path.resolve(__dirname, '../priv/static/js'),
//       publicPath: '/js/'
//     },
//     devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
//     module: {
//       rules: [
//         {
//           test: /\.js$/,
//           exclude: /node_modules/,
//           use: {
//             loader: 'babel-loader'
//           }
//         },
//         {
//           test: /\.[s]?css$/,
//           use: [
//             MiniCssExtractPlugin.loader,
//             'css-loader',
//             'sass-loader',
//           ],
//         }
//       ]
//     },
//     plugins: [
//       new MiniCssExtractPlugin({ filename: '../css/app.css' }),
//       new CopyWebpackPlugin([{ from: 'static/', to: '../' }])
//     ]
//     .concat(devMode ? [new HardSourceWebpackPlugin()] : [])
//   }
// };




const webpack = require("webpack")
const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { merge } = require("webpack-merge")
const dev = process.env.NODE_ENV !== "production"
console.log("|> node env:", process.env.NODE_ENV)
console.log("|> hostname:", process.env.WCMS_HOSTNAME)
console.log("|> origin:", process.env.WCMS_ORIGIN)

let common = {
  stats: {
    colors: true
  }
}

// if (dev) {
//   common.externals = {
//     "react": "React",
//     "react-dom": "ReactDOM"
//   }
// }

/*
if (false) {
  common.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "server",
      analyzerPort: 8889,
      openAnalyzer: true
    })
  )
}
*/

module.exports = [
  merge(common, {
    node: {
      fs: "empty"
    },
    entry: [
      __dirname + "/app/app.js"
    ],
    output: {
      path: __dirname + "/../priv/static",
      filename: "js/app.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    resolve: {
      modules: [
        "node_modules",
        __dirname + "/app"
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        React: "react",
        $: "jquery",
        jQuery: "jquery"
      }),
      new webpack.DefinePlugin({
        __WCMS_ORIGIN__: JSON.stringify(process.env.WCMS_ORIGIN || "localhost"),
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV || "development")
      }),
      new CopyWebpackPlugin([{ from: __dirname + "/static" }]),
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /vi|en/),
      new webpack.IgnorePlugin(/unicode\/category\/So/, /node_modules/),
      new webpack.IgnorePlugin(/sass.js\/dist\/sass.sync/, /node_modules/)
    ]
  }),
  merge(common, {
    entry: [
      './app/styles/main.sass'
    ],
    module: {
      rules: [
        {
          test: [/\.sass$/, /\.css$/],
          loader: ExtractTextPlugin.extract({ use: "css-loader!postcss-loader!sass-loader", fallback: "style-loader" })
        },
      ]
    },
    output: {
      path: path.resolve(__dirname, '../priv/static/css')
    },
    plugins: [
      new CopyWebpackPlugin([{ from: __dirname + "/static" }]),
      new ExtractTextPlugin({ filename: "app.css", allChunks: true })
    ]
  }),
]
