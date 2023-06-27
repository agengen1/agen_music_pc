<template>
  <div
    class="playControl"
    @mouseenter="playControl_MouseIn"
    @mouseleave="playControl_MouseOut"
  >
    <div class="playControl_box">
      <!-- 是否锁定控制 -->
      <div class="lock_control">
        <el-icon @click="islocked = !islocked" v-if="islocked"
          ><Lock
        /></el-icon>
        <el-icon @click="islocked = !islocked" v-else><Unlock /></el-icon>
      </div>
      <div class="content margin_layout">
        <div class="left">
          <div class="music_img">
            <img
              v-lazy="music_info.imgUrl + '?param=550y550'"
              :alt="music_info.name"
              :title="music_info.name"
            />
          </div>
          <div class="music_progress">
            <div class="other_info">
              <span class="text_exceed_hide_one">{{ music_info.name }}</span>
              <p>
                <span>{{ computeMusicTimeDuration(playMusic_time) }}</span> /
                <span>{{ computeMusicTimeDuration(music_info.playTime) }}</span>
              </p>
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
            <van-icon name="like-o" />
            <van-icon name="like" />
          </p>
          <p>
            <el-icon><Download /></el-icon>
          </p>
          <p>
            <van-icon name="comment-o" />
          </p>
          <p>
            <van-icon name="bars" :badge="playMusic_list.length" />
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
  ref,
  watch,
} from "vue";
import { Unlock, Lock, Download } from "@element-plus/icons-vue";
import { getMusic_isUsable_api, getMusic_url_api } from "@/api/publicApi";
import { computeMusicTimeDuration } from "@/assets/public";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
export default defineComponent({
  name: "playControl",
  components: {
    Unlock,
    Lock,
    Download,
  },
  setup() {
    let islocked = ref(false); //锁定就不会自动隐藏  true-表示锁定   false-不锁定
    let playControl_el = null; //鼠标移入移出操作元素
    let audio_el = null; //播放器操作元素
    let store = useStore(); //vuex 中的公共数据
    let playMusic_index = computed(() => {
      return store.state.player.playMusic_index;
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
        audio_el.currentTime = val_number / 1000;
        store.commit("player/SETPLAYMUSIC_TIME", val_number);
        play_handler();
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
    });
    watch(playMusic_index, () => {
      pause_handler();
      store.commit("player/SETPLAYMUSIC_TIME", 0);
      music_info.value = playMusic_list.value[playMusic_index.value];
      operation_set(music_info.value.id);
      setTimeout(() => {
        audio_el.load(); //用来重新加载audio音频路径
        store.commit("player/SETPLAYMUSIC_STATUS", true);
      }, 500);
    });
    watch(playMusic_volume, (newVal) => {
      audio_el.volume = newVal / 100;
    });
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
      nextTick(() => {
        audio_el.play();
        store.commit("player/SETPLAYMUSIC_STATUS", true);
      });
    }
    /**
     * 暂停处理函数
     */
    function pause_handler() {
      audio_el.pause();
      store.commit("player/SETPLAYMUSIC_STATUS", false);
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
      console.log("播放完成");
      info_prompt("提示", "歌曲播放完毕!,自动播放下一首！");
      setTimeout(() => {
        play_nextSong_music();
      }, 400);
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
      if (index >= playMusic_list.value.length) {
        index = 0;
      }
      store.commit("player/SETPLAYMUSIC_INDEX", index);
    }

    /**
     * 获取歌曲是否可用
     * @param {string} id 歌曲id
     */
    async function getMusic_isUsable(id) {
      const { data: res } = await getMusic_isUsable_api(id);
      return res;
    }
    /**
     * 获取歌曲详情
     * @param {string} id 歌曲id
     */
    async function getMusic_url(id) {
      const { data: res } = await getMusic_url_api(id);
      if (res.code === 200) {
        music_urlInfo.value = markRaw(res.data[0]);
      }
    }
    /**
     * 信息提示框
     * @param {string} title
     * @param {string} message
     */
    function info_prompt(title, message) {
      ElNotification({
        title,
        message,
        position: "top-right",
      });
    }
    /**
     * 操作集合
     * 功能:用于简化调用
     * @param {number} id 歌曲id
     */
    async function operation_set(id) {
      let status = await getMusic_isUsable(id);
      if (status.success) {
        getMusic_url(id);
      } else {
        info_prompt("提示", status.message + "自动播放下一首！");
        play_nextSong_music();
      }
    }
    operation_set(music_info.value.id);
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
    };
  },
});
</script>

<style lang="less" scoped>
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
          width: 20%;
          height: 100%;
          display: flex;
          align-items: center;
          img {
            height: 90%;
            object-fit: cover;
          }
        }
        .music_progress {
          width: 80%;
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
              font: 500 14px "";
            }
            > p {
              margin-left: 10px;
              flex: 1;
              font: 500 14px "";
            }
          }
          .progress_bar {
            margin-top: 20px;
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
        p {
          flex: 1;
          font-size: 22px;
        }
        .volume {
          flex: 2;
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
  }
}
</style>