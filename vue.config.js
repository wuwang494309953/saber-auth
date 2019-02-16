// vue.config.js
module.exports = {
    devServer: {
      proxy: {
        '/v1': {
          target: 'http://127.0.0.1:8602', //对应自己的接口
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/v1': ''
          }
        }
      }
    }
  }
