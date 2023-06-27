<template>
  <div class="loading">
    <div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <p>{{ title }}</p>
  </div>
</template>
        
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "loading",
  props: {
    title: {
      default: "Loading...",
    },
    textColor: {
      default: "#000000",
    },
  },
});
</script>
        
<style lang="less" scoped>
.loading {
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    width: 120px;
    height: 120px;
    background-color: rgba(255, 255, 255, 0);
    position: relative;
    animation: spin_0 1.2s infinite;
    div {
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #409eff;
      &:nth-child(2n) {
        background-color: #ff006c;
      }
      &:nth-child(1) {
        top: 10px;
        right: 10px;
        animation: spin_1 1.2s infinite;
      }
      &:nth-child(2) {
        top: 10px;
        left: 10px;
        animation: spin_2 1.2s infinite;
      }
      &:nth-child(3) {
        bottom: 10px;
        left: 10px;
        animation: spin_3 1.2s infinite;
      }
      &:nth-child(4) {
        bottom: 10px;
        right: 10px;
        animation: spin_4 1.2s infinite;
      }
    }
  }
  p {
    font-size: 18px;
    font-family: "华文楷书";
    color: v-bind(textColor);
  }
}

@keyframes spin_0 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spin_1 {
  0% {
    transform: scale(2) rotate(0deg);
    top: 30px;
    right: 30px;
    border-radius: 30%;
  }
  50% {
    transform: scale(1) rotate(360deg);
    top: 45px;
    right: 45px;
    border-radius: 0%;
  }
  100% {
    transform: scale(2) rotate(0deg);
    top: 30px;
    right: 30px;
    border-radius: 30%;
  }
}
@keyframes spin_2 {
  0% {
    transform: scale(2);
    top: 30px;
    left: 30px;
    background-color: #ff006c;
  }
  50% {
    transform: scale(1);
    top: 45px;
    left: 45px;
    background-color: #23d623;
  }
  100% {
    transform: scale(2);
    top: 30px;
    left: 30px;
    background-color: #ff006c;
  }
}
@keyframes spin_3 {
  0% {
    transform: scale(2) rotate(0deg);
    bottom: 30px;
    left: 30px;
    border-radius: 30%;
  }
  50% {
    transform: scale(1) rotate(360deg);
    bottom: 45px;
    left: 45px;
    border-radius: 0%;
  }
  100% {
    transform: scale(2) rotate(0deg);
    bottom: 30px;
    left: 30px;
    border-radius: 30%;
  }
}
@keyframes spin_4 {
  0% {
    transform: scale(2);
    bottom: 30px;
    right: 30px;
    background-color: #23d623;
  }
  50% {
    transform: scale(1);
    bottom: 45px;
    right: 45px;
    background-color: #ff006c;
  }
  100% {
    transform: scale(2);
    bottom: 30px;
    right: 30px;
    background-color: #23d623;
  }
}
</style>