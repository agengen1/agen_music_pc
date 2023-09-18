<template>
  <div class="followedList">
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
          ><span>共{{ user_info.profile.follows }}位关注</span>
        </p>
      </div>
      <p class="follwed_title">关注列表({{ user_info.profile.follows }})</p>
      <Loading
        v-if="followedList_falg"
        textColor="#409eff"
        title="加载中..."
      ></Loading>
      <div class="follwed_content" v-else>
        <div
          class="info_content odd_backColor"
          v-for="item in followedList"
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
              color="#b71c1c"
              type="info"
              :icon="User"
              circle
              title="isMe - 登录用户者"
            />
          </div>
          <div class="info_content_right" v-else>
            <el-button
              type="success"
              :icon="Check"
              size="small"
              v-if="item.followed"
              >已关注</el-button
            >
            <el-button type="primary" :icon="Plus" size="small" v-else
              >关注</el-button
            >
          </div>
        </div>
        <el-empty v-if="followedList.length <= 0" description="暂无关注数据" />
      </div>
      <div class="paginatio">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="total"
          :default-page-size="pagCount"
          :current-page="pagNo"
          @current-change="handlerCurrentChange($event)"
          :disabled="followedList_falg"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { getUserFollowedListapi } from "@/api/userDetailsApi";
import { getUserDetailsapi } from "@/api/userDetailsApi";
import { useRouter, useRoute } from "vue-router";
import { Plus, Check, Female, Male, User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "followedList",
  components: {
    Female,
    Male,
  },
  setup() {
    let router = useRouter();
    let route = useRoute();
    let all_doc_flag = ref(true); //全部加载状态
    let followedList_falg = ref(true); //加载状态
    let pagCount = ref(30); //每一页数量
    let followedList = ref([]); // 关注数据列表
    let pagNo = ref(1); //第几页
    let total = ref(0); //共有多少条数据
    let user_info = ref({}); //用户信息
    let login_id = ref(parseInt(localStorage.getItem("userId"))); //登录者id
    watch(
      () => route.params.userIdFollowed,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          all_doc_flag.value = true;
          followedList_falg.value = true;
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
        // router.push(``)
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
      followedList_falg.value = true;
      getUserFollowedList(
        route.params.userIdFollowed,
        pagCount.value,
        pagNo.value,
        true
      );
    }
    /**
     * 获取用户详情
     * @param { String | Number} id 用户id
     */
    async function getUserDetails(id) {
      const { data: res } = await getUserDetailsapi(id);
      if (res && res.code === 200) {
        user_info.value = res;
        total.value = user_info.value.profile.follows;
        getUserFollowedList(id, pagCount.value, pagNo.value, false);
      }
    }
    /**
     * 获取用户关注列表
     * @param {number | string} uId 用户id
     * @param {number } limit  返回数量 , 默认为 30
     * @param {number} offset  偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     * @param { boolean }   flagScroll :标记是否为分页请求
     */
    async function getUserFollowedList(uId, limit, offset, flagScroll) {
      const { data: res } = await getUserFollowedListapi(uId, limit, offset);
      followedList_falg.value = false;
      all_doc_flag.value = false;
      if (res && res.code === 200) {
        followedList.value = res.follow;
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
        followedList.value = [];
      }
    }
    return {
      total,
      pagCount,
      pagNo,
      followedList_falg,
      handlerCurrentChange,
      followedList,
      all_doc_flag,
      user_info,
      Plus,
      Check,
      User,
      login_id,
      click_typeSkipDoc,
      clickUserNameSkip_doc,
    };
  },
});
</script>

<style lang='less' scoped>
.followedList {
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
            font: 700 14px "";
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