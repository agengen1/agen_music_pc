<template>
  <div class="Nofound margin_layout">
    <p><span>4</span><span>0</span><span>4</span></p>
    <p>很抱歉，你要查找的网页找不到</p>
    <p>
      点击跳转<span @click="clickSkipHome">音乐馆</span>
      <span
        >自动跳转(<span>{{ stime }}</span
        >)秒</span
      >
    </p>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "404",
  setup() {
    let router = useRouter();
    let stime = ref(5); //自动跳转时间
    onMounted(() => {
      let ds = null;
      ds = setInterval(() => {
        stime.value--;
        if (stime.value <= 0) {
          clearInterval(ds);
          clickSkipHome();
        }
      }, 1000);
    });
    /**
     * 点击跳转音乐馆
     */
    function clickSkipHome() {
      router.replace("/");
    }
    return {
      stime,
      clickSkipHome,
    };
  },
});
</script>

<style lang='less' scoped>
.Nofound {
  height: 70vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  p {
    &:nth-child(1) {
      font: 700 150px "arial";
      span {
        text-shadow: 10px 4px 10px rgba(0, 0, 0, 0.5);
        &:nth-child(1) {
          color: #409eff;
        }
        &:nth-child(2) {
          color: #23d624;
        }
        &:nth-child(3) {
          color: #ff006d;
        }
      }
    }
    &:nth-child(2) {
      margin-top: 20px;
      font: 700 22px "arial";
    }
    &:nth-child(3) {
      margin-top: 20px;
      font: 700 22px "arial";
      > span {
        &:nth-child(1) {
          margin-right: 15px;
          color: #409eff;
          cursor: pointer;
          text-decoration: underline;
          &:hover {
            color: #ff006d;
          }
        }
        &:nth-child(2) {
          span {
            color: #ff006d;
          }
        }
      }
    }
  }
}
</style>