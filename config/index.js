// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  version: '1.0', // vendor版本号
  build: {
    // 根据test参数判断测试环境还是生产环境
    env: process.env.npm_config_test ? require('./test.env') : require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/api": {
        target: 'http://192.168.99.105:8091',
      },
    },
    cssSourceMap: false
  }
}
