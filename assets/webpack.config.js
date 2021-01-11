const webpack = require("webpack")
const path = require('path')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { merge } = require("webpack-merge")
const dev = process.env.NODE_ENV !== "production"
console.log("|> node env:", process.env.NODE_ENV)

let common = {
  stats: {
    colors: true
  }
}

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
  merge(common, {
    entry: [__dirname + "/src/main.js"],
    output: {
      path: __dirname + "/../priv/static",
      filename: "js/main.js"
    },
    plugins: [
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }),
    ]
  })
]
