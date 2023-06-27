import { createApp } from "vue"; //导入创建vue实例函数
import App from "./App.vue"; //导入根组件
import LOADING from "@/components/tool_components/loading.vue"; //导入全局组件loading
import router from "./router"; //导入路由配置
import store from "./store"; //导入vuex仓库
import ElementPlus from "element-plus"; //导入element-plus 组件库
import Vant from "vant"; //导入vant 组件库
import VueLazyload from "vue-lazyload"; //导入vue-lazyload 懒加载插件
const loadimage = require("./assets/lazy_logo_loading.png"); //导入加载图片
const errorimage = require("./assets/lazy_logo_error.png"); //导入失败图片
import "element-plus/dist/index.css"; //element-plus的css
import "vant/lib/index.css"; //Vant的css
import "@/assets/reset.css"; //清除默认css
import "@/assets/public.css"; //公共css
import "@/assets/iconfont/iconfont.css"; //字体图标样式
/* 创建vue实例，传入app根组件 -- 注册element-plus插件 -- 注册vant插件 -- 注册VueLazyload懒加载插件 -- 注册仓库插件 -- 注册路由配置插件 -- 挂载到html中的(#app)节点上 */
createApp(App)
  .use(ElementPlus)
  .use(Vant)
  .use(VueLazyload, {
    preLoad: 1,
    error: errorimage,
    loading: loadimage,
    attempt: 3,
  })
  .use(store)
  .use(router)
  .component("LOADING", LOADING)
  .mount("#app");
