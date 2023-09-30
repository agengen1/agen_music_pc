<template>
  <div class="events">
    <div class="info" v-for="item in followList[pageNO].event" :key="item.id">
      <div class="left">
        <img
          v-lazy="item.user.avatarUrl + '?param=120y120'"
          :alt="item.user.nickname"
        />
      </div>
      <div class="right">
        <p class="person_content">
          <span
            class="ncname"
            @click="clickUserNameSkip_doc(item.user.userId)"
            >{{ item.user.nickname }}</span
          >
          <span v-if="item.user.avatarDetail">
            <img
              v-lazy="item.user.avatarDetail.identityIconUrl + '?param=20y20'"
            />
          </span>
          <span v-if="item.type === 56" class="label_title">分享网页</span>
          <span v-if="item.type === 18" class="label_title">分享单曲</span>
          <span v-if="item.type === 17" class="label_title">分享节目</span>
          <span v-if="item.type === 21" class="label_title">分享MV</span>
          <span v-if="item.type === 41" class="label_title">分享视频</span>
          <span v-if="item.type === 13" class="label_title">分享歌单</span>
          <span v-if="item.type === 22" class="label_title">转发</span>
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
        <p v-else-if="item.type === 22" class="body_content">
          转发内容暂时无法查看
          <a
            class="skip_W"
            href="https://music.163.com/#/friend"
            target="_blank"
            >(请前往网易云音乐查看)</a
          >
        </p>
        <p v-else-if="item.type === 41" class="body_content">
          视频功能暂未实现！(^_^)
        </p>
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
        <!-- 单曲 -->
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
        <!-- 节目 -->
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
              v-if="item.treeJson_data.program.mainSong"
              @click="
                clickMuiscName_Skpi_doc(item.treeJson_data.program.mainSong.id)
              "
            >
              {{ item.treeJson_data.program.name }}
            </span>
            <span
              v-else
              class="songName"
              @click="clickMuiscName_Skpi_doc(null)"
            >
              {{ item.treeJson_data.program.name }}
            </span>
            <span class="singerName" v-if="item.treeJson_data.program.mainSong">
              {{ computeSingerAs(item.treeJson_data.program.mainSong.artists) }}
            </span>
          </div>
        </div>
        <!-- 歌单 -->
        <div class="webPag" v-if="item.type === 13">
          <div class="webPag_L">
            <img
              v-lazy="
                item.treeJson_data.playlist.coverImgUrl + '?param=120y120'
              "
              :alt="item.treeJson_data.playlist.name"
              :title="item.treeJson_data.playlist.name"
              @click="clickSongSheetNameSkip(item.treeJson_data.playlist.id)"
            />
          </div>
          <div class="webPag_R">
            <span
              @click="clickSongSheetNameSkip(item.treeJson_data.playlist.id)"
              >{{ item.treeJson_data.playlist.name }}</span
            >
          </div>
        </div>
        <!-- MV -->
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
        <!-- 网页 -->
        <div class="webPag" v-if="item.type === 56">
          <div class="webPag_L">
            <img
              v-lazy="item.treeJson_data.resource.coverImgUrl + '?param=60y60'"
              :alt="item.treeJson_data.resource.title"
              :title="item.treeJson_data.resource.title"
              @click="clickSkpiWebPag(item.treeJson_data.resource.webviewUrl)"
            />
          </div>
          <div class="webPag_R">
            <span
              @click="clickSkpiWebPag(item.treeJson_data.resource.webviewUrl)"
              >{{ item.treeJson_data.resource.title }}</span
            >
          </div>
        </div>
        <!-- 转发··暂时没有实现 -->
        <!-- 视频··暂时没有实现 -->
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
          <el-button type="primary" link :icon="Pointer" disabled
            >({{ item.info.likedCount }})</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="primary" link disabled
            >转发({{ item.info.shareCount }})</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="primary" link disabled
            >评论({{ item.info.commentCount }})</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  stamp_time,
  computeSingerAs,
  FollowWordHighlight,
  FollowA_userNameHighlight,
  playCountTransform,
  computeMusicTimeDuration,
} from "@/assets/public";
import { Pointer } from "@element-plus/icons-vue";
import { getNetEaseCloudNickName_api } from "@/api/followApi";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "events",
  props: {
    pageNO: {
      type: Number,
      required: true,
    },
    followList: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    let store = useStore();
    let router = useRouter();

    /**
     * clickMuiscName_Skpi_doc
     * @param {number} id
     * 功能::点击跳转音乐详情页面
     */
    function clickMuiscName_Skpi_doc(id) {
      ElMessage.closeAll();
      if (!id) {
        return ElMessage({
          type: "warning",
          message: "功能暂未开发",
        });
      }
      // DOTO:
      router.push("/layout/home/songDetails/" + id);
    }
    /**
     * clickPlayIcon_playMusic
     * @param {object} music_data
     * 功能：点击播放icon,播放音乐——添加到音乐播放列表
     */
    function clickPlayIcon_playMusic(music_data) {
      ElMessage.closeAll();
      if (!music_data) {
        return ElMessage({
          type: "warning",
          message: "功能暂未开发",
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
          getNetEaseCloudNickName(singerName).then((res) => {
            //跳转用户详情

            if (res) {
              router.push(`/layout/home/userDetails/${res}`);
            } else {
              ElMessage({
                type: "error",
                message: "跳转失败！",
              });
            }
          });
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
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 点击跳转歌单详情页
     * @param {string|number} id 歌单id
     */
    function clickSongSheetNameSkip(id) {
      router.push(`/layout/home/songSheetDetail/${id}`);
    }
    /**
     * 根据nickname获取userid
     * @param {string} nickname  用户nickname
     */
    async function getNetEaseCloudNickName(nickname) {
      const { data: res } = await getNetEaseCloudNickName_api(nickname);
      if (res && res.code === 200) {
        return res.nicknames[nickname];
      }
    }
    return {
      clickMuiscName_Skpi_doc,
      clickPlayIcon_playMusic,
      clickSkpiWebPag,
      zoomFollowImg,
      clickAct_SingerNameSkpi_dom,
      clickMvSkipDetails,
      clickLookedImg,
      stamp_time,
      computeSingerAs,
      FollowWordHighlight,
      FollowA_userNameHighlight,
      playCountTransform,
      computeMusicTimeDuration,
      clickUserNameSkip_doc,
      clickSongSheetNameSkip,
      Pointer,
    };
  },
});
</script>

<style lang='less' scoped>
.events {
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
        .skip_W {
          color: #409eff;
          &:hover {
            text-decoration: underline;
          }
        }
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
</style>