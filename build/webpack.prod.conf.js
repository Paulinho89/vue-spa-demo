var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var ImageminPlugin = require('imagemin-webpack-plugin').default;//图片压缩
var env = config.build.env;
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js?[chunkhash]'),
    chunkFilename: utils.assetsPath('js/[name].js?[chunkhash]')
  },
  plugins: [
    // 区分生产环境
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 提取公共部分的css
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css?[contenthash]')
    }),
    // css 压缩
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    /**
     * 调用vendor的内容
     * @type {[type]}
     */
    new webpack.DllReferencePlugin({
      context: __dirname,
      //这里引入manifest文件
      manifest: require('../dist/static/js/vendor-manifest.json')
    }),
    /**
     * 提取公共部分js
     * @type {String}
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'static/js/[name].js?[chunkhash]',
      minChunks: Infinity,
    }),
    // 压缩js
    new webpack.optimize.UglifyJsPlugin({
      comments: false,//去掉注释
      compress: {
        warnings: false,//忽略警告,要不然会有一大堆的黄色字体出现……
        drop_console: true,
        pure_funcs: ['console.log']
      },
      sourceMap: false
    }),
    //拷贝文件到dist目录
    new CopyWebpackPlugin(
      [
        {
          from: 'src/images/icon/favicon.png',
          to: utils.assetsPath('img')
        }
      ]
    ),
    // 生成html模板
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      commonFile: '/static/js/vendor.js' + '?' + config.version,
      // minify: {
      //   removeComments: true, // 去注释
      //   collapseWhitespace: true, // 压缩空格
      //   removeAttributeQuotes: true // 去除属性引用
      // },
      inject: true,
      shortcut: '/static/img/favicon.png',
      chunksSortMode: 'dependency',
    }),
    // 图片压缩
    new ImageminPlugin({
      test: 'static/img/**',
      jpegtran: {
        progressive: true,
      },
      optipng: {
        optimizationLevel: 3
      },
      maxConcurrency: Infinity,
    }),
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 打包分析器
if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
     // Can be `server`, `static` or `disabled`.
        // In `server` mode analyzer will start HTTP server to show bundle report.
        // In `static` mode single HTML file with bundle report will be generated.
        // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
        analyzerMode: 'server',
        // Host that will be used in `server` mode to start HTTP server.
        analyzerHost: '127.0.0.1',
        // Port that will be used in `server` mode to start HTTP server.
        analyzerPort: 8888,
        // Path to bundle report file that will be generated in `static` mode.
        // Relative to bundles output directory.
        reportFilename: 'report.html',
        // Module sizes to show in report by default.
        // Should be one of `stat`, `parsed` or `gzip`.
        // See "Definitions" section for more information.
        defaultSizes: 'parsed',
        // Automatically open report in default browser
        openAnalyzer: true,
        // If `true`, Webpack Stats JSON file will be generated in bundles output directory
        generateStatsFile: false,
        // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
        // Relative to bundles output directory.
        statsFilename: 'stats.json',
        // Options for `stats.toJson()` method.
        // For example you can exclude sources of your modules from stats file with `source: false` option.
        // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        statsOptions: null,
        // Log level. Can be 'info', 'warn', 'error' or 'silent'.
        logLevel: 'info'
  }))
}

module.exports = webpackConfig
