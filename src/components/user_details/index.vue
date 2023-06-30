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
            <p>
              <el-button type="primary" plain
                ><el-icon><Plus /></el-icon>关注</el-button
              >
              <el-button
                v-if="
                  user_info.profile.artistId &&
                  user_info.profile.artistId != null
                "
                type="success"
                plain
                @click="clickSkipSingerDetails(user_info.profile.artistId)"
                ><el-icon><Mic /></el-icon>歌手页</el-button
              >
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
            <p>
              <span>{{ user_info.profile.follows }}</span>
              <span>关注</span>
            </p>
            <el-divider direction="vertical" />
            <p>
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
      <div
        class="songSheet_list"
        v-if="
          user_songSheetList_create.length > 0 &&
          user_songSheetList_collect.length > 0
        "
      >
        <div v-if="user_songSheetList_create.length > 0">
          <h2>{{ user_info.profile.nickname }}创建的歌单</h2>
          <div>
            <div
              v-for="item in user_songSheetList_create"
              :key="item.id"
              @click="clickSkipSongSheetDetails(item.id)"
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
          <h2>{{ user_info.profile.nickname }}收藏的歌单</h2>
          <div>
            <div
              v-for="item in user_songSheetList_collect"
              :key="item.id"
              @click="clickSkipSongSheetDetails(item.id)"
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
import { defineComponent, ref } from "vue";
import { Plus, Mic, Male, Female, Headset } from "@element-plus/icons-vue";
import goBack from "@/components/tool_components/goBack.vue";
import {
  getUserDetailsapi,
  getUserSongSheetDetailsapi,
} from "@/api/userDetailsApi";
import { useRoute, useRouter } from "vue-router";
import { stamp_time, getProvince, getCity } from "@/assets/public";
import Loading from "../tool_components/loading.vue";
export default defineComponent({
  name: "userDetails",
  components: {
    goBack,
    Loading,
    Plus,
    Mic,
    Male,
    Female,
    Headset,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let user_info = ref({});
    let user_songSheetList_create = ref([]);
    let user_songSheetList_collect = ref([]);
    /**
     * 点击跳转歌单详情页面
     * @param {string |number} songSheetId
     */
    function clickSkipSongSheetDetails(songSheetId) {
      // TODO:
      console.log(`歌单id:${songSheetId}`);
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
     * 获取用户详情
     * @param { String | Number} id 用户id
     */
    async function getUserDetails(id) {
      const { data: res } = await getUserDetailsapi(id);
      console.log(res);
      if (res.code === 200) {
        user_info.value = res;
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
      if (res.code === 200) {
        user_songSheetList_create.value = res.playlist.filter((item) => {
          return item.userId == route.params.userId;
        });
        user_songSheetList_collect.value = res.playlist.filter((item) => {
          return item.userId != route.params.userId;
        });
      }
    }
    getUserDetails(route.params.userId);
    getUserSongSheetDetails(route.params.userId, 100, 1);
    return {
      user_info,
      user_songSheetList_create,
      user_songSheetList_collect,
      route,
      stamp_time,
      getProvince,
      getCity,
      clickSkipSongSheetDetails,
      clickSkipSingerDetails,
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
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
          span {
            &:nth-child(1) {
              font-size: 18px;
            }
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
  .songSheet_list {
    padding: 0 10px;
    margin-top: 20px;
    > div {
      margin: 5px 0;
      h2 {
        border-bottom: 3px solid #409eff;
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