import axios from 'axios';
import qs from 'qs';
import config from '../build/config';
import { func } from '../utils';
import { ElMessage } from 'element-plus';
/**
 * 通用header
 */
export function getHeaders() {
  const token = localStorage.getItem('token') || '';
  return {
    Accept: 'application/json',
    Token: token,
  };
}

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

//创建axios实例
const httpClient = axios.create({
  baseURL: config[process.env.NODE_ENV]?.baseApi || '',
  cancelToken: source.token,
  timeout: 5 * 60 * 1000,
  withCredentials: true,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    ...getHeaders(),
  },
  data: {},
});

//请求
httpClient.interceptors.request.use(
  config => {
    // config.data = qs.stringify(config.data);
    return config;
  },
  error => {
    Promise.reject(error).then(r => r);
  },
);

//响应
httpClient.interceptors.response.use(
  async response => {
    if (response.status === 200) {
      const res = response.data || {};
      return Promise.resolve(res);
    }

    return Promise.reject(response.statusText);
  },
  error => {
    if (error?.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else {
      ElMessage.error('服务异常');
    }
  },
);

httpClient.abort = source.cancel;

export default httpClient;
