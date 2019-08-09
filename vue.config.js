const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir)
};


const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/sjlw'
  : '/';

module.exports = {

  baseUrl: BASE_URL,

  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088/', //后台服务器的ip地址
        pathRewrite: { '^/api': '/' },
        changeOrigin: true
      }
    }
  }
};
