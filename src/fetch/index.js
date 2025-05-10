import router from '@/router';
// import { showLoadingToast, closeToast, showDialog } from 'vant';
import { tools } from '../utils';
import httpClient from './http';
import { ElMessage, ElLoading } from 'element-plus';
let loading = null;
class httpService {
  constructor() { }

  showLoading() {
    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    });
    // this.Toast = showLoadingToast({
    //   message: '加载中，请稍后...',
    //   duration: 0,
    //   loadingType: 'spinner',
    //   forbidClick: true,
    // });
  }

  clearLoading() {
    loading && loading.close();
    loading = null;
  }

  get(path, data, config = {}) {
    if (!config.hideLoading) this.showLoading();

    return new Promise(resolve => {
      const response = httpClient.get(path, { params: { ...data } });
      response.then(result => {
        if (result.code == '200') {
          resolve(result || {});
        } else {
          ElMessage(result.message);
        }
      });
      response.catch(error => {
        ElMessage(error);
        resolve(error || {});
      });
      response.finally(() => {
        if (!config.hideLoading) this.clearLoading();
      });
    });
  }

  post(path, data, config = {}) {
    if (!config.hideLoading) this.showLoading();
    // path = this.appendData(path);

    return new Promise(resolve => {
      const response = httpClient.post(path, data, config);
      console.log();
      response.then(result => {
        console.log(result, 'result');
        if (result.code == '200') {
          resolve(result || {});
        } else {
          ElMessage(result.message);
        }
      });
      response.catch(error => {
        ElMessage(error);
        resolve(error || {});
      });
      response.finally(() => {
        if (!config.hideLoading) this.clearLoading();
      });
    });
  }

  put(path, data, config = {}) {
    if (!config.hideLoading) this.showLoading();
    // path = this.appendData(path);

    return new Promise(resolve => {
      const response = httpClient.put(path, data, config);
      response.then(result => {
        console.log(result, 'result');
        if (result.code == '200') {
          resolve(result || {});
        } else {
          ElMessage(result.message);
        }
      });
      response.catch(error => {
        ElMessage(error);
        resolve(error || {});
      });
      response.finally(() => {
        if (!config.hideLoading) this.clearLoading();
      });
    });
  }
  del(path, data, config = {}) {
    if (!config.hideLoading) this.showLoading();
    // path = this.appendData(path);

    return new Promise(resolve => {
      const response = httpClient.delete(path, data, config);
      response.then(result => {
        console.log(result, 'result');
        if (result.code == '200') {
          resolve(result || {});
        } else {
          ElMessage(result.message);
        }
      });
      response.catch(error => {
        ElMessage(error);
        resolve(error || {});
      });
      response.finally(() => {
        if (!config.hideLoading) this.clearLoading();
      });
    });
  }
}

export default new httpService();
