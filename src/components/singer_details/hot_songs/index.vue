<template>
  <Loading
    v-if="songList.length <= 0"
    textColor="#409eff"
    title="加载中..."
  ></Loading>
  <!-- 音乐列表展示 -->
  <musicList
    v-else
    :music_list="songList"
    :music_total="songList.length"
  ></musicList>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { getSingerSongListapi } from "@/api/singerApi";
import musicList from "@/components/music_list/index.vue";
export default defineComponent({
  name: "hotSongs",
  props: {
    singerId: {
      required: true,
    },
  },
  components: {
    musicList,
  },
  setup(props) {
    let songList = ref([]); //歌曲数据
    watch(
      () => props.singerId,
      (newVal) => {
        songList.value = [];
        getSingerSongList(newVal);
      },
      {
        immediate: true,
      }
    );
    /**
     * 歌手单曲获取
     * @param {String | number} id 歌手id
     */
    async function getSingerSongList(id) {
      const { data: res } = await getSingerSongListapi(id);
      if (res && res.code === 200) {
        songList.value = res.hotSongs;
      }
    }
    return {
      songList,
    };
  },
});
</script>

<style lang='less' scoped>
</style>