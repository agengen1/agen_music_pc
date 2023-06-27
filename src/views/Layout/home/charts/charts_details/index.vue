<template>
  <LOADING title="加载中...." textColor="#409eff" v-if="data_loading" />
  <div class="charts_details_one" v-else>
    <div class="SongSheet_info">
      <p>{{ SongSheet_details.name }}</p>
      <p>
        {{ stamp_time(SongSheet_details.updateTime) }}
      </p>
    </div>
    <div class="SongSheet_desc" v-if="SongSheet_details.description !== null">
      {{ SongSheet_details.description }}
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
    <div class="SongSheet_musiclist">
      <h4>
        <span>歌曲列表({{ SongSheet_details.trackCount }})</span>
        <span
          >播放:
          <span>
            {{ SongSheet_details.playCount }}
          </span>
          次</span
        >
      </h4>
      <ul class="SongSheet_musiclist_title">
        <li>歌曲</li>
        <li>歌手</li>
        <li>时长</li>
      </ul>
      <ul class="SongSheet_musiclist_content">
        <li
          v-for="(item, index) in SongSheet_details.SongSheet_allMusic"
          :key="item.id"
          :class="{ odd_backColor: index % 2 != 0 }"
        >
          <p>
            <span>{{ index + 1 }}</span>
            <span>
              <img
                v-lazy="item.al.picUrl + '?param=120y120'"
                :alt="item.name"
                :title="item.name"
              />
            </span>
            <span
              class="text_exceed_hide_two"
              @click="clickMuiscName_Skpi_doc(item.id)"
              >{{ item.name }}</span
            >
            <span class="play_music"
              ><van-icon
                name="play-circle-o"
                size="45px"
                @click="clickPlayIcon_playMusic(item)"
            /></span>
          </p>
          <p class="text_exceed_hide_one">
            <span
              v-for="item_a in item.ar"
              :key="item_a.id"
              @click="clickSingerName_Skpi_doc(item_a.id)"
            >
              &nbsp; {{ item_a.name }}&nbsp;
            </span>
          </p>
          <p>{{ computeMusicTimeDuration(item.dt) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
      
<script>
import { defineComponent, markRaw, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getSongSheet_desc_api,
  getSongSheet_Music_All_api,
} from "@/api/publicApi";
import { Share, Comment, VideoPlay } from "@element-plus/icons-vue";
import { computeMusicTimeDuration, stamp_time } from "@/assets/public";
import { useStore } from "vuex";
export default defineComponent({
  name: "chartsDetails",
  setup() {
    let route = useRoute();
    let router = useRouter();
    let SongSheet_details = ref({});
    let data_loading = ref(true);
    let store = useStore();
    /**
     * clickSingerName_Skpi_doc
     * @param {number} id
     * 功能::点击跳转歌手详情页面
     */
    function clickSingerName_Skpi_doc(id) {
      console.log(id);
      // DOTO:
    }
    /**
     * clickMuiscName_Skpi_doc
     * @param {number} id
     * 功能::点击跳转音乐详情页面
     */
    function clickMuiscName_Skpi_doc(id) {
      console.log(id);
      // DOTO:
      router.push("/layout/home/songDetails/" + id);
    }
    /**
     * clickPlayIcon_playMusic
     * @param {object} music_data
     * 功能：点击播放icon,播放音乐——添加到音乐播放列表
     */
    function clickPlayIcon_playMusic(music_data) {
      // TODO:
      let obj = {
        name: music_data.name,
        id: music_data.id,
        playTime: music_data.dt,
        imgUrl: music_data.al.picUrl,
        album: {
          id: music_data.al.id,
          name: music_data.al.name,
          imgUrl: music_data.al.picUrl,
        },
        artists: music_data.ar,
      };
      store.commit("player/ADDPLAYMUSIC_LIST", obj);
    }
    /**
     * getSongSheet_desc
     * @param {number} id
     * 获取歌单详情-歌单所有音乐
     */
    async function getSongSheet_desc(id) {
      let { data: res } = await getSongSheet_desc_api(id);
      if (res.code === 200) {
        let { data: res_all } = await getSongSheet_Music_All_api(
          res.playlist.id
        );
        if (res_all.code === 200) {
          res.playlist["SongSheet_allMusic"] = res_all.songs;
          SongSheet_details.value = markRaw(res.playlist);
          data_loading.value = false;
        }
      }
    }
    watch(
      () => route.params.id,
      (newVal) => {
        data_loading.value = true;
        getSongSheet_desc(newVal);
      },
      {
        immediate: true,
      }
    );
    return {
      data_loading,
      SongSheet_details,
      stamp_time,
      computeMusicTimeDuration,
      clickSingerName_Skpi_doc,
      clickMuiscName_Skpi_doc,
      clickPlayIcon_playMusic,
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
.charts_details_one {
  padding: 15px 0 0 15px;
  .SongSheet_info {
    display: flex;
    align-items: center;
    margin: 0 0 15px 0;

    p {
      color: #000;
      &:nth-child(1) {
        font-size: 24px;
      }
      &:nth-child(2) {
        margin: 0 0 0 15px;
        font-size: 14px;
      }
    }
  }
  .SongSheet_desc {
    margin: 10px 0;
    font: 500 14px "";
  }
  .SongSheet_musiclist {
    margin: 10px 0 0;
    h4 {
      margin-top: 20px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 20px;
      span {
        &:nth-child(2) {
          font-size: 12px;
          > span {
            color: #ff006c;
          }
        }
      }
    }
    .SongSheet_musiclist_title {
      width: 100%;
      background-color: #f6f6f6;
      display: flex;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        &:nth-child(1) {
          padding: 0 0 0 20px;
          width: 70%;
        }
        &:nth-child(2) {
          padding-right: 25px;
          width: 20%;
        }
        &:nth-child(3) {
          padding-right: 50px;
          text-align: right;
          width: 10%;
        }
      }
    }
    .SongSheet_musiclist_content {
      width: 100%;
      li {
        padding: 10px 0;
        width: 100%;
        height: 80px;
        display: flex;
        &:hover p:nth-child(1) > .play_music {
          opacity: 1;
        }
        p {
          height: 100%;
          line-height: 80px;
          font-size: 14px;
          &:nth-child(1) {
            display: flex;
            padding: 0 0 0 20px;
            width: 70%;

            span {
              &:nth-child(1) {
                width: 5%;
                display: flex;
                justify-content: center;
                align-items: center;
                font: 700 22px "楷体";
              }
              &:nth-child(2) {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 20%;
                img {
                  height: 100%;
                  width: 80px;
                  object-fit: cover;
                }
              }
              &:nth-child(3) {
                padding: 0 15px 0 0;
                width: 65%;
                font: 700 18px "";
                color: #000;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                  color: #409eff;
                }
              }
              &:nth-child(4) {
                width: 10%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #23d623;
                transition: all 0.2s;
                opacity: 0;
                cursor: pointer;
              }
            }
          }
          &:nth-child(2) {
            padding-right: 25px;
            width: 20%;
            span {
              cursor: pointer;
              &:nth-child(1) {
                > span {
                  display: none;
                }
              }
              &:hover {
                text-decoration: underline;
                color: #ff006c;
              }
            }
          }
          &:nth-child(3) {
            padding-right: 50px;
            text-align: right;
            width: 10%;
          }
        }
      }
      .odd_backColor {
        background-color: #f9f9f9;
      }
    }
  }
}
</style>