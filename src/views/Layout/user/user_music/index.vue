<template>
  <Loading
    title="加载中...."
    textColor="#409eff"
    v-if="
      userSongSheetType.MyCreatedSongSheet.length <= 0 &&
      userSongSheetType.MyCollectSongSheet.length <= 0
    "
  ></Loading>
  <div class="userMusic" v-else>
    <div class="userMusic_left">
      <el-menu :default-active="defaultSelete">
        <el-menu-item class="CreateSSheet" @click="clickCreateUserSongSheet">
          <el-icon><Plus /></el-icon>
          <template #title>新建歌单</template>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <span
              >我创建的歌单({{
                userSongSheetType.MyCreatedSongSheet.length
              }})</span
            >
          </template>
          <el-menu-item
            v-for="(item, index) in userSongSheetType.MyCreatedSongSheet"
            :key="item.id"
            :index="'1-' + item.id"
            @click="clickSkipUserMusic(item.id, 1)"
            :class="{ 'is-active': defaultSelete === '1-' + item.id }"
          >
            <div class="songSheetBox">
              <div class="left">
                <img v-lazy="item.coverImgUrl + '?param=120y120'" />
              </div>
              <div class="right">
                <p v-if="index === 0" class="text_exceed_hide_one">
                  我喜欢的音乐
                </p>
                <p v-else class="text_exceed_hide_one">{{ item.name }}</p>
                <p class="text_exceed_hide_one">{{ item.trackCount }}首</p>
              </div>
              <div class="operate" v-if="index != 0">
                <el-icon
                  class="edit_hover"
                  @click.stop="
                    clickEditSongSheet(item.id, item.name, item.description)
                  "
                  ><Edit
                /></el-icon>
                <el-icon
                  class="delete_hover"
                  @click.stop="clickDeleteSongSheet(item.id, item.name)"
                  ><Delete
                /></el-icon>
              </div>
            </div>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span
              >我收藏的歌单({{
                userSongSheetType.MyCollectSongSheet.length
              }})</span
            >
          </template>
          <el-menu-item
            v-for="item in userSongSheetType.MyCollectSongSheet"
            :key="item.id"
            :index="'2-' + item.id"
            @click="clickSkipUserMusic(item.id, 2)"
            :class="{ 'is-active': defaultSelete === '2-' + item.id }"
          >
            <div class="songSheetBox">
              <div class="left">
                <img v-lazy="item.coverImgUrl + '?param=120y120'" />
              </div>
              <div class="right">
                <p class="text_exceed_hide_one">{{ item.name }}</p>
                <p class="text_exceed_hide_one">
                  <span>{{ item.trackCount }}首 </span>
                  <span>by {{ item.creator.nickname }}</span>
                </p>
              </div>
              <div class="operate">
                <el-icon
                  class="delete_hover"
                  @click.stop="clickCancelSongSheet(item.id, item.name)"
                  ><Delete
                /></el-icon>
              </div>
            </div>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="userMusic_right">
      <router-view></router-view>
    </div>
    <!-- 监听 userMusic_right 右边翻滚-->
    <van-back-top
      target=".userMusic_right"
      :offset="300"
      bottom="20vh"
      right="3%"
    />
    <el-dialog v-model="dialog_Control" class="SongSheetInfoControl">
      <template #header>
        <p v-if="dialog_info.currType === 1" class="header_create">新建歌单</p>
        <p v-else class="header_edit">
          <span>{{ dialog_info.editinfo.SongSheetName }}</span>
          >
          <span>编辑歌单</span>
        </p>
      </template>
      <div class="create__S" v-if="dialog_info.currType === 1">
        <el-form-item label="歌单名：">
          <el-input
            autofocus
            placeholder="歌单名称"
            v-model="dialog_info.createinfo.new_SongSheetName"
          />
        </el-form-item>
        <p>可通过“收藏”将音乐添加到新歌单中</p>
      </div>
      <div class="edit__S" v-else>
        <el-form-item label="歌单名：" required>
          <el-input
            autofocus
            v-model="dialog_info.editinfo.ChangeSongSheetName"
          />
        </el-form-item>
        <el-form-item label="　 介 绍： ">
          <el-input
            v-model="dialog_info.editinfo.SongSheetDesc"
            :maxlength="1000"
            show-word-limit
            resize="none"
            :autosize="{ minRows: 5, maxRows: 10 }"
            type="textarea"
          />
        </el-form-item>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog_Control = false">取消</el-button>
          <el-button
            type="primary"
            v-if="dialog_info.currType === 1"
            @click="clickSubmitDialogInfo"
          >
            新建
          </el-button>
          <el-button type="primary" v-else @click="clickSubmitDialogInfo">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, reactive, ref } from "vue";

import { useRouter, useRoute } from "vue-router";
import { getUserSongSheetDetailsapi } from "@/api/userDetailsApi";
import {
  createNewSongSheet_api,
  updateSongSheet_info_api,
  deleteMyCreateSongSheet_api,
  manageSongSheet_api,
} from "@/api/songSheetDeaitlsApi";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { PackageMessageBox } from "@/assets/public";

export default defineComponent({
  name: "userMusic",
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  components: {
    Plus,
    Edit,
    Delete,
  },
  setup(props) {
    let userSongSheetType = reactive({
      MyCreatedSongSheet: [], // 我创建的歌单
      MyCollectSongSheet: [], //我收藏的歌单
    }); //歌单数据列表
    let route = useRoute();
    let router = useRouter();
    let defaultSelete = ref(""); //默认选中
    let dialog_Control = ref(false); //对话框打开状态（新建歌单/编辑歌单）
    let dialog_info = reactive({
      currType: null, //打开对话框状态 （1.表示当前为创建） （2.表示当前为编辑）
      createinfo: {
        new_SongSheetName: "", //创建新歌单名字
      },
      editinfo: {
        SongSheetId: "", //歌单id
        SongSheetName: "", //歌单名字-用于展示
        ChangeSongSheetName: "", //歌单名字(变化后)-用于提交
        SongSheetDesc: "", //歌单介绍,
      },
    }); //对话框详细内容
    /**
     * 点击跳转展示音乐详情
     * @param { number | string } id 歌单id
     */
    function clickSkipUserMusic(id, type) {
      defaultSelete.value = type + "-" + id; //用来设置选中状态
      router.push(`/layout/user/userMusicSongSheet/${id}`);
    }
    /**
     * 点击新建歌单
     */
    function clickCreateUserSongSheet() {
      dialog_Control.value = true;
      dialog_info.currType = 1;
    }
    /**
     * 点击编辑歌单
     * @param { number | string } id 歌单id
     * @param { string } name 歌单名称
     * @param { string } desc 歌单介绍
     */
    function clickEditSongSheet(id, name, desc) {
      dialog_Control.value = true;
      dialog_info.currType = 2;
      dialog_info.editinfo.SongSheetId = id;
      dialog_info.editinfo.SongSheetName = name;
      dialog_info.editinfo.ChangeSongSheetName = name;
      desc != null
        ? (dialog_info.editinfo.SongSheetDesc = desc)
        : (dialog_info.editinfo.SongSheetDesc = "");
    }
    /**
     * 提交数据（根据打开对话框状态）来提交不同的数据
     * 1--提交创建歌单数据
     * 2--提交编辑歌单数据
     */
    function clickSubmitDialogInfo() {
      ElMessage.closeAll(); //点击之前关闭前面所有的消息提示
      if (dialog_info.currType === 1) {
        if (dialog_info.createinfo.new_SongSheetName == "") {
          return ElMessage({
            message: "请填写歌单名！",
            type: "warning",
          });
        }
        //提交创建歌单数据
        createNewSongSheet(dialog_info.createinfo.new_SongSheetName);
      } else if (dialog_info.currType === 2) {
        if (dialog_info.editinfo.ChangeSongSheetName == "") {
          return ElMessage({
            message: "请填写歌单名！",
            type: "warning",
          });
        }
        //提交编辑歌单数据
        updateSongSheet_info(
          dialog_info.editinfo.SongSheetId,
          dialog_info.editinfo.ChangeSongSheetName,
          dialog_info.editinfo.SongSheetDesc
        );
      }
    }
    /**
     * 删除创建的歌单
     * @param {number | string} id 歌单id
     * @param {number | string} name 歌单名称
     */
    function clickDeleteSongSheet(id, name) {
      PackageMessageBox(`确定删除歌单?  (${name})`, "删除提示", {
        type: "warning",
        draggable: true,
      })
        .then(() => {
          // 确定，执行删除
          let isMe = false; //表示是否为现在展示路由id和删除歌单id 相同 （false-不同，true-相同）
          if (id == route.params.id) {
            isMe = true;
          }
          deleteMyCreateSongSheet(id, isMe);
        })
        .catch(() => {
          //取消，什么都不用干
        });
    }
    /**
     * 取消收藏 歌单
     * @param {number | string} id 歌单id
     * @param {number | string} name 歌单名称
     */
    function clickCancelSongSheet(id, name) {
      PackageMessageBox(`确定取消收藏歌单?  (${name})`, "取消收藏提示", {
        type: "warning",
        draggable: true,
      })
        .then(() => {
          // 确定，执行删除
          let isMe = false; //表示是否为现在展示路由id和删除歌单id 相同 （false-不同，true-相同）
          if (id == route.params.id) {
            isMe = true;
          }
          manageSongSheet(id, 2, isMe);
        })
        .catch(() => {
          //取消，什么都不用干
        });
    }
    /**
     * 删除我创建的歌单
     * @param {number|string} id 我创建的歌单id
     * @param { boolean } isMe 是否为取消收藏歌单id和当前展示歌单id相同
     */
    async function deleteMyCreateSongSheet(id, isMe) {
      const { data: res } = await deleteMyCreateSongSheet_api(id);
      if (res && res.code === 200) {
        ElMessage({
          message: "删除成功！",
          type: "success",
        });
        if (isMe) {
          let delete_nextid = "";
          for (
            let i = 0;
            i < userSongSheetType.MyCreatedSongSheet.length;
            i++
          ) {
            if (userSongSheetType.MyCreatedSongSheet[i].id === id) {
              if (i >= userSongSheetType.MyCreatedSongSheet.length - 1) {
                delete_nextid = userSongSheetType.MyCreatedSongSheet[0].id;
              } else {
                delete_nextid = userSongSheetType.MyCreatedSongSheet[i + 1].id;
              }
            }
          }
          console.log(delete_nextid, defaultSelete.value);
          defaultSelete.value = "1-" + delete_nextid;
          router.push(`/layout/user/userMusicSongSheet/${delete_nextid}`);
        }
        userSongSheetType.MyCreatedSongSheet =
          userSongSheetType.MyCreatedSongSheet.filter((e) => e.id != id);
      } else {
        ElMessage({
          message: "删除失败！",
          type: "error",
        });
      }
    }
    /**
     * 收藏/取消收藏 歌单
     * @param {number|string} id 歌单id
     * @param {number|string} type 类型：(1:收藏 - 2:取消收藏)
     * @param { boolean } isMe 是否为取消收藏歌单id和当前展示歌单id相同
     *
     */
    async function manageSongSheet(id, type, isMe) {
      const { data: res } = await manageSongSheet_api(id, type);
      if (res && res.code === 200) {
        ElMessage({
          message: "取消收藏成功！",
          type: "success",
        });
        if (isMe) {
          let delete_nextid = "";
          for (
            let i = 0;
            i < userSongSheetType.MyCollectSongSheet.length;
            i++
          ) {
            if (userSongSheetType.MyCollectSongSheet[i].id === id) {
              if (i >= userSongSheetType.MyCollectSongSheet.length - 1) {
                delete_nextid = userSongSheetType.MyCollectSongSheet[0].id;
              } else {
                delete_nextid = userSongSheetType.MyCollectSongSheet[i + 1].id;
              }
            }
          }
          console.log(delete_nextid, defaultSelete.value);
          defaultSelete.value = "2-" + delete_nextid;
          router.push(`/layout/user/userMusicSongSheet/${delete_nextid}`);
        }
        userSongSheetType.MyCollectSongSheet =
          userSongSheetType.MyCollectSongSheet.filter((e) => e.id != id);
      } else {
        ElMessage({
          message: "取消收藏失败！",
          type: "error",
        });
      }
    }
    /**
     * 获取用户歌单 (并处理为 创建/收藏-两种数据)
     * @param { String|Number } id 用户id
     * @param { String|Number } limit : 返回数量 , 默认为 30
     * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     */
    async function getUserSongSheetDetails(id, limit, offset) {
      const { data: res } = await getUserSongSheetDetailsapi(id, limit, offset);
      if (res && res.code === 200) {
        res.playlist.forEach((e) => {
          if (e.creator.userId === props.userId) {
            userSongSheetType.MyCreatedSongSheet.push(e);
          } else {
            userSongSheetType.MyCollectSongSheet.push(e);
          }
        });

        defaultSelete.value = "1-" + userSongSheetType.MyCreatedSongSheet[0].id;
        router.push(
          `/layout/user/userMusicSongSheet/${userSongSheetType.MyCreatedSongSheet[0].id}`
        );
      }
    }
    /**
     * 新建歌单
     * @param {string} name 歌单名称
     */
    async function createNewSongSheet(name) {
      const { data: res } = await createNewSongSheet_api(name);
      if (res && res.code === 200) {
        ElMessage({
          message: "新建成功！",
          type: "success",
        });
        userSongSheetType.MyCreatedSongSheet.push(res.playlist);
        dialog_Control.value = false;
        dialog_info.createinfo.new_SongSheetName = "";
      } else {
        ElMessage({
          message: "新建失败！" + res.message,
          type: "error",
        });
      }
    }
    /**
     * 更新歌单信息
     * @param {number | string} id 歌单id
     * @param {string} name 歌单名称
     * @param {string} desc 歌单介绍
     */
    async function updateSongSheet_info(id, name, desc) {
      const { data: res } = await updateSongSheet_info_api(id, name, desc);
      if (res && res.code === 200) {
        ElMessage({
          message: "保存成功！",
          type: "success",
        });
        let arr = userSongSheetType.MyCreatedSongSheet.filter(
          (e) => e.id === id
        );
        arr[0].name = name;
        arr[0].description = desc;
        defaultSelete.value = "1-" + id;
        if (route.params.id == id) {
          router.replace({
            path: `/layout/user/userMusicSongSheet/${id}`,
            query: {
              refreshs: "true" + Date.now(),
            },
          });
        } else {
          router.replace(`/layout/user/userMusicSongSheet/${id}`);
        }
        dialog_Control.value = false;
      } else {
        ElMessage({
          message: "保存失败！",
          type: "error",
        });
      }
    }
    onBeforeMount(() => {
      getUserSongSheetDetails(props.userId, 100, 1);
    });

    return {
      defaultSelete,
      dialog_Control,
      dialog_info,
      userSongSheetType,
      clickSkipUserMusic,
      clickCreateUserSongSheet,
      clickEditSongSheet,
      clickSubmitDialogInfo,
      clickDeleteSongSheet,
      clickCancelSongSheet,
    };
  },
});
</script>

<style lang='less' scoped>
.userMusic {
  width: 100%;
  height: calc(100vh - 70px);
  display: flex;
  /deep/ .el-form-item__label {
    color: #000;
    font-weight: 700;
  }
  .userMusic_left {
    width: 20%;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #dedede;
    /deep/ .el-menu {
      border-right: none;
    }
    /deep/.el-sub-menu__title {
      padding-left: 5px;
      border-bottom: 1px solid #f1f1f1;
      border-right: none;
      span {
        font-size: 16px;
        font-weight: 700;
      }
    }
    .el-menu-item {
      height: 100%;
      padding: 5px 0;
      width: 100%;
      white-space: normal;
      &:hover .operate {
        display: flex;
      }
    }
    .el-menu-item.is-active {
      background-color: #c3e1ffc4;
      color: #ff006d;
    }
    .CreateSSheet {
      padding-left: 10px;
      width: 100%;
      height: 50px;
      background-color: #409eff;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .songSheetBox {
      padding: 0 5px;
      display: flex;
      height: 100%;
      width: 100%;
      .left {
        width: 50px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          object-fit: cover;
          border-radius: 5px;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 5px;
        p {
          width: 100%;
          height: 20px;
          line-height: 20px;

          &:nth-child(1) {
            font: 500 14px "";
          }
          &:nth-child(2) {
            font: 500 12px "";
            color: #8d8d8d;
          }
        }
      }
      .operate {
        width: 10%;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        i {
          color: #949494 !important;
        }
        .edit_hover {
          &:hover {
            color: #409eff !important;
          }
        }
        .delete_hover {
          &:hover {
            color: red !important;
          }
        }
      }
    }
  }
  .userMusic_right {
    padding-right: 15px;
    margin-top: 5px;
    width: 80%;
    height: calc(100%-5px);
    overflow: auto;
  }
  .SongSheetInfoControl {
    .header_create {
      font: 700 18px "";
    }
    .header_edit {
      font: 500 16px "";
      color: #656565;
      span {
        &:nth-child(1) {
          font-size: 18px;
          color: #409eff;
          font-weight: 700;
        }
      }
    }
    .create__S {
      p {
        text-align: center;
        color: #a3a1a1;
      }
    }
  }
}
</style>