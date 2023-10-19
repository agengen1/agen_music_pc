<template>
  <div class="mv">
    <div class="mv_label">
      <div>
        <div class="left">地区:</div>
        <div class="right">
          <p v-for="item in mvLabel.area" :key="item">
            <span
              :class="{
                isSelect: item == selectArea,
              }"
              @click="clickMvLabelName({ status: 'area', name: item })"
              >{{ item }}</span
            >
          </p>
        </div>
      </div>
      <div>
        <div class="left">类型:</div>
        <div class="right">
          <p v-for="item in mvLabel.type" :key="item">
            <span
              :class="{
                isSelect: item == selectType,
              }"
              @click="clickMvLabelName({ status: 'type', name: item })"
              >{{ item }}</span
            >
          </p>
        </div>
      </div>
      <div>
        <div class="left">排序:</div>
        <div class="right">
          <p v-for="item in mvLabel.order" :key="item">
            <span
              :class="{
                isSelect: item == selectOrder,
              }"
              @click="clickMvLabelName({ status: 'order', name: item })"
              >{{ item }}</span
            >
          </p>
        </div>
      </div>
    </div>
    <div class="mv_content">
      <Loading
        title="加载中...."
        textColor="#409eff"
        v-if="mv_loading_flag"
      ></Loading>
      <div class="content" v-else>
        <div class="info" v-for="item in now_mv_list" :key="item.id">
          <img
            v-lazy="item.cover + '?param=450y260'"
            :alt="item.name"
            :title="item.name"
            @click.stop="clickMvSkipDetails(item.id)"
          />
          <div class="mask" @click.stop="clickMvSkipDetails(item.id)">
            <van-icon name="play" />
          </div>
          <div class="playCount">
            <van-icon name="play" />{{ playCountTransform(item.playCount) }}
          </div>
          <div class="mvTime">
            {{ computeMusicTimeDuration(item.duration) }}
          </div>
          <p
            class="text_exceed_hide_one mvName"
            @click.stop="clickMvSkipDetails(item.id)"
          >
            {{ item.name }}
          </p>
          <p class="mvSingerName">{{ item.artistName }}</p>
        </div>
      </div>
      <div class="paginatio">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="mvTotal"
          :default-page-size="pagCount"
          :current-page="pagNo"
          @current-change="handlerCurrentChange($event)"
          :disabled="mv_loading_flag"
          hide-on-single-page
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getMvlistapi } from "@/api/mvApi";
import { useRouter } from "vue-router";
import { computeMusicTimeDuration, playCountTransform } from "@/assets/public";
export default defineComponent({
  name: "mv",
  setup() {
    let router = useRouter();
    let mvLabel = {
      area: ["全部", "内地", "港台", "欧美", "日本", "韩国"],
      type: ["全部", "官方版", "原生", "现场版", "网易出品"],
      order: ["上升最快", "最热", "最新"],
    };
    let selectArea = ref("全部"); //选中的地区标签 - 默认全部
    let selectType = ref("全部"); //选中的类型标签 - 默认全部
    let selectOrder = ref("上升最快"); //选中的排序标签 - 默认上升最快
    let pagCount = ref(28); //每一页多少条数据 默认28条
    let pagNo = ref(1); //当前第几页数据
    let mvTotal = ref(0); //共有多少条数据
    let mv_loading_flag = ref(true); // 加载状态
    let now_mv_list = ref([]); //当前页数数据

    /**
     * 点击mv标签触发
     * @param {object} objData （包含name:标签名称  status:点击的那种标签）
     */
    function clickMvLabelName(objData) {
      pagNo.value = 1;
      mv_loading_flag.value = true;
      if (objData.status === "area") {
        selectArea.value = objData.name;
      } else if (objData.status === "type") {
        selectType.value = objData.name;
      } else if (objData.status === "order") {
        selectOrder.value = objData.name;
      }
      getMvlist(
        selectArea.value,
        selectType.value,
        selectOrder.value,
        pagCount.value,
        pagNo.value
      );
    }
    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动效果
      });
      pagNo.value = No;
      mv_loading_flag.value = true;
      getMvlist(
        selectArea.value,
        selectType.value,
        selectOrder.value,
        pagCount.value,
        pagNo.value
      );
    }
    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
    }
    /**
     * mv列表获取
     * @param {String } area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
     * @param {String } type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
     * @param {String } order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
     * @param {number} limit: 取出数量 , 默认为 30
     * @param {number} offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
     */
    async function getMvlist(area, type, order, limit, offset) {
      const { data: res } = await getMvlistapi(
        area,
        type,
        order,
        limit,
        offset
      );
      mv_loading_flag.value = false;
      if (res && res.code === 200) {
        if (res.count) {
          mvTotal.value = res.count;
        }
        now_mv_list.value = res.data;
      }
    }
    getMvlist(
      selectArea.value,
      selectType.value,
      selectOrder.value,
      pagCount.value,
      pagNo.value
    );
    return {
      mvLabel,
      selectArea,
      selectType,
      selectOrder,
      mvTotal,
      pagCount,
      pagNo,
      mv_loading_flag,
      now_mv_list,
      handlerCurrentChange,
      clickMvLabelName,
      computeMusicTimeDuration,
      playCountTransform,
      clickMvSkipDetails,
    };
  },
});
</script>

<style lang='less' scoped>
.mv {
  padding-bottom: 20px;
  .mv_label {
    margin-top: 10px;
    > div {
      margin: 10px 0;
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      .left {
        width: 4%;
        text-align: center;
        font-size: 14px;
        color: #333;
      }
      .right {
        width: 95%;
        display: flex;
        p {
          padding: 0 15px;
          border-right: 1px solid #ccc;
          &:last-child {
            border: none;
          }
        }
        span {
          padding: 3px 5px;
          cursor: pointer;
          border-radius: 8px;
        }
        .isSelect {
          color: #ff006d;
          background-color: #ff006d1a;
        }
      }
    }
  }
  .mv_content {
    .content {
      display: flex;
      flex-wrap: wrap;
      .info {
        position: relative;
        margin: 10px 1.5%;
        width: 22%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: baseline;

        img {
          width: 100%;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          border: 0.5px solid #ccc;
          &:hover ~ .mask {
            opacity: 1;
          }
        }
        p {
          margin: 5px 0 0 0;
          width: 100%;
        }
        .mvName {
          font: 500 14px "华文楷书";
          cursor: pointer;
          &:hover {
            color: #409eff;
            text-decoration: underline;
          }
        }
        .mvSingerName {
          padding-left: 10px;
          font-size: 12px;
          color: #969696;
        }
        .mask {
          position: absolute;
          transform: translateY(-60px);
          transition: all 0.3s;
          top: 55%;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #ffffff92;
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          cursor: pointer;
          i {
            font-size: 24px;
            color: #ff006d;
          }
          &:hover {
            opacity: 1;
          }
        }
        .mvTime {
          padding: 2px 5px;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #00000061;
          color: #ffffff;
          font-size: 14px;
          border-radius: 5px;
          border-top-left-radius: 10px;
        }
        .playCount {
          padding: 2px 5px;
          position: absolute;
          right: 0;
          top: 0;
          background-color: #00000061;
          color: #ffffff;
          font-size: 14px;
          border-radius: 5px;
          border-top-right-radius: 10px;
          i {
            margin: 0 2px;
          }
        }
      }
    }
    .paginatio {
      margin-top: 25px;
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
}
</style>