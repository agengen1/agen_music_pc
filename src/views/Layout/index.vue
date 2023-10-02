<template>
  <div class="Layout_Header">
    <el-menu
      :default-active="slectRouter_layout"
      class="el-menu"
      mode="horizontal"
      router
      :class="{
        isBackColorTransparent: route.name === 'songDetails',
      }"
    >
      <div class="logo">
        <img src="@/assets/img/logo_png.png" />
      </div>
      <el-menu-item index="/layout/home">音乐馆</el-menu-item>
      <el-menu-item index="/layout/user">我的音乐</el-menu-item>
      <el-menu-item v-if="user_isLogin" index="/layout/follow"
        >关注</el-menu-item
      >
      <!-- 用户信息 -->
      <div class="other_fun">
        <div class="sea_header">
          <search :useDom="'all'"></search>
        </div>
        <p class="loginSuccess" v-if="user_isLogin">
          <el-dropdown>
            <div class="infoimg">
              <img
                v-lazy="user_userinfo.avatarUrl + '?param=100y100'"
                :title="user_userinfo.nickname"
              />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :icon="icon.Connection"
                  @click="clickUserNameSkip_doc(user_userinfo.userId)"
                  >我的主页</el-dropdown-item
                >
                <el-dropdown-item
                  :icon="icon.TrophyBase"
                  @click="clickUserLevelSkip_doc()"
                  >我的等级</el-dropdown-item
                >
                <el-dropdown-item
                  divided
                  :icon="icon.SwitchButton"
                  @click="clickLogout(user_userinfo.nickname)"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </p>
        <p class="login_user" v-else @click="clickOpenLogin">登录</p>
      </div>
      <!-- github头像模块 -->
      <div class="github_icon">
        <a href="https://github.com/agengen1/agen_music_pc" target="_blank">
          <i
            title="github -- agengen1/agen_music_pc"
            class="iconfont icon-github"
          ></i>
        </a>
      </div>
    </el-menu>
  </div>
  <router-view></router-view>
  <div class="Layout_Footer" v-if="disappear_footer">
    <div class="content">
      <div class="top_footer">
        <p>
          <a
            href="https://github.com/Binaryify/NeteaseCloudMusicApi"
            target="_blank"
          >
            <i class="iconfont icon-github"></i>
          </a>
          <span>后端技术支持</span>
        </p>
        <p>
          <a href="https://github.com/agengen1" target="_blank">
            <i class="iconfont icon-github"></i>
          </a>
          <span>开发者</span>
        </p>
        <p @click="clickCopyContent('2073923271')">
          <van-icon name="qq" class="van_i" />
          <span>开发者QQ</span>
        </p>
        <p @click="clickCopyContent('2073923271@qq.com')">
          <van-icon name="envelop-o" class="van_i" />
          <span>开发者邮箱</span>
        </p>
      </div>
      <div class="bottom_desc">
        <p>如有侵权，请联系 2073923271@qq.com 进行整改。谢谢！</p>
        <p>
          本网站只做学习参考，切勿进行商业活动，一经发现，请立即停止行为(并承担全部法律责任)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { SwitchButton, TrophyBase, Connection } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { logOutapi } from "@/api/loginApi";
import { PackageMessageBox } from "@/assets/public";
import { ElMessage } from "element-plus";
import search from "@/components/search/index.vue";

export default defineComponent({
  name: "Layout",
  components: {
    search,
  },
  setup() {
    let router = useRouter();
    let route = useRoute();
    let store = useStore();
    let user_isLogin = computed(() => {
      return store.state.user.user_isLogin;
    });
    let user_userinfo = computed(() => {
      return store.state.user.userinfo;
    });
    let slectRouter_layout = computed(() => {
      if (route.path.indexOf("/layout/home") === 0) {
        return "/layout/home";
      } else if (route.path.indexOf("/layout/user") === 0) {
        return "/layout/user";
      } else if (route.path.indexOf("/layout/follow") === 0) {
        return "/layout/follow";
      }
    });
    let disappear_footer = computed(() => {
      if (route.path.indexOf("/layout/user") === 0 && user_isLogin.value) {
        return false;
      } else {
        return true;
      }
    });
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 点击跳转用户等级详情页面
     */
    function clickUserLevelSkip_doc() {
      router.push("/layout/home/userLevel");
    }
    /**
     * 点击退出登录
     */
    function clickLogout(name) {
      PackageMessageBox(`确定退出登录?  (${name})`, "退出提示", {
        type: "warning",
        draggable: true,
      })
        .then(() => {
          // 确定退出
          logOut();
        })
        .catch(() => {
          //取消，什么都不用干
        });
    }
    /**
     * clickOpenLogin
     * 点击立即登录，弹出登录页面
     */
    function clickOpenLogin() {
      store.commit("user/SETLOGINOPENSTATE", true);
    }
    /**
     * 点击复制内容
     * @param {string} content 复制的内容
     */
    function clickCopyContent(content) {
      ElMessage.closeAll();
      navigator.clipboard
        .writeText(content)
        .then(() => {
          ElMessage({
            type: "success",
            message: `复制成功：${content}`,
          });
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: "复制出错!",
          });
        });
    }
    /**
     * 退出登录
     */
    async function logOut() {
      const { data: res } = await logOutapi();
      if (res.code === 200) {
        ElMessage({
          message: "退出成功！",
          type: "success",
        });
        store.commit("user/SETUSERISLOGIN", false);
        store.commit("user/SETUSERINFO", {});
        store.commit("user/SETUSERLIKEMUSICLISTID", []);
        router.replace("/");
      } else {
        ElMessage({
          message: "退出失败！",
          type: "error",
        });
      }
    }
    return {
      icon: {
        SwitchButton,
        TrophyBase,
        Connection,
      },
      router,
      route,
      slectRouter_layout,
      disappear_footer,
      user_userinfo,
      user_isLogin,
      clickOpenLogin,
      clickLogout,
      clickUserNameSkip_doc,
      clickUserLevelSkip_doc,
      clickCopyContent,
    };
  },
});
</script>

<style lang="less" scoped>
.el-menu--horizontal > .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff !important;
}
/deep/ .infoimg {
  &:focus-visible {
    outline: none;
  }
}
.Layout_Header {
  height: 70px;
  .el-menu {
    margin: 0 auto;
    width: 100%;
    padding: 0 6%;
    height: 70px;
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
      .sea_header {
        width: 75%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .login_user {
        margin-left: 20px;
        flex: 1;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .loginSuccess {
        flex: 1;
        margin-left: 20px;
        .infoimg {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 50%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
      }
    }
    .github_icon {
      width: 6%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        cursor: pointer;
        color: #333;
        font-size: 36px;
      }
    }
  }
  /deep/ .el-input--large .el-input__wrapper {
    border-radius: 5px;
  }
}
.Layout_Footer {
  margin-top: 30px;
  box-sizing: border-box;
  padding: 0 10%;
  width: 100%;
  height: 25vh;
  background-color: #333;
  .content {
    padding: 20px 0;
    .top_footer {
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        margin: 0 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        cursor: pointer;
        &:hover i {
          color: #409eff;
        }
        &:hover span {
          color: #409eff;
        }
        i {
          font-size: 34px;
        }
        .van_i {
          margin: 8.5px 0;
        }
      }
    }
    .bottom_desc {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      p {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>