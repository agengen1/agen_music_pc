<template>
  <div class="home margin_layout">
    <el-menu
      class="el-menu"
      mode="horizontal"
      :default-active="selectRouter_home"
      active-text-color="#ff006c"
      router
      :class="{
        isBackColorTransparent: route.name === 'songDetails',
      }"
    >
      <el-menu-item index="/layout/home/recommend">推荐</el-menu-item>
      <el-menu-item index="/layout/home/charts">排行榜</el-menu-item>
      <el-menu-item index="/layout/home/songSheets">歌单</el-menu-item>
      <el-menu-item index="/layout/home/singers">歌手</el-menu-item>
      <el-menu-item index="/layout/home/mvs">MV</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>
  
<script>
import { defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "home",
  setup() {
    let router = useRouter();
    let route = useRoute();
    let selectRouter_home = computed(() => {
      if (route.path.indexOf("/layout/home/recommend") === 0) {
        return "/layout/home/recommend";
      } else if (route.path.indexOf("/layout/home/charts") === 0) {
        return "/layout/home/charts";
      } else if (route.path.indexOf("/layout/home/songSheets") === 0) {
        return "/layout/home/songSheets";
      } else if (route.path.indexOf("/layout/home/singers") === 0) {
        return "/layout/home/singers";
      } else if (route.path.indexOf("/layout/home/mvs") === 0) {
        return "/layout/home/mvs";
      }
    });
    return {
      router,
      route,
      selectRouter_home,
    };
  },
});
</script>
  
<style lang="less" scoped>
</style>