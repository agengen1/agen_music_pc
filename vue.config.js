const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  //防止代码泄露
  productionSourceMap: false,
  configureWebpack: (config) => {
    config.devtool = false;
  },

  publicPath: process.env.VUE_APP_BASE_URL,
});
