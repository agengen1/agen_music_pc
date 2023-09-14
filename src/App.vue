<template>
  <router-view></router-view>
  <!-- <el-backtop :right="100" :bottom="100" />  element-puls组件返回顶部-->
  <van-back-top :offset="300" bottom="20vh" right="3%" />
  <!-- 播放器组件 -->
  <!-- <PLAYCONTROL
    v-if="playMusic_list.length > 0"
    v-show="player_control_flag"
  ></PLAYCONTROL> -->
  <!-- 登录页面 -->
  <el-dialog v-model="login_openState" destroy-on-close title="登录">
    <LOGIN></LOGIN>
  </el-dialog>
  <!-- 验证页面 -->
  <el-dialog
    v-model="verifyOpenStatus"
    width="30%"
    destroy-on-close
    title="验证"
  >
    <VERIFY></VERIFY>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, watch, ref } from "vue";
import PLAYCONTROL from "@/components/playControl/index.vue";
import LOGIN from "@/components/login/index.vue";
import VERIFY from "@/components/verify/index.vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { getLoginStatusapi } from "@/api/loginApi";
import { getUserLikeMusicListapi } from "@/api/userDetailsApi";

export default defineComponent({
  name: "App",
  components: {
    PLAYCONTROL,
    LOGIN,
    VERIFY,
  },
  setup() {
    let store = useStore();
    let route = useRoute();
    let login_openState = computed({
      get() {
        return store.state.user.login_openState;
      },
      set(newVal) {
        store.commit("user/SETLOGINOPENSTATE", newVal);
      },
    }); //登录页面打开状态
    let verifyOpenStatus = computed({
      get() {
        return store.state.verify.verifyOpenStatus;
      },
      set(newVal) {
        store.commit("verify/SETVERIFYOPENSTATUS", newVal);
      },
    }); //验证页面打开状态
    let userId = parseInt(localStorage.getItem("userId"));
    let playMusic_list = computed(() => {
      return store.state.player.playMusic_list;
    });
    let player_control_flag = ref(true); //播放器的控制 true表示显示
    watch(
      //监听当前是否在{mv/视频}播放页面（在：隐藏播放控制栏）
      () => route.name,
      (newVal) => {
        if (newVal && newVal == "mvDetails") {
          player_control_flag.value = false;
        } else {
          player_control_flag.value = true;
        }
      },
      {
        immediate: true,
      }
    );
    /**
     * 获取用户登录状态
     * @param {number | string}  time 时间戳
     */
    async function getLoginStatus(time) {
      const { data: res } = await getLoginStatusapi(time);
      if (res && res.data.code === 200) {
        if (res.data.profile != null) {
          store.commit("user/SETUSERISLOGIN", true);
          store.commit("user/SETUSERINFO", res.data.profile);
        } else {
          store.commit("user/SETUSERISLOGIN", false);
        }
      }
    }
    /**
     * 获取用户喜欢音乐列表
     * @param { String | Number} id 用户id
     */
    async function getUserLikeMusicList(id) {
      if (!id) {
        return;
      }
      const { data: res } = await getUserLikeMusicListapi(id);
      if (res && res.code === 200) {
        store.commit("user/SETUSERLIKEMUSICLISTID", res.ids);
      }
    }
    getLoginStatus(Date.now());
    getUserLikeMusicList(userId);
    return {
      login_openState,
      player_control_flag,
      verifyOpenStatus,
      playMusic_list,
    };
  },
});
</script>

<style lang="less" scoped>
</style>