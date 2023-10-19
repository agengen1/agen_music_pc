<template>
  <div class="subject">
    <goBack></goBack>
    <Loading
      v-if="subject_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="content" v-else>
      <div class="top_details">
        <img v-lazy="subject_details.coverPCListUrl" />
        <h1>{{ subject_details.title }}</h1>
        <p class="button_subject">
          <span @click="clcikPushEvent()"
            ><el-icon><EditPen /></el-icon>发动态</span
          >
          <span @click="clcikPushVideo()"
            ><el-icon><VideoCamera /></el-icon>发布视频</span
          >
        </p>
        <p class="par_subject">
          已参与人数：{{ subject_details.participateCount }}
        </p>
      </div>
      <div class="subject_event">
        <h3>热门动态</h3>

        <el-empty
          v-if="subject_listing_obj[1].event.length <= 0"
          description="暂无热门动态"
        />
        <events v-else :followList="subject_listing_obj" :pageNO="1"></events>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch } from "vue";
import {
  getSubjectDetails_api,
  getSubjectHotListing_api,
} from "@/api/subjectApi";
import { useRoute } from "vue-router";
import { EditPen, VideoCamera } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "subject",
  components: {
    EditPen,
    VideoCamera,
  },
  setup() {
    let route = useRoute();
    let subject_flag = ref(true); //话题加载状态
    let subject_details = ref({}); //话题详情
    let subject_listing_obj = reactive({}); //话题热门列表

    watch(
      () => route.params.actId,
      (newVal) => {
        if (newVal) {
          subject_flag.value = true;
          getSubjectDetails(newVal);
        }
      },
      { immediate: true }
    );
    /**
     * 点击发布视频
     */
    function clcikPushVideo() {
      window.open("https://music.163.com/st/ncreator/");
    }
    /**
     * 点击发布动态
     */
    function clcikPushEvent() {
      ElMessage.closeAll();
      ElMessage({
        type: "warning",
        message: "暂时无法发布动态！",
      });
    }
    /**
     * 获取话题详情
     * @param {number | string} actid 话题id
     */
    async function getSubjectDetails(actid) {
      const { data: res } = await getSubjectDetails_api(actid);
      if (res && res.code === 200) {
        subject_details.value = res.act;
        getSubjectHotListing(actid);
      }
    }
    /**
     * 获取话题详情热门动态
     * @param {number | string} actid 话题id
     */
    async function getSubjectHotListing(actid) {
      const { data: res } = await getSubjectHotListing_api(actid);
      subject_flag.value = false;
      if (res && res.code === 200) {
        res.events.forEach((el) => {
          el["treeJson_data"] = JSON.parse(el.json);
        });
        subject_listing_obj[1] = {
          event: res.events,
        };
      }
    }
    return {
      subject_flag,
      subject_details,
      subject_listing_obj,
      clcikPushEvent,
      clcikPushVideo,
    };
  },
});
</script>

<style lang='less' scoped>
.subject {
  .content {
    padding: 0 10px;
    .top_details {
      position: relative;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
      }
      h1 {
        margin-top: 40px;
        font-size: 32px;
        color: #fff;
      }

      .button_subject {
        display: flex;
        span {
          box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
          margin: 100px 50px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 50px;
          background-color: #fff;
          border-radius: 10px;
          cursor: pointer;
          font-size: 18px;
          color: firebrick;
          i {
            margin-right: 8px;
          }
        }
      }
      .par_subject {
        color: #fff;
        font-size: 14px;
      }
    }
    .subject_event {
      padding: 20px 50px 10px;
      h3 {
        color: #333;
      }
    }
  }
}
</style>