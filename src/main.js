import { createApp } from "vue"; //导入创建vue实例函数
import App from "./App.vue"; //导入根组件
import LOADING from "@/components/tool_components/loading.vue"; //导入全局组件loading
import goBack from "@/components/tool_components/goBack.vue"; //导入全局组件goBack
import videoPlayer from "@/components/video_player/index.vue"; //导入全局组件video_player
import events from "@/components/events/index.vue"; //导入全局组件events
import bar from "@/components/bar/index.vue"; //导入全局组件bar
import router from "./router"; //导入路由配置
import store from "./store"; //导入vuex仓库
import ElementPlus from "element-plus"; //导入element-plus 组件库
import zhCn from "element-plus/dist/locale/zh-cn.mjs"; //导入汉字包
import Vant from "vant"; //导入vant 组件库
import VueLazyload from "vue-lazyload"; //导入vue-lazyload 懒加载插件
import loadimage from "@/assets/img/lazy_logo_loading.png"; //导入加载图片
import errorimage from "@/assets/img/lazy_logo_error.png"; //导入失败图片
import "element-plus/dist/index.css"; //element-plus的css
import "vant/lib/index.css"; //Vant的css
import "@/assets/css/reset.css"; //清除默认css
import "@/assets/css/public.css"; //公共css
import "@/assets/iconfont/iconfont.css"; //字体图标样式
import "xgplayer/dist/index.min.css"; //导入视频播放器css

/* 创建vue实例，传入app根组件 -- 注册element-plus插件 -- 注册vant插件 -- 注册VueLazyload懒加载插件 -- 注册仓库插件 -- 注册路由配置插件 -- 挂载到html中的(#app)节点上 */

createApp(App)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(Vant)
  .use(VueLazyload, {
    preLoad: 1,
    error: errorimage,
    loading: loadimage,
    attempt: 3,
  })
  .use(store)
  .use(router)
  .component("Loading", LOADING)
  .component("VIDEOPLAYER", videoPlayer)
  .component("goBack", goBack)
  .component("Mbar", bar)
  .component("events", events)
  .mount("#app");
