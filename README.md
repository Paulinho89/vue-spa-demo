### 1.简介
> 项目案例是一个简单的权限管理页面,分为3个页面,

> 首页,账户中心,登录页

> 通过vue-router 对于路由做权限控制,

> 首页无需登录,跳转账户中心会自动检索是否登录,

> 登录之后首页的登录按钮变为退出按钮,

> 页面之间的的状态管理全部通过vuex进行管理

##### 项目用到的技术栈:
> * vue

> * vue-router

> * vuex

> * webpack

> * axios

> * eslint

> * less

**基础环境**
> node : v8.2.1

>npm : 5.3.0

**注:如果项目install有问题,可把对应环境配置成上面相关的环境在尝试**

**项目运行**
```
$ npm install
$ npm run dev
```

**启动服务**
```
npm run dev  开发环境构建
npm run build 发布环境构建
npm run eslint 代码格式校验
```


### 2.目录结构
```
├── README.md                       项目介绍
├── index.html                      入口页面
├── build                           构建脚本目录
│   ├── webpack.base.conf.js            webpack基础配置,开发环境,生产环境都依赖
│   ├── webpack.dev.conf.js             webpack开发环境配置
│   ├── webpack.prod.conf.js            webpack生产环境配置
│   ├── build.js                        生产环境构建脚本
│   ├── dev-server.js                   开发服务器热重载脚本，主要用来实现开发阶段的页面自动刷新
│   ├── utils.js                        构建相关工具方法
├── config                          项目配置
│   ├── dev.env.js                      开发环境变量
│   ├── index.js                        项目配置文件
│   ├── prod.env.js                     生产环境变量
├── src                             源码目录
│   ├── main.js                         入口文件
│   ├── config                          入口相关配置文件
│   ├── app.vue                         根组件
│   ├── components                      公共组件目录
│   │   └── base                          基础组件
│   │   └── layouts                       布局组件
│   │       └──header.vue                       头部组件
│   ├── styles                          样式资源
│   │   └── index.less                    样式入口
│   │   └── var.less                      变量
│   │   └── reset.less                    重置样式
│   │   └── common.less                   公共样式
│   ├── images                          图片资源
│   │   └── auth                          验证模块图片
│   ├── services                        接口服务
│   │   └── auth                          验证模块接口
│   ├── pages                           页面目录
│   │   └── auth                          验证模块
│   │       └── login.vue                       登录文件
│   ├── routes                          路由目录
│   │   └── auth                          验证模块
│   │       └── index.js                    验证模块入口
│   │   └── index                         所有模块汇总
│   ├── store                           应用级数据（state）
│   │   └── index.js                      所有模块数据汇总
│   │   └── type.js                       类型汇总
│   │   └── auth                          验证相关数据模块
│   │       └── index.js                    验证模块入口
│   │       └── actions.js                  actions
│   │       └── mutations.js                mutations
│   │       └── getters.js                  getters
│   │       └── state.js                    默认状态
│   ├── services                        接口api定义
├── .eslintrc.js                        eslint规则配置
├── package.json
```
**大概解释一下目录结构**

> 项目是以**模块化**去划分页面,

> 建议在拿到需求的时候,根据**模块**划分好页面,

> **定义好模块名称,建议`pages`,`images`,`routes`,`services`,
`store`目录,模块名保持一致**

> **pages**目录里面是模块文件,模块文件里面是页面文件

> **styles**目录里面放一些公共样式,最后通过index.less导出,在入口文件引入

>**components**目录里面放几个模块,可以大致分为**base基础组件**,

>**layouts布局组件**,**bussiness业务组件**,然后在对应模块下面写上对应的组件实现


***


### 3.配置文件
**package.json里面的配置**
```
"dev": "node build/dev-server.js",
"build": "node build/build.js",
```

#### 3.1**开发环境启动 dev-server.js**

**dev-server.js的实现**

```
require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}

```

> **dev-server.js**依赖了**webpack.dev.conf.js**配置文件

> 配置文件分为**webpack.base.conf.js**基础配置

> 还有**webpack.dev.conf.js**开发环境的配置

> 还有**webpack.prod.conf.js**生产环境的配置

**贴一段base的基础配置**

```
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      '~component': resolve('src/components'),
    }
  },
  module: {
    rules: [
      // eslint检查配置 不需要可以注释
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
  ]
}

```
> 上面的配置依赖于config目录的一些配置,

> config目录分为prod.evn.js生产环境的变量,dev.env.js 开发环境的变量,

> 比如**api接口**的地址就可以在这边配置,根据开发环境还有生产环境分别配置不同的接口地址

**config入口文件的实现**

```
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

```

**入口文件根据环境的不同,分别做了一些不同的配置**


**贴一段dev的配置**

```
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

```

#### 3.2生产环境启动 build.js
**build.js的实现**
```
require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

```

**build引入了webpack.prod.conf,下面贴一段实现prod的实现**

```
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

var env = config.build.env

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
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
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

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

```
***
> 上面分别是dev环境还有prod环境的配置,
> 他们都是基础base配置,不同点主要在于

> - dev环境利用express在本地搭建了环境,启动了热更新服务
> - prod环境js,html进行了压缩合并,减少了体积
> - prod环境提取了公共js,提取了样式文件

***

### 4.路由的实现
**使用[vue-router](https://router.vuejs.org/zh-cn/)进行单页面路由的控制**

**vue-router的相关概念介绍,就不一一介绍的,这边直接讲解vue-router在项目中的实现,具体的vue-router相关知识请参考[vue-router官网](https://router.vuejs.org/zh-cn/)**

**路由的使用在config.js文件中**

```
export const router = new VueRouter({
  mode: 'history',
  routes,
});
```

#### mode为history表示使用h5 history模式,这样就不会出现#符号

不过history模式下面也有一些坑,具体可以参考
[HTML5 History 模式](https://router.vuejs.org/zh-cn/essentials/history-mode.html)

**路由目录如下:**
```
│   ├── routes                          路由目录
│   │   └── auth                          验证模块
│   │       └── index.js                    验证模块入口
│   │   └── index                         所有模块汇总
```
**路由模块按照页面模块同步,如验证模块,保持跟页面模块一致,
一个模块下面放一个模块入口,里面的配置如下**

```
const Login = r => require.ensure([], () => r(require('@/pages/auth/login')), 'auth');
const arr = [
  {
    path: '/login',
    name: 'login.index',
    component: Login,

    // If the user needs to be a guest to view this page
    meta: {
      guest: true,
    },
  },
];
// Auth
export default arr;

```


```
const Login = r => require.ensure([], () => r(require('@/pages/auth/login')), 'auth');
```
> 这边结合 Vue 的 异步组件和 Webpack 的 [code splitting feature](https://doc.webpack-china.org//guides/code-splitting-async/#require-ensure-/), 轻松实现路由组件的懒加载。

> 有时候我们想把某个模块下的所有组件都打包在同个异步 chunk 中。只需要提供 require.ensure第三个参数作为 chunk 的名称即可

**路由做了权限控制,对于需要登录之后才能打开的页面,
我们控制meta.auth 属性为true即可**

```
export const router = new VueRouter({
  mode: 'history',
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
    /*
     * If the user is not authenticated and visits
     * a page that requires authentication, redirect to the login page
     */
    next({
      name: 'login.index',
    });
  } else if (to.matched.some(m => m.meta.guest) && store.state.auth.authenticated) {
    /*
     * If the user is authenticated and visits
     * an guest page, redirect to the dashboard page
     */
    next({
      name: 'home.index',
    });
  } else {
    next();
  }
});
```

***

### 5.Vuex状态管理

##### 项目使用[vuex](https://vuex.vuejs.org/zh-cn/intro.html)进行状态管理,把一些公共行为,api交互相关的状态都封装在vuex中进行统一管理

**vuex的相关概念介绍,就不一一介绍的,这边直接讲解vuex在项目中的实现,具体的vuex相关知识请参考[vuex官网](https://vuex.vuejs.org/zh-cn/state.html)**

**vuex目录实现:**

```
│   ├── store                           应用级数据（state）
│   │   └── index.js                      所有模块数据汇总
│   │   └── type.js                      类型定义汇总
│   │   └── auth                          验证相关数据模块
│   │       └── index.js                    验证模块入口
│   │       └── actions.js                  actions
│   │       └── mutations.js                mutations
│   │       └── getters.js                  getters
│   │       └── state.js                    默认状态
```

> vuex按照**页面目录结构**进行划分


#### 这边简单介绍一下自己对于vuex流程的理解

##### 1.首先就是我们在页面上必须通过action（行为）去改变数据状态,那么我们就需要定义action

```
/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import * as types from '../type';
// 调用services接口
// import {
//   axLogin,
//   axLoginOut
// } from '@/services/auth';

import Vue from 'vue';
import store from '@/store';

export const check = (
  { commit }) => {
  commit(types.CHECK);
};

export const login = ({ commit }, payload) => {
  const promise = new Promise((resolve, reject) => {
    // axLogin(); 正常情况需要调用services接口获取数据,这边暂时默认成功
    const success = true;
    if (success) {
      commit(types.LOGIN, payload);
      // 登录成功,触发存入用户信息
      store.dispatch('account/setAccount');
      Vue.router.push('/account');
      resolve();
    } else {
      reject();
    }
  });
  return promise;
};

export const logout = ({ commit }) => {
  const promise = new Promise((resolve, reject) => {
    // axLoginOut(); 正常情况需要调用services接口获取数据,这边暂时默认成功
    const success = true;
    if (success) {
      commit(types.LOGOUT);
      resolve();
    } else {
      reject();
    }
  });
  return promise;
};

export default {
  check,
  login,
  logout,
};


```
##### 2.更改 Vuex 的 store 中的状态的唯一方法是提交 mutation (变化)

**每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)**

```
/* ============
 * Mutations for the auth module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import Vue from 'vue';
import {
  CHECK,
  LOGIN,
  LOGOUT,
} from '../type';

export default {
  [CHECK](state) {
    state.authenticated = !!localStorage.getItem('id_token');
    if (state.authenticated) {
      Vue.$http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('id_token')}`;
    }
  },

  [LOGIN](state, token) {
    state.authenticated = true;
    localStorage.setItem('id_token', token);
    Vue.$http.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  [LOGOUT](state) {
    state.authenticated = false;
    localStorage.removeItem('id_token');
    Vue.$http.defaults.headers.common.Authorization = '';
  },
};

```

##### 3.mutation需要事件类型,那么我们就需要定义一个不可变的类型,这样可以避免类型冲突

```
/* ============
 * Mutation types for the account module
 * ============
 *
 * The mutation types that are available
 * on the auth module.
 */

export const CHECK = 'CHECK';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SETACCOUNT = 'SETACCOUNT';

export default {
  CHECK,
  LOGIN,
  LOGOUT,
  SETACCOUNT,
};

```
##### 4.那么前面的数据变更都完成了,如何获取数据的变更了,这时候我们就需要getters了
```
/* ============
 * Getters for the auth module
 * ============
 *
 * The getters that are available on the
 * auth module.
 */

export default {
  isLogin: state => state.authenticated,
};

```

##### 5.数据初始化的时候都为空,这时候我们要定义一些默认的状态,就需要state了

```
/* ============
 * State of the auth module
 * ============
 *
 * The initial state of the auth module.
 */

export default {
  authenticated: false,
};

```

##### 6.最后就是把当前模块导出了,在index里面实现

```
/* ============
 * Auth Module
 * ============
 */

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

```
##### 7.在页面上如何绑定action还有获取getter呢？
```
import { mapActions, mapGetters } from 'vuex';
...
computed: {
      ...mapActions({
        authLogout: 'auth/logout', // 映射 this.authLogout() 为 this.$store.dispatch('auth/logout')
      }),
      // 使用对象展开运算符将 getters 混入 computed 对象中
      ...mapGetters({
        // 映射 this.auth/isLogin 为 store.getters.auth/isLogin
        isLogin: 'auth/isLogin',
      }),
    },
```

我们通过**mapGetters**,**mapActions**辅助函数去实现

### 6.eslint在项目中的使用

> 项目集成了eslint,做代码规范的检查
项目的eslint目前继承了[airbnb](https://github.com/airbnb/javascript)提供的规则验证

**注:目前eslint集成在webpack环境中,项目启动的时候,如果有相关格式不符合规则,就会提示错误,这样的方案可能有些人不是很适应,那么可以通过注释下面的代码关闭eslint在webpack启动期间的运行**
**在webpack.base.conf.js中配置**

```
// eslint检查配置 不需要可以注释
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
```

**不过个人建议还是在项目中集成eslint,好的代码习惯和风格,对于项目的阅读性,后期维护性还有扩展性都有很大的帮助**

**eslint可以加入一些自己个人的规则配置,在.eslintrc.js文件下修改,如下:**

```
// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',// 继承aribnb的配置
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here 0表示关闭规则
  'rules': {
    'global-require': 0,
    'import/first': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-multi-assign': 0,

    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

```
[更多eslint规则请参考](http://eslint.cn/docs/rules/)

**eslint一键格式化**
```
npm run lint
```

**运行上面命令就会根据eslint设置的规则格式化,建议在关闭eslint的同学,在上传代码之前都运行一下这个命令,这样可以保证大家代码风格的统一性**

[eslint官网,更多eslint相关知识请查看](http://eslint.cn/)

### 7.样式规范

-  class命名统一采用-命名: 如: user-help

-  样式变量命名: $color-{颜色}-{用途}-{深浅}

```
/**
 * 颜色主题，色值为6位值
 * 规则：
 * $color-{颜色}-{用途}-{深浅}
 * 颜色：英文   white、gray
 * 用途：不可缺省
 * 		bg: 背景
 * 		bd：边框
 * 		ft：字体
 * 深浅：通用缺省
 * 		较深：darker
 * 		深  ：dark
 * 		浅  ：light
 * 		较浅：lighter
 */
```

-  样式里面的背景图片路径统一设置：

```
@imgPath: "/src/images/";
```

> **所有接口调用，统一走vuex,与services进行配合**
