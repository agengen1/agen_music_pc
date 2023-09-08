<template>
  <div class="songSheetDetail">
    <goBack></goBack>
    <div class="content">
      <div class="left">
        <h3>热门歌单</h3>
      </div>
      <div class="right">
        <musicDetails></musicDetails>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import musicDetails from "@/components/music_details/index.vue";

export default defineComponent({
  name: "songSheetDetail",
  components: {
    musicDetails,
  },
  setup() {
    return {};
  },
});
</script>

<style lang='less' scoped>
.songSheetDetail {
  .content {
    margin-top: 5px;
    width: 100%;
    display: flex;
    .left {
      width: 25%;
      h3 {
        padding-left: 5px;
        height: 35px;
        line-height: 35px;
        border-left: 4px solid #ff006d;
      }
    }
    .right {
      width: 75%;
    }
  }
}
</style>