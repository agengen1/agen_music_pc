<template>
  <Loading
    title="加载中...."
    textColor="#409eff"
    v-if="out_loading_flag"
  ></Loading>
  <div class="songSheet" v-else>
    <el-dropdown trigger="hover" :teleported="false">
      <div class="lable_content">
        <el-button type="primary" plain>
          全部分类 <el-icon :size="22"><Menu /></el-icon>
        </el-button>
        <span>{{ selectTag }}<i>(已选中)</i></span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-button color="#626aef" size="">全部</el-button>
          <div
            class="lable_info"
            v-for="(item, index) in songsheetLable.type"
            :key="index"
          >
            <h3>{{ item }}</h3>
            <div class="smallLabel">
              <span
                v-for="(smallItem, smallIndex) in songsheetLable.content[index]"
                :key="smallIndex"
                :class="{
                  isSelect: smallItem.name == selectTag,
                }"
                @click="clickSongSheetLable(smallItem.name)"
                >{{ smallItem.name }}</span
              >
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="divider"></div>
    <div class="songSheetContent">
      <Loading
        title="加载中...."
        textColor="#409eff"
        v-if="songSheet_loading_flag"
      ></Loading>
      <div class="content" v-else>
        <div class="info" v-for="item in nowSongSheetlist" :key="item.id">
          <img
            v-lazy="item.coverImgUrl + '?param=400y400'"
            :alt="item.name"
            :title="item.name"
            @click="clickSongSheetNameSkip(item.id)"
          />

          <p @click="clickSongSheetNameSkip(item.id)">{{ item.name }}</p>
          <!-- <p>{{ stamp_time(item.publishTime) }}</p> -->
        </div>
      </div>
      <div class="paginatio">
        <el-pagination
          background
          layout="total,slot,prev, pager, next,jumper"
          :total="SongSheetTotal"
          :default-page-size="pagCount"
          :current-page="pagNo"
          @current-change="handlerCurrentChange($event)"
          :disabled="songSheet_loading_flag"
        />
      </div>
    </div>
  </div>
</template>
    
<script>
import { defineComponent, reactive, ref } from "vue";
import {
  getSongSheetList_label_api,
  getSongSheetList_api,
} from "@/api/songSheetDeaitlsApi";
import { useRouter } from "vue-router";
import { Menu } from "@element-plus/icons-vue";

export default defineComponent({
  name: "songSheet",
  components: {
    Menu,
  },
  setup() {
    let router = useRouter();
    let out_loading_flag = ref(true); //外层loading加载状态
    let songSheet_loading_flag = ref(true); //歌单分页loading加载状态
    let songsheetLable = reactive({
      type: {}, //类型
      content: {}, //数据
    }); //标签数据
    let selectTag = ref("全部"); //选中歌单类型 默认全部

    let nowSongSheetlist = ref([]); //当前歌单列表数据
    let SongSheetTotal = ref(1000); //当前歌单共有歌单数量
    let pagCount = ref(30); //每一页多少条数据(歌单) 默认30
    let pagNo = ref(1); //当前第几页数据
    /**
     * 点击标签
     * @param {string} label 标签名称
     */
    function clickSongSheetLable(label) {
      pagNo.value = 1;
      selectTag.value = label;
      songSheet_loading_flag.value = true;
      getSongSheetList(selectTag.value, pagCount.value, pagNo.value);
    }
    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      songSheet_loading_flag.value = true;
      getSongSheetList(selectTag.value, pagCount.value, pagNo.value);
    }
    /**
     * 点击跳转歌单详情页
     * @param {string|number} id 歌单id
     */
    function clickSongSheetNameSkip(id) {
      router.push(`/layout/home/songSheetDetail/${id}`);
    }
    /**
     * 歌单广场标签获取
     */
    async function getSongSheetList_label() {
      const { data: res } = await getSongSheetList_label_api();
      out_loading_flag.value = false;
      if (res && res.code === 200) {
        songsheetLable.type = res.categories;
        let arrIndex = Object.keys(res.categories);
        arrIndex.forEach((el) => {
          songsheetLable.content[parseInt(el)] = res.sub.filter((els) => {
            return els.category === parseInt(el);
          });
        });
      }
    }
    /**
     * 歌单广场歌单获取
     * @param {string} tag 标签名称
     * @param {number} limit 取出多少页
     * @param {number} pagNO 分页第几页
     */
    async function getSongSheetList(tag, limit, pagNO) {
      const { data: res } = await getSongSheetList_api(tag, limit, pagNO);
      songSheet_loading_flag.value = false;
      if (res && res.code === 200) {
        SongSheetTotal.value = res.total;
        nowSongSheetlist.value = res.playlists;
      }
    }
    getSongSheetList_label();
    getSongSheetList(selectTag.value, pagCount.value, pagNo.value);
    return {
      out_loading_flag,
      songSheet_loading_flag,
      songsheetLable,
      pagNo,
      selectTag,
      pagCount,
      SongSheetTotal,
      handlerCurrentChange,
      clickSongSheetLable,
      nowSongSheetlist,
      clickSongSheetNameSkip,
    };
  },
});
</script>
    
<style lang="less" scoped>
/deep/ .el-popper {
  top: 40px !important;
  left: 0 !important;
  box-shadow: rgb(204, 204, 204) 1px 2px 5px 2px !important;
}
/deep/ .el-dropdown-menu {
  padding: 10px 20px;
  width: 40vw;
}
/deep/ .el-popper__arrow {
  width: 15px;
  height: 15px;
  left: 40px !important;
}
.songSheet {
  padding: 20px 0 10px;
  .lable_content {
    width: 100%;
    display: flex;
    align-items: center;
    &:focus-visible {
      outline: none;
    }
    > span {
      margin-left: 15px;
      font-size: 20px;
      color: #ff006d;
      > i {
        margin-left: 2px;
        font-size: 14px;
        color: #999;
      }
    }
  }
  .lable_info {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    .smallLabel {
      margin: 5px 0;
      padding-left: 15px;
      display: flex;
      flex-wrap: wrap;
      span {
        margin: 4px 5px;
        padding: 0 5px;
        font-size: 12px;
        color: #333;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          text-decoration: underline;
        }
      }
      .isSelect {
        color: #ff006d;
        background-color: #ff006d1a;
      }
    }
  }
  .divider {
    margin: 8px 0;
    width: 100%;
    background-color: #d1d1d16b;
    height: 3px;
  }
  .songSheetContent {
    .content {
      display: flex;
      flex-wrap: wrap;
      .info {
        margin: 10px 1%;
        width: 14.6%;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 90%;
          object-fit: cover;
          border-radius: 10px;
          cursor: pointer;
          border: 0.5px solid #ccc;
        }
        p {
          margin: 5px 0 0 0;
          width: 90%;
          font: 500 14px "华文楷书";
          &:nth-child(2) {
            cursor: pointer;
            &:hover {
              color: #409eff;
              text-decoration: underline;
            }
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