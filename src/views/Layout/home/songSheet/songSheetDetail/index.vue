<template>
  <div class="songSheetDetail">
    <goBack></goBack>
    <div class="content">
      <div class="left">
        <musicDetails></musicDetails>
      </div>
      <div class="right">
        <Loading
          title="加载中...."
          textColor="#409eff"
          v-if="SongSheet_flag"
        ></Loading>
        <div class="right_content" v-else>
          <div class="subPerson" v-if="SongSheetPersonList.length > 0">
            <h3>收藏此歌单的用户</h3>
            <div class="subPerson_content">
              <div
                class="subInfo"
                v-for="item in SongSheetPersonList"
                :key="item.userId"
                @click="clickUserNameSkip_doc(item.userId)"
              >
                <img
                  v-lazy="item.avatarUrl + '?param=120y120'"
                  :alt="item.nickname"
                  :title="item.nickname"
                />
              </div>
            </div>
          </div>
          <div class="simi">
            <h3>相似歌单</h3>
            <div class="simi_content" v-if="simiSongSheetList.length > 0">
              <div
                class="simiInfo"
                v-for="item in simiSongSheetList"
                :key="item.id"
                @click="clickSongSheetNameSkip(item.id)"
              >
                <div class="simiInfo_left">
                  <img
                    v-lazy="item.coverImgUrl + '?param=120y120'"
                    :alt="item.name"
                    :title="item.name"
                  />
                </div>
                <div class="simiInfo_right">
                  <p class="text_exceed_hide_one">{{ item.name }}</p>
                  <p>by {{ item.creator.nickname }}</p>
                </div>
              </div>
            </div>
            <el-empty v-else description="暂无相似歌单" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import musicDetails from "@/components/music_details/index.vue";
import {
  getSimiSongSheet_api,
  getSongSheetSubscribers_api,
} from "@/api/songSheetDeaitlsApi";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
  name: "songSheetDetail",
  components: {
    musicDetails,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let simiSongSheetList = ref([]); //相似歌单数据
    let SongSheetPersonList = ref([]); //收藏歌单用户数据
    let SongSheet_flag = ref(true); //相似歌曲加载状态
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal) {
          SongSheet_flag.value = true;
          getSimiSongSheet(newVal);
        }
      },
      {
        immediate: true,
      }
    );

    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }

    /**
     * 点击跳转歌单详情页
     * @param {string|number} id 歌单id
     */
    function clickSongSheetNameSkip(id) {
      router.push(`/layout/home/songSheetDetail/${id}`);
    }

    /**
     * 获取相似歌单
     * @param {number | string} songSheetId  歌单id
     */
    async function getSimiSongSheet(id) {
      const { data: res } = await getSimiSongSheet_api(id);
      if (res && res.code === 200) {
        simiSongSheetList.value = res.playlists;
        getSongSheetSubscribers(id, 10, 1);
      }
    }
    /**
     * 获取歌单收藏者
     * @param {number | string} songSheetId  歌单id
     * @param {number}  limit: 取出评论数量 , 默认为 20
     * @param {number}  offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
     */
    async function getSongSheetSubscribers(id, count, No) {
      const { data: res } = await getSongSheetSubscribers_api(id, count, No);
      SongSheet_flag.value = false;
      if (res && res.code === 200) {
        SongSheetPersonList.value = res.subscribers;
      }
    }
    return {
      SongSheet_flag,
      simiSongSheetList,
      SongSheetPersonList,
      clickUserNameSkip_doc,
      clickSongSheetNameSkip,
    };
  },
});
</script>

<style lang='less' scoped>
.songSheetDetail {
  .content {
    margin-top: 5px;
    width: 100%;
    display: flex;
    .left {
      width: 75%;
    }
    .right {
      padding: 0 10px;
      width: 25%;
      .right_content {
        display: flex;
        flex-direction: column;
        > div {
          margin-bottom: 5px;
          h3 {
            padding-left: 5px;
            height: 30px;
            line-height: 30px;
          }
          > div {
            padding-left: 10px;
          }
        }
        .subPerson {
          .subPerson_content {
            display: flex;
            flex-wrap: wrap;
            .subInfo {
              margin: 1.5%;
              width: 17%;
              img {
                width: 100%;
                border-radius: 10px;
                cursor: pointer;
                border: 1px solid #ededed;
              }
            }
          }
        }
        .simi {
          .simi_content {
            display: flex;
            flex-direction: column;
            .simiInfo {
              display: flex;
              padding: 5px 5px;
              cursor: pointer;
              &:hover {
                background-color: #ededed;
              }
              .simiInfo_left {
                width: 20%;
                img {
                  width: 100%;
                  object-fit: cover;
                  border-radius: 10px;
                  border: 1px solid #ededed;
                }
              }
              .simiInfo_right {
                width: 80%;
                padding-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p {
                  color: #333;
                  font-size: 14px;

                  &:nth-child(2) {
                    color: #a4a4a4;
                    font-size: 12px;
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