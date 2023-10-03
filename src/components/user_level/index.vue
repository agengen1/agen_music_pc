<template>
  <div class="userLevel">
    <goBack></goBack>
    <Loading title="加载中...." textColor="#409eff" v-if="level_flag"></Loading>
    <div class="content" v-else>
      <div class="nowLevel">
        <span>当前等级:</span>
        <span class="level">LV.{{ levelData.level }}</span>
      </div>
      <div class="nowBar">
        <ul class="bar_title">
          <li v-for="index in 10" :key="index">
            <p v-if="index - 1 >= 9">
              <span :class="{ Select_level: levelData.level == index - 1 }">{{
                index - 1
              }}</span>
              <span
                :class="{ Select_level: levelData.level == index }"
                class="title_10"
                >{{ index }}</span
              >
            </p>
            <p v-else>
              <span :class="{ Select_level: levelData.level == index - 1 }">{{
                index - 1
              }}</span>
            </p>
          </li>
          <li class="cursor_select"></li>
        </ul>
        <div class="bar_content">
          <div class="bar_displayContent"></div>
          <ul class="level_split_line">
            <li v-for="index in 9" :key="index"></li>
          </ul>
        </div>
        <div class="bar_desc">等级数据每天下午2点更新</div>
      </div>
      <div class="levelQuity">
        <p class="levelQuity_title">当前等级特权：</p>
        <p v-if="levelData.info_arr <= 0" class="noQuity">
          <span> 暂无特权 </span>
        </p>
        <ul class="levelQuity_content" v-else>
          <li v-for="(item, index) in levelData.info_arr" :key="index">
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <el-divider />
      <div class="nextLevel">
        <p class="nextLevel_title">
          <span> 距离下一个等级:</span>
          <span class="level">LV.{{ levelData.level + 1 }}</span>
        </p>
        <div class="nextLevel_contnet">
          <div class="nextLevel_play">
            <el-progress
              type="circle"
              :percentage="next_play_progress"
              status="exception"
            >
              <template #default="{ percentage }">
                <p class="percentage-value">{{ percentage }}%</p>
                <p class="percentage-label">
                  还需听歌{{
                    levelData.nextPlayCount - levelData.nowPlayCount
                  }}首
                </p>
              </template>
            </el-progress>
            <p>听歌量</p>
          </div>
          <div class="nextLevel_day">
            <el-progress type="circle" :percentage="next_day_progress">
              <template #default="{ percentage }">
                <p class="percentage-value">{{ percentage }}%</p>
                <p class="percentage-label">
                  还需登录{{
                    levelData.nextLoginCount - levelData.nowLoginCount
                  }}
                  天
                </p>
              </template>
            </el-progress>
            <p>登录天数</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { getUserLevelapi } from "@/api/userDetailsApi";
export default defineComponent({
  name: "userLevel",
  setup() {
    let level_flag = ref(true); //加载状态
    let levelData = ref({}); //等级信息
    let levelbarWidth = ref(""); //等级进度
    let levelbarCursor = ref(""); //等级游标
    let next_play_progress = ref(0); //下一等级听歌进度
    let next_day_progress = ref(0); //下一等级登录进度
    watch(
      () => levelData.value,
      (newVal) => {
        if (newVal.level && newVal.progress) {
          levelbarWidth.value =
            (newVal.level + newVal.progress).toFixed(2) * 10 + "%";
          if (newVal.level === 10) {
            levelbarCursor.value = `calc(${newVal.level * 10}% - ${30}px)`;
          } else {
            levelbarCursor.value = `calc(${newVal.level * 10}% - ${15}px)`;
          }
        }
        if (newVal.level === 0) {
          levelbarCursor.value = "-15px";
        }
        if (
          newVal.nowPlayCount &&
          newVal.nextPlayCount &&
          newVal.nowLoginCount &&
          newVal.nextLoginCount
        ) {
          next_play_progress.value =
            (newVal.nowPlayCount / newVal.nextPlayCount).toFixed(2) * 100;
          next_day_progress.value =
            (newVal.nowLoginCount / newVal.nextLoginCount) * 100;
        }
      },
      { immediate: true }
    );
    /**
     * 获取用户等级信息
     */
    async function getUserLevel() {
      const { data: res } = await getUserLevelapi();
      level_flag.value = false;
      if (res && res.code === 200) {
        levelData.value = res.data;
        levelData.value["info_arr"] = res.data.info.split("$");
      }
    }
    getUserLevel();
    return {
      levelbarWidth,
      level_flag,
      levelData,
      levelbarCursor,
      next_play_progress,
      next_day_progress,
    };
  },
});
</script>

<style lang='less' scoped>
.userLevel {
  .content {
    padding: 20px 50px;
    .nowLevel {
      span {
        font-size: 24px;
        color: #333;
      }
      .level {
        margin-left: 5px;
        color: red;
        font-style: italic;
        font-weight: 700;
      }
    }
    .nowBar {
      padding: 10px 20px 0;
      .bar_title {
        height: 40px;
        position: relative;
        display: flex;
        align-items: center;
        li {
          width: 10%;
          font-size: 16px;
          font-weight: 700;

          p {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              position: absolute;
              left: -5px;
            }
            .title_10 {
              width: 100%;
              text-align: right;
            }
          }
        }
        .Select_level {
          color: #fff;
        }

        .cursor_select {
          position: absolute;
          z-index: -1;
          left: v-bind(levelbarCursor);
          width: 30px;
          height: 35px;
          border-radius: 50%;
          background-image: url("@/assets/img/cursor_select.png");
          background-size: 100%;
          background-position-y: 4px;
          background-repeat: no-repeat;
        }
      }
      .bar_content {
        position: relative;
        width: 100%;
        height: 10px;
        background-color: #dcdfe6;
        border-radius: 10px;

        .bar_displayContent {
          height: 10px;
          width: v-bind(levelbarWidth);
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 10px;
          background-color: red;
        }
        .level_split_line {
          z-index: 4;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-evenly;
          li {
            width: 2px;
            height: 100%;
            background-color: #fff;
          }
        }
      }
      .bar_desc {
        margin: 5px 0;
        height: 30px;
        line-height: 30px;
        color: #949494;
      }
    }
    .levelQuity {
      .levelQuity_title {
        font-size: 24px;
        color: #333;
        margin: 25px 0 0;
      }
      .noQuity {
        padding: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        span {
          padding: 2px 10px;
          border: 1px solid red;
          color: red;
          border-radius: 10px;
        }
      }
      .levelQuity_content {
        padding-left: 20px;
        li {
          list-style: disc;
          color: red;
          height: 30px;
          line-height: 30px;
          span {
            color: #828282;
            font-size: 14px;
          }
        }
      }
    }
    .nextLevel {
      .nextLevel_title {
        span {
          font-size: 20px;
          color: #333;
        }
        .level {
          margin-left: 5px;
          color: red;
          font-style: italic;
          font-weight: 700;
        }
      }
      .nextLevel_contnet {
        .percentage-value,
        .percentage-label {
          margin: 20px 0;
          color: #333;
          font-size: 12px;
        }
        .percentage-value {
          font-size: 16px;
          font-weight: 700;
        }
        display: flex;
        padding-left: 10px;
        > div {
          margin: 20px 20px 10px;

          display: flex;
          flex-direction: column;
          align-items: center;
          > p {
            margin-top: 10px;
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>