<template>
  <div class="goback">
    <p @click="clickGoback">
      <el-icon :size="22"><Back /></el-icon>
      返回
    </p>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Back } from "@element-plus/icons-vue";
export default defineComponent({
  name: "goback",
  components: {
    Back,
  },
  setup() {
    let router = useRouter();
    /**
     * 返回上一级
     */
    function clickGoback() {
      router.go(-1);
    }
    return {
      clickGoback,
    };
  },
});
</script>

<style lang='less' scoped>
.goback {
  height: 40px;
  p {
    width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #409eff;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>