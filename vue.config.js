const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/": {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
