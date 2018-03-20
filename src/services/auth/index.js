import api from '../axios';

export default {
  login: param => api.post('login接口', param),
  loginOut: param => api.post('loginout接口', param),
};
