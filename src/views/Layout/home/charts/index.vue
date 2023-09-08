<template>
  <div class="charts">
    <nav class="charts_nav">
      <div
        class="charts_one"
        v-for="item in ranking_arr"
        :key="item.id"
        @click="clickCharts_details(item.id)"
        :class="{ nav_active: route.path.split('/')[5] == item.id }"
      >
        <div class="info_img">
          <img
            v-lazy="item.coverImgUrl + '?param=80y80'"
            :alt="item.name"
            :title="item.name"
          />
        </div>
        <div class="info">
          <p class="text_exceed_hide_one">{{ item.name }}</p>
          <p class="text_exceed_hide_one">{{ item.updateFrequency }}</p>
        </div>
      </div>
    </nav>
    <div class="charts_details">
      <router-view></router-view>
    </div>
  </div>
</template>
    
<script>
import { defineComponent, markRaw, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getRankingListapi } from "@/api/recommendApi";
export default defineComponent({
  name: "charts",
  setup() {
    let ranking_arr = ref([]);
    let route = useRoute();
    let router = useRouter();
    /**
     * clickCharts_details
     * @param {number} id
     * 功能：点击排行榜跳转排行榜详情
     */
    function clickCharts_details(id) {
      router.push(`/layout/home/charts/details/${id}`);
    }
    /**
     * getRankingList_All_desc
     * 获取所有_排行榜详情函数
     * 返回promise对象
     */
    async function getRankingList_All_desc() {
      let { data: res } = await getRankingListapi();
      if (res && res.code === 200) {
        ranking_arr.value = markRaw(res.list);
      }
    }
    getRankingList_All_desc();
    return {
      route,
      ranking_arr,
      clickCharts_details,
    };
  },
});
</script>
    
<style lang="less" scoped>
.charts {
  display: flex;
  .charts_nav {
    width: 20%;
    border-right: 1px solid #dcdfe6;
    background-color: #f6f6f6;
    .charts_one {
      cursor: pointer;
      display: flex;
      background-color: #fff;
      height: 75px;
      .info_img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 30%;
        height: 100%;
        img {
          width: 80%;
          object-fit: cover;
        }
      }
      .info {
        width: 70%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p {
          &:nth-child(1) {
            font-size: 14px;
            color: #000;
          }
        }
      }
      &:hover {
        background-color: #6eb6ff42;
      }
    }
    .nav_active {
      background-color: #6eb6ff42;
    }
  }

  .charts_details {
    width: 80%;
  }
}
</style>