/* ============
 * Actions for the auth module
 * ============
 *
 * The actions that are available on the
 * auth module.
 */

import types from '../types';
// 调用services接口
// import service from '@/services';

import app from '@/main';

export const check = ({ commit }) => {
  commit(types.CHECK);
};

export const login = ({ commit, dispatch }, param) => {
  // 接口调用的真实逻辑
  // 需要在页面上进行逻辑处理的用promise的方式再行返回
  // return new Promise((resolve, reject) => {
  //   service.auth.login(param)
  //   .then((data) => {
  //     console.log('处理成功逻辑');
  //     resolve(data);
  //   }, (e) => {
  //     reject(e);
  //   });
  // });
  commit(types.LOGIN, param);
  // 登录成功,触发存入用户信息
  // 如果跨module触发
  app.$store.dispatch('profile/setAccount');
  // 不跨module触发
  // dispatch('setAccount');
  app.$router.push('/profile');
};

export const logout = ({ commit }) => {
  // 接口调用的真实逻辑
  // service.auth.loginOut()
  //           .then((res) => {
  //             console.log('处理成功逻辑');
  //           });
  commit(types.LOGOUT);
};

export default {
  check,
  login,
  logout,
};
