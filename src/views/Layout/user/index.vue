<template>
  <div class="user margin_layout">
    <div v-if="user_isLogin">
      <userMusic :userId="userId"></userMusic>
    </div>
    <no-login v-else />
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import noLogin from "@/components/noLogin/index.vue";
import userMusic from "@/views/Layout/user/user_music/index.vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "user",
  components: {
    noLogin,
    userMusic,
  },
  setup() {
    let store = useStore();
    let user_isLogin = computed(() => {
      return store.state.user.user_isLogin;
    }); //用户登录状态
    let userId = parseInt(localStorage.getItem("userId")); //登录用户id
    return {
      user_isLogin,
      userId,
    };
  },
});
</script>

<style lang="less" scoped>
.user {
}
</style>