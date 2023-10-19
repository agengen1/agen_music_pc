<template>
  <div class="search">
    <el-input
      v-model="searchVal"
      size="large"
      clearable
      placeholder="音乐 / 歌手 / 歌单"
      :prefix-icon="Search"
      @focus="handlerFocused"
      @blur="handlerBlured"
      @input="handlerInputed"
      @keyup.enter="SkipSearchResult(searchVal)"
    />
    <div class="results_content">
      <p
        class="searchN text_exceed_hide_one"
        @mousedown="SkipSearchResult(searchVal)"
      >
        <el-icon size="16px"><Search /></el-icon>
        搜索"<span>{{ searchVal }}</span
        >"
      </p>
      <Loading
        title="搜索中...."
        textColor="#409eff"
        v-if="search_flag"
      ></Loading>
      <div class="content" v-else>
        <div
          class="info"
          v-for="(item, index) in searchSuggestions_data.order"
          :key="index"
        >
          <h4 v-if="item === 'songs' && searchSuggestions_data[item]">单曲</h4>
          <h4 v-if="item === 'artists' && searchSuggestions_data[item]">
            歌手
          </h4>
          <h4 v-if="item === 'albums' && searchSuggestions_data[item]">专辑</h4>
          <h4 v-if="item === 'playlists' && searchSuggestions_data[item]">
            歌单
          </h4>
          <p
            class="text_exceed_hide_one"
            v-for="item_child in searchSuggestions_data[item]"
            :key="item_child.id"
            @mousedown="clickTypeSkipDom(item, item_child.id)"
          >
            <!-- p这里为什么不使用click事件，因为blur执行在click之前，此处场景可以使用mousedown -->
            <span
              v-if="item_child.artists && item_child.artists.length > 0"
              v-html="
                SearchTextHighlight(
                  searchVal,
                  item_child.name + '-' + item_child.artists[0].name
                )
              "
            ></span>
            <span
              v-else-if="item_child.artist"
              v-html="
                SearchTextHighlight(
                  searchVal,
                  item_child.name + '-' + item_child.artist.name
                )
              "
            ></span>
            <span
              v-else
              v-html="SearchTextHighlight(searchVal, item_child.name)"
            ></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getSearchSuggestionsapi } from "@/api/searchApi";
import { SearchTextHighlight } from "@/assets/public";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "search",
  components: {
    Search,
  },
  props: {
    affeSearchVal: {
      type: String,
      default: "",
    },
    useDom: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    let route = useRoute();
    let router = useRouter();
    let searchVal = ref("");
    let search_flag = ref(true); //搜索状态 true-搜索中
    let searchSuggestions_data = ref({}); //搜索建议数据
    let results_content = null; //数据展示dom元素
    let timer = null;
    watch(
      () => props.affeSearchVal,
      (newVal) => {
        if (newVal != "") {
          searchVal.value = newVal;
          getSearchSuggestions(searchVal.value);
        }
      },
      {
        immediate: true,
      }
    );

    onMounted(() => {
      if (props.useDom !== "searchResult") {
        results_content = document.querySelector(
          ".sea_header .results_content"
        );
      } else {
        results_content = document.querySelector(
          ".searchResult .results_content"
        );
      }
    });
    /**
     * 输入框获取焦点
     */
    function handlerFocused() {
      if (searchVal.value != "") {
        results_content.style.transform = "scaleY(1)";
      }
    }
    /**
     * 输入框失去焦点
     */
    function handlerBlured() {
      results_content.style.transform = "scaleY(0)";
    }
    /**
     * 输入框发生变化触发
     */
    function handlerInputed() {
      if (searchVal.value != "") {
        search_flag.value = true;
        results_content.style.transform = "scaleY(1)";
        if (timer != null) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          //发送请求
          if (searchVal.value != "") {
            getSearchSuggestions(searchVal.value);
          }
        }, 1000);
      } else {
        results_content.style.transform = "scaleY(0)";
      }
    }
    /**
     * 点击跳转对应页面
     * @param {string} type 触发事件类型
     * @param {string | number} id 触发事件类型对应id
     */
    function clickTypeSkipDom(type, id) {
      if (type === "songs") {
        //跳转单曲详情
        router.push(`/layout/home/songDetails/${id}`);
      } else if (type === "artists") {
        //跳转歌手详情
        router.push(`/layout/home/singerDetails/${id}`);
      } else if (type === "albums") {
        //跳转专辑详情
        //专辑页面暂未开发
      } else if (type === "playlists") {
        //跳转歌单详情
        router.push(`/layout/home/songSheetDetail/${id}`);
      }
    }
    /**
     * 跳转搜索结果页面
     * @param {string} searchV 搜索内容
     */
    function SkipSearchResult(searchV) {
      if (searchV === "") {
        return;
      }
      if (route.name != "searchResult") {
        router.push(`/layout/home/searchResult/${searchV}`);
      } else {
        router.replace(`/layout/home/searchResult/${searchV}`);
      }
      results_content.style.transform = "scaleY(0)";
    }
    /**
     * 搜索建议获取
     * @param {string}   keyword ： 搜索关键字
     */
    async function getSearchSuggestions(key) {
      const { data: res } = await getSearchSuggestionsapi(key);
      search_flag.value = false;
      if (res && res.code === 200) {
        searchSuggestions_data.value = res.result;
      }
    }
    return {
      searchVal,
      Search,
      handlerFocused,
      handlerBlured,
      handlerInputed,
      search_flag,
      searchSuggestions_data,
      SearchTextHighlight,
      clickTypeSkipDom,
      SkipSearchResult,
    };
  },
});
</script>

<style lang='less' scoped>
.search {
  position: relative;
  width: 100%;
  .results_content {
    padding: 10px;
    position: absolute;
    z-index: 9999;
    width: 24vw;
    top: 45px;
    left: 2px;
    border-radius: 10px;
    background-color: #fff;
    transition: all 0.3s;
    transform-origin: center top;
    transform: scaleY(0);
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    .searchN {
      padding: 2px 5px;
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
      span {
        color: #409eff;
      }
      &:hover {
        background-color: #ecececbb;
      }
    }
    .content {
      .info {
        padding: 2px 5px;
        h4 {
          color: #333;
        }
        p {
          cursor: pointer;
          padding: 5px 0;
          padding-left: 15px;
          color: #8c8c8c;

          &:hover {
            background-color: #ecececbb;
          }
        }
      }
    }
  }
}
</style>