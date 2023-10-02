<template>
  <div class="bar">
    <span class="count" v-if="playCount > 0">{{ playCount }}次</span>
    <div class="bar_line"></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "bar",
  props: {
    el_height: {
      type: Number,
      required: true,
    },
    barWidth: {
      type: Number,
      required: true,
    },
    playCount: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return {
      barWidth: props.barWidth + "%",
      playCount: props.playCount,
      el_height: props.el_height + "px",
    };
  },
});
</script>

<style lang='less' scoped>
.bar {
  position: relative;
  height: v-bind(el_height);
  line-height: v-bind(el_height);
  width: 100%;
  .bar_line {
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(barWidth);
    height: v-bind(el_height);
    background-color: #40a0ff2c;
  }
  .count {
    margin-left: 10px;
    color: #858585;
    font: 700 12px "黑体";
  }
}
</style>