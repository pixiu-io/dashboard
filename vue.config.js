const { defineConfig } = require("@vue/cli-service");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";
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
  configureWebpack: (config) => {
    // 开启gzip压缩js，确保ng上的gizp是开的
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
      // 开启分片式打包js
      config.optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                if (module.context.indexOf("node_modules") !== -1) {
                  return module.context
                    .toString()
                    .split("node_modules/")[1]
                    .split("/")[0]
                    .toString();
                }
              },
            },
          },
        },
      };
      // 取消打包时的一些超出最大限制提醒
      config.performance = {
        hints: "warning",
        //入口起点的最大体积
        maxEntrypointSize: 50000000,
        //生成文件的最大体积
        maxAssetSize: 30000000,
        //只给出 js 文件的性能提示
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith(".js");
        },
      };
    }
  },
  productionSourceMap: !isProduction,
});
