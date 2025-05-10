const func = {
  // 从url中解析参数
  getParams(url = window.location.href) {
    const paramObj = {};
    if (url.indexOf('?') !== -1) {
      const keyValueArr = url.split('?')[1].split('&');
      keyValueArr.forEach(item => {
        const keyValue = item.split('=');
        paramObj[keyValue[0]] = decodeURIComponent(keyValue[1]);
      });
    }
    return paramObj;
  },
  // 从url中获取指定属性的值
  getUrlParam(query) {
    var hash = location.hash;
    if (location.hash.indexOf('?') == -1) {
      return '';
    }
    var arr = [];
    var queryString = hash.split('?')[1];
    if (queryString.indexOf('&&') != -1) {
      arr = queryString.split('&&');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(query) != -1) {
          return arr[i].split('=')[1];
        }
      }
    } else if (queryString.indexOf('&') != -1) {
      arr = queryString.split('&');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(query) != -1) {
          return arr[i].split('=')[1];
        }
      }
    } else if (queryString.indexOf('=') != -1) {
      if (queryString.indexOf(query) != -1) {
        return queryString.split('=')[1];
      }
    } else {
      return '';
    }
  },
  // 从url中删除指定属性，并返回新的url
  delParam(paramKey) {
    var url = window.location.href; //页面url
    var urlParam = this.getParams(); //页面参数
    var beforeUrl = url.substr(0, url.indexOf('?')); //页面主地址（参数之前地址）
    var nextUrl = '';
    let newUrl = '';
    var arr = new Array();
    if (urlParam.toString() != '{}' && paramKey in urlParam) {
      for (let key in urlParam) {
        if (key !== paramKey) {
          if (!newUrl) {
            newUrl = beforeUrl + '?' + key + '=' + urlParam[key];
          } else if (newUrl.includes('?')) {
            newUrl = newUrl + '&' + key + '=' + urlParam[key];
          }
        }
      }
      return newUrl;
    }
    return url;
  },
  companyCode: () => location.hash.split('/')[1],
  siteCode: () => {
    return location.hash.split('/')[2];
  },
  allCode: () => {
    return func.companyCode() + '/' + func.siteCode();
  },
  getSiteCode() {
    return func.companyCode() + 'daying';
  },
};
export default func;
