<template>
  <div class="albumDetails">
    <goBack></goBack>
    <div class="album">
      <div class="album_left">
        <Loading
          v-if="album_flag"
          textColor="#409eff"
          title="加载中..."
        ></Loading>
        <div class="content" v-else>
          <div class="peopleInfo">
            <div class="peopleInfo_left">
              <img v-lazy="album_Data.album.picUrl + '?param=250y250'" />
            </div>
            <div class="peopleInfo_right">
              <p class="album_name">{{ album_Data.album.name }}</p>
              <p class="album_artist">
                歌手：
                <span v-for="item in album_Data.album.artists" :key="item.id">{{
                  item.name
                }}</span>
              </p>
              <p>发行时间：{{ stamp_time(album_Data.album.publishTime) }}</p>
              <p v-if="album_Data.album.company">
                发行公司：{{ album_Data.album.company }}
              </p>
              <p class="album_button">
                <el-button
                  type="primary"
                  :icon="icon.VideoPlay"
                  @click="clickPlaySongsMusic_all(album_Data.songs)"
                  >播放全部</el-button
                >
                <el-button
                  type="success"
                  :icon="icon.FolderAdd"
                  @click="clickButton_pushMusic()"
                  >收藏</el-button
                >
                <el-button type="info" plain :icon="icon.Share"
                  >分享({{ album_Data.album.info.shareCount }})</el-button
                >
              </p>
            </div>
          </div>
          <div class="album_inrt" v-if="album_Data.album.description">
            <h3>专辑介绍:</h3>
            <p>{{ album_Data.album.description }}</p>
          </div>
          <!-- 音乐列表展示 -->
          <musicList
            :music_list="album_Data.songs"
            :music_total="album_Data.album.size"
          ></musicList>
        </div>
      </div>
      <div class="album_right">
        <h3>最新专辑</h3>
        <Loading
          v-if="newAlbum_flag"
          textColor="#409eff"
          title="加载中..."
        ></Loading>
        <div class="newAlbum_content" v-else>
          <div
            class="newAlbum"
            v-for="item in newAlbum_Data"
            :key="item.id"
            @click="clickSkipAlbumDetails(item.id)"
          >
            <div class="newAlbum_left">
              <img
                v-lazy="item.picUrl + '?param=120y120'"
                :alt="item.name"
                :title="item.name"
              />
            </div>
            <div class="newAlbum_right">
              <p class="text_exceed_hide_one">{{ item.name }}</p>
              <p class="other_ill">
                <span>{{ item.size }}首</span>
                <span>
                  {{ stamp_time(item.publishTime) }}
                </span>
              </p>
            </div>
          </div>
        </div>
        <el-empty
          v-if="newAlbum_Data.length <= 0 && !newAlbum_flag"
          description="暂无专辑"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { getAlbumData_api, getNewAlbum_api } from "@/api/albumApi";
import { useRoute, useRouter } from "vue-router";
import { stamp_time } from "@/assets/public";
import musicList from "@/components/music_list/index.vue";
import { Share, VideoPlay, FolderAdd } from "@element-plus/icons-vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "albumDetails",
  components: {
    musicList,
  },
  setup() {
    let store = useStore();
    let router = useRouter();
    let route = useRoute();
    let album_flag = ref(true); //专辑加载状态
    let album_Data = ref({}); //专辑数据
    let newAlbum_flag = ref(true); //最新专辑加载状态
    let newAlbum_Data = ref([]); //最新专辑数据
    watch(
      () => route.params.albumId,
      (newVal) => {
        if (newVal) {
          album_flag.value = true;
          newAlbum_flag.value = true;
          getAlbumData(newVal);
          getNewAlbum();
        }
      },
      { immediate: true }
    );
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
     * 点击跳转专辑详情页
     * @param {string | number} id 专辑id
     */
    function clickSkipAlbumDetails(id) {
      // TODO:
      router.push(`/layout/home/albumDetails/${id}`);
    }
    /**
     * 点击添加专辑单曲到歌单
     */
    function clickButton_pushMusic() {
      let arr_ids = [];
      album_Data.value.songs.forEach((el) => {
        arr_ids.push(el.id);
      });
      arr_ids = arr_ids.join(",");
      store.commit("collect/SETCOLLECTMUSIC_ID", arr_ids);
      store.commit("collect/SETCOLLECTMUSIC_STATUS", true);
    }
    /**
     * 获取专辑内容
     * @param {number | string} id  专辑id
     */
    async function getAlbumData(id) {
      const { data: res } = await getAlbumData_api(id);
      album_flag.value = false;
      if (res && res.code === 200) {
        album_Data.value["album"] = res.album;
        album_Data.value["songs"] = res.songs;
      }
    }
    /**
     * 获取最新专辑
     */
    async function getNewAlbum() {
      const { data: res } = await getNewAlbum_api();
      newAlbum_flag.value = false;
      if (res && res.code === 200) {
        newAlbum_Data.value = res.albums.slice(0, 5);
      }
    }
    return {
      album_flag,
      album_Data,
      newAlbum_flag,
      newAlbum_Data,
      stamp_time,
      clickSkipAlbumDetails,
      clickPlaySongsMusic_all,
      clickButton_pushMusic,
      icon: {
        Share,
        VideoPlay,
        FolderAdd,
      },
    };
  },
});
</script>

<style lang='less' scoped>
.albumDetails {
  .album {
    display: flex;
    .album_left {
      padding-top: 10px;
      width: 75%;
      .content {
        .peopleInfo {
          display: flex;
          .peopleInfo_left {
            width: 20%;
            img {
              width: 100%;
              object-fit: cover;
              border-radius: 10px;
            }
          }
          .peopleInfo_right {
            width: 80%;
            padding-left: 10px;
            p {
              padding-left: 2px;
              margin: 5px 0;
              font-size: 14px;
            }
            .album_name {
              padding-left: 0;
              font: 700 22px "华文楷书";
              color: #333;
            }
            .album_artist {
              span {
                margin-right: 6px;
                color: #409eff;
                font-weight: 700;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
            .album_button {
              margin-top: 10px;
            }
          }
        }
        .album_inrt {
          padding-left: 10px;
          h3 {
            margin: 5px 0 3px 0;
            color: #333;
          }
          p {
            max-height: 20vh;
            overflow: scroll;
            padding: 0 20px 0 10px;
            white-space: pre-wrap;
          }
        }
      }
    }
    .album_right {
      padding: 0 10px;
      width: 25%;
      h3 {
        margin-bottom: 5px;
      }
      .newAlbum_content {
        display: flex;
        flex-direction: column;

        .newAlbum {
          display: flex;
          padding: 5px 5px;
          cursor: pointer;
          &:hover {
            background-color: #ededed;
          }
          .newAlbum_left {
            width: 20%;
            img {
              width: 100%;
              object-fit: cover;
              border-radius: 10px;
              border: 1px solid #ededed;
            }
          }
          .newAlbum_right {
            width: 80%;
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              color: #333;
              font-size: 14px;

              &:nth-child(2) {
                color: #a4a4a4;
                font-size: 12px;
              }
            }
            .other_ill {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>