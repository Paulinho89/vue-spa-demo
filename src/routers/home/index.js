/**
 * const Home = r =>
 * require.ensure(dependencies: String[], callback: function(require), chunkName: String);
 *
 * webpack 在编译时，会静态地解析代码中的 require.ensure()，同时将模块添加到一个分开的 chunk 当中。
 * 这个新的 chunk 会被 webpack 通过 jsonp 来按需加载
 *
 * dependencies => 这是一个字符串数组，通过这个参数，在所有的回调函数的代码被执行前，
 * 我们可以将所有需要用到的模块进行声明
 *
 * callback => 当所有的依赖都加载完成后，webpack会执行这个回调函数。
 * require 对象的一个实现会作为一个参数传递给这个回调函数
 *
 * chunkName => chunkName 是提供给这个特定的 require.ensure() 的 chunk 的名称
 *
 */
const Home = r => require.ensure([], () => r(require('@/pages/home/index.vue')), 'home');
const arr = [
  {
    path: '',
    name: 'home',
    component: Home,
    // If the user needs to be authenticated to view this page
    meta: {
      auth: false,
    },
  },
];
export default arr;
