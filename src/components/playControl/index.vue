<template>
  <div
    class="playControl"
    @mouseenter="playControl_MouseIn"
    @mouseleave="playControl_MouseOut"
    data-playListing="is_playlist"
  >
    <div class="playControl_box" data-playListing="is_playlist">
      <!-- 是否锁定控制 -->

      <div class="lock_control">
        <el-icon @click="islocked = !islocked" v-if="islocked"
          ><Lock data-playListing="is_playlist"
        /></el-icon>
        <el-icon @click="islocked = !islocked" v-else
          ><Unlock data-playListing="is_playlist"
        /></el-icon>
      </div>
      <div class="content margin_layout">
        <div class="left">
          <div class="music_img">
            <img
              v-lazy="music_info.imgUrl + '?param=150y150'"
              :alt="music_info.name"
              :title="music_info.name"
            />
            <div class="mack" @click="clickMuiscName_Skpi_doc(music_info.id)">
              <p><i class="iconfont icon-quanping"></i></p>
            </div>
          </div>
          <div class="music_progress">
            <div class="other_info">
              <span class="text_exceed_hide_one">{{ music_info.name }}</span>
              <p>
                <span>{{ computeMusicTimeDuration(playMusic_time) }}</span> /
                <span v-if="music_urlInfo.fee === 1">{{
                  computeMusicTimeDuration(music_urlInfo.time)
                }}</span>
                <span v-else>{{
                  computeMusicTimeDuration(music_info.playTime)
                }}</span>
              </p>
            </div>
            <!-- 上下边距 -->
            <div class="marginTB">
              <!-- 是否vip  试听30s -->
              <div class="isAudition" v-show="music_urlInfo.fee === 1">
                <i class="iconfont icon-zhuanshukefu"></i>
                <p>VIP歌曲,试听30s</p>
              </div>
            </div>

            <div class="progress_bar">
              <!-- :src="`https://music.163.com/song/media/outer/url?id=${music_info.id}.mp3 `" -->
              <!-- :src="music_urlInfo.url" -->
              <audio
                :src="music_urlInfo.url"
                @timeupdate="playMusic_update_handler"
                @ended="playMusic_complete_handler"
                autoplay
              ></audio>
              <van-slider
                v-if="music_urlInfo.fee === 1"
                v-model="playMusic_time"
                bar-height="3px"
                button-size="4px"
                :min="0"
                :max="music_urlInfo.time"
                active-color="#fe036e"
                :readonly="false"
              />
              <van-slider
                v-else
                v-model="playMusic_time"
                bar-height="3px"
                button-size="4px"
                :min="0"
                :max="music_info.playTime"
                active-color="#fe036e"
                :readonly="false"
              />
            </div>
          </div>
        </div>
        <div class="middle">
          <p title="上一首">
            <van-icon name="arrow-left" @click="play_preSong_music" />
          </p>
          <p title="暂停" v-if="playMusic_status">
            <van-icon name="pause-circle-o" @click="click_playMusic_button" />
          </p>
          <p title="播放" v-else>
            <van-icon name="play-circle-o" @click="click_playMusic_button" />
          </p>

          <p title="下一首">
            <van-icon name="arrow" @click="play_nextSong_music" />
          </p>
        </div>
        <div class="right">
          <p>
            <van-icon
              name="like"
              color="red"
              v-if="isLikeMusic"
              @click="clickSetLikeMusic({ id: music_info.id, type: false })"
            />
            <van-icon
              name="like-o"
              v-else
              @click="clickSetLikeMusic({ id: music_info.id, type: true })"
            />
          </p>
          <p title="下载歌曲">
            <el-icon
              @click="clickDownloadButton(music_info.id, music_info.name)"
              ><Download
            /></el-icon>
          </p>
          <p title="播放记录">
            <van-icon
              name="bars"
              data-playListing="is_playlist"
              :badge="playMusic_list.length"
              @click="clickOpen_playMusic_list()"
            />
          </p>
          <div class="volume">
            <i
              class="iconfont icon-24gf-volumeCross"
              v-if="playMusic_volume == 0"
            ></i>
            <i class="iconfont icon-24gf-volumeHigh" v-else></i>
            <el-slider
              v-model="playMusic_volume"
              :max="100"
              :min="0"
              size="small"
            />
          </div>
        </div>
      </div>
      <!-- 播放列表 -->
      <Transition name="playListing" mode="out-in" appear>
        <div
          class="play_listing"
          v-show="playlist_open_flag"
          data-playListing="is_playlist"
        >
          <h3>
            <span>播放列表({{ playMusic_list.length }})</span>
            <p>
              <span title="清空播放列表"
                ><van-icon
                  name="delete-o"
                  @click="clickPlayMusic_delete_all_music"
              /></span>
              <span title="关闭" @click="click_close_playlisting"
                ><van-icon name="cross"
              /></span>
            </p>
          </h3>
          <ul>
            <li
              v-for="(item, index) in playMusic_list"
              :key="item.id"
              :class="{ odd_backColor: index % 2 != 0 }"
              data-playListing="is_playlist"
            >
              <div class="play_flag" data-playListing="is_playlist">
                <el-icon v-show="index === playMusic_index"><Flag /></el-icon>
              </div>
              <div
                class="play_name text_exceed_hide_one"
                :class="{ isplay_music: index === playMusic_index }"
                @click="clickPlayMusic_music_name(index)"
                data-playListing="is_playlist"
                :title="item.name"
              >
                {{ item.name }}
              </div>
              <div class="play_handler_button">
                <span title="收藏"
                  ><el-icon
                    data-playListing="is_playlist"
                    @click="clickButton_pushMusic(item.id)"
                    ><FolderAdd /></el-icon
                ></span>
                <span title="删除"
                  ><van-icon
                    name="delete-o"
                    @click="clickPlayMusic_delete_music(item.id)"
                    data-playListing="is_playlist"
                /></span>
              </div>
              <div class="play_artists text_exceed_hide_one">
                {{ computeSingerAs(item.artists) }}
              </div>
              <div class="play_time text_exceed_hide_one">
                {{ computeMusicTimeDuration(item.playTime) }}
              </div>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  markRaw,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import {
  Unlock,
  Lock,
  Download,
  Flag,
  FolderAdd,
} from "@element-plus/icons-vue";
import { getMusic_url_api, getMusic_isUsable_api } from "@/api/publicApi";
import { computeMusicTimeDuration, computeSingerAs } from "@/assets/public";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { PackageMessageBox } from "@/assets/public";
import { setUserLikeStatusapi } from "@/api/userDetailsApi";
import downloadMusic from "@/utils/downloadMusic";
import { getSongDetailsNoVipDownloadUrl } from "@/api/songDetailsApi";
export default defineComponent({
  name: "playControl",
  components: {
    Unlock,
    Lock,
    Download,
    Flag,
    FolderAdd,
  },
  setup() {
    let islocked = ref(false); //锁定就不会自动隐藏  true-表示锁定   false-不锁定
    let playlist_open_flag = ref(false); //播放列表打开状态 -- true - 打开 ， false -隐藏
    let playControl_el = null; //鼠标移入移出操作元素
    let playListing_el = ref(null); //播放列表元素
    let audio_el = null; //播放器操作元素
    let store = useStore(); //vuex 中的公共数据
    let router = useRouter();
    let route = useRoute();
    let user_isLogin = computed(() => {
      return store.state.user.user_isLogin;
    });
    let isLikeMusic = computed(() => {
      if (store.state.user.user_isLogin) {
        if (
          store.state.user.userLikeMusicListId.indexOf(music_info.value.id) !=
          -1
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        //未登录直接返回 false
        return false;
      }
    });
    let playMusic_index = computed(() => {
      return store.state.player.playMusic_index;
    });
    let playMusic_id = computed(() => {
      return store.state.player.playMusic_id;
    });
    let playMusic_status = computed(() => {
      return store.state.player.playMusic_status;
    });
    let playMusic_list = computed(() => {
      return store.state.player.playMusic_list;
    });
    let playMusic_time = computed({
      get() {
        return store.state.player.playMusic_time;
      },
      set(val_number) {
        //以下代码用来实现拖动进度条播放音乐
        if (audio_el && val_number) {
          audio_el.currentTime = val_number / 1000;
          store.commit("player/SETPLAYMUSIC_TIME", val_number);
          play_handler();
        }
      },
    });
    let playMusic_volume = computed({
      get() {
        return store.state.player.playMusic_volume;
      },
      set(val_number) {
        //以下代码用来实现拖动进度条控制音乐音量
        store.commit("player/SETPLAYMUSIC_VOLUME", val_number);
      },
    });
    let music_info = ref(playMusic_list.value[playMusic_index.value]); //歌曲详情数据
    let music_urlInfo = ref({}); //歌曲音乐url数据
    onMounted(() => {
      playControl_el = document.querySelector(".playControl");
      audio_el = document.querySelector("audio");
      playListing_el.value = document.querySelector(".play_listing");
      window.addEventListener("click", watch_playListing_out);
    });
    onUnmounted(() => {
      window.removeEventListener("click", watch_playListing_out);
    });
    watch(
      playMusic_index,
      (newVal) => {
        store.commit("player/SETPLAYMUSIC_ID", playMusic_list.value[newVal].id);
      },
      { immediate: true }
    );
    watch(playMusic_id, () => {
      store.commit("player/SETPLAYMUSIC_STATUS", false);
      pause_handler();
      store.commit("player/SETPLAYMUSIC_TIME", 0);
      music_info.value = playMusic_list.value[playMusic_index.value];
      getMusic_url(music_info.value.id);
      audio_el.load(); //用来重新加载audio音频路径
      store.commit("player/SETPLAYMUSIC_STATUS", true);
    });
    watch(playMusic_volume, (newVal) => {
      audio_el.volume = newVal / 100;
    });
    watch(
      //监听当前是否在{mv/视频}播放页面（在：判断是否在播放音乐（播放就关闭音乐））
      () => route.name,
      (newVal) => {
        if (newVal && newVal == "mvDetails") {
          if (playMusic_status.value) {
            pause_handler();
          }
        }
      },
      {
        immediate: true,
      }
    );
    /**
     * 监听点击外部元素
     */
    function watch_playListing_out(e) {
      if (playlist_open_flag.value) {
        e.preventDefault();
        if (
          e?.target?.dataset?.playlisting == "is_playlist" ||
          e?.target?.offsetParent?.dataset?.playlisting == "is_playlist" ||
          e?.target?.nodeName == "svg"
        ) {
        } else {
          if (islocked.value) {
            playlist_open_flag.value = false;
          } else {
            playlist_open_flag.value = false;
            playControl_el.style.bottom = "-90px";
          }
        }
      }
    }
    /**
     * playControl_MouseIn
     * 功能：鼠标移入触发事件
     */
    function playControl_MouseIn() {
      if (islocked.value) {
        return;
      }
      playControl_el.style.bottom = "0";
    }
    /**
     * playControl_MouseOut
     * 功能：鼠标移出触发事件
     */
    function playControl_MouseOut() {
      if (islocked.value) {
        return;
      }
      playControl_el.style.bottom = "-90px";
      playlist_open_flag.value = false;
    }
    /**
     * 功能:点击播放按钮 -播放或暂停音乐
     * audio中 paused属性 true表示现在暂停状态
     */
    function click_playMusic_button() {
      if (audio_el.paused) {
        play_handler();
      } else {
        pause_handler();
      }
    }
    /**
     * 播放处理函数
     */
    function play_handler() {
      if (
        music_urlInfo.value &&
        music_urlInfo.value.fee === 0 &&
        music_urlInfo.value.is_copyright === false
      ) {
        store.commit("player/SETPLAYMUSIC_TIME", 0);
        info_prompt("提示", "<i style='color:red;'>暂无版权！</i>");
        return;
      }
      store.commit("player/SETPLAYMUSIC_STATUS", true);
      nextTick(() => {
        audio_el.play();
      });
    }
    /**
     * 暂停处理函数
     */
    function pause_handler() {
      store.commit("player/SETPLAYMUSIC_STATUS", false);
      nextTick(() => {
        audio_el.pause();
      });
    }
    /**
     * 音乐播放中触发事件
     */
    function playMusic_update_handler(e) {
      store.commit("player/SETPLAYMUSIC_TIME", e.target.currentTime * 1000);
    }
    /**
     * 音乐播放完成触发事件
     */
    function playMusic_complete_handler() {
      info_prompt("提示", "歌曲播放完毕!,自动播放下一首！");
      store.commit("player/SETPLAYMUSIC_TIME", 0);
      store.commit("player/SETPLAYMUSIC_STATUS", false);
      nextTick(() => {
        play_nextSong_music();
      });
    }
    /**
     * 功能：播放上一首音乐
     */
    function play_preSong_music() {
      let index = playMusic_index.value;
      index -= 1;
      if (index < 0) {
        index = playMusic_list.value.length - 1;
      }
      store.commit("player/SETPLAYMUSIC_INDEX", index);
    }
    /**
     * 功能：播放下一首音乐
     */
    function play_nextSong_music() {
      let index = playMusic_index.value;
      index += 1;
      // 判断是否播放列表只有一首音乐
      if (playMusic_list.value.length === 1) {
        index = 0;
        play_handler();
        return;
      }
      if (index >= playMusic_list.value.length) {
        index = 0;
      }
      store.commit("player/SETPLAYMUSIC_INDEX", index);
    }
    /**
     * 点击打开音乐播放列表
     */
    function clickOpen_playMusic_list() {
      if (playlist_open_flag.value) {
        playlist_open_flag.value = false;
      } else {
        playlist_open_flag.value = true;
      }
    }
    /**
     * @param {number} id
     * 功能::点击跳转音乐详情页面
     */
    function clickMuiscName_Skpi_doc(id) {
      if (route.name === "songDetails") {
        if (route.params.songId != id) {
          router.replace("/layout/home/songDetails/" + id);
        }
      } else {
        router.push("/layout/home/songDetails/" + id);
      }
    }
    /**
     * 点击下载歌曲按钮
     * @param {String} id  歌曲id
     * @param {String} id  歌曲name
     */
    async function clickDownloadButton(id, name) {
      //两种情况，登录和未登录获取 歌曲api不同   下面用未登录获取
      const { data: res } = await getSongDetailsNoVipDownloadUrl(id);
      if (res && res.code === 200) {
        const obj = {
          music_name: name,
          music_url: res.data[0].url,
          music_type: res.data[0].type,
        };
        downloadMusic(obj);
      }
    }
    /**
     * 点击添加单曲到歌单
     * @param {number} id 单曲id
     */
    function clickButton_pushMusic(id) {
      ElMessage.closeAll();
      if (!user_isLogin.value) {
        return ElMessage({
          type: "warning",
          message: "请先进行登录",
        });
      }
      store.commit("collect/SETCOLLECTMUSIC_ID", id);
      store.commit("collect/SETCOLLECTMUSIC_STATUS", true);
    }
    /**
     * 点击取消/喜欢 歌曲
     * @param {Object}  objData (对象中包括type:取消(false)，还是喜欢(true)，id:歌曲id)
     */
    function clickSetLikeMusic(objData) {
      if (!store.state.user.user_isLogin) {
        ElMessage.closeAll();
        ElMessage({
          message: "请先进行登录！",
          type: "warning",
        });
        return store.commit("user/SETLOGINOPENSTATE", true);
      }
      if (objData.type) {
        //喜欢音乐
        PackageMessageBox(`确定喜欢这首音乐? `, "喜欢提示", {
          type: "success",
          draggable: true,
        })
          .then(() => {
            setUserLikeStatus(objData.id, objData.type);
          })
          .catch(() => {});
      } else {
        //取消喜欢音乐
        PackageMessageBox(`确定取消喜欢这首音乐? `, "取消喜欢提示", {
          type: "warning",
          draggable: true,
        })
          .then(() => {
            setUserLikeStatus(objData.id, objData.type);
          })
          .catch(() => {});
      }
    }
    /**
     * 信息提示框
     * @param {string} title
     * @param {string} message
     */
    function info_prompt(title, message) {
      ElNotification({
        type: "warning",
        title,
        message,
        duration: 2000,
        position: "top-right",
        dangerouslyUseHTMLString: true,
      });
    }
    /**
     * 点击关闭播放列表
     */
    function click_close_playlisting() {
      if (islocked.value) {
        playlist_open_flag.value = false;
      } else {
        playlist_open_flag.value = false;
        playControl_el.style.bottom = "-90px";
      }
    }
    /**
     * 点击播放列表 music_name 切换音乐
     * @param {number} index 音乐下标
     */
    function clickPlayMusic_music_name(index) {
      store.commit("player/SETPLAYMUSIC_INDEX", index);
    }
    /**
     * 点击播放列表全部删除icon 删除全部音乐
     */
    function clickPlayMusic_delete_all_music() {
      PackageMessageBox("确定删除全部音乐?", "删除提示", {
        type: "warning",
        draggable: true,
      })
        .then(() => {
          // 确定删除
          pause_handler();
          store.commit("player/DELETEPLAYMUSIC_LIST_ALLMUSIC");
        })
        .catch(() => {
          //取消，什么都不用干
        });
    }
    /**
     * 点击播放列表删除icon 删除音乐
     * @param {number} id 音乐id
     */
    function clickPlayMusic_delete_music(id) {
      store.commit("player/DELETEPLAYMUSIC_LIST_MUSIC", id);
    }
    /**
     * 歌曲是否可用获取
     * @param {number} id 歌曲id
     */
    async function getMusic_isUsable(id) {
      const { data: res } = await getMusic_isUsable_api(id);
      return Promise.resolve(res);
    }
    /**
     * 获取歌曲url详情
     * @param {string} id 歌曲id
     */
    async function getMusic_url(id) {
      const { data: res } = await getMusic_url_api(id);
      if (res && res.code === 200) {
        music_urlInfo.value = markRaw(res.data[0]);
        if (res.data[0].fee === 1) {
          info_prompt("提示", "<i style='color:red;'>VIP歌曲,试听30s</i>");
        } else if (res.data[0].fee === 0) {
          const res_u = await getMusic_isUsable(res.data[0].id);
          if (res_u && res_u.success === false) {
            info_prompt("提示", "<i style='color:red;'>暂无版权！</i>");
            music_urlInfo.value["is_copyright"] = false; //标记此歌曲为无版权 fasle - 没有版权
            pause_handler();
          }
        }
      }
    }
    /**
     * 喜欢音乐/取消喜欢音乐
     * @param { String | Number} id 歌曲id
     * @param { boolean } like  布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢
     */
    async function setUserLikeStatus(id, like) {
      const { data: res } = await setUserLikeStatusapi(id, like);
      if (res && res.code === 200) {
        let LikeList = store.state.user.userLikeMusicListId;
        if (like) {
          ElMessage({
            message: "喜欢成功！",
            type: "success",
          });
          LikeList = [...LikeList, id];
        } else {
          ElMessage({
            message: "取消喜欢成功！",
            type: "success",
          });
          LikeList = LikeList.filter((el) => {
            return el !== id;
          });
        }
        store.commit("user/SETUSERLIKEMUSICLISTID", LikeList);
      } else {
        if (like) {
          ElMessage({
            message: "喜欢失败！",
            type: "error",
          });
        } else {
          ElMessage({
            message: "取消喜欢失败！",
            type: "error",
          });
        }
      }
    }
    getMusic_url(music_info.value.id);

    return {
      islocked,
      music_info,
      playMusic_time,
      playMusic_volume,
      music_urlInfo,
      playMusic_status,
      playMusic_list,
      playControl_MouseIn,
      playControl_MouseOut,
      click_playMusic_button,
      playMusic_update_handler,
      computeMusicTimeDuration,
      playMusic_complete_handler,
      play_preSong_music,
      play_nextSong_music,
      clickMuiscName_Skpi_doc,
      isLikeMusic,
      clickSetLikeMusic,
      clickOpen_playMusic_list,
      playlist_open_flag,
      playListing_el,
      playMusic_index,
      computeSingerAs,
      clickPlayMusic_music_name,
      clickPlayMusic_delete_music,
      clickPlayMusic_delete_all_music,
      click_close_playlisting,
      clickButton_pushMusic,
      clickDownloadButton,
    };
  },
});
</script>

<style lang="less" scoped>
.playListing-enter-active,
.playListing-leave-active {
  transition: transform 0.3s;
}
.playListing-enter-from,
.playListing-leave-to {
  transform: translateY(45vh+90px);
}
.playListing-enter-to,
.playListing-leave-from {
  transform: translateY(0);
}
.playControl {
  position: fixed;
  left: 0;
  bottom: -90px;
  // bottom: 1px;
  height: 106px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
  transition: all 0.5s;
  z-index: 100;
  .playControl_box {
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    margin-top: 15px;
    height: 90px;
    background-color: #ffffff;

    .lock_control {
      padding-top: 2px;
      width: 40px;
      height: 20px;
      position: absolute;
      top: -22px;
      right: 5%;
      text-align: center;
      line-height: 10px;
      background-color: rgb(255, 255, 255);
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
      border-radius: 20px 20px 0 0;
      cursor: pointer;
      .el-icon {
        font-size: 20px;
        color: #fe036e;
      }
      .el-icon:hover {
        color: #409eff;
      }
    }
    .content {
      display: flex;
      height: 100%;
      .left {
        width: 40%;
        height: 100%;
        display: flex;
        .music_img {
          position: relative;
          width: 20%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover .mack {
            opacity: 1;
          }
          img {
            height: 90%;
            object-fit: cover;
          }
          .mack {
            position: absolute;
            opacity: 0;
            height: 90%;
            width: 81px;
            background-color: #00000077;
            transition: all 0.3s;
            overflow: hidden;
            display: flex;
            align-items: center;
            &:hover > p {
              transform: scale(1.5);
            }
            > p {
              width: 100%;
              text-align: center;
              transition: all 0.3s;

              transform: scale(2.5);
              i {
                font-size: 50px;
                font-weight: 300;
                color: #ffffffc8;
              }
            }
          }
        }
        .music_progress {
          margin-left: 10px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .other_info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span {
              width: 200px;
              font: 500 14px "Helvetica Neue";
            }
            > p {
              margin-left: 10px;
              flex: 1;
              font: 500 14px "Helvetica Neue";
            }
          }
          .marginTB {
            margin: 10px 0;
            .isAudition {
              display: flex;
              align-items: center;
              i {
                font-size: 15px;
                color: red;
                font-weight: 700;
              }
              p {
                margin-left: 10px;
                color: red;
              }
            }
          }
          .progress_bar {
            /deep/ .van-slider__button {
              background-color: #fe036e;
              border: 4px solid #fff;
              box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
            }
          }
        }
      }
      .middle {
        margin: 0 10px;
        width: 20%;
        display: flex;
        align-items: center;
        p {
          color: #000;
          cursor: pointer;
          flex: 1;
          text-align: center;
          font-size: 24px;
          &:nth-child(2) {
            flex: 2;
            font-size: 45px;
          }
        }
      }
      .right {
        width: 40%;
        display: flex;
        align-items: center;
        i {
          cursor: pointer;
        }
        p {
          flex: 1;
          font-size: 22px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .volume {
          margin-left: 20px;
          flex: 1.5;
          display: flex;
          align-items: center;
          /deep/.el-slider {
            --el-slider-height: 4px;
            --el-slider-button-size: 12px;
            --el-slider-button-wrapper-size: 38px;
            --el-slider-button-wrapper-offset: -17px;
          }
          i {
            margin-right: 15px;
            font-size: 20px;
          }
        }
      }
    }
    .play_listing {
      position: absolute;
      z-index: -1;
      right: 8.5vw;
      bottom: 90px;
      width: 35vw;
      height: 45vh;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
      background-color: #fff;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      padding: 10px;
      h3 {
        display: flex;
        justify-content: space-between;
        border-bottom: 1.5px solid #eaeaea;
        padding-bottom: 5px;
        margin-bottom: 5px;
        p {
          span {
            i {
              margin-left: 20px;
              cursor: pointer;
              font-size: 18px;
              transition: transform 0.3s ease-in-out;
            }
            &:nth-child(1) {
              &:hover {
                color: #fe036e;
              }
            }
            &:nth-child(2) {
              &:hover i {
                color: #409eff;
                transform: rotate(180deg);
              }
            }
          }
        }
      }
      ul {
        background-color: #fff;
        width: 100%;
        height: calc(45vh - 27px);
        overflow: scroll;
        li {
          padding: 5px;
          display: flex;
          &:hover {
            background-color: #dedede91;
          }
          &:hover .play_handler_button {
            opacity: 1;
          }
          .play_flag {
            width: 5%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fe036e;
            font-size: 16px;
          }
          .play_name {
            width: 45%;
            color: #333;
            font-size: 14px;
            cursor: pointer;
            font-weight: 700;
          }
          .play_handler_button {
            opacity: 0;
            width: 15%;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              margin: 0 5px;
              font-size: 16px;
              cursor: pointer;
            }
          }
          .play_artists {
            font-size: 12px;
            width: 20%;
            color: #6f6f6f;
          }
          .play_time {
            width: 15%;
            text-align: center;
          }
          .isplay_music {
            color: #fe036e;
          }
        }
      }
    }
  }
}
</style>