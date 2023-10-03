<template>
  <div class="musicList">
    <div class="SongSheet_musiclist">
      <h4>
        <span
          >歌曲列表({{ music_total_P }})
          <el-button
            v-if="
              ![
                'songSheetDetail',
                'charts_details',
                'musicSongSheet',
                'albumDetails',
              ].includes(route.name)
            "
            type="primary"
            size="small"
            :icon="VideoPlay"
            @click="clickPlaySongsMusic_all(music_list_P)"
            >播放全部</el-button
          ></span
        >
        <span v-if="play_total_P > 0"
          >播放:
          <span>
            {{ playCountTransform(play_total_P) }}
          </span>
          次</span
        >
      </h4>
      <ul class="SongSheet_musiclist_title">
        <li>歌曲</li>
        <li>歌手</li>
        <li>时长</li>
      </ul>
      <ul class="SongSheet_musiclist_content" v-if="music_list_P.length > 0">
        <li
          v-for="(item, index) in music_list_P"
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
              v-if="isSearchUse_P"
              class="text_exceed_hide_two"
              @click="clickMuiscName_Skpi_doc(item.id)"
              v-html="SearchTextHighlight(key, item.name)"
            ></span>
            <span
              v-else
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
          <p class="singers_all text_exceed_hide_one">
            <span
              v-for="item_a in item.ar"
              :key="item_a.id"
              @click="clickSingerName_Skpi_doc(item_a.id)"
              :class="{
                Highlight: item_a.name == key,
              }"
            >
              {{ item_a.name }}
            </span>
          </p>
          <p>{{ computeMusicTimeDuration(item.dt) }}</p>
        </li>
      </ul>
      <el-empty v-else description="歌单暂无音乐">
        <el-button
          v-if="route.name == 'musicSongSheet'"
          type="primary"
          @click="clickSkipRecommend()"
          >前往音乐馆收藏音乐</el-button
        >
      </el-empty>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import {
  computeMusicTimeDuration,
  playCountTransform,
  SearchTextHighlight,
} from "@/assets/public";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { VideoPlay } from "@element-plus/icons-vue";

export default defineComponent({
  name: "musicList",
  props: {
    music_list: {
      //歌曲列表
      required: true,
      type: Array,
    },
    music_total: {
      //歌曲总数
      required: true,
      type: Number,
    },
    play_total: {
      //歌曲总播放量
      type: Number,
      default: 0,
    },
    isSearchUse: {
      //是否为搜索结果使用
      type: Boolean,
      default: false,
    },
    keyWord: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    let router = useRouter();
    let route = useRoute();
    let store = useStore();
    let music_list_P = ref([]);
    let music_total_P = ref(0);
    let play_total_P = ref(0);
    let isSearchUse_P = ref(false);
    let key = ref(""); //搜索内容

    watch(
      [
        () => props.music_list,
        () => props.music_total,
        () => props.play_total,
        () => props.isSearchUse,
        () => props.keyWord,
      ],
      (newVal) => {
        music_list_P.value = newVal[0];
        music_total_P.value = newVal[1];
        play_total_P.value = newVal[2];
        isSearchUse_P.value = newVal[3];
        key.value = newVal[4];
      },
      {
        immediate: true,
      }
    );
    /**
     * clickSingerName_Skpi_doc
     * @param {number} id
     * 功能::点击跳转歌手详情页面
     */
    function clickSingerName_Skpi_doc(id) {
      ElMessage.closeAll();
      // DOTO:
      if (id > 0) {
        //接口返回数据存在 id为零，所以进行判断
        router.push(`/layout/home/singerDetails/${id}`);
      } else {
        ElMessage({
          message: "暂未歌手信息或注销！",
          type: "warning",
        });
      }
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
     *  点击跳转音乐馆添加音乐
     */
    function clickSkipRecommend() {
      router.push("/");
    }
    /**
     * clickPlayIcon_playMusic
     * @param {object} music_data
     * 功能：点击播放icon,播放音乐——添加到音乐播放列表
     */
    function clickPlayIcon_playMusic(music_data) {
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
     * 点击播放全部
     * @param {array}  songsList 音乐单曲数组
     */
    function clickPlaySongsMusic_all(songsList) {
      ElMessage.closeAll();
      if (songsList.length <= 0) {
        return ElMessage({
          type: "error",
          message: "暂无可播放音乐",
        });
      }
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

    return {
      music_list_P,
      music_total_P,
      play_total_P,
      computeMusicTimeDuration,
      clickSingerName_Skpi_doc,
      clickMuiscName_Skpi_doc,
      clickPlayIcon_playMusic,
      playCountTransform,
      SearchTextHighlight,
      isSearchUse_P,
      key,
      VideoPlay,
      route,
      clickSkipRecommend,
      clickPlaySongsMusic_all,
    };
  },
});
</script>

<style lang='less' scoped>
.musicList {
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
                  border: 0.5px solid #efefef;
                  border-radius: 5px;
                }
              }
              &:nth-child(3) {
                padding: 0 15px 0 0;
                width: 65%;
                font: 700 18px "黑体";
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
        .singers_all {
          span {
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>