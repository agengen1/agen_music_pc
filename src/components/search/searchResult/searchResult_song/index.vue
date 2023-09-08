<template>
  <div class="searchResultSong">
    <Loading
      v-if="searchResultSong_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <musicList
      v-else
      :music_list="songList"
      :music_total="total"
      :keyWord="key"
      :isSearchUse="true"
    ></musicList>
    <div class="paginatio">
      <el-pagination
        background
        layout="total,slot,prev, pager, next,jumper"
        :total="total"
        :default-page-size="pagCount"
        :current-page="pagNo"
        @current-change="handlerCurrentChange($event)"
        :disabled="searchResultSong_flag"
        hide-on-single-page
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { getSearchResultapi } from "@/api/searchApi";
import musicList from "@/components/music_list/index.vue";

export default defineComponent({
  name: "searchResultSong",
  props: {
    keyWord: {
      type: String,
      required: true,
    },
  },
  components: {
    musicList,
  },
  setup(props) {
    let searchResultSong_flag = ref(true); //加载状态
    let total = ref(0); //共有多少条数据
    let pagCount = ref(30); //每一页数据 默认30条
    let pagNo = ref(1); //第几页
    let key = ref(""); //搜索内容
    let songList = ref([]); //返回单曲数据
    watch(
      () => props.keyWord,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          key.value = newVal.trim();
          getSearchResult(newVal, 1, pagCount.value, pagNo.value, false);
        }
      },
      { immediate: true }
    );

    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      searchResultSong_flag.value = true;
      getSearchResult(props.keyWord, 1, pagCount.value, pagNo.value, true);
    }

    /**
     * 搜索结果获取
     * @param {string}   keyword ： 搜索关键字
     * @param {number}   type : 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
     * @param {number}   limit : 返回数量  默认为 0
     * @param {number }   offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , offset默认值为 0
     * @param { boolean }   flagScroll :标记是否为分页请求
     */
    async function getSearchResult(keyword, type, limit, offset, flagScroll) {
      const { data: res } = await getSearchResultapi(
        keyword,
        type,
        limit,
        offset
      );
      searchResultSong_flag.value = false;
      if (res && res.code === 200) {
        songList.value = res.result.songs;
        if (res.result.songCount) {
          total.value = res.result.songCount;
        }
        if (flagScroll) {
          window.scrollTo({
            top: 300,
            behavior: "smooth", // 平滑滚动效果
          });
        }
      }
    }

    return {
      searchResultSong_flag,
      pagCount,
      pagNo,
      total,
      handlerCurrentChange,
      songList,
      key,
    };
  },
});
</script>

<style lang='less' scoped>
.searchResultSong {
  padding: 20px;
  .paginatio {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>