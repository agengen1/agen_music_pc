<template>
  <div class="searchResultUser">
    <Loading
      v-if="searchResultUser_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="content" v-else></div>
    <div class="paginatio">
      <el-pagination
        background
        layout="total,slot,prev, pager, next,jumper"
        :total="total"
        :default-page-size="pagCount"
        :current-page="pagNo"
        @current-change="handlerCurrentChange($event)"
        :disabled="searchResultUser_flag"
        hide-on-single-page
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { getSearchResultapi } from "@/api/searchApi";
import { SearchTextHighlight } from "@/assets/public";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "searchResultUser",
  props: {
    keyWord: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    let router = useRouter();
    let searchResultUser_flag = ref(true); //加载状态
    let total = ref(0); //共有多少条数据
    let pagCount = ref(30); //每一页数据 默认30条
    let pagNo = ref(1); //第几页
    let key = ref(""); //搜索内容

    watch(
      () => props.keyWord,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          key.value = newVal;
          // getSearchResult(
          //   props.keyWord,
          //   1002,
          //   pagCount.value,
          //   pagNo.value,
          //   true
          // );
        }
      },
      { immediate: true }
    );

    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      searchResultUser_flag.value = true;
      getSearchResult(props.keyWord, 1002, pagCount.value, pagNo.value, true);
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
    }

    return {
      searchResultUser_flag,
      key,
      pagCount,
      pagNo,
      total,
      handlerCurrentChange,
      SearchTextHighlight,
    };
  },
});
</script>

<style lang='less' scoped>
.searchResultUser {
  padding: 20px;
  .content {
    min-height: 40vh;
  }
  .paginatio {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>