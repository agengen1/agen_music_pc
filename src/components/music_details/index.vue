<template>
  <Loading title="加载中...." textColor="#409eff" v-if="data_loading" />
  <div class="music_details_one" v-else>
    <div class="box_position">
      <div class="left">
        <img v-lazy="SongSheet_details.coverImgUrl + '?param=250y250'" />
      </div>
      <div class="right">
        <div class="SongSheet_info">
          <p>{{ SongSheet_details.name }}</p>
          <p>
            <span>{{ stamp_time(SongSheet_details.updateTime) }}</span>
            <span>(更新)</span>
          </p>
        </div>
        <div class="createPerson" v-if="SongSheet_details.creator">
          <img
            v-lazy="SongSheet_details.creator.avatarUrl + '?param=50y50'"
            :alt="SongSheet_details.creator.nickname"
          />
          <span
            class="person"
            @click="clickUserNameSkip_doc(SongSheet_details.creator.userId)"
            >{{ SongSheet_details.creator.nickname }}</span
          >
          <span>{{ stamp_time(SongSheet_details.createTime) }} 创建</span>
        </div>
        <div
          class="SongSheet_desc"
          v-if="SongSheet_details.description !== null"
        >
          <span>介绍：</span>{{ SongSheet_details.description }}
        </div>
        <div class="SongSheet_other">
          <el-button type="primary" size="large" :icon="icon.VideoPlay"
            >播放全部</el-button
          >
          <el-button type="info" size="large" plain :icon="icon.Share"
            >分享({{ SongSheet_details.shareCount }})</el-button
          >
          <el-button type="info" size="large" plain :icon="icon.Comment"
            >评论({{ SongSheet_details.commentCount }})</el-button
          >
        </div>
      </div>
    </div>
    <!-- 音乐列表展示 -->
    <musicList
      :music_list="SongSheet_details.SongSheet_allMusic"
      :music_total="SongSheet_details.trackCount"
      :play_total="SongSheet_details.playCount"
    ></musicList>
  </div>
</template>
      
<script>
import { defineComponent, markRaw, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import musicList from "@/components/music_list/index.vue";
import {
  getSongSheet_desc_api,
  getSongSheet_Music_All_api,
} from "@/api/songSheetDeaitlsApi";
import { Share, Comment, VideoPlay } from "@element-plus/icons-vue";
import { stamp_time } from "@/assets/public";
export default defineComponent({
  name: "musicDetails",
  components: {
    musicList,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let SongSheet_details = ref({});
    let data_loading = ref(true);
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * getSongSheet_desc
     * @param {number} id
     * 获取歌单详情-歌单所有音乐
     */
    async function getSongSheet_desc(id) {
      let { data: res } = await getSongSheet_desc_api(id);
      if (res && res.code === 200) {
        let { data: res_all } = await getSongSheet_Music_All_api(
          res.playlist.id
        );
        if (res_all.code === 200) {
          res.playlist["SongSheet_allMusic"] = res_all.songs;
          SongSheet_details.value = markRaw(res.playlist);
          data_loading.value = false;
          console.log(SongSheet_details.value);
        }
      }
    }
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal) {
          data_loading.value = true;
          getSongSheet_desc(newVal);
        }
      },
      {
        immediate: true,
      }
    );
    watch(
      /**
       * 用来强制刷新，因为这个是监听id发生变化，有的场景重新跳转到这个id,监听到id,没有变化就不会刷新，所以在发现这种情况，就使用此方法
       */
      () => route.query.refreshs,
      (newVal) => {
        if (newVal) {
          if (newVal.slice(0, 4) === "true") {
            data_loading.value = true;
            getSongSheet_desc(route.params.id);
          }
        }
      },
      {
        immediate: true,
      }
    );
    return {
      data_loading,
      SongSheet_details,
      clickUserNameSkip_doc,
      stamp_time,
      icon: {
        Share,
        Comment,
        VideoPlay,
      },
    };
  },
});
</script>
      
<style lang="less" scoped>
.music_details_one {
  padding: 15px 0 0 15px;
  .box_position {
    width: 100%;
    display: flex;
    .left {
      width: 20%;
      img {
        width: 90%;
        object-fit: cover;
        border-radius: 10px;
      }
    }
    .right {
      width: 80%;
      .SongSheet_info {
        display: flex;
        align-items: center;
        margin: 0 0 10px 0;

        p {
          color: #000;
          &:nth-child(1) {
            font-size: 24px;
          }
          &:nth-child(2) {
            margin: 0 0 0 15px;
            span {
              font-size: 14px;
              &:nth-child(2) {
                margin-left: 4px;
                font-size: 12px;
                color: #9b9b9b;
              }
            }
          }
        }
      }
      .SongSheet_desc {
        margin: 0 0 10px 5px;
        font: 500 14px "";
        color: #a7a7a7;
        span {
          color: #717171;
        }
      }
      .createPerson {
        margin-bottom: 5px;
        img {
          margin-right: 5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span {
          font: 700 14px "";
          color: #bfbfbf;
        }
        .person {
          margin-right: 10px;
          color: #409eff;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>