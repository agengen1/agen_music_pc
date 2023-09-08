<template>
  <div class="searchResultMv">
    <Loading
      v-if="searchResultMv_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="content" v-else>
      <div class="info" v-for="item in mvList" :key="item.id">
        <img
          v-lazy="item.cover + '?param=450y260'"
          :alt="item.name"
          :title="item.name"
          @click.stop="clickMvSkipDetails(item.id)"
        />
        <div class="mask" @click.stop="clickMvSkipDetails(item.id)">
          <van-icon name="play" />
        </div>
        <div class="playCount">
          <van-icon name="play" />{{ playCountTransform(item.playCount) }}
        </div>
        <div class="mvTime">
          {{ computeMusicTimeDuration(item.duration) }}
        </div>
        <p
          class="text_exceed_hide_one mvName"
          @click.stop="clickMvSkipDetails(item.id)"
          v-html="SearchTextHighlight(key, item.name)"
        ></p>
        <p
          class="mvSingerName"
          v-html="SearchTextHighlight(key, item.artistName)"
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
        :disabled="searchResultMv_flag"
        hide-on-single-page
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { getSearchResultapi } from "@/api/searchApi";
import {
  SearchTextHighlight,
  playCountTransform,
  computeMusicTimeDuration,
} from "@/assets/public";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "searchResultMv",
  props: {
    keyWord: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    let router = useRouter();
    let searchResultMv_flag = ref(true); //加载状态
    let total = ref(0); //共有多少条数据
    let pagCount = ref(30); //每一页数据 默认30条
    let pagNo = ref(1); //第几页
    let key = ref(""); //搜索内容
    let mvList = ref([]); //mv数据
    watch(
      () => props.keyWord,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          key.value = newVal;
          getSearchResult(
            props.keyWord,
            1004,
            pagCount.value,
            pagNo.value,
            false
          );
        }
      },
      { immediate: true }
    );

    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      searchResultMv_flag.value = true;
      getSearchResult(props.keyWord, 1004, pagCount.value, pagNo.value, true);
    }
    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
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
      searchResultMv_flag.value = false;
      if (res && res.code === 200) {
        mvList.value = res.result.mvs;
        if (res.result.mvCount) {
          total.value = res.result.mvCount;
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
      searchResultMv_flag,
      key,
      pagCount,
      pagNo,
      total,
      handlerCurrentChange,
      SearchTextHighlight,
      playCountTransform,
      computeMusicTimeDuration,
      mvList,
      clickMvSkipDetails,
    };
  },
});
</script>

<style lang='less' scoped>
.searchResultMv {
  padding: 20px;
  .content {
    display: flex;
    min-height: 40vh;
    flex-wrap: wrap;
    .info {
      position: relative;
      margin: 10px 1.5%;
      width: 22%;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 100%;
        object-fit: cover;
        border-radius: 10px;
        cursor: pointer;
        border: 0.5px solid #ccc;
        &:hover ~ .mask {
          opacity: 1;
        }
      }
      p {
        margin: 5px 0 0 0;
        width: 100%;
      }
      .mvName {
        font: 500 14px "华文楷书";
        cursor: pointer;
        &:hover {
          color: #409eff;
          text-decoration: underline;
        }
      }
      .mvSingerName {
        padding-left: 10px;
        font-size: 12px;
        color: #969696;
      }
      .mask {
        position: absolute;
        transform: translateY(-60px);
        transition: all 0.3s;
        top: 55%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #ffffff92;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        cursor: pointer;
        i {
          font-size: 24px;
          color: #ff006d;
        }
        &:hover {
          opacity: 1;
        }
      }
      .mvTime {
        padding: 2px 5px;
        position: absolute;
        right: 0;
        top: 64.1%;
        background-color: #00000061;
        color: #ffffff;
        font-size: 14px;
        border-radius: 5px;
        border-bottom-right-radius: 10px;
      }
      .playCount {
        padding: 2px 5px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: #00000061;
        color: #ffffff;
        font-size: 14px;
        border-radius: 5px;
        border-top-right-radius: 10px;
        i {
          margin: 0 2px;
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