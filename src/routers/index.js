import Vue from 'vue';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

import store from '@/store';

import Base from './base';
import Home from './home';
import Auth from './auth';
import Profile from './profile';

// 数组合并
const routes = [...Base, ...Home, ...Auth, ...Profile];
// console.log(routes);
const router = new VueRouter({
  // 去除vue-router hash
  mode: 'history',
  routes,
});

/**
 * to: Route : 即将要进入的目标 [路由对象]
 *
 * from: Route : 当前导航正要离开的路由
 *
 * next: Function : 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next方法的调用参数
 *
 * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是confirmed （确认的）
 *
 * next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），
 * 那么 URL 地址会重置到 from路由对应的地址。
 *
 * next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
 *
 */

router.beforeEach((to, from, next) => {
  const matched = router.getMatchedComponents(to); // 是否有匹配组件
  // console.log(matched);
  // 配置404页面
  if (matched.length > 0) {
    if (to.matched.some(m => m.meta.auth) && !store.state.auth.authenticated) {
      /*
       * If the user is not authenticated and visits
       * a page that requires authentication, redirect to the login page
       */
      next({
        name: 'login',
      });
    } else if (to.matched.some(m => m.meta.guest) && store.state.auth.authenticated) {
      /*
       * If the user is authenticated and visits
       * an guest page, redirect to the dashboard page
       */
      next({
        name: 'home',
      });
    } else {
      next();
    }
  } else {
    next({
      name: '404',
    });
  }
});

export default router;
