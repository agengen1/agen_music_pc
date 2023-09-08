<template>
  <div class="login">
    <div class="login_start" v-if="login_status === 1">
      <div class="left">
        <img src="@/assets/img/ScanCode_login.png" />
        <p>
          请使用<a href="https://music.163.com/#/download" target="_blank"
            >网易云音乐APP</a
          >
          扫码登录
        </p>
      </div>
      <div class="right">
        <p>扫码登录</p>
        <div class="Maskcode">
          <img v-if="keyPic != null" :src="keyPic" />
          <div class="maskRefrPic" v-if="keyPicisExpire">
            <el-icon size="50px" color="#ff006d"><Refresh /></el-icon>
            <el-button type="primary" @click="clickCodeRefresh"
              >刷新二维码</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="login_have" v-else-if="login_status === 2">
      <div class="left">
        <img src="@/assets/img/ScanCode_success.png" />
        <p>扫描成功</p>
        <p>请在手机上确认登录</p>
      </div>
      <div class="right">
        <p>授权信息</p>
        <img
          v-if="empowerInfo && JSON.stringify(empowerInfo) != '{}'"
          v-lazy="empowerInfo.userPic"
        />
        <p class="emName">{{ empowerInfo.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted, ref } from "vue";
import {
  getLoginKeyapi,
  getLoginPicapi,
  getLoginisOkapi,
  getAccountDetailsapi,
} from "@/api/loginApi";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Refresh } from "@element-plus/icons-vue";
import { getUserLikeMusicListapi } from "@/api/userDetailsApi";

export default defineComponent({
  name: "login",
  components: {
    Refresh,
  },
  setup() {
    let store = useStore();
    let login_status = ref(1); //表示此时登录状态来展示那个页面， 1-初始   2-授权
    let loginKey = ref(null); //表示获取的key
    let keyPic = ref(null); //表示二维码
    let keyPicisExpire = ref(false); //表示二维码是否过期或不存在 （true-过期不存在）
    let pollingTimer = ref(null); // 存储轮询方法
    let empowerInfo = ref(null); //扫描二维码的用户信息

    onUnmounted(() => {
      empowerInfo.value = null;
      clearInterval(pollingTimer.value);
    });
    /**
     * 获取二维码key
     * @param {number | string}  time 时间戳
     */
    async function getLoginKey(time) {
      const { data: res } = await getLoginKeyapi(time);
      if (res && res.data.code === 200) {
        loginKey.value = res.data.unikey;
        getLoginPic(loginKey.value, Date.now());
      }
    }
    /**
     * 获取二维码
     * @param { string}  key 二维码标识
     * @param {number | string}  time 时间戳
     */
    async function getLoginPic(key, time) {
      const { data: res } = await getLoginPicapi(key, time);
      if (res && res.code === 200) {
        keyPic.value = res.data.qrimg;
        polling();
      }
    }
    /**
     * 检测登录状态
     * @param { string}  key 二维码标识
     * @param {number | string}  time 时间戳
     * 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
     */
    async function getLoginisOk(key, time) {
      const { data: res } = await getLoginisOkapi(key, time);
      if (res && res.code === 803) {
        //登录成功
        clearInterval(pollingTimer.value);
        store.commit("user/SETUSERISLOGIN", true);
        ElMessage.closeAll();
        ElMessage({
          message: "登录成功",
          type: "success",
        });
        getAccountDetails(Date.now());

        store.commit("user/SETLOGINOPENSTATE", false);
      } else if (res && res.code === 802) {
        //授权
        login_status.value = 2;
        if (empowerInfo.value === null) {
          let obj = {
            userPic: res.avatarUrl,
            name: res.nickname,
          };
          empowerInfo.value = obj;
        }
      } else if (res && res.code === 800) {
        //二维码过期或不存在
        login_status.value = 1;
        keyPicisExpire.value = true;
        empowerInfo.value = null;
        clearInterval(pollingTimer.value);
        ElMessage.closeAll();
        ElMessage({
          message: "二维码过期或不存在",
          type: "error",
        });
      }
    }
    /**
     * 获取账号信息
     * @param {number | string}  time 时间戳
     */
    async function getAccountDetails(time) {
      const { data: res } = await getAccountDetailsapi(time);
      if (res && res.code === 200) {
        if (res.profile != null) {
          store.commit("user/SETUSERINFO", res.profile);
          getUserLikeMusicList(res.profile.userId);
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
    /**
     * 刷新二维码
     */
    function clickCodeRefresh() {
      keyPicisExpire.value = false;
      getLoginKey(Date.now());
    }
    /**
     * 轮询登录检测状态
     */
    function polling() {
      clearInterval(pollingTimer.value);
      pollingTimer.value = setInterval(() => {
        getLoginisOk(loginKey.value, Date.now());
      }, 1000);
    }
    getLoginKey(Date.now());
    return {
      login_status,
      keyPic,
      empowerInfo,
      keyPicisExpire,
      clickCodeRefresh,
    };
  },
});
</script>

<style lang='less' scoped>
.login {
  padding: 0 0 50px 0;

  .login_start,
  .login_have {
    display: flex;
    > div {
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .left {
      margin-top: 40px;
      align-items: center;
      img {
        width: 80%;
      }
      p {
        margin-top: 20px;
        font: 500 16px "华文楷书";
        a {
          color: #409eff;
        }
      }
    }
    .right {
      align-items: center;
      p {
        margin-bottom: 20px;

        font: 700 20px "华文楷书";
      }
      img {
        width: 200px;
        height: 200px;
      }
    }
  }
  .login_have {
    .left {
      margin-top: 10px;
      img {
        width: 40%;
      }
      p {
        margin-top: 10px;
        &:nth-child(2) {
          margin-top: 20px;
          font-weight: 700;
          font-size: 24px;
        }
      }
    }
    .right {
      .emName {
        margin-bottom: 0;
        margin-top: 20px;
        font: 700 22px "华文楷书";
        color: #000;
      }
      img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }
  .Maskcode {
    position: relative;
    .maskRefrPic {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      button {
        margin-top: 10px;
      }
    }
  }
}
</style>