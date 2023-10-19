<template>
  <div class="allAlbum">
    <Loading
      v-if="mvList.length <= 0"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div v-else>
      <Loading v-if="flag" textColor="#409eff" title="加载中..."></Loading>
      <div v-else class="list">
        <div class="info" v-for="item in mvList" :key="item.id">
          <img
            v-lazy="item.imgurl16v9 + '?param=450y260'"
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
          >
            {{ item.name }}
          </p>
          <p class="mvSingerName">{{ item.artistName }}</p>
        </div>
      </div>
      <div class="page">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="mvTotal"
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
import { getSingerMvsapi } from "@/api/singerApi";
import {
  stamp_time,
  playCountTransform,
  computeMusicTimeDuration,
} from "@/assets/public";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "allAlbum",
  props: {
    singerId: {
      required: true,
    },
    mvTotal: {
      required: true,
    },
  },
  setup(props) {
    let router = useRouter();
    let mvList = ref([]); //专辑列表数据
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
      getSingerMvs(props.singerId, pageSize.value, No);
    }
    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
    }
    /**
     * 获取歌手专辑
     * @param {String | number}  id 歌手 id
     * @param { number } limit 取出数量 , 默认为 30
     * @param { number } offset  偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
     */
    async function getSingerMvs(id, limit, offset) {
      const { data: res } = await getSingerMvsapi(id, limit, offset);
      flag.value = false;
      if (res && res.code === 200) {
        mvList.value = res.mvs;
      }
    }
    getSingerMvs(props.singerId, pageSize.value, pageNo.value);
    return {
      mvList,
      pageNo,
      pageSize,
      flag,
      handlerCurrentChange,
      stamp_time,
      playCountTransform,
      computeMusicTimeDuration,
      clickMvSkipDetails,
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
    .info {
      position: relative;
      margin: 10px 1.6%;
      width: 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: baseline;

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
        left: 0;
        top: 0;
        background-color: #00000061;
        color: #ffffff;
        font-size: 14px;
        border-radius: 5px;
        border-top-left-radius: 10px;
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
  .page {
    margin: 10px 0 15px;
    display: flex;
    justify-content: center;
  }
}
</style>