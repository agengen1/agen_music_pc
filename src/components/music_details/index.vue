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
        <div class="SongSheet_other">
          <el-button
            type="primary"
            :icon="icon.VideoPlay"
            @click="
              clickPlaySongsMusic_all(SongSheet_details.SongSheet_allMusic)
            "
            >播放全部</el-button
          >
          <el-button
            v-if="SongSheet_details.subscribed"
            type="success"
            :icon="icon.Check"
            disabled
            >已收藏({{ SongSheet_details.subscribedCount }})</el-button
          >
          <el-button
            v-else
            type="info"
            :icon="icon.FolderAdd"
            :disabled="userId === SongSheet_details.creator.userId"
            @click="setSongSheetFollower(SongSheet_details.id, 1)"
            >收藏({{ SongSheet_details.subscribedCount }})</el-button
          >
          <el-button
            type="info"
            plain
            :icon="icon.Share"
            @click="clickCopySharelink()"
            >分享({{ SongSheet_details.shareCount }})</el-button
          >
        </div>
        <div
          class="SongSheet_desc"
          v-if="SongSheet_details.description_arr.length > 0"
        >
          <p class="h_desc">介绍：</p>
          <div class="content_desc">
            <p
              v-for="(item, index) in SongSheet_details.description_arr"
              :key="index"
            >
              {{ item }}
            </p>
          </div>

          <div class="button_control">
            <span v-if="el_button_text === '收起'" @click="clickPackUpText()"
              >收起<van-icon name="arrow-up"
            /></span>
            <span v-else @click="clickExpandText()"
              >展开<van-icon name="arrow-down"
            /></span>
          </div>
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
import { defineComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import musicList from "@/components/music_list/index.vue";
import {
  getSongSheet_desc_api,
  getSongSheet_Music_All_api,
  setSongSheetFollowerapi,
} from "@/api/songSheetDeaitlsApi";
import {
  Share,
  Comment,
  VideoPlay,
  Check,
  FolderAdd,
} from "@element-plus/icons-vue";
import { stamp_time } from "@/assets/public";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default defineComponent({
  name: "musicDetails",
  components: {
    musicList,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let store = useStore();
    let userId = parseInt(localStorage.getItem("userId")); //登录用户id
    let SongSheet_details = ref({});
    let data_loading = ref(true);
    let desc_height = ref(50); //desc允许展示高度
    let desc_el_height = ref(0); //元素正常显示高度
    let el_desc_content = null; //展示desc元素
    let el_button_text = ref("展开"); //按钮展示打开状态
    /**
     * 点击播放全部
     * @param {array}  songsList 音乐单曲数组
     */
    function clickPlaySongsMusic_all(songsList) {
      let arr_songs = [];
      songsList.forEach((el) => {
        arr_songs.push({
          name: el.name,
          id: el.id,
          playTime: el.dt,
          imgUrl: el.al.picUrl,
          album: {
            id: el.al.id,
            name: el.al.name,
            imgUrl: el.al.picUrl,
          },
          artists: el.ar,
        });
      });
      store.commit("player/ADDPLAYMUSIC_LIST", arr_songs);
    }
    /**
     * 点击展开
     */
    function clickExpandText() {
      ElMessage.closeAll();
      desc_el_height.value = 0;
      el_desc_content = document.querySelector(".content_desc");
      el_desc_content.querySelectorAll("p").forEach((el) => {
        desc_el_height.value += el.scrollHeight;
      });
      if (desc_el_height.value <= desc_height.value) {
        //判断是否全部展示
        return ElMessage({
          type: "warning",
          message: "已展示全部内容！",
        });
      }
      el_desc_content.style.height = desc_el_height.value + "px";
      el_button_text.value = "收起";
    }
    /**
     * 点击收起
     */
    function clickPackUpText() {
      el_desc_content.style.height = desc_height.value + "px";
      el_button_text.value = "展开";
    }
    /**
     * 点击分享
     */
    function clickCopySharelink() {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          ElMessage({
            type: "success",
            message: `分享链接获取成功:${window.location.href}`,
          });
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: `分享链接获取失败:${error.message}`,
          });
        });
    }
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 收藏/取消收藏  歌单
     * @param {string | number} id : 歌单 id
     * @param {string | number} t : 1为收藏,2为取消收藏
     */
    async function setSongSheetFollower(id, t) {
      const { data: res } = await setSongSheetFollowerapi(id, t);
      if (res && res.code === 200) {
        ElMessage({
          type: "success",
          message: "收藏歌单成功！",
        });
        SongSheet_details.value.subscribed = true;
        SongSheet_details.value.subscribedCount++;
      } else {
        ElMessage({
          type: "error",
          message: "收藏歌单失败！",
        });
      }
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
          SongSheet_details.value = res.playlist;
          data_loading.value = false;
          if (SongSheet_details.value.description) {
            SongSheet_details.value["description_arr"] =
              SongSheet_details.value.description.split("\n");
          } else {
            SongSheet_details.value["description_arr"] = [];
          }
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
      route,
      data_loading,
      SongSheet_details,
      clickUserNameSkip_doc,
      stamp_time,
      el_button_text,
      clickPackUpText,
      clickExpandText,
      clickPlaySongsMusic_all,
      userId,
      setSongSheetFollower,
      clickCopySharelink,
      desc_height_str: desc_height.value + "px",
      icon: {
        Share,
        Comment,
        VideoPlay,
        Check,
        FolderAdd,
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
        margin: 10px 0 10px 5px;
        font: 500 14px "";
        color: #8f8f8f;

        .h_desc {
          color: #717171;
          padding: 0px;
          font-weight: 700;
        }
        .content_desc {
          height: v-bind(desc_height_str);
          transition: all 0.3s;
          overflow: hidden;
          p {
            padding: 5px 10px;
            line-height: 25px;
          }
        }
        .button_control {
          margin-top: 10px;
          padding-right: 25px;
          display: flex;
          justify-content: flex-end;
          span {
            cursor: pointer;
            color: #409eff;
          }
        }
      }
      .createPerson {
        margin-bottom: 10px;
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