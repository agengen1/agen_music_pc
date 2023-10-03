<template>
  <div class="songDetails">
    <!-- 背景 -->
    <div class="backpic"></div>
    <goBack></goBack>
    <Loading
      title="加载中...."
      textColor="#409eff"
      v-if="JSON.stringify(song_info) == '{}'"
    ></Loading>
    <div class="content" v-else>
      <div class="content_left">
        <p>
          <img
            v-if="song_info.al"
            v-lazy="song_info.al.picUrl + '?param=400y400'"
            :alt="song_info.name"
            :title="song_info.name"
          />
        </p>
        <el-button
          class="download_btn"
          type="primary"
          color="#ff006d"
          size="large"
          :icon="Download"
          round
          @click="clickDownloadButton(song_info.id)"
          >下载这首歌</el-button
        >
      </div>
      <div class="content_right">
        <div class="header">
          <p class="text_exceed_hide_one">
            <span class="name_vip">
              {{ song_info.name }}
              <i v-if="song_info.fee === 1" class="vipDis">VIP单曲</i>
            </span>
            <span v-if="song_info.tns && song_info.tns.length > 0">
              (
              <span v-for="item in song_info.tns" :key="item">{{ item }}</span>
              )
            </span>
          </p>
          <p class="text_exceed_hide_one">
            歌手：
            <span
              v-for="item in song_info.ar"
              :key="item.id"
              @click="clickSingerName_Skpi_doc(item.id)"
            >
              &nbsp; {{ item.name }}&nbsp;
            </span>
          </p>
          <p class="text_exceed_hide_one">
            所属专辑：<span @click="clickSkipAlbum_doc(song_info.al.id)">{{
              song_info.al.name
            }}</span>

            <span v-if="song_info.al.tns && song_info.al.tns.length > 0">
              - ({{ song_info.al.tns[0] }})</span
            >
          </p>
          <p v-if="song_info.publishTime != 0">
            发行时间：<span>{{ stamp_time(song_info.publishTime) }}</span>
          </p>
        </div>
        <div class="middle_buttons">
          <el-button
            type="primary"
            round
            @click="clickPlayButton_playMusic(song_info)"
            ><el-icon :size="20"><VideoPlay /></el-icon>&nbsp;
            立即播放</el-button
          >
          <el-button
            type="success"
            round
            @click="clickButton_pushMusic(song_info.id)"
            ><el-icon :size="20"><FolderAdd /></el-icon>&nbsp; 收藏</el-button
          >
          <el-button type="info" plain round @click="clickCopySharelink()"
            ><el-icon :size="20"><Share /></el-icon>&nbsp; 分享</el-button
          >

          <el-button type="info" plain round @click="clickOpenLyric"
            ><el-icon :size="20"><ZoomIn /></el-icon>&nbsp;
            查看完整歌词</el-button
          >
        </div>
        <div class="lyric_content" ref="lyric_content">
          <ul class="ulLyric" ref="ulLyric" v-if="song_lyric.lyric_arr">
            <li
              v-for="(item, index) in song_lyric.lyric_arr"
              :key="item.Millisecond_time"
              :data-index="index"
              :class="{
                li_active:
                  route.params.songId == playMusic_ID &&
                  playMusic_time >= item.Millisecond_time &&
                  playMusic_time <= item.next_millisecond_time,
              }"
              class="text_exceed_hide_one"
            >
              {{ item.words }}
            </li>
          </ul>
          <p v-else class="Nolyric">此歌曲暂无歌词！</p>
        </div>
        <div class="hot_comments">
          <h2>热评 <van-icon name="fire" color="#ff006d" /></h2>
          <Loading
            title="加载中...."
            textColor="#409eff"
            v-if="hot_comment_flag"
          ></Loading>
          <ul v-else>
            <li v-for="item in hot_comment_list" :key="item.commentId">
              <div>
                <img
                  v-lazy="item.user.avatarUrl + '?param=150y150'"
                  :alt="item.user.nickname"
                  :title="item.user.nickname"
                />
              </div>
              <div>
                <p>
                  <span @click="clickUserNameSkip_doc(item.user.userId)">{{
                    item.user.nickname
                  }}</span>
                  <span>
                    <span v-if="item.user.avatarDetail != null" class="Aicon"
                      ><img v-lazy="item.user.avatarDetail.identityIconUrl"
                    /></span>
                    <span
                      v-if="
                        item.user.vipRights != null &&
                        item.user.vipRights.associator != null
                      "
                      class="Licon"
                      ><img v-lazy="item.user.vipRights.associator.iconUrl"
                    /></span>
                  </span>
                  <span> ：{{ item.content }}</span>
                </p>
                <p>
                  <span>
                    <span>{{ item.ipLocation.location }} </span>
                    <span> {{ item.timeStr }}</span>
                  </span>
                  <span>获赞{{ item.likedCount }}</span>
                </p>
              </div>
            </li>
          </ul>
          <el-empty
            v-if="hot_comment_list.length <= 0 && !hot_comment_flag"
            description="暂无热门评论"
          />
        </div>
        <div class="comments" v-if="comment_list.length > 0">
          <h2>
            最新热评 <el-icon color="#ff006d"><Clock /></el-icon>
          </h2>
          <div>
            <div class="comments_content">
              <Loading
                title="加载中...."
                textColor="#409eff"
                v-if="loading_flag"
              ></Loading>
              <ul v-else>
                <li v-for="item in comment_list" :key="item.commentId">
                  <div>
                    <img
                      v-lazy="item.user.avatarUrl + '?param=150y150'"
                      :alt="item.user.nickname"
                      :title="item.user.nickname"
                    />
                  </div>
                  <div>
                    <p>
                      <span @click="clickUserNameSkip_doc(item.user.userId)">{{
                        item.user.nickname
                      }}</span>
                      <span>
                        <span
                          v-if="item.user.avatarDetail != null"
                          class="Aicon"
                          ><img v-lazy="item.user.avatarDetail.identityIconUrl"
                        /></span>
                        <span
                          v-if="
                            item.user.vipRights != null &&
                            item.user.vipRights.associator != null
                          "
                          class="Licon"
                          ><img v-lazy="item.user.vipRights.associator.iconUrl"
                        /></span>
                      </span>
                      <span> ：{{ item.content }}</span>
                    </p>
                    <p class="beReplied" v-if="item.beReplied.length > 0">
                      <span @click="clickUserNameSkip_doc(item.user.userId)">{{
                        item.beReplied[0].user.nickname
                      }}</span>
                      <span> ：{{ item.beReplied[0].content }}</span>
                    </p>
                    <p class="otherinfo">
                      <span>
                        <span>{{ item.ipLocation.location }} </span>
                        <span> {{ item.timeStr }}</span>
                      </span>
                      <span>获赞{{ item.likedCount }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="comments_buttons" v-if="all_pages > 1">
              <el-button
                type="primary"
                :disabled="disabled_text == 'left'"
                @click="clickPreButton_PreMusic"
                ><el-icon :size="16"><ArrowLeftBold /></el-icon
                >上一页</el-button
              >
              <p>
                <span
                  >当前第<i>{{ pageNO }}</i
                  >页 </span
                >/
                <span>
                  共<i>{{ all_pages }}</i
                  >页</span
                >
              </p>
              <el-button
                type="primary"
                :disabled="disabled_text == 'right'"
                @click="clickNextButton_NextMusic"
                :loading="loading_flag"
                >下一页<el-icon :size="16"><ArrowRightBold /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer class="openLyric" v-model="openAllLyric" size="45%">
      <template v-slot:header>
        <p class="lyric_title">{{ song_info.name }} <span>(完整歌词)</span></p>
        <p class="lyric_copy">
          <el-button
            size="small"
            :icon="CopyDocument"
            type="primary"
            @click="click_lyricCopy(song_info.name, song_lyric.lyric_arr)"
            >复制歌词</el-button
          >
        </p>
      </template>
      <ul v-if="song_lyric.lyric_arr">
        <li v-for="item in song_lyric.lyric_arr" :key="item.Millisecond_time">
          {{ item.words }}
        </li>
      </ul>
      <p v-else class="Nolyric">此歌曲暂无歌词！</p>
    </el-drawer>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  ref,
  watch,
  nextTick,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getSongDetailsapi,
  getSongDetailsHotCommentapi,
  getSongDetailsCommentapi,
  getSongDetailsLyricapi,
  getSongDetailsNoVipDownloadUrl,
} from "@/api/songDetailsApi";
import {
  Back,
  Download,
  VideoPlay,
  Share,
  ZoomIn,
  FolderAdd,
  Clock,
  ArrowLeftBold,
  ArrowRightBold,
  CopyDocument,
} from "@element-plus/icons-vue";
import { stamp_time } from "@/assets/public";
import { useStore } from "vuex";
import downloadMusic from "@/utils/downloadMusic";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "songDetails",
  components: {
    Back,
    VideoPlay,
    Share,
    ZoomIn,
    FolderAdd,
    Clock,
    ArrowLeftBold,
    ArrowRightBold,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let store = useStore();
    let openAllLyric = ref(false); //全部歌词弹出框
    let song_info = ref({}); //歌曲详情
    let song_lyric = ref({}); //歌曲歌词
    let ulLyric = ref(); //滚动容器
    let roll_height; //滚动高度
    let li_active_el_height = 25; //每首歌词高度
    let index = ref(0); // index表示当前播放到歌词索引 -- 用来滚动歌词
    let hot_comment_list = ref([]); //表示热门评论
    let hot_comment_flag = ref(true); //表示热门评论加载状态

    let disabled_text = ref("left"); //上下一页按钮禁用 left表示上一页禁用 right表示下一页禁用
    let pageNO = ref(1); //分页页码
    let pageCount = ref(6); //每页多少条
    let pageComment_All_list = ref({}); //请求到的评论数据 (页数对应数据)
    let CountTotal = ref(0); //评论总条数
    let comment_list = ref([]); //表示评论列表
    let loading_flag = ref(false); //按钮加载状态
    let rgbaColor1 = ref(""); //随机16进制颜色1
    let rgbaColor2 = ref(""); //随机16进制颜色2
    let user_isLogin = computed(() => {
      return store.state.user.user_isLogin;
    });
    let all_pages = computed(() => {
      if (CountTotal.value > 0 && pageCount.value > 0) {
        return Math.ceil(CountTotal.value / pageCount.value);
      } else {
        return 1;
      }
    }); //表示共有多少页

    let playMusic_time = computed(() => {
      //当前播放音乐时间
      return store.state.player.playMusic_time;
    });
    let playMusic_ID = computed(() => {
      //当前播放音乐id
      return store.getters["player/playMusic_ID"];
    });
    onBeforeUpdate(() => {
      nextTick(function () {
        ulLyric.value = document.querySelector(".ulLyric");
      });
    });

    watch(playMusic_time, (newVal) => {
      if (newVal == 0) {
        if (ulLyric.value) {
          ulLyric.value.style.transform = `translateY(${0}px)`;
        }
      }
      if (route.params.songId == playMusic_ID.value) {
        let li_active_el = document.querySelector(".li_active");
        if (li_active_el != null) {
          index.value = li_active_el.getAttribute("data-index");
          roll_height = index.value * li_active_el_height;
          if (roll_height > 0) {
            if (ulLyric.value) {
              ulLyric.value.style.transform = `translateY(${-roll_height}px)`;
            }
          }
        }
      }
    });
    watch(
      () => route.params.songId,
      (newVal) => {
        if (newVal) {
          pageNO.value = 1;
          loading_flag.value = true;
          hot_comment_flag.value = true;
          getSongDetails(newVal);
          getSongDetailsLyric(newVal);
          getSongDetailsComment(newVal, pageCount.value, pageNO.value);
          getSongDetailsHotComment(newVal, 0);
        }
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
     * clickSkipAlbum_doc
     * @param {String} albumID 专辑ID
     * 功能：点击跳转，通过传递的参数跳转到歌单详情页
     */
    function clickSkipAlbum_doc(albumID) {
      router.push(`/layout/home/albumDetails/${albumID}`);
    }
    /**
     * 点击全部歌词弹出框未打开则弹出，否则相反
     */
    function clickOpenLyric() {
      if (openAllLyric.value) {
        openAllLyric.value = false;
      } else {
        openAllLyric.value = true;
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
     * 点击分享
     */
    function clickCopySharelink() {
      ElMessage.closeAll();
      copyToClipboard(window.location.href);
      ElMessage({
        type: "success",
        message: `分享链接复制成功：${window.location.href}`,
      });
    }
    /**
     * 点击复制歌词
     * @param {array}  lyric_arr 歌词数组
     */
    function click_lyricCopy(song_name, lyric_arr) {
      if (lyric_arr.length <= 0) {
        ElMessage({
          type: "warning",
          message: "暂无可复制歌词",
        });
      }
      let str = "";
      lyric_arr.forEach((el) => {
        str += el.words + "\n";
      });
      str = song_name + "\n" + "\n" + str;
      ElMessage.closeAll();
      copyToClipboard(str);
      ElMessage({
        type: "success",
        message: "复制歌词成功!",
      });
    }
    /**
     * clickPlayButton_playMusic
     * @param {object} music_data
     * 功能：点击播放按钮,播放音乐——添加到音乐播放列表
     */
    function clickPlayButton_playMusic(music_data) {
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
     * 点击上一页，请求上一页数据
     */
    function clickPreButton_PreMusic() {
      pageNO.value -= 1;
      if (pageNO.value <= 1) {
        disabled_text.value = "left";
      } else {
        disabled_text.value = "";
      }
      comment_list.value = pageComment_All_list.value[pageNO.value];
    }
    /**
     * 点击下一页，请求下一页数据
     */
    function clickNextButton_NextMusic() {
      loading_flag.value = true;
      pageNO.value += 1;
      if (pageNO.value >= all_pages.value) {
        disabled_text.value = "right";
      } else {
        disabled_text.value = "";
      }
      if (
        pageComment_All_list.value[pageNO.value] &&
        pageComment_All_list.value[pageNO.value].length > 0
      ) {
        comment_list.value = pageComment_All_list.value[pageNO.value];
        loading_flag.value = false;
        return;
      }
      getSongDetailsComment(
        route.params.songId,
        pageCount.value,
        pageNO.value,
        pageComment_All_list.value[pageNO.value - 1][
          pageComment_All_list.value[pageNO.value - 1].length - 1
        ].time
      );
    }
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 随机生成带有透明的16进制颜色
     */
    function createdRandomColor() {
      // 生成随机的RGB颜色值
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      // 生成随机的透明度值（0到1之间）
      const alpha = 0.1;

      // 将RGB颜色值转换为16进制表示形式
      const rgbToHex = function (c) {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      const color = "#" + rgbToHex(r) + rgbToHex(g) + rgbToHex(b);

      // 将透明度与颜色值合并
      const rgbaColorString = color + Math.round(alpha * 255).toString(16);

      return rgbaColorString;
    }
    /**
     * 点击下载歌曲按钮
     * @param {String} id  歌曲id
     */
    async function clickDownloadButton(id) {
      //两种情况，登录和未登录获取 歌曲api不同   下面用未登录获取
      const { data: res } = await getSongDetailsNoVipDownloadUrl(id);
      if (res && res.code === 200) {
        const obj = {
          music_name: song_info.value.name,
          music_url: res.data[0].url,
          music_type: res.data[0].type,
        };
        downloadMusic(obj);
      }
    }
    /**
     * 获取歌曲详情
     * @param {String} ids — 歌曲id，或多个歌曲id(用,分隔)
     */
    async function getSongDetails(ids) {
      const { data: res } = await getSongDetailsapi(ids);
      if (res && res.code === 200) {
        song_info.value = res.songs[0];
      }
    }
    /**
     * 歌曲歌词获取 - 包括处理歌词
     * @param {String} id — 歌曲id
     */
    async function getSongDetailsLyric(id) {
      const { data: res } = await getSongDetailsLyricapi(id);
      if (res && res.code === 200) {
        let obj = {};
        let all_arr = [];
        let strLyric = "";
        if (res.lrc.lyric.trim().length <= 0) {
          return;
        } else {
          let arr = res.lrc.lyric.slice(0, -1).split("\n");
          arr.forEach((e) => {
            //时间单位：毫秒
            obj = {};
            if (e.split("]")[1] !== undefined) {
              obj.words = e.split("]")[1].trim();
            } else {
              obj.words = e;
            }
            strLyric += obj.words + "\r\n";
            let time = e.split("]")[0].trim().split("[")[1];
            let m = 0;
            let s = 0;
            let ms = 0;
            if (time) {
              m = parseInt(time.split(":")[0]);
              s = parseInt(time.split(":")[1].split(".")[0]);
              ms = parseInt(time.split(":")[1].split(".")[1]);
            } else {
              m = 0;
              s = 0;
              ms = 0;
            }

            obj.Millisecond_time = (m * 60 + s) * 1000 + ms;
            all_arr.push(obj);
          });
          song_lyric.value.lyric_str = strLyric;
          song_lyric.value.lyric_arr = all_arr;
          song_lyric.value.lyric_arr.forEach((el, index) => {
            if (index >= song_lyric.value.lyric_arr.length - 1) {
              el.next_millisecond_time = song_info.value.dt;
            } else {
              el.next_millisecond_time =
                song_lyric.value.lyric_arr[index + 1].Millisecond_time;
            }
          });
        }
      }
    }
    /**
     * 歌曲热门评论获取
     * @param {String} id: 音乐 id
     * @param {String} type: 资源类型  ( 歌曲: 0 , mv: 1, 专辑: 2 , 歌单: 3 , 电台: 4, 视频: 5)
     */
    async function getSongDetailsHotComment(id, type) {
      const { data: res } = await getSongDetailsHotCommentapi(id, type);
      hot_comment_flag.value = false;

      if (res && res.code === 200) {
        hot_comment_list.value = res.hotComments;
      }
    }
    /**
     * 歌曲评论获取
     *@param {String} id  音乐 id
     *@param {String} limit  取出评论数量 , 默认为 20
     *@param {String} offset  偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
     *@param {String} before  分页参数,取上一页最后一项的 time 获取下一页数据(获取
     */
    async function getSongDetailsComment(id, limit, offset, before) {
      const { data: res } = await getSongDetailsCommentapi(
        id,
        limit,
        offset,
        before
      );
      loading_flag.value = false;
      if (res && res.code === 200) {
        if (pageNO.value == 1) {
          CountTotal.value = res.total;
        }
        if (!pageComment_All_list.value[pageNO.value]) {
          pageComment_All_list.value[pageNO.value] = res.comments;
        }
        if (res.comments.length > 0) {
          comment_list.value = res.comments;
        }
      }
    }
    rgbaColor1.value = createdRandomColor();
    rgbaColor2.value = createdRandomColor();
    return {
      roll_height,
      rgbaColor1,
      rgbaColor2,
      route,
      playMusic_ID,
      song_info,
      song_lyric,
      playMusic_time,
      openAllLyric,
      hot_comment_list,
      disabled_text,
      comment_list,
      pageComment_All_list,
      pageNO,
      all_pages,
      loading_flag,
      hot_comment_flag,
      stamp_time,
      clickSingerName_Skpi_doc,
      clickSkipAlbum_doc,
      clickOpenLyric,
      clickPlayButton_playMusic,
      clickDownloadButton,
      clickPreButton_PreMusic,
      clickNextButton_NextMusic,
      clickUserNameSkip_doc,
      click_lyricCopy,
      Download,
      CopyDocument,
      clickButton_pushMusic,
      clickCopySharelink,
    };
  },
});
</script>

<style lang="less" scoped>
.songDetails {
  width: 100%;
  .Nolyric {
    padding: 50px 0 0 220px;
    font-size: 20px;
    color: #ff006d;
  }
  .backpic {
    position: absolute;
    z-index: -20;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background-image: linear-gradient(
      to bottom,
      v-bind(rgbaColor1),
      v-bind(rgbaColor2),
      rgba(255, 255, 255, 0)
    );
  }
  .content {
    margin-top: 5px;
    width: 100%;
    display: flex;
    .content_left {
      width: 25%;
      p {
        width: 100%;
        img {
          width: 90%;
          object-fit: cover;
          border-radius: 10px;
        }
      }
      .download_btn {
        margin-top: 15px;
        margin-left: 5%;
        width: 80%;
        color: #fff;
      }
    }
    .content_right {
      width: 75%;
      padding: 5px 15px 0;
      .header {
        p {
          margin: 5px 0;
          color: black;
          &:nth-child(1) {
            font-size: 30px;
            span {
              &:nth-child(2) {
                font-size: 20px;
                color: #848484;
              }
            }
            .name_vip {
              display: flex;
              align-items: center;
              .vipDis {
                margin-left: 5px;
                padding: 2px 10px 2px 5px;
                border-radius: 10px;
                background-color: red;
                color: #fff;
                font-size: 14px;
              }
            }
          }
          &:nth-child(2) {
            color: #848484;
            font-size: 16px;
            span {
              cursor: pointer;
              color: #409eff;
              &:hover {
                text-decoration: underline;
                color: #ff006d;
              }
            }
          }
          &:nth-child(3) {
            color: #848484;
            font-size: 16px;
            span {
              &:nth-child(1) {
                cursor: pointer;
                color: #409eff;
                &:hover {
                  text-decoration: underline;
                  color: #ff006d;
                }
              }
            }
          }
          &:nth-child(4) {
            color: #848484;
            font-size: 16px;
          }
        }
      }
      .middle_buttons {
        width: 100%;
        margin-top: 15px;
        .el-button {
          width: 17%;
          height: 40px;
        }
      }
      .lyric_content {
        margin: 20px 0;
        width: 100%;
        height: 45vh;
        overflow: hidden;
        ul {
          padding-left: 20px;
          transition: all 0.3s;
          li {
            margin: 2px 0;
            font-size: 14px;
            transition: all 0.3s;
            height: 25px;
            line-height: 25px;
          }
          .li_active {
            color: #ff006d;
            font-size: 19px;
          }
        }
      }
      .hot_comments {
        margin-top: 10px;
        ul {
          width: 100%;
          li {
            display: flex;
            padding: 10px 0;
            border-top: 1px dotted #e6e6e6;
            width: 100%;
            div {
              &:nth-child(1) {
                width: 10%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  width: 80%;
                  object-fit: cover;
                  border-radius: 50%;
                }
              }
              &:nth-child(2) {
                width: 90%;
                p {
                  padding-right: 10px;
                  &:nth-child(1) {
                    font: 500 14px "华为楷书";
                    span {
                      height: 26px;
                      line-height: 26px;
                      &:nth-child(1) {
                        margin-right: 5px;
                        color: #409eff;
                        cursor: pointer;
                        font-weight: 700;
                        &:hover {
                          color: #ff006d;
                          text-decoration: underline;
                        }
                      }
                      &:nth-child(2) {
                        span {
                          margin: 0 2px;
                          display: inline-block;
                        }
                        .Aicon {
                          width: 18px;
                          img {
                            width: 100%;
                            object-fit: cover;
                          }
                        }
                        .Licon {
                          width: 45px;
                          img {
                            width: 100%;
                            object-fit: cover;
                          }
                        }
                      }
                    }
                  }
                  &:nth-child(2) {
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span {
                      &:nth-child(1) {
                        span {
                          margin: 0 5px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .comments {
        margin-top: 15px;
        width: 100%;
        height: 80vh;
        h2 {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #e6e6e6;
          i {
            margin-left: 5px;
          }
        }
        > div {
          height: 80vh;
          .comments_content {
            height: 85%;
            overflow: auto;
            ul {
              width: 100%;
              li {
                display: flex;
                padding: 10px 0;
                border-top: 1px solid #e6e6e6;
                width: 100%;
                div {
                  &:nth-child(1) {
                    width: 10%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                      width: 80%;
                      object-fit: cover;
                      border-radius: 50%;
                    }
                  }
                  &:nth-child(2) {
                    width: 90%;
                    p {
                      margin-right: 10px;
                      &:nth-child(1) {
                        font: 500 14px "华为楷书";
                        span {
                          height: 26px;
                          line-height: 26px;
                          &:nth-child(1) {
                            margin-right: 5px;
                            color: #409eff;
                            cursor: pointer;
                            font-weight: 700;
                            &:hover {
                              color: #ff006d;
                              text-decoration: underline;
                            }
                          }
                          &:nth-child(2) {
                            span {
                              margin: 0 2px;
                              display: inline-block;
                            }
                            .Aicon {
                              width: 18px;
                              img {
                                width: 100%;
                                object-fit: cover;
                              }
                            }
                            .Licon {
                              width: 45px;
                              img {
                                width: 100%;
                                object-fit: cover;
                              }
                            }
                          }
                        }
                      }
                    }
                    .beReplied {
                      position: relative;
                      padding: 5px 10px;
                      margin-top: 10px;
                      background-color: #f1f1f1;
                      border-radius: 5px;
                      font-size: 14px;
                      span {
                        &:nth-child(1) {
                          cursor: pointer;
                          color: #409eff;
                          &:hover {
                            color: #ff006d;
                            text-decoration: underline;
                          }
                        }
                      }
                      &::after {
                        content: "";
                        position: absolute;
                        top: -5px;
                        left: 10px;
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-bottom: 6px solid #f1f1f1;
                      }
                    }
                    .otherinfo {
                      margin-top: 15px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      span {
                        &:nth-child(1) {
                          span {
                            margin: 0 5px;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          .comments_buttons {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 10%;
            p {
              margin: 0 15px;
              span {
                font-size: 14px;
                i {
                  margin: 0 5px;
                  color: #409eff;
                }
              }
            }
          }
        }
      }
    }
  }
  .openLyric {
    .el-drawer__header {
      .lyric_title {
        font: 700 22px "华文楷书";
        color: #000;
        span {
          font-size: 14px;
          color: #848484;
        }
      }
      .lyric_copy {
        margin-right: 40px;
      }
    }
    ul {
      padding-left: 20px;
      li {
        margin: 5px 0;
        line-height: 25px;
        font: 500 14px "华文楷书";
      }
    }
  }
}
</style>