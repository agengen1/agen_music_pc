<template>
  <div class="collectMusic">
    <Loading
      title="加载中...."
      textColor="#409eff"
      v-if="MyCreateSongSheet_flag"
    ></Loading>
    <ul v-else class="myCollectSongSheet_content">
      <li
        v-for="(item, index) in MyCreateSongSheet"
        :key="item.id"
        @click="click_collectMusic(item.id)"
      >
        <div class="left">
          <img v-lazy="item.coverImgUrl + '?param=120y120'" />
        </div>
        <div class="right">
          <p v-if="index == 0" class="top_name">我喜欢的音乐</p>
          <p v-else class="top_name">{{ item.name }}</p>
          <p>{{ item.trackCount }} 首</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { getUserSongSheetDetailsapi } from "@/api/userDetailsApi";
import { push_delSongSheetMusicapi } from "@/api/songSheetDeaitlsApi";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default defineComponent({
  name: "collectMusic",
  setup() {
    let store = useStore();
    let MyCreateSongSheet = ref([]); //登录用户创建的歌单
    let MyCreateSongSheet_flag = ref(true); //获取歌单状态
    let loginUserId = computed(() => {
      return store.state.user.userinfo.userId;
    }); //登录用户id
    let collectMusicId = computed(() => {
      return store.state.collect.collectMusic_id;
    }); //收藏音乐id
    /**
     * 点击收藏音乐
     * @param {number} id 歌单id
     */
    function click_collectMusic(id) {
      push_delSongSheetMusic("add", id, collectMusicId.value);
    }
    /**
     * 歌单添加或删除歌曲
     * @param {string } op: 从歌单增加单曲为 add, 删除为 del
     * @param {string | number} pid: 歌单 id
     * @param {string | number} tracks: 歌曲 id,可多个,用逗号隔开
     */
    async function push_delSongSheetMusic(op, pid, tracks) {
      console.log(tracks);
      const { data: res } = await push_delSongSheetMusicapi(op, pid, tracks);
      console.log(res);
      if (res && res.body.code === 200) {
        ElMessage({
          type: "success",
          message: "添加成功！",
        });
        store.commit("collect/SETCOLLECTMUSIC_STATUS", false);
      } else if (res.body.code === 502) {
        ElMessage({
          type: "warning",
          message: res.body.message,
        });
        store.commit("collect/SETCOLLECTMUSIC_STATUS", false);
      } else {
        ElMessage({
          type: "error",
          message: "添加失败！",
        });
        store.commit("collect/SETCOLLECTMUSIC_STATUS", false);
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
      MyCreateSongSheet_flag.value = false;
      if (res && res.code === 200) {
        let Myarr = [];
        res.playlist.forEach((e) => {
          if (e.creator.userId === loginUserId.value) {
            Myarr.push(e);
          }
        });
        MyCreateSongSheet.value = Myarr;
      }
    }
    getUserSongSheetDetails(loginUserId.value, 100, 1);
    return {
      MyCreateSongSheet,
      MyCreateSongSheet_flag,
      click_collectMusic,
    };
  },
});
</script>

<style lang='less' scoped>
.collectMusic {
  .myCollectSongSheet_content {
    height: 50vh;
    overflow: scroll;
    li {
      padding: 5px;
      display: flex;
      cursor: pointer;
      &:hover {
        background-color: rgba(224, 224, 224, 0.731);
      }
      .left {
        width: 12%;
        img {
          width: 100%;
          object-fit: cover;
        }
      }
      .right {
        padding-left: 5px;
        width: 88%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top_name {
          color: #333;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>