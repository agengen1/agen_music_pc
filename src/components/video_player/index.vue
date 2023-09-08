<template>
  <div class="videoPlayer">
    <!-- 播放器占位 -->
    <div id="video"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import Player from "xgplayer";
export default defineComponent({
  name: "videoPlayer",
  props: {
    mvSrc: {
      type: String,
      required: true,
    },
    coverPic: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    onMounted(() => {
      const player = new Player({
        id: "video",
        url: props.mvSrc,
        poster: props.coverPic,
        fluid: true,
        videoInit: true,
        playbackRate: false,
        cssFullscreen: false,
        closePauseVideoFocus: false,
        lang: "zh-cn",
        leavePlayerTime: 500,
        start: {
          isShowPause: true,
        },
      }); //播放器配置
    });
    return {};
  },
});
</script>

<style lang='less' scoped>
.videoPlayer {
  width: 100%;
  #video {
    border-radius: 5px;
  }
}
</style>