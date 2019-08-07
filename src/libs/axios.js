import axios from 'axios'
import store from '@/store'
import { Spin } from 'iview'
import { Message  } from 'iview'
import Cookies from 'js-cookie'

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo;
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  };
  if (!responseURL.includes('save_error_logger'))
    store.dispatch('addErrorLog', info)
};

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    };
    return config
  }
  destroy (url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // 判断是否是登录请求，如果存在的话，则每个http header都加上token
      if (!config.url.includes('/login')) {
        //这个在请求头统一加token
        config.headers.Authorization = `${store.state.user.token}`
      }

      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true;
      return config
    }, error => {
      return Promise.reject(error)
    });
    // 响应拦截
    instance.interceptors.response.use(res => {
      //console.log(url.indexOf('/login') !== -1);  // /user/login -1
      if (url.indexOf('/login') !== -1) {//判断是否为登录请求
        if(res.data.data === ""){//判断请求返回的数据 返回空则表示登录失败，可自定义
          Cookies.remove(TOKEN_KEY);
          Message.error('用户名或密码输入错误！');//弹出消息提示
          return
        }
      }
      this.destroy(url);
      const { data, status } = res;
      return { data, status }
    }, error => {
      this.destroy(url);
      addErrorLog(error.response);
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options)
  }
}
export default HttpRequest
