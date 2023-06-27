<template>
  <div class="user">
    <goBack></goBack>
    <Loading
      v-if="JSON.stringify(user_info) == '{}'"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="info" v-else>
      <div class="info_left">
        <img
          v-lazy="user_info.profile.avatarUrl + '?param=300y300'"
          :alt="user_info.profile.nickname"
          :title="user_info.profile.nickname"
        />
      </div>
      <div class="info_right">
        <div class="info_top_name">
          <p>{{ user_info.profile.nickname }}</p>
          <p>
            <el-button type="primary" plain
              ><el-icon><Plus /></el-icon>关注</el-button
            >
            <el-button
              v-if="
                user_info.profile.artistId && user_info.profile.artistId != null
              "
              type="success"
              plain
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
              <img v-lazy="user_info.identify.imageUrl" />
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
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Plus, Mic, Male, Female } from "@element-plus/icons-vue";
import goBack from "@/components/tool_components/goBack.vue";
import { getUserDetailsapi } from "@/api/userDetailsApi";
import { useRoute } from "vue-router";
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
  },
  setup() {
    let route = useRoute();
    let user_info = ref({});
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
    getUserDetails(route.params.userId);
    return {
      user_info,
      route,
      stamp_time,
      getProvince,
      getCity,
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
}
</style>