<template>
  <div class="follow margin_layout">
    <div class="follow_content">
      <div class="top">动态</div>
      <Loading
        v-if="follow_flag"
        textColor="#409eff"
        title="加载中..."
      ></Loading>
      <events v-else :followList="followList" :pageNO="pageNO"></events>
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
          >下一页<el-icon><ArrowRightBold /></el-icon
        ></el-button>
      </div>
    </div>

    <div class="user_info">
      <Loading
        v-if="userinfo_flag"
        textColor="#409eff"
        title="加载中..."
      ></Loading>
      <div v-else>
        <div class="user_info_content">
          <div class="user_info_content_top">
            <img
              v-lazy="user_info.profile.avatarUrl"
              :title="user_info.profile.nickname"
            />
            <span @click="clickUserNameSkip_doc(user_info.profile.userId)">{{
              user_info.profile.nickname
            }}</span>
          </div>
          <div class="user_info_content_bottom">
            <p
              class="event"
              @click="clickSkipEventList(user_info.profile.userId)"
            >
              <span>{{ user_info.profile.eventCount }}</span>
              <span>动态</span>
            </p>
            <el-divider direction="vertical" />
            <p
              class="followed"
              @click="clickSkipFollowedList(user_info.profile.userId)"
            >
              <span>{{ user_info.profile.follows }}</span>
              <span>关注</span>
            </p>
            <el-divider direction="vertical" />
            <p
              class="fans"
              @click="clickSkipFansList(user_info.profile.userId)"
            >
              <span>{{ user_info.profile.followeds }}</span>
              <span>粉丝</span>
            </p>
          </div>
        </div>
        <div class="user_info_content_singer">
          <h3>
            <span>喜欢的歌手</span
            ><span>查看更多<van-icon name="arrow" /></span>
          </h3>
          <div class="singer_content">
            <ul>
              <li v-for="item in likeSinger_data" :key="item.id">
                <div class="singer_content_left">
                  <img v-lazy="item.picUrl + '?param=80y80'" :alt="item.name" />
                </div>
                <div class="singer_content_right">
                  <p>
                    <span @click="clickSkipSingerDetails(item.id)">{{
                      item.name
                    }}</span>
                    <span v-if="item.trans != null">{{ item.trans }}</span>
                  </p>
                  <p>
                    <span>{{ item.albumSize }}个专辑</span>
                    <span>{{ item.mvSize }}个MV</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, ref } from "vue";
import { getMyFollowerData_api } from "@/api/followApi";
import { getUserDetailsapi } from "@/api/userDetailsApi";
import { getSingerMeLikeapi } from "@/api/singerApi";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";

import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "follow",
  components: { ArrowRightBold },
  setup() {
    let router = useRouter();
    let pageNO = ref(1); //当前第几页
    let followList = reactive({}); //动态数据
    let pageCount = ref(30); //每一页多少条数据
    let follow_flag = ref(true); //动态请求状态 true请求中
    let user_info = ref({}); //用户信息
    let userinfo_flag = ref(true); //用户信息请求状态 true请求中
    let userId = window.localStorage.getItem("userId"); //用户id
    let likeSinger_data = ref([]); //喜欢的歌手（前5名歌手）
    let leftDisabled = computed(() => {
      return pageNO.value <= 1;
    }); //左边按钮是否禁用

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
     * 点击跳转关注列表详情
     * @param {number} userid 用户id
     */
    function clickSkipFollowedList(userid) {
      router.push(`/layout/home/followedList/${userid}`);
    }
    /**
     * 点击跳转粉丝列表详情
     * @param {number} userid 用户id
     */
    function clickSkipFansList(userid) {
      router.push(`/layout/home/fansList/${userid}`);
    }
    /**
     * 点击跳转动态列表详情
     * @param {number} userid 用户id
     */
    function clickSkipEventList(userid) {
      router.push(`/layout/home/EventList/${userid}`);
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
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 获取喜欢的歌手
     * @param {number}  limit: 取出歌单数量 , 默认为 25
     * @param {number}  offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*25, 其中 25 为 limit 的值
     */
    async function getSingerMeLike(limit, offset) {
      const { data: res } = await getSingerMeLikeapi(limit, offset);
      userinfo_flag.value = false;
      if (res && res.code === 200) {
        likeSinger_data.value = res.data;
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
        getSingerMeLike(10, 1);
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
    getUserDetails(userId);
    return {
      followList,
      pageNO,
      user_info,
      userinfo_flag,
      follow_flag,
      ArrowLeftBold,
      leftDisabled,
      likeSinger_data,
      clickSkipEventList,
      clickSkipFollowedList,
      clickSkipFansList,
      clickPre_data,
      clickNext_data,
      clickSkipSingerDetails,
      clickUserNameSkip_doc,
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
    display: flex;
    flex-direction: column;
    .user_info_content {
      display: flex;
      flex-direction: column;
      background-color: #f7f7f7bd;
      .user_info_content_top {
        padding: 30px 0 30px 30px;

        display: flex;
        img {
          margin-right: 10px;
          width: 20%;
          object-fit: cover;
          border-radius: 5%;
        }
        span {
          color: #333;
          font: 700 18px "";
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            color: #409eff;
          }
        }
      }
      .user_info_content_bottom {
        padding: 0 0 30px 30px;
        height: 45px;
        display: flex;
        align-items: center;
        .el-divider--vertical {
          height: 2em;
        }
        p {
          margin: 0 10px;
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          font: 700 14px "";
          color: #898989;
          cursor: pointer;
          &:hover {
            color: #409eff;
          }
        }
      }
    }
    .user_info_content_singer {
      padding: 10px 30px 30px 30px;
      h3 {
        color: #333;
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        span {
          &:nth-child(2) {
            cursor: pointer;
            color: #a8abb2;
            font: 700 12px "";
            &:hover {
              color: #409eff;
              text-decoration: underline;
            }
          }
        }
      }
      .singer_content {
        padding: 0 5px;
        ul {
          li {
            padding: 5px;
            display: flex;
            width: 100%;
            &:hover {
              background-color: #f3f3f3;
            }
            .singer_content_left {
              width: 20%;
              img {
                width: 100%;
              }
            }
            .singer_content_right {
              padding-left: 5px;
              width: 80%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              p {
                &:nth-child(1) {
                  span {
                    font-size: 14px;
                    color: #333;
                    font-weight: 700;
                    &:nth-child(1) {
                      cursor: pointer;
                      &:hover {
                        text-decoration: underline;
                        color: #409eff;
                      }
                    }
                    &:nth-child(2) {
                      margin-left: 5px;
                      color: #a8abb2;
                      font-size: 12px;
                    }
                  }
                }
                &:nth-child(2) {
                  span {
                    color: #898989;
                    margin-right: 5px;
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
</style>