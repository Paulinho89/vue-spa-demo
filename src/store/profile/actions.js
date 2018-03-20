import types from '../types';

export const setAccount = ({ commit }) => {
  // 接口调用的真实逻辑
  // service.auth.login()
  //           .then((res) => {
  //             console.log('处理成功逻辑');
  //           });
  const account = {
    firstName: 'caoyp',
    interest: '看中超，亚冠、欧冠、CBA、NBA、打篮球',
    email: 'caoyp@guahao.com',
  };
  commit(types.SET_ACCOUNT, account);
};

export default {
  setAccount,
};
