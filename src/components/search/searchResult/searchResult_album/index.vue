<template>
  <div class="searchResultAlbum">
    <Loading
      v-if="searchResultAlbum_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="content" v-else>
      <el-empty
        v-if="albumList.length <= 0 && !searchResultAlbum_flag"
        description="暂无搜索专辑"
      />
      <div class="info" v-for="item in albumList" :key="item.id">
        <img
          v-lazy="item.picUrl + '?param=300y300'"
          :alt="item.name"
          :title="item.name"
          @click="clickAlbumNameSkip(item.id)"
        />
        <p
          v-html="SearchTextHighlight(key, item.name)"
          @click="clickAlbumNameSkip(item.id)"
        ></p>
      </div>
    </div>
    <div class="paginatio">
      <el-pagination
        background
        layout="total,slot,prev, pager, next,jumper"
        :total="total"
        :default-page-size="pagCount"
        :current-page="pagNo"
        @current-change="handlerCurrentChange($event)"
        :disabled="searchResultAlbum_flag"
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
  name: "searchResultAlbum",
  props: {
    keyWord: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    let router = useRouter();
    let searchResultAlbum_flag = ref(true); //加载状态
    let albumList = ref([]); //专辑列表
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
          getSearchResult(
            props.keyWord,
            10,
            pagCount.value,
            pagNo.value,
            false
          );
        }
      },
      { immediate: true }
    );
    /**
     * 点击跳转专辑详情页
     * @param {string|number} id 专辑id
     */
    function clickAlbumNameSkip(id) {
      router.push(`/layout/home/albumDetails/${id}`);
    }
    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      searchResultAlbum_flag.value = true;
      getSearchResult(props.keyWord, 10, pagCount.value, pagNo.value, true);
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
      searchResultAlbum_flag.value = false;
      if (res && res.code === 200 && res.result && res.result.albums) {
        albumList.value = res.result.albums;
        if (res.result.albumCount) {
          total.value = res.result.albumCount;
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
      searchResultAlbum_flag,
      key,
      pagCount,
      pagNo,
      total,
      handlerCurrentChange,
      SearchTextHighlight,
      albumList,
      clickAlbumNameSkip,
    };
  },
});
</script>

<style lang='less' scoped>
.searchResultAlbum {
  padding: 20px;
  .content {
    min-height: 40vh;
    display: flex;
    flex-wrap: wrap;
    .info {
      margin: 10px 1%;
      width: 14.6%;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 90%;
        object-fit: cover;
        border-radius: 10px;
        cursor: pointer;
        border: 0.5px solid #ccc;
      }
      p {
        margin: 5px 0 0 0;
        width: 90%;
        font: 500 14px "华文楷书";
        &:nth-child(2) {
          cursor: pointer;
          &:hover {
            color: #409eff;
            text-decoration: underline;
          }
        }
      }
    }
  }
  .paginatio {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>