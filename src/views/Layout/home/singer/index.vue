<template>
  <div class="singer">
    <div class="singer_left">
      <div class="singer_area" v-for="item in singer_area" :key="item.area">
        <h2>{{ item.area_name }}</h2>
        <p
          class="singer_type"
          v-for="item_c in singer_type"
          :key="item_c.type"
          :class="{
            isSelected_singer:
              select_class.type === item_c.type &&
              select_class.area === item.area,
          }"
          @click="
            clickSwitch_selected(
              item_c.type,
              item_c.type_name,
              item.area,
              item.area_name
            )
          "
        >
          <span> {{ item.area_name }}{{ item_c.type_name }}</span>
          <span class="flag_f"
            ><el-icon><Flag /></el-icon
          ></span>
        </p>
      </div>
    </div>
    <div class="singer_right">
      <h2>{{ select_class.area_name }}{{ select_class.type_name }}</h2>
      <Loading
        title="加载中...."
        textColor="#409eff"
        v-if="singer_flag"
      ></Loading>
      <div class="singer_right_content" v-else>
        <ul>
          <li v-for="item in singerData[pageNo]" :key="item.id">
            <img
              v-lazy="item.picUrl + '?param=140y140'"
              :alt="item.name"
              :title="item.name"
            />
            <p>
              <span
                class="text_exceed_hide_one singer_name"
                :title="item.name + ' - 歌手页'"
                @click="clickSingerName_Skpi_doc(item.id)"
                >{{ item.name }}</span
              >
              <span
                v-if="item.accountId && item.accountId > 0"
                class="singer_user"
                :title="item.name + ' - 用户页'"
                @click="clickUserNameSkip_doc(item.accountId)"
              >
                <el-icon><User /></el-icon>
              </span>
            </p>
          </li>
        </ul>
      </div>
      <div class="paginatio">
        <el-button
          type="primary"
          :icon="ArrowLeftBold"
          :disabled="leftDisabled"
          @click="clickPre_data"
          >上一页</el-button
        >
        <p>
          当前第<span>{{ pageNo }}</span
          >页
        </p>
        <el-button type="primary" :loading="singer_flag" @click="clickNext_data"
          >下一页<el-icon><ArrowRightBold /></el-icon
        ></el-button>
      </div>
    </div>
  </div>
</template>
      
  <script>
import { defineComponent, reactive, ref, computed } from "vue";
import { getSingerClass_typeapi } from "@/api/singerApi";
import {
  Flag,
  ArrowRightBold,
  ArrowLeftBold,
  User,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "singer",
  components: {
    Flag,
    ArrowRightBold,
    User,
  },
  setup() {
    let router = useRouter();
    let singer_flag = ref(true); //加载状态
    let singer_type = reactive([
      {
        type: 1,
        type_name: "男歌手",
      },
      {
        type: 2,
        type_name: "女歌手",
      },
      {
        type: 3,
        type_name: "乐队",
      },
    ]); //歌手type数据
    let singer_area = reactive([
      {
        area: 7,
        area_name: "华语",
      },
      {
        area: 96,
        area_name: "欧美",
      },
      {
        area: 8,
        area_name: "日本",
      },
      {
        area: 16,
        area_name: "韩国",
      },
      {
        area: 0,
        area_name: "其他",
      },
    ]); //歌手area数据
    let select_class = reactive({
      type: 1,
      type_name: "男歌手",
      area: 7,
      area_name: "华语",
    }); //选中type, area 默认1,7
    let pageCount = ref(40); //每一页多少条数据 默认30
    let pageNo = ref(1); //当前第几页数据
    let singerData = ref({}); //歌手数据
    let leftDisabled = computed(() => {
      return pageNo.value <= 1;
    }); //左边按钮是否禁用

    /**
     * clickSingerName_Skpi_doc
     * @param {number} id
     * 功能::点击跳转歌手详情页面
     */
    function clickSingerName_Skpi_doc(id) {
      ElMessage.closeAll();
      // DOTO:
      if (id > 0) {
        //接口返回数据存在 id为零，所以进行判断
        router.push(`/layout/home/singerDetails/${id}`);
      } else {
        ElMessage({
          message: "暂未歌手信息或注销！",
          type: "warning",
        });
      }
    }
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 点击上一页数据
     */
    function clickPre_data() {
      pageNo.value--;
    }
    /**
     * 点击下一页数据
     */
    function clickNext_data() {
      pageNo.value++;
      if (!singerData[pageNo.value]) {
        singer_flag.value = true;
        // 发请求
        getSingerClass_type(
          select_class.type,
          select_class.area,
          pageCount.value,
          pageNo.value,
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
     * 点击切换选中
     * @param {number} type 选中type类型
     * @param {number} area 选中area类型
     */
    function clickSwitch_selected(type, type_name, area, area_name) {
      pageNo.value = 1;
      singer_flag.value = true;
      select_class.type = type;
      select_class.area = area;
      select_class.type_name = type_name;
      select_class.area_name = area_name;
      //发送请求
      getSingerClass_type(
        select_class.type,
        select_class.area,
        pageCount.value,
        pageNo.value,
        true
      );
    }
    /**
     * 获取歌手分类列表
     * @param {number} type 取值:
     *                    -1:全部
     *                    1:男歌手
     *                    2:女歌手
     *                    3:乐队
     * @param {number} area 取值:
     *                    -1:全部
     *                    7华语
     *                    96欧美
     *                    8:日本
     *                    16韩国
     *                    0:其他
     * @param {number} limit : 返回数量 , 默认为 30
     * @param {number} offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     * @param { boolean }   flagScroll :标记是否为分页请求
     */
    async function getSingerClass_type(type, area, limit, offset, flagScroll) {
      const { data: res } = await getSingerClass_typeapi(
        type,
        area,
        limit,
        offset
      );
      singer_flag.value = false;
      if (res && res.code === 200) {
        if (res.artists.length <= 0) {
          ElMessage.closeAll();
          ElMessage({
            type: "warning",
            message: "已经到底了！",
          });
          pageNo.value--;
        } else {
          singerData.value[pageNo.value] = res.artists;
          if (flagScroll) {
            window.scrollTo({
              top: 0,
              behavior: "smooth", // 平滑滚动效果
            });
          }
        }
      }
    }
    getSingerClass_type(
      select_class.type,
      select_class.area,
      pageCount.value,
      pageNo.value,
      false
    );
    return {
      singer_flag,
      singer_type,
      singer_area,
      select_class,
      clickSwitch_selected,
      pageNo,
      leftDisabled,
      ArrowLeftBold,
      clickNext_data,
      clickPre_data,
      singerData,
      clickSingerName_Skpi_doc,
      clickUserNameSkip_doc,
    };
  },
});
</script>
      
<style lang="less" scoped>
.singer {
  width: 100%;
  display: flex;
  .singer_left {
    width: 20%;
    padding: 10px;
    border-right: 1px solid #dedede;
    .singer_area {
      h2 {
        margin: 2px 0;
        color: #333;
      }
      .singer_type {
        margin: 1px 0;
        padding: 8px;
        font-size: 14px;
        cursor: pointer;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #333;
        .flag_f {
          opacity: 0;
        }
        &:hover {
          color: #fff;
          background-color: #ff006f5b;
        }
      }
      .isSelected_singer {
        color: #ff006f !important;
        background-color: #ff006f37;
        .flag_f {
          opacity: 1;
        }
      }
    }
  }
  .singer_right {
    padding: 10px;
    width: 80%;
    h2 {
      margin-bottom: 5px;
      color: #333;
    }
    .singer_right_content {
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          margin: 1%;
          width: 18%;
          img {
            width: 100%;
            object-fit: cover;
            border-radius: 10px;
            border: 1px solid #dedede;
          }

          p {
            padding: 10px 2px;
            display: flex;
            font-size: 14px;
            font-weight: 700;
            justify-content: space-between;
            .singer_name {
              cursor: pointer;
              &:hover {
                color: #409eff;
                text-decoration: underline;
              }
            }
            .singer_user {
              margin-left: 10px;
              width: 20px;
              height: 20px;
              background-color: #ff006f;
              color: #fff;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              cursor: pointer;
            }
          }
        }
      }
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