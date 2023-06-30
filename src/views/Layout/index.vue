<template>
  <div class="Layout_Header">
    <el-menu
      :default-active="slectRouter_layout"
      class="el-menu"
      mode="horizontal"
      router
    >
      <div class="logo">
        <img src="@/assets/logo_png.png" />
      </div>
      <el-menu-item index="/layout/home">音乐馆</el-menu-item>
      <el-menu-item index="/layout/user">我的</el-menu-item>
      <el-menu-item index="/user/interest">关注</el-menu-item>
      <div class="other_fun">
        <p class="search">
          <el-input
            v-model="searchVal"
            class="w-50 m-2"
            size="large"
            clearable
            placeholder="音乐 / 歌手 / 歌单"
            :prefix-icon="icon.Search"
          />
        </p>
        <p class="login_user">登录</p>
      </div>
    </el-menu>
  </div>
  <router-view></router-view>
  <div class="Layout_Footer"></div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
export default defineComponent({
  name: "Layout",
  setup() {
    let searchVal = ref("");
    let router = useRouter();
    let route = useRoute();
    let slectRouter_layout = computed(() => {
      if (route.path.indexOf("/layout/home") === 0) {
        return "/layout/home";
      } else if (route.path.indexOf("/layout/user") === 0) {
        return "/layout/user";
      } else if (route.path.indexOf("/user/interest") === 0) {
        return "/user/interest";
      }
    });
    return {
      icon: {
        Search,
      },
      searchVal,
      router,
      route,
      slectRouter_layout,
    };
  },
});
</script>

<style lang="less" scoped>
.el-menu--horizontal > .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff !important;
}
.Layout_Header {
  .el-menu {
    margin: 0 auto;
    width: 100%;
    padding: 0 6%;
    height: 80px;
    .el-menu-item {
      font-size: 18px;
      font-weight: 700;
    }
    .logo {
      width: 18%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .other_fun {
      display: flex;
      margin-left: 20%;
      width: 30%;
      height: 100%;
      p {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .search {
        width: 75%;
        height: 100%;
      }
      .login_user {
        flex: 1;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  /deep/ .el-input--large .el-input__wrapper {
    border-radius: 20px;
  }
}
.Layout_Footer {
  width: 100%;
  height: 25vh;
  background-color: #333;
}
</style>