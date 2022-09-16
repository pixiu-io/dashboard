const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      "/": {
        target: process.env.VUE_BASE_URL,
        changeOrigin: true,
        ws: false,
      },
    },
  },
});
