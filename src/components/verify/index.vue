<template>
  <div class="verify">
    <div class="qrImg">
      <vue-qr :text="verifyUrl"></vue-qr>
    </div>
    <p>
      请使用<a href="https://music.163.com/#/download" target="_blank"
        >网易云音乐APP</a
      >
      扫码验证
    </p>
  </div>
</template>

<script>
import { computed, defineComponent, onUnmounted, ref } from "vue";
import vueQr from "vue-qr/src/packages/vue-qr.vue";
import { useStore } from "vuex";
import { eventLoopVerifyapi } from "@/api/userDetailsApi";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "verify",
  components: {
    vueQr,
  },
  setup() {
    let verifyTimer = ref(null); //定时器
    let store = useStore();
    let verifyCode = computed(() => {
      return store.state.verify.verifyCode;
    });
    let verifyUrl = computed(() => {
      return store.state.verify.verifyUrl;
    });
    onUnmounted(() => {
      clearInterval(verifyTimer.value);
    });
    /**
     * 轮询验证接口
     */
    function polling() {
      clearInterval(verifyTimer.value);
      if (verifyCode.value.trim().length > 0) {
        verifyTimer.value = setInterval(() => {
          eventLoopVerify(verifyCode.value);
        }, 1000);
      }
    }
    /**
     * 验证接口-二维码检测
     * @param {string}  qr: /verify/getQr接口返回的qr字符串
     * @param 返回结果说明：
     * qrCodeStatus:0,detailReason:0 二维码生成成功
     * qrCodeStatus:0,detailReason:303 账号不一致
     * qrCodeStatus:10,detailReason:0 二维码已扫描,并且手机号相同
     * qrCodeStatus:20,detailReason:0 验证成功
     * qrCodeStatus:21,detailReason:0 二维码已失效
     */
    async function eventLoopVerify(qr) {
      const { data: res } = await eventLoopVerifyapi(qr);
      ElMessage.closeAll();
      if (res && res.code === 200) {
        if (res.data.qrCodeStatus === 10 && res.data.detailReason === 0) {
          //二维码已经扫描-账号一致
          ElMessage({
            type: "success",
            message: "扫描成功且账号一致！",
          });
        } else if (
          res.data.qrCodeStatus === 21 &&
          res.data.detailReason === 0
        ) {
          //二维码已过期
          ElMessage({
            type: "warning",
            message: "二维码已过期！",
          });
        } else if (
          res.data.qrCodeStatus === 0 &&
          res.data.detailReason === 303
        ) {
          //账号不一致
          ElMessage({
            type: "error",
            message: "扫码账号与验证账号不一致！",
          });
        } else if (
          res.data.qrCodeStatus === 20 &&
          res.data.detailReason === 0
        ) {
          //扫码成功——验证成功
          ElMessage({
            type: "success",
            message: "扫码并验证成功！",
          });
          store.commit("verify/SETVERIFYOPENSTATUS", false);
        }
      }
    }
    polling();
    return {
      verifyUrl,
    };
  },
});
</script>

<style lang='less' scoped>
.verify {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  .qrImg {
    width: 60%;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    img {
      width: 100%;
      transform: scale(0.9);
    }
  }
  > p {
    margin-top: 20px;
    font: 500 16px "华文楷书";
    a {
      color: #409eff;
    }
  }
}
</style>