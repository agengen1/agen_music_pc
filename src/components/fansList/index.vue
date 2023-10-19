<template>
  <div class="fansList">
    <goBack></goBack>
    <Loading
      v-if="all_doc_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div v-else>
      <div class="userinfo">
        <img
          v-lazy="user_info.profile.avatarUrl + '?param=80y80'"
          :alt="user_info.profile.nickname"
        />
        <p>
          <span class="userinfo_name">{{ user_info.profile.nickname }}</span
          ><span>共{{ user_info.profile.followeds }}位粉丝</span>
        </p>
      </div>
      <p class="follwed_title">粉丝列表({{ user_info.profile.followeds }})</p>
      <Loading
        v-if="fansList_falg"
        textColor="#409eff"
        title="加载中..."
      ></Loading>
      <div class="follwed_content" v-else>
        <div
          class="info_content odd_backColor"
          v-for="item in fansList"
          :key="item.userId"
        >
          <div class="info_content_left">
            <img
              v-lazy="item.avatarUrl + '?param=80y80'"
              :alt="item.nickname"
            />
          </div>
          <div class="info_content_center">
            <p class="text_exceed_hide_one follow_name">
              <span
                class="follow_name_nickname"
                @click="clickUserNameSkip_doc(item.userId)"
                >{{ item.nickname }}</span
              >
              <span v-if="item.avatarDetail">
                <img
                  v-lazy="item.avatarDetail.identityIconUrl + '?param=50y50'"
              /></span>
              <span>
                <el-icon color="#409EFF" size="18px" v-if="item.gender === 1"
                  ><Male
                /></el-icon>
                <el-icon color="#ff006d" size="18px" v-if="item.gender === 2"
                  ><Female
                /></el-icon>
              </span>
            </p>
            <p class="text_exceed_hide_one follow_other">
              <span
                @click="click_typeSkipDoc({ uid: item.userId, type: 'event' })"
                >动态<span>({{ item.eventCount }})</span></span
              >
              <el-divider direction="vertical" />
              <span
                @click="
                  click_typeSkipDoc({ uid: item.userId, type: 'followed' })
                "
                >关注<span>({{ item.follows }})</span></span
              >
              <el-divider direction="vertical" />
              <span
                @click="click_typeSkipDoc({ uid: item.userId, type: 'fans' })"
                >粉丝<span>({{ item.followeds }})</span></span
              >
            </p>
            <p v-if="item.signature" class="text_exceed_hide_one follow_desc">
              {{ item.signature }}
            </p>
          </div>
          <div
            class="info_content_right_is_login_me"
            v-if="login_id === item.userId"
          >
            <el-button
              color="#ff006d"
              type="info"
              :icon="User"
              circle
              title="isMe - 登录用户者"
            />
          </div>
          <div class="info_content_right" v-else>
            <el-button
              type="success"
              :icon="Link"
              color="#d84315"
              size="small"
              v-if="item.followed"
              >相互关注</el-button
            >
            <el-button
              type="primary"
              :icon="Plus"
              size="small"
              v-else
              @click="clickFollow_button(item.userId)"
              >关注</el-button
            >
          </div>
        </div>
        <el-empty v-if="fansList.length <= 0" description="暂无关注数据" />
      </div>
      <div class="paginatio">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="total"
          :default-page-size="pagCount"
          :current-page="pagNo"
          @current-change="handlerCurrentChange($event)"
          :disabled="fansList_falg"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import {
  getUserFansListapi,
  getUserDetailsapi,
  setFollowerapi,
  CreatedVerifyapi,
} from "@/api/userDetailsApi";
import { useRouter, useRoute } from "vue-router";
import { Plus, Link, Female, Male, User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";

export default defineComponent({
  name: "fansList",
  components: {
    Female,
    Male,
  },
  setup() {
    let router = useRouter();
    let route = useRoute();
    let store = useStore();

    let all_doc_flag = ref(true); //全部加载状态
    let fansList_falg = ref(true); //加载状态
    let pagCount = ref(30); //每一页数量
    let fansList = ref([]); // 粉丝数据列表
    let pagNo = ref(1); //第几页
    let total = ref(0); //共有多少条数据
    let user_info = ref({}); //用户信息
    let login_id = ref(parseInt(localStorage.getItem("userId"))); //登录者id
    watch(
      () => route.params.userIdFans,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          all_doc_flag.value = true;
          fansList_falg.value = true;
          getUserDetails(newVal);
        }
      },
      { immediate: true }
    );
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 点击跳转对应type页面
     * @param {object}  obj_data  数据对象 {uid,type}
     */
    function click_typeSkipDoc(obj_data) {
      if (obj_data.type == "event") {
        router.push(`/layout/home/EventList/${obj_data.uid}`);
      } else if (obj_data.type == "followed") {
        router.push(`/layout/home/followedList/${obj_data.uid}`);
      } else if (obj_data.type == "fans") {
        router.push(`/layout/home/fansList/${obj_data.uid}`);
      }
    }
    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      fansList_falg.value = true;
      getUserFansList(
        route.params.userIdFans,
        pagCount.value,
        pagNo.value,
        true
      );
    }

    /**
     * 点击按钮关注
     */
    function clickFollow_button(id) {
      setFollower(id, 1);
    }
    /**
     * 关注/取消关注  用户
     * @param {string | number} id : 用户 id
     * @param {string | number} t : 1为关注,2为取消关注
     */
    async function setFollower(id, t) {
      const { data: res } = await setFollowerapi(id, t);
      if (res && res.code === 200) {
        ElMessage.closeAll();

        ElMessage({
          type: "success",
          message: "关注成功，谢谢关注!",
        });
        for (let i = 0; i < fansList.value.length; i++) {
          if (fansList.value[i].userId === id) {
            fansList.value[i].followed = true;
            break;
          }
        }
      } else if (res && res.code === 250) {
        ElMessage.closeAll();

        ElMessage({
          type: "error",
          message: res.message,
        });
      } else {
        ElMessage.closeAll();
        ElMessage({
          type: "warning",
          message: "需要进行验证！",
        });
        CreatedVerify(
          res.verifyId,
          res.verifyType,
          res.verifyToken,
          res.params.event_id,
          res.params.sign
        );
      }
    }
    /**
     * 验证接口-二维码生成（用于关注等接口验证）
     * @param {number} vid: 触发验证后,接口返回的verifyId
     * @param {number} type:触发验证后,接口返回的verifyType
     * @param {string} token:触发验证后,接口返回的verifyToken
     * @param {string} evid:触发验证后,接口返回的params的event_id
     * @param {string} sign:触发验证后,接口返回的params的sign
     */
    async function CreatedVerify(vid, type, token, evid, sign) {
      const { data: res } = await CreatedVerifyapi(
        vid,
        type,
        token,
        evid,
        sign
      );
      if (res && res.code === 200) {
        store.commit("verify/SETVERIFYOPENSTATUS", true);
        store.commit("verify/SETVERIFYURL", res.data.qrurl);
        store.commit("verify/SETVERIFYCODE", res.data.qrCode);
      }
    }

    /**
     * 获取用户详情
     * @param { String | Number} id 用户id
     */
    async function getUserDetails(id) {
      const { data: res } = await getUserDetailsapi(id);
      if (res && res.code === 200) {
        user_info.value = res;
        total.value = user_info.value.profile.followeds;
        getUserFansList(id, pagCount.value, pagNo.value, false);
      }
    }
    /**
     * 获取用户粉丝列表
     * @param {number | string} uId 用户id
     * @param {number } limit  返回数量 , 默认为 30
     * @param {number} offset  偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     * @param { boolean }   flagScroll :标记是否为分页请求
     */
    async function getUserFansList(uId, limit, offset, flagScroll) {
      const { data: res } = await getUserFansListapi(uId, limit, offset);
      fansList_falg.value = false;
      all_doc_flag.value = false;
      if (res && res.code === 200) {
        fansList.value = res.followeds;
        if (flagScroll) {
          window.scrollTo({
            top: 0,
            behavior: "smooth", // 平滑滚动效果
          });
        }
      } else {
        ElMessage({
          type: "warning",
          message: res.message,
        });
        fansList.value = [];
      }
    }
    return {
      total,
      pagCount,
      pagNo,
      fansList_falg,
      handlerCurrentChange,
      fansList,
      all_doc_flag,
      user_info,
      Plus,
      Link,
      User,
      login_id,
      click_typeSkipDoc,
      clickUserNameSkip_doc,
      clickFollow_button,
    };
  },
});
</script>

<style lang='less' scoped>
.fansList {
  .userinfo {
    padding: 5px;
    width: 100%;
    height: 60px;
    background-color: rgb(245, 245, 245);
    display: flex;
    img {
      margin-right: 10px;
      height: 100%;
      object-fit: cover;
    }
    p {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .userinfo_name {
      font-size: 16px;
      color: #333;
      font-weight: 700;
    }
  }
  .follwed_title {
    padding: 10px;
    font-size: 14px;
    color: #333;
  }
  .follwed_content {
    padding: 0 15px;
    min-height: 40vh;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .info_content {
      padding: 1%;
      margin: 0.5% 1%;
      width: 46%;
      height: 68px;
      display: flex;
      .info_content_left {
        img {
          height: 100%;
          object-fit: cover;
        }
      }
      .info_content_center {
        flex: 1;
        padding-left: 10px;
        p {
          margin: 3px 0;
        }
        .follow_name {
          display: flex;
          .follow_name_nickname {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: #409eff;
            }
          }
          span {
            margin-right: 4px;
            font: 700 14px "Helvetica Neue";
            color: #333;
            img {
              width: 18px;
              height: 18px;
              object-fit: cover;
              border-radius: 50%;
            }
          }
        }
        .follow_other {
          > span {
            color: #333;
            cursor: pointer;
            > span {
              color: #409eff;
            }
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .follow_desc {
          color: #909090;
        }
      }
      .info_content_right {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
      }
      .info_content_right_is_login_me {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
      }
    }
    .el-empty {
      width: 100%;
    }
  }

  .paginatio {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>