<template>
  <div class="follow margin_layout">
    <div class="follow_content">
      <div class="top">动态</div>
      <Loading
        v-if="follow_flag"
        textColor="#409eff"
        title="加载中..."
      ></Loading>
      <div class="content" v-else>
        <div
          class="info"
          v-for="item in followList[pageNO].event"
          :key="item.id"
        >
          <div class="left">
            <img
              v-lazy="item.user.avatarUrl + '?param=120y120'"
              :alt="item.user.nickname"
            />
          </div>
          <div class="right">
            <p class="person_content">
              <span class="ncname">{{ item.user.nickname }}</span>
              <span v-if="item.user.avatarDetail">
                <img
                  v-lazy="
                    item.user.avatarDetail.identityIconUrl + '?param=20y20'
                  "
                />
              </span>
              <span
                v-if="item.type != 35 && item.type != 56"
                class="label_title"
                >{{
                  item.info.commentThread.resourceInfo.name.split("：")[0]
                }}</span
              >
              <span v-if="item.type === 56" class="label_title">分享网页</span>
            </p>
            <p class="followTime">{{ stamp_time(item.eventTime, true) }}</p>
            <p
              v-if="item.type === 18 && item.actId > 0"
              class="body_content"
              v-html="
                FollowWordHighlight({
                  text: item.treeJson_data.msg,
                  actArr: item.bottomActivityInfos,
                })
              "
              @click="clickAct_SingerNameSkpi_dom($event)"
            ></p>
            <p
              v-else
              class="body_content"
              v-html="
                FollowA_userNameHighlight({
                  text: item.treeJson_data.msg,
                  actArr: item.bottomActivityInfos,
                })
              "
              @click="clickAct_SingerNameSkpi_dom($event)"
            ></p>
            <div class="song" v-if="item.type === 18">
              <div class="song_L">
                <img
                  v-lazy="item.treeJson_data.song.album.picUrl + '?param=60y60'"
                  :alt="item.treeJson_data.song.name"
                  :title="'点击播放 ' + item.treeJson_data.song.name"
                  @click="clickPlayIcon_playMusic(item.treeJson_data.song)"
                />
                <div
                  class="playIcon"
                  @click="clickPlayIcon_playMusic(item.treeJson_data.song)"
                >
                  <van-icon name="play" />
                </div>
              </div>
              <div class="song_R">
                <span
                  class="songName"
                  @click="clickMuiscName_Skpi_doc(item.treeJson_data.song.id)"
                >
                  {{ item.treeJson_data.song.name }}
                </span>
                <span class="singerName">
                  {{ computeSingerAs(item.treeJson_data.song.artists) }}
                </span>
              </div>
            </div>
            <div class="song" v-if="item.type === 17">
              <div class="song_L">
                <img
                  v-lazy="item.treeJson_data.program.img80x80 + '?param=60y60'"
                  :alt="item.treeJson_data.program.name"
                  :title="'点击播放 ' + item.treeJson_data.program.name"
                  @click="
                    clickPlayIcon_playMusic(item.treeJson_data.program.mainSong)
                  "
                />
                <div
                  class="playIcon"
                  @click="
                    clickPlayIcon_playMusic(item.treeJson_data.program.mainSong)
                  "
                >
                  <van-icon name="play" />
                </div>
              </div>
              <div class="song_R">
                <span
                  class="songName"
                  @click="
                    clickMuiscName_Skpi_doc(
                      item.treeJson_data.program.mainSong.id
                    )
                  "
                >
                  {{ item.treeJson_data.program.name }}
                </span>
                <span class="singerName">
                  {{
                    computeSingerAs(item.treeJson_data.program.mainSong.artists)
                  }}
                </span>
              </div>
            </div>
            <div class="mv" v-if="item.type === 21">
              <img
                v-lazy="item.treeJson_data.mv.imgurl16v9 + '?param=450y260'"
                :alt="item.treeJson_data.mv.name"
                :title="item.treeJson_data.mv.name"
                @click.stop="clickMvSkipDetails(item.treeJson_data.mv.id)"
              />
              <div
                class="mask"
                @click.stop="clickMvSkipDetails(item.treeJson_data.mv.id)"
              >
                <van-icon name="play" />
              </div>
              <div class="playCount">
                <van-icon name="play" />{{
                  playCountTransform(item.treeJson_data.mv.playCount)
                }}
              </div>
              <div class="mvTime" v-if="item.treeJson_data.mv.duration > 0">
                {{ computeMusicTimeDuration(item.treeJson_data.mv.duration) }}
              </div>
              <p
                class="text_exceed_hide_one mvName"
                @click.stop="clickMvSkipDetails(item.treeJson_data.mv.id)"
              >
                {{ item.treeJson_data.mv.name }}
              </p>
              <p class="mvSingerName">{{ item.treeJson_data.mv.artistName }}</p>
            </div>
            <div class="webPag" v-if="item.type === 56">
              <div class="webPag_L">
                <img
                  v-lazy="
                    item.treeJson_data.resource.coverImgUrl + '?param=60y60'
                  "
                  :alt="item.treeJson_data.resource.title"
                  :title="item.treeJson_data.resource.title"
                  @click="
                    clickSkpiWebPag(item.treeJson_data.resource.webviewUrl)
                  "
                />
              </div>
              <div class="webPag_R">
                <span
                  @click="
                    clickSkpiWebPag(item.treeJson_data.resource.webviewUrl)
                  "
                  >{{ item.treeJson_data.resource.title }}</span
                >
              </div>
            </div>
            <div
              class="follow_img"
              v-if="item.pics.length === 1 && item.type != 56"
            >
              <img
                v-lazy="item.pics[0].originUrl"
                data-inOut="false"
                @click="zoomFollowImg($event)"
                title="点击放大查看"
              />
            </div>
            <div
              class="follow_img_alls"
              v-if="item.pics.length > 1 && item.type != 56"
            >
              <img
                v-for="(item_pic, index) in item.pics"
                :key="index"
                v-lazy="item_pic.pcRectangleUrl"
                data-inOut="false"
                @click="clickLookedImg(item_pic.originUrl)"
                title="点击查看"
              />
            </div>
            <div class="operate">
              <el-button type="primary" link :icon="Pointer"
                >({{ item.info.likedCount }})</el-button
              >
              <el-divider direction="vertical" />
              <el-button type="primary" link
                >转发({{ item.info.shareCount }})</el-button
              >
              <el-divider direction="vertical" />
              <el-button type="primary" link
                >评论({{ item.info.commentCount }})</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="paginatio">
        <el-button
          type="primary"
          :icon="ArrowLeftBold"
          :disabled="leftDisabled"
          @click="clickPre_data"
          >上一页</el-button
        >
        <p>
          当前第<span>{{ pageNO }}</span
          >页
        </p>
        <el-button type="primary" :loading="follow_flag" @click="clickNext_data"
          >下一页<el-icon class="el-icon--right"><ArrowRightBold /></el-icon
        ></el-button>
      </div>
    </div>
    <div class="user_info"></div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import { getMyFollowerData_api } from "@/api/followApi";
import {
  ArrowLeftBold,
  ArrowRightBold,
  Pointer,
} from "@element-plus/icons-vue";
import {
  stamp_time,
  computeSingerAs,
  FollowWordHighlight,
  FollowA_userNameHighlight,
  playCountTransform,
  computeMusicTimeDuration,
} from "@/assets/public";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "follow",
  components: { ArrowRightBold },
  setup() {
    let router = useRouter();
    let store = useStore();
    let pageNO = ref(1); //当前第几页
    let followList = reactive({}); //动态数据
    let pageCount = ref(30); //每一页多少条数据
    let follow_flag = ref(true); //请求状态 true请求中
    let leftDisabled = computed(() => {
      return pageNO.value <= 1;
    }); //左边按钮是否禁用
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
      ElMessage.closeAll();
      if (music_data.fee === 0) {
        return ElMessage({
          message: "此歌曲暂无版权！",
          type: "warning",
        });
      }
      let obj = {
        name: music_data.name,
        id: music_data.id,
        playTime: music_data.duration,
        imgUrl: music_data.album.picUrl,
        album: {
          id: music_data.album.id,
          name: music_data.album.name,
          imgUrl: music_data.album.picUrl,
        },
        artists: music_data.artists,
      };
      store.commit("player/ADDPLAYMUSIC_LIST", obj);
    }
    /**
     * 点击跳转网页
     * @param {string} webPaguUrl  网页地址
     */
    function clickSkpiWebPag(webPaguUrl) {
      window.open(webPaguUrl);
    }
    /**
     * 点击放大查看图片
     */
    function zoomFollowImg(e) {
      if (JSON.parse(e.target.dataset.inout)) {
        e.target.dataset.inout = "false";
        e.target.style.width = "30%";
        e.target.style.cursor = "zoom-in";
        e.target.title = "点击放大查看";
      } else {
        e.target.dataset.inout = "true";
        e.target.style.width = "100%";
        e.target.style.cursor = "zoom-out";
        e.target.title = "点击取消查看";
      }
    }
    /**
     * 点击跳转话题/点击@歌手名称跳转详情-事件代理（事件绑定在父级身上）
     * @param {number} actId  话题id
     */
    function clickAct_SingerNameSkpi_dom(e) {
      if (e.target.tagName === "SPAN") {
        ElMessage.closeAll();
        if (parseInt(e.target.dataset.actid) > 0) {
          console.log(e.target.innerText);
          console.log("跳转", e.target.dataset.actid);
        } else {
          ElMessage({
            type: "error",
            message: "跳转失败！",
          });
        }
      } else if (e.target.tagName === "I") {
        ElMessage.closeAll();
        let singerName = e.target.innerText;
        let arr = singerName.match(/@{1}/g);
        if (arr.length === 1) {
          singerName = singerName.trim().slice(1);
          console.log("跳转", singerName);
        } else {
          ElMessage({
            type: "error",
            message: "跳转失败！",
          });
        }
      } else if (e.target.tagName === "A") {
        e.preventDefault();
        let src = e.target.dataset.href.replaceAll(".=+*", "#");
        window.open(src);
      }
    }
    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
    }
    /**
     * 点击跳转站外查看图片
     * @param {string} src 图片链接
     */
    function clickLookedImg(src) {
      window.open(src);
    }
    /**
     * 点击上一页数据
     */
    function clickPre_data() {
      pageNO.value--;
    }
    /**
     * 点击下一页数据
     */
    function clickNext_data() {
      pageNO.value++;
      if (!followList[pageNO.value]) {
        follow_flag.value = true;
        let pre_lasttime = followList[pageNO.value - 1].lasttime;
        getMyFollowerData(pageCount.value, pre_lasttime, true);
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // 平滑滚动效果
        });
      }
    }

    /**
     * 获取动态消息
     * @param {number} pagesize 每页数据,默认 20
     * @param {number} lasttime : 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
     * @param { boolean }   flagScroll :标记是否需要滚动到某一处
     * @
     * 返回结果的type参数对应:
     * 18 分享单曲
     * 19 分享专辑
     * 17、28 分享电台节目
     * 22 转发
     * 39 发布视频
     * 35、13 分享歌单
     * 24 分享专栏文章
     * 41、21 分享视频
     */
    async function getMyFollowerData(pagesize, lasttime, flagScroll) {
      const { data: res } = await getMyFollowerData_api(pagesize, lasttime);
      follow_flag.value = false;
      if (res && res.code === 200) {
        if (res.event.length <= 0) {
          ElMessage.closeAll();
          ElMessage({
            type: "warning",
            message: "已经到底了！",
          });
          pageNO.value--;
        } else {
          followList[pageNO.value] = {
            event: res.event,
            lasttime: res.lasttime,
          };
          followList[pageNO.value].event.forEach((el) => {
            el["treeJson_data"] = JSON.parse(el.json);
          });

          if (flagScroll) {
            window.scrollTo({
              top: 0,
              behavior: "smooth", // 平滑滚动效果
            });
          }
        }
      }
    }
    getMyFollowerData(pageCount.value, 0, false);
    return {
      followList,
      pageNO,
      follow_flag,
      ArrowLeftBold,
      leftDisabled,
      Pointer,
      stamp_time,
      computeSingerAs,
      clickMuiscName_Skpi_doc,
      clickPlayIcon_playMusic,
      zoomFollowImg,
      FollowWordHighlight,
      clickAct_SingerNameSkpi_dom,
      clickMvSkipDetails,
      clickPre_data,
      clickNext_data,
      FollowA_userNameHighlight,
      playCountTransform,
      computeMusicTimeDuration,
      clickSkpiWebPag,
      clickLookedImg,
    };
  },
});
</script>

<style lang='less' scoped>
.follow {
  display: flex;
  min-height: 70vh;
  .follow_content {
    width: 70%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    .top {
      font-size: 18px;
      font-weight: 700;
      border-bottom: 3px solid #ff006d;
      padding-bottom: 5px;
    }
    .content {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .info {
        width: 100%;
        display: flex;
        padding: 20px 0 10px;
        border-bottom: 0.5px solid #e8e8e9;
        .left {
          padding-right: 1.5%;
          width: 7%;
          img {
            width: 98.5%;
            object-fit: cover;
            border-radius: 10px;
          }
        }
        .right {
          width: 93%;
          .person_content {
            display: flex;
            align-items: center;
            span {
              margin-left: 5px;
              font-size: 14px;
              color: #333;
              img {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                object-fit: cover;
              }
            }
            .ncname {
              margin-left: 0px;
              margin-right: 5px;
              color: #409eff;
              cursor: pointer;
              font-weight: 700;
              &:hover {
                text-decoration: underline;
              }
            }
            .label_title {
              padding: 1px 5px;
              font-size: 12px;
              color: #ff006d;
              background-color: #ff006d1a;
              border: 1px solid #dedede9e;
              border-radius: 10px;
            }
          }
          .followTime {
            color: #a8abb2;
            margin: 2px 0;
          }
          .body_content {
            color: #333;
            font-size: 16px;
            padding: 5px;
          }
          .song {
            padding: 10px;
            height: 50px;
            display: flex;
            background-color: #ededed;
            .song_L {
              position: relative;
              width: 50px;
              margin-right: 5px;
              cursor: pointer;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .playIcon {
                top: 8.5px;
                left: 8.5px;
                position: absolute;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 4px solid #898989;
                display: flex;
                justify-content: center;
                align-items: center;
                &:hover i {
                  color: #ff006d;
                }
                i {
                  font-size: 20px;
                  color: #898989;
                }
              }
            }
            .song_R {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              span {
                color: #333;
                font-size: 14px;
              }
              .songName {
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                  color: #409eff;
                }
              }
              .singerName {
                color: #8f8f8f;
                font-size: 12px;
              }
            }
          }
          .mv {
            position: relative;
            margin: 10px 1.5%;
            width: 45%;
            display: flex;
            flex-direction: column;
            align-items: center;

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
              right: 0;
              top: 72%;
              background-color: #00000061;
              color: #ffffff;
              font-size: 14px;
              border-radius: 5px;
              border-bottom-right-radius: 10px;
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
          .webPag {
            padding: 10px;
            height: 50px;
            display: flex;
            background-color: #ededed;
            .webPag_L {
              width: 50px;
              margin-right: 5px;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            .webPag_R {
              display: flex;
              align-items: center;
              span {
                color: #333;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                  color: #409eff;
                }
              }
            }
          }
          .follow_img {
            padding: 10px 5px;
            img {
              border: 1px solid #d6d6d6;
              transition: all 0.3s;
              width: 30%;
              cursor: zoom-in;
            }
          }
          .follow_img_alls {
            display: flex;
            flex-wrap: wrap;
            img {
              margin: 0.3vw;
              width: 9.5vw;
              height: 9.5vw;
              object-fit: cover;
              border: 1px solid #d6d6d6;
              cursor: pointer;
            }
          }
          .operate {
            margin: 10px 0 5px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            button {
              font-size: 12px;
            }
          }
        }
      }
    }
    .paginatio {
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        font-size: 14px;
        color: #333;
        span {
          margin: 0 2px;
          color: #409eff;
          font-style: italic;
        }
      }
      button {
        margin: 0 20px;
      }
    }
  }
  .user_info {
    border-left: 0.5px solid #e8e8e9;
    width: 30%;
  }
}
</style>