<template>
  <div class="allAlbum">
    <Loading
      v-if="albumList.length <= 0"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div v-else>
      <Loading v-if="flag" textColor="#409eff" title="加载中..."></Loading>
      <div v-else class="list">
        <div
          class="albuminfo"
          v-for="item in albumList"
          :key="item.id"
          @click="clickSkipAlbumDetails(item.id)"
        >
          <img
            v-lazy="item.picUrl + '?param=300y300'"
            :alt="item.name"
            :title="item.name"
          />
          <p>{{ item.name }}</p>
          <p>{{ stamp_time(item.publishTime) }}</p>
        </div>
      </div>
      <div class="page">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="albumTotal"
          :default-page-size="pageSize"
          @current-change="handlerCurrentChange($event)"
          :disabled="flag"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getSingerAlbumapi } from "@/api/singerApi";
import { stamp_time } from "@/assets/public";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "allAlbum",
  props: {
    singerId: {
      required: true,
    },
    albumTotal: {
      required: true,
    },
  },
  setup(props) {
    let router = useRouter();
    let albumList = ref([]); //专辑列表数据
    let pageNo = ref(1); // 分页页数
    let pageSize = ref(20); //每一页多少条数据
    let flag = ref(true); //加载状态
    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动效果
      });
      flag.value = true;
      getSingerAlbum(props.singerId, pageSize.value, No);
    }
    /**
     * 点击跳转专辑详情页
     * @param {string | number} id 专辑id
     */
    function clickSkipAlbumDetails(id) {
      // TODO:
      router.push(`/layout/home/albumDetails/${id}`);
    }
    /**
     * 获取歌手专辑
     * @param {String | number}  id 歌手 id
     * @param { number } limit 取出数量 , 默认为 30
     * @param { number } offset  偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
     */
    async function getSingerAlbum(id, limit, offset) {
      const { data: res } = await getSingerAlbumapi(id, limit, offset);
      flag.value = false;
      if (res && res.code === 200) {
        albumList.value = res.hotAlbums;
      }
    }
    getSingerAlbum(props.singerId, pageSize.value, pageNo.value);
    return {
      albumList,
      pageNo,
      pageSize,
      flag,
      handlerCurrentChange,
      stamp_time,
      clickSkipAlbumDetails,
    };
  },
});
</script>

<style lang='less' scoped>
.allAlbum {
  margin-top: 30px;
  .list {
    display: flex;
    flex-wrap: wrap;
    .albuminfo {
      margin: 10px 1%;
      width: 23%;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 90%;
        object-fit: cover;
        border-radius: 10px;
        cursor: pointer;
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
  .page {
    margin: 10px 0 15px;
    display: flex;
    justify-content: center;
  }
}
</style>