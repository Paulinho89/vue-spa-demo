import axios from 'axios';
import config from '~config';
import qs from 'qs';

const api = axios.create({
  baseURL: config.api,
  timeout: 3000, // 超时时间
  responseType: 'json', // default
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  // 通过Qs.stringify转换为表单查询参数
  transformRequest: [(data) => {
    data = qs.stringify(data);
    return data;
  }],
  // `validateStatus` defines whether to resolve or reject the promise for a given
  // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
  // or `undefined`), the promise will be resolved; otherwise, the promise will be
  // rejected.
  validateStatus: status => status === 200,
});

// 请求拦截
api.interceptors.request.use(
  apiconfig => apiconfig,
  e => Promise.reject(e),
);

// 响应拦截
api.interceptors.response.use((res = {}) => {
  try {
    return Promise.resolve(res.data && res.data.data);
  } catch (e) {
    return Promise.reject(e);
  }
}, (e) => {
  if (e.response.status >= 400) {
    // 错误提示
    console.log(e.response.data && e.response.data.messsage);
  }
  return Promise.reject(e);
});
export default api;
