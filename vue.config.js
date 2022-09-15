const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/": {
        target: "http://8.140.165.201:8090",
        changeOrigin: true,
        ws: false,
      }
    }
  }
})
