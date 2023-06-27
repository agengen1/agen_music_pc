<template>
  <router-view></router-view>
  <!-- <el-backtop :right="100" :bottom="100" />  element-puls组件返回顶部-->
  <van-back-top :offset="300" bottom="20vh" right="5%" />
  <!-- 播放器组件 -->
  <!-- <PLAYCONTROL></PLAYCONTROL> -->
</template>

<script>
import { defineComponent } from "vue";
import PLAYCONTROL from "@/components/playControl/index.vue";
export default defineComponent({
  name: "App",
  components: {
    PLAYCONTROL,
  },
});
</script>

<style lang="less" scoped>
</style>