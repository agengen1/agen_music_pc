<template>
  <div class="eventList">
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
          ><span>共{{ user_info.profile.eventCount }}条动态</span>
        </p>
      </div>
      <p class="follwed_title">动态列表({{ user_info.profile.eventCount }})</p>

      <div class="eventList_content" v-if="JSON.stringify(eventList) != '{}'">
        <Loading
          v-if="eventList_flag"
          textColor="#409eff"
          title="加载中..."
        ></Loading>
        <events v-else :followList="eventList" :pageNO="pageNO"></events>
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
          <el-button
            type="primary"
            :loading="eventList_flag"
            @click="clickNext_data"
            >下一页<el-icon><ArrowRightBold /></el-icon
          ></el-button>
        </div>
      </div>
      <el-empty v-else description="暂无动态" />
    </div>
  </div>
</template>
  
<script>
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { getUserFollowerData_api } from "@/api/followApi";
import { getUserDetailsapi } from "@/api/userDetailsApi";

import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "eventList",
  components: { ArrowRightBold },
  setup() {
    let route = useRoute();
    let pageNO = ref(1); //当前第几页
    let eventList = reactive({}); //动态数据
    let pageCount = ref(10); //每一页多少条数据
    let eventList_flag = ref(true); //动态请求状态 true请求中
    let all_doc_flag = ref(true); //全部加载状态
    let user_info = ref({}); //用户信息
    let login_id = ref(parseInt(localStorage.getItem("userId"))); //登录者id
    let leftDisabled = computed(() => {
      return pageNO.value <= 1;
    }); //左边按钮是否禁用

    watch(
      () => route.params.userIdEvent,
      (newVal) => {
        if (newVal) {
          pageNO.value = 1;
          all_doc_flag.value = true;
          eventList_flag.value = true;
          getUserDetails(newVal);
        }
      },
      { immediate: true }
    );

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
      if (!eventList[pageNO.value]) {
        eventList_flag.value = true;
        let pre_lasttime = eventList[pageNO.value - 1].lasttime;
        getUserFollowerData(
          route.params.userIdEvent,
          pageCount.value,
          pre_lasttime,
          true
        );
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // 平滑滚动效果
        });
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
        getUserFollowerData(id, pageCount.value, 0, false);
      }
    }
    /**
     * 获取用户动态
     * @param {number | string} uid 用户id
     * @param {number} pagesize 每页数据,默认 20
     * @param {number} lasttime : 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
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
    async function getUserFollowerData(uid, pagesize, lasttime, flagScroll) {
      const { data: res } = await getUserFollowerData_api(
        uid,
        pagesize,
        lasttime
      );
      eventList_flag.value = false;
      all_doc_flag.value = false;

      if (res && res.code === 200) {
        if (res.events.length <= 0) {
          ElMessage.closeAll();
          ElMessage({
            type: "warning",
            message: "已经到底了！",
          });
          pageNO.value--;
        } else {
          eventList[pageNO.value] = {
            event: res.events,
            lasttime: res.lasttime,
          };
          eventList[pageNO.value].event.forEach((el) => {
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

    return {
      eventList,
      pageNO,
      eventList_flag,
      ArrowLeftBold,
      leftDisabled,
      all_doc_flag,
      clickPre_data,
      clickNext_data,
      user_info,
    };
  },
});
</script>
  
<style lang='less' scoped>
.eventList {
  padding: 0 20px;
  min-height: 70vh;
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
    padding: 10px 100px 0;
    font-size: 14px;
    color: #333;
    font-weight: 700;
  }
  .eventList_content {
    padding: 0 100px;
    display: flex;
    flex-direction: column;

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
}
</style>