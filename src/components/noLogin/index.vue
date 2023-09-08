<template>
  <div class="noLogin">
    <div class="left_content">
      <div>
        <img src="@/assets/img/noLogin.png" />
      </div>
    </div>
    <div class="right_content">
      <p>登录牛牛音乐</p>
      <p>享受更多服务，查看更详细的内容和歌曲</p>
      <el-button type="primary" @click="clickOpenLogin">立即登录</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "noLogin",
  setup() {
    let store = useStore();

    /**
     * clickOpenLogin
     * 点击立即登录，弹出登录页面
     */
    function clickOpenLogin() {
      store.commit("user/SETLOGINOPENSTATE", true);
    }
    return {
      clickOpenLogin,
    };
  },
});
</script>

<style lang='less' scoped>
.noLogin {
  width: 100%;
  height: calc(100vh - 25vh - 80px);
  display: flex;
  .left_content {
    width: 50%;
    display: flex;
    justify-content: flex-end;

    div {
      width: 90%;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
  }
  .right_content {
    padding-left: 20px;
    padding-top: 15vh;
    width: 50%;
    display: flex;
    flex-direction: column;
    p {
      width: 100%;
      color: #000;
      margin: 15px 0;
      &:nth-child(1) {
        font: 700 40px "华文楷书";
      }
      &:nth-child(2) {
        font: 500 20px "华文楷书";
      }
    }
    button {
      margin-top: 40px;
      height: 60px;
      font-size: 20px;
      width: 300px;
    }
  }
}
</style>
