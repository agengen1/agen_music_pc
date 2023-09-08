<template>
  <div class="searchResult">
    <goBack></goBack>
    <div class="header">
      <el-affix :offset="0">
        <div class="header_search">
          <search :affeSearchVal="keyWord" :useDom="'searchResult'"></search>
        </div>
      </el-affix>
    </div>
    <div class="result">
      <van-tabs>
        <van-tab title="单曲">
          <search-result-song :keyWord="keyWord"></search-result-song>
        </van-tab>
        <van-tab title="歌手">
          <search-result-singer :keyWord="keyWord"></search-result-singer>
        </van-tab>
        <van-tab title="歌单">
          <search-result-song-sheet
            :keyWord="keyWord"
          ></search-result-song-sheet>
        </van-tab>
        <van-tab title="专辑">
          <search-result-album :keyWord="keyWord"></search-result-album>
        </van-tab>
        <van-tab title="MV">
          <search-result-mv :keyWord="keyWord"></search-result-mv>
        </van-tab>
        <van-tab title="用户">
          <search-result-user :keyWord="keyWord"></search-result-user>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import search from "@/components/search/index.vue";
import searchResultSong from "@/components/search/searchResult/searchResult_song/index.vue";
import searchResultSinger from "@/components/search/searchResult/searchResult_singer/index.vue";
import searchResultSongSheet from "@/components/search/searchResult/searchResult_songSheet/index.vue";
import searchResultMv from "@/components/search/searchResult/searchResult_mv/index.vue";
import searchResultAlbum from "@/components/search/searchResult/searchResult_album/index.vue";
import searchResultUser from "@/components/search/searchResult/searchResult_user/index.vue";

export default defineComponent({
  name: "searchResult",
  components: {
    search,
    searchResultSong,
    searchResultSinger,
    searchResultSongSheet,
    searchResultMv,
    searchResultAlbum,
    searchResultUser,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let keyWord = ref("");
    let scrollHeight = 0; //滚动高度
    let header_search = null; //输入框el
    /**
     * 监听页面滚动方法
     */
    function onscrollDom() {
      if (parseInt(window.scrollY) >= scrollHeight) {
        header_search.style.marginTop = 0;
        header_search.style.width = "100%";
      } else {
        header_search.style.marginTop = "55px";
        header_search.style.width = "40%";
      }
    }
    onMounted(() => {
      let header = document.querySelector(".header");
      header_search = document.querySelector(".header_search");
      scrollHeight = header.offsetTop + 55;
      window.addEventListener("scroll", onscrollDom);
    });
    onUnmounted(() => {
      console.log("卸载了scroll事件");
      window.removeEventListener("scroll", onscrollDom);
    }),
      watch(
        () => route.params.searchText,
        (newVal) => {
          if (newVal) {
            keyWord.value = newVal;
          }
        },
        {
          immediate: true,
        }
      );
    return {
      keyWord,
    };
  },
});
</script>

<style lang='less' scoped>
/deep/ .results_content {
  top: 50px !important;
}
/deep/ .el-input__wrapper {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  height: 45px;
}
/deep/ .van-tabs__line {
  height: 5px;
}
/deep/ .van-tab--active {
  color: #1989fa;
}
.searchResult {
  .header {
    height: 160px;
    width: 100%;
    padding: 1px;
    border-radius: 10px;
    background-image: url("@/assets/img/searchResult_back.png");
    background-repeat: no-repeat;
    background-size: cover;
    .header_search {
      margin: 55px auto 0;
      width: 40%;
      height: 40px;
      transition: all 0.3s;
    }
  }
  .result {
    padding-top: 20px;
  }
}
</style>