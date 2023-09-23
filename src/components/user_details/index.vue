<template>
  <div class="user">
    <goBack></goBack>
    <Loading
      v-if="JSON.stringify(user_info) == '{}' && user_info.profile == null"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div v-else>
      <div class="info">
        <div class="info_left">
          <img
            v-lazy="user_info.profile.avatarUrl + '?param=300y300'"
            :alt="user_info.profile.nickname"
            :title="user_info.profile.nickname"
          />
        </div>
        <div class="info_right">
          <div class="info_top_name">
            <p>
              {{ user_info.profile.nickname }}
            </p>
            <p v-if="user_login_id != user_info.profile.userId">
              <el-button
                type="success"
                :icon="Check"
                v-if="user_info.profile.followed"
                >已关注</el-button
              >
              <el-button type="primary" :icon="Plus" v-else>关注</el-button>

              <el-button
                v-if="
                  user_info.profile.artistId &&
                  user_info.profile.artistId != null
                "
                color="#6f10ff"
                type="success"
                @click="clickSkipSingerDetails(user_info.profile.artistId)"
                ><el-icon><Mic /></el-icon>歌手页</el-button
              >
            </p>
            <p v-else>
              <el-button :icon="EditPen" type="info">编辑个人资料</el-button>
            </p>
          </div>
          <div class="info_top_otherinfo">
            <div>
              <p>
                <span>Lv.</span><span>{{ user_info.level }}</span>
              </p>
              <p
                v-if="
                  user_info.profile.gender != 0 ||
                  user_info.profile.gender != null
                "
              >
                <el-icon
                  v-if="user_info.profile.gender == 1"
                  :size="24"
                  color="#409eff"
                  ><Male
                /></el-icon>
                <el-icon
                  v-if="user_info.profile.gender == 2"
                  :size="24"
                  color="#ff006d"
                  ><Female
                /></el-icon>
              </p>
            </div>
            <div class="info_top_identify">
              <p v-if="user_info.identify">
                <img v-lazy="user_info.identify.imageUrl + '?param=120y120'" />
                <span>{{ user_info.identify.imageDesc }}</span>
              </p>
            </div>
          </div>
          <el-divider />
          <div class="info_center_details">
            <p>
              <span>{{ user_info.profile.eventCount }}</span>
              <span>动态</span>
            </p>
            <el-divider direction="vertical" />
            <p @click="clickSkipFollowedList(user_info.profile.userId)">
              <span>{{ user_info.profile.follows }}</span>
              <span>关注</span>
            </p>
            <el-divider direction="vertical" />
            <p @click="clickSkipFansList(user_info.profile.userId)">
              <span>{{ user_info.profile.followeds }}</span>
              <span>粉丝</span>
            </p>
          </div>
          <div class="info_footer_details">
            <p v-if="user_info.profile.signature != ''">
              个人简介：{{ user_info.profile.signature }}
            </p>
            <p
              v-if="
                getProvince(user_info.profile.province) != null &&
                getCity(user_info.profile.city) != null
              "
            >
              所在地区：
              <span v-if="getProvince(user_info.profile.province) != null">{{
                getProvince(user_info.profile.province)
              }}</span>
              <span v-if="getCity(user_info.profile.city) != null"
                >-{{ getCity(user_info.profile.city) }}</span
              >
            </p>
            <p class="time">注册时间：{{ stamp_time(user_info.createTime) }}</p>
          </div>
        </div>
      </div>
      <!-- 最近播放 -->
      <div class="RecentlyPlayed" v-if="isPower">
        <div class="played_top" v-if="user_r_played.length > 0">
          <h2>听歌排行</h2>
          <div class="select_data">
            <span
              :class="{ isSelect_played: user_r_played_type === 1 }"
              @click="clickSwitchData_type(1)"
              >最近一周</span
            >
            <el-divider direction="vertical" />
            <span
              :class="{ isSelect_played: user_r_played_type === 0 }"
              @click="clickSwitchData_type(0)"
              >所有时间</span
            >
          </div>
        </div>
        <Loading
          v-if="r_played_flag"
          textColor="#409eff"
          title="加载中..."
        ></Loading>
        <div class="played_content" v-else>
          <ul>
            <li
              v-for="(item, index) in user_r_played"
              :key="item.song.id"
              :class="{ odd_backColor: index % 2 != 1 }"
            >
              <div class="played_index">{{ index + 1 }}</div>
              <div class="played_info">
                <div class="played_info_left text_exceed_hide_one">
                  <span
                    class="played_info_left_name text_exceed_hide_one"
                    @click="clickMuiscName_Skpi_doc(item.song.id)"
                    >{{ item.song.name }}</span
                  >
                  <span class="played_info_left_ar text_exceed_hide_one">
                    - {{ computeSingerAs(item.song.ar) }}</span
                  >
                </div>
                <div class="played_info_right">
                  <van-icon
                    name="play"
                    title="播放"
                    @click="clickPlayIcon_playMusic(item.song)"
                  />
                  <van-icon
                    name="plus"
                    title="添加播放列表"
                    @click="clickPlus_plusMusic(item.song)"
                  />
                  <span
                    v-if="item.song.mv > 0"
                    title="查看MV"
                    @click="clickMvSkipDetails(item.song.mv)"
                    >MV</span
                  >
                </div>
              </div>
              <div class="played_count">
                <!-- 次数展示 -->
                <Mbar
                  :barWidth="item.score"
                  :playCount="item.playCount"
                  :el_height="45"
                ></Mbar>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="songSheet_list"
        v-if="
          user_songSheetList_create.length > 0 &&
          user_songSheetList_collect.length > 0
        "
      >
        <div v-if="user_songSheetList_create.length > 0">
          <h2>
            {{ user_info.profile.nickname }}创建的歌单<span
              >({{ user_songSheetList_create.length }}首)</span
            >
          </h2>
          <div>
            <div
              v-for="item in user_songSheetList_create"
              :key="item.id"
              @click="clickSongSheetNameSkip(item.id)"
            >
              <img v-lazy="item.coverImgUrl + '?param=250y250'" />
              <p class="text_exceed_hide_two">{{ item.name }}</p>
              <div>
                <el-icon :size="18"><Headset /></el-icon>
                <span>{{ item.playCount }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="user_songSheetList_collect.length > 0">
          <h2>
            {{ user_info.profile.nickname }}收藏的歌单<span
              >({{ user_songSheetList_collect.length }}首)</span
            >
          </h2>
          <div>
            <div
              v-for="item in user_songSheetList_collect"
              :key="item.id"
              @click="clickSongSheetNameSkip(item.id)"
            >
              <img v-lazy="item.coverImgUrl + '?param=250y250'" />
              <p class="text_exceed_hide_two">
                {{ item.name }}
              </p>
              <div>
                <el-icon :size="18"><Headset /></el-icon>
                <span>{{ item.playCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无歌单数据" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import {
  Plus,
  Mic,
  Male,
  Female,
  Headset,
  Check,
  EditPen,
} from "@element-plus/icons-vue";
import {
  getUserDetailsapi,
  getUserSongSheetDetailsapi,
  getUserPlayRecordsapi,
} from "@/api/userDetailsApi";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  stamp_time,
  getProvince,
  getCity,
  computeSingerAs,
} from "@/assets/public";
import { ElMessage } from "element-plus";
import Loading from "../tool_components/loading.vue";
export default defineComponent({
  name: "userDetails",
  components: {
    Loading,
    Mic,
    Male,
    Female,
    Headset,
  },
  setup() {
    let store = useStore();
    let route = useRoute();
    let router = useRouter();
    let user_info = ref({}); //用户信息
    let user_songSheetList_create = ref([]); //用户创建歌单
    let user_songSheetList_collect = ref([]); //用户收藏歌单
    let user_login_id = computed(() => {
      return store.state.user.userinfo.userId;
    }); //登录者id
    let isPower = ref(true); //是否有访问权限; true-有
    let user_r_played = ref([]); //听歌排行数据
    let r_played_flag = ref(true); //听歌排行数据请求状态
    let user_r_played_type = ref(1); //type=1时只返回weekData(本周播放记录), type=0时返回allData(全部播放记录)
    watch(
      () => route.params.userId,
      (newVal) => {
        if (newVal) {
          getUserDetails(newVal);
          getUserSongSheetDetails(newVal, 100, 1);
          getUserPlayRecords(newVal, user_r_played_type.value);
        }
      },
      {
        immediate: true,
      }
    );
    /**
     * 点击跳转歌单详情页
     * @param {string|number} id 歌单id
     */
    function clickSongSheetNameSkip(id) {
      router.push(`/layout/home/songSheetDetail/${id}`);
    }
    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
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
     * clickPlus_plusMusic
     * @param {object} music_data
     * 功能：点击添加音乐列表,不播放音乐——添加到音乐播放列表
     */
    function clickPlus_plusMusic(music_data) {
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
      store.commit("player/ADDPLAYMUSIC_LIST_NOTPLAY", obj);
    }
    /**
     * 点击跳转歌手详情页面
     * @param {string |number} singerId
     */
    function clickSkipSingerDetails(singerId) {
      // TODO:
      router.push(`/layout/home/singerDetails/${singerId}`);
    }
    /**
     * 点击跳转关注列表详情
     * @param {number} userid 用户id
     */
    function clickSkipFollowedList(userid) {
      router.push(`/layout/home/followedList/${userid}`);
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
     * 点击跳转粉丝列表详情
     * @param {number} userid 用户id
     */
    function clickSkipFansList(userid) {
      router.push(`/layout/home/fansList/${userid}`);
    }
    /**
     * 点击切换数据展示
     * @param {number} type 类型code
     */
    function clickSwitchData_type(type) {
      user_r_played_type.value = type;
      r_played_flag.value = true;
      getUserPlayRecords(route.params.userId, user_r_played_type.value);
    }
    /**
     * 获取用户详情
     * @param { String | Number} id 用户id
     */
    async function getUserDetails(id) {
      const { data: res } = await getUserDetailsapi(id);
      if (res && res.code === 200) {
        user_info.value = res;
      }
    }
    /**
     * 获取用户播放记录
     * @param {String | number} id 用户id
     * @param {String | number} type 播放记录类型  type=1时只返回weekData(本周播放记录), type=0时返回allData(全部播放记录)
     */
    async function getUserPlayRecords(id, type) {
      const { data: res } = await getUserPlayRecordsapi(id, type);
      ElMessage.closeAll();
      r_played_flag.value = false;
      if (res && res.code === 200) {
        if (type === 1) {
          user_r_played.value = res.weekData;
        } else {
          user_r_played.value = res.allData;
        }
      } else {
        isPower.value = false;
        ElMessage({
          type: "warning",
          message: "播放记录，暂无访问权限！",
        });
      }
    }
    /**
     * 获取用户歌单
     * @param { String|Number } id 用户id
     * @param { String|Number } limit : 返回数量 , 默认为 30
     * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     */
    async function getUserSongSheetDetails(id, limit, offset) {
      const { data: res } = await getUserSongSheetDetailsapi(id, limit, offset);
      if (res && res.code === 200) {
        user_songSheetList_create.value = res.playlist.filter((item) => {
          return item.userId == route.params.userId;
        });
        user_songSheetList_collect.value = res.playlist.filter((item) => {
          return item.userId != route.params.userId;
        });
      }
    }

    return {
      isPower,
      user_info,
      user_songSheetList_create,
      user_songSheetList_collect,
      route,
      stamp_time,
      getProvince,
      getCity,
      clickSongSheetNameSkip,
      clickSkipSingerDetails,
      clickMvSkipDetails,
      clickSwitchData_type,
      clickPlayIcon_playMusic,
      clickPlus_plusMusic,
      clickSkipFollowedList,
      clickSkipFansList,
      Plus,
      Check,
      EditPen,
      user_login_id,
      r_played_flag,
      user_r_played,
      user_r_played_type,
      computeSingerAs,
      clickMuiscName_Skpi_doc,
    };
  },
});
</script>

<style lang='less' scoped>
.user {
  width: 100%;

  .info {
    margin-top: 10px;
    width: 100%;
    display: flex;
    .info_left {
      width: 22%;
      img {
        width: 90%;
        object-fit: cover;
        border-radius: 10px;
      }
    }
    .info_right {
      width: 78%;
      .el-divider--horizontal {
        margin: 15px 0 10px 0;
      }
      .el-divider--vertical {
        height: 2em;
      }
      .info_top_name {
        display: flex;
        height: 40px;
        p {
          margin-right: 25px;
          font: 500 24px "华文楷书";
          color: #000;
          button {
            margin-right: 15px;
            i {
              margin-right: 5px;
            }
          }
        }
      }
      .info_top_otherinfo {
        div {
          &:nth-child(1) {
            display: flex;
            align-items: center;
            p {
              &:nth-child(1) {
                margin-right: 10px;
                padding: 2px 8px;
                font: 700 16px "隶书";
                color: red;
                border: 1px solid red;
                border-radius: 15px;
                font-style: italic;
              }
            }
          }
        }
        .info_top_identify {
          display: flex;
          align-items: center;
          margin: 6px 0;
          p {
            height: 30px;
            font: 500 14px "华文楷书";
            img {
              height: 90%;
              object-fit: cover;
              margin-right: 5px;
            }
          }
        }
      }
      .info_center_details {
        height: 40px;
        display: flex;
        align-items: center;
        p {
          margin: 0 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font: 500 14px "华文楷书";
          span {
            &:nth-child(1) {
              font-size: 18px;
            }
          }
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
      .info_footer_details {
        p {
          margin: 5px 0;
          font: 500 14px "华文楷书";
        }
      }
    }
  }
  .RecentlyPlayed {
    margin-top: 20px;
    padding: 0 10px;
    .played_top {
      padding: 5px 0;
      color: #000;
      border-bottom: 3px solid #409eff;
      display: flex;
      justify-content: space-between;
      .select_data {
        display: flex;
        align-items: center;
        span {
          padding: 2px 5px;
          font-weight: 700;
          cursor: pointer;
        }
        .isSelect_played {
          background-color: #40a0ff36;
          color: #409eff;
          border-radius: 5px;
        }
      }
    }
    .played_content {
      > ul {
        padding-top: 10px;
        width: 100%;
        > li {
          width: 100%;
          height: 45px;
          display: flex;
          &:hover {
            background-color: #ababab2d;
          }
          &:hover .played_info .played_info_right {
            opacity: 1;
          }
          .played_index {
            width: 5%;
            display: flex;
            justify-content: center;
            align-items: center;
            font: 700 16px "";
          }
          .played_info {
            width: 60%;
            display: flex;
            .played_info_left {
              width: 70%;
              display: flex;
              align-items: center;
              .played_info_left_name {
                margin-right: 4px;
                font: 700 14px "";
                color: #000;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                  color: #409eff;
                }
              }
              .played_info_left_ar {
                font-size: 12px;
                color: #b9b9b9;
              }
            }
            .played_info_right {
              padding-left: 10px;
              transition: all 0.2s;
              opacity: 0;
              width: 30%;
              display: flex;
              align-items: center;
              i {
                margin: 0 8px;
                color: #737373;
                cursor: pointer;
                font-size: 22px;
              }
              span {
                margin: 0 8px;
                padding: 1px 5px;
                border: 1px solid #ff006d;
                background-color: #ff006f4a;
                color: #ff006d;
                cursor: pointer;
              }
            }
          }
          .played_count {
            height: 45px;
            width: 35%;
          }
        }
      }
    }
  }
  .songSheet_list {
    padding: 0 10px;
    margin-top: 20px;
    > div {
      margin: 5px 0;
      h2 {
        color: #000;
        padding: 5px 0;

        border-bottom: 3px solid #409eff;
        span {
          color: #409eff;
          font-size: 14px;
        }
      }
      > div {
        margin: 5px 0;
        display: flex;
        flex-wrap: wrap;
        > div {
          cursor: pointer;
          width: 14%;
          margin: 10px 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          img {
            width: 100%;
            object-fit: cover;
            border-radius: 10px;
          }
          p {
            padding: 10px;
            &:hover {
              text-decoration: underline;
              color: #409eff;
            }
          }
          > div {
            position: absolute;
            padding-left: 10px;
            left: 0;
            top: 0;
            width: 70%;
            display: flex;
            align-items: center;
            height: 25px;
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 35px;
            color: #fff;
            font: 500 14px "华文楷书";
            span {
              margin: 0 5px;
            }
          }
        }
      }
    }
  }
}
</style>