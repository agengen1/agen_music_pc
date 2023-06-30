<template>
  <Loading
    v-if="songList.length <= 0"
    textColor="#409eff"
    title="加载中..."
  ></Loading>
  <div v-else class="hotSongs">
    <h2>热门歌曲({{ songList.length }})</h2>
    <ul class="hotSongs_title">
      <li>歌曲</li>
      <li>歌手</li>
      <li>时长</li>
    </ul>
    <ul class="hotSongs_content">
      <li
        v-for="(item, index) in songList"
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
</template>

<script>
import { defineComponent, ref } from "vue";
import { getSingerSongListapi } from "@/api/singerApi";
import { computeMusicTimeDuration } from "@/assets/public";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "hotSongs",
  props: {
    singerId: {
      required: true,
    },
  },
  setup(props) {
    let songList = ref([]); //歌曲数据
    let store = useStore();
    let router = useRouter();

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
      console.log(typeof music_data.ar);
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
      };
      if (music_data.ar.length > 0 && typeof music_data.ar == "object") {
        obj["artists"] = music_data.ar[0];
      } else {
        obj["artists"] = music_data.ar;
      }
      store.commit("player/ADDPLAYMUSIC_LIST", obj);
    }
    /**
     * 歌手单曲获取
     * @param {String | number} id 歌手id
     */
    async function getSingerSongList(id) {
      const { data: res } = await getSingerSongListapi(id);
      if (res.code === 200) {
        songList.value = res.hotSongs;
      }
    }
    getSingerSongList(props.singerId);
    return {
      songList,
      computeMusicTimeDuration,
      clickSingerName_Skpi_doc,
      clickMuiscName_Skpi_doc,
      clickPlayIcon_playMusic,
    };
  },
});
</script>

<style lang='less' scoped>
.hotSongs {
  margin-top: 10px;
  .hotSongs_title {
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
  .hotSongs_content {
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
</style>