<template>
  <goBack></goBack>
  <Loading
    v-if="singerDetails.artist == null && JSON.stringify(singerDetails) == '{}'"
    textColor="#409eff"
    title="加载中..."
  ></Loading>
  <div v-else>
    <div class="singerDetails_content">
      <div class="left">
        <h3>相似歌手</h3>
        <div class="left_con"></div>
      </div>
      <div class="right">
        <div class="details">
          <div class="backimg">
            <img
              v-lazy="singerDetails.artist.avatar + '?param=300y300'"
              :alt="singerDetails.artist.name"
              :title="singerDetails.artist.name"
            />
          </div>
          <div class="info">
            <p class="info_name">{{ singerDetails.artist.name }}</p>
            <p class="info_as">
              {{ computeSingerAs(singerDetails.artist.alias) }}
            </p>
            <p class="info_identify" v-if="singerDetails.identify != null">
              <img v-lazy="singerDetails.identify.imageUrl" />
              <span>{{ singerDetails.identify.imageDesc }}</span>
            </p>
            <p class="info_identities">
              <span
                v-if="
                  singerDetails.artist.identities &&
                  singerDetails.artist.identities.length > 0
                "
              >
                <span
                  v-for="item in singerDetails.artist.identities"
                  :key="item"
                  >{{ item }}</span
                >
              </span>
              <span
                v-if="
                  singerDetails.artist.identifyTag &&
                  singerDetails.artist.identifyTag.length > 0
                "
              >
                <span
                  v-for="item in singerDetails.artist.identifyTag"
                  :key="item"
                  >{{ item }}</span
                >
              </span>
            </p>
            <p class="info_buttons">
              <el-button type="primary" plain
                ><el-icon><FolderAdd /></el-icon>收藏</el-button
              >
              <el-button
                v-if="singerDetails.user && singerDetails.user.userId"
                type="success"
                plain
                @click="clickUserNameSkip_doc(singerDetails.user.userId)"
                ><el-icon><User /></el-icon>个人主页</el-button
              >
            </p>
          </div>
        </div>
        <div class="allSingerOther_content">
          <van-tabs>
            <van-tab title="热门单曲"
              ><hotSongs :singerId="singerDetails.artist.id"></hotSongs
            ></van-tab>
            <van-tab title="所有专辑"
              ><allAlbum
                :singerId="singerDetails.artist.id"
                :albumTotal="singerDetails.artist.albumSize"
              ></allAlbum
            ></van-tab>
            <van-tab title="艺人简介"
              ><singerDesc
                :singerId="singerDetails.artist.id"
                :singerName="singerDetails.artist.name"
              ></singerDesc
            ></van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import goBack from "@/components/tool_components/goBack.vue";
import { getSingerDetailsapi, getSingerSimilarapi } from "@/api/singerApi";
import { useRoute, useRouter } from "vue-router";
import { computeSingerAs } from "@/assets/public";
import { FolderAdd, User } from "@element-plus/icons-vue";
import allAlbum from "@/components/singer_details/all_album/index.vue";
import hotSongs from "@/components/singer_details/hot_songs/index.vue";
import singerDesc from "@/components/singer_details/singer_desc/index.vue";
export default defineComponent({
  name: "singerDetails",
  components: {
    goBack,
    FolderAdd,
    User,
    allAlbum,
    hotSongs,
    singerDesc,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let singerDetails = ref({}); //歌手详情
    let similarSinger = ref({}); //
    watch(
      () => route.params.singerId,
      (newVal) => {
        singerDetails.value = {};
        getSingerDetails(newVal);
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
     * 歌手详情获取
     * @param {String | number} id 歌手id
     */
    async function getSingerDetails(id) {
      const { data: res } = await getSingerDetailsapi(id);
      if (res && res.code === 200) {
        singerDetails.value = res.data;
      }
    }
    /**
     * 相似歌手获取 -- 需要登录
     * @param {String | number} id 歌手id
     */
    async function getSingerSimilar(id) {
      const { data: res } = await getSingerSimilarapi(id);
      console.log(res);
      if (res && res.code === 200) {
      }
    }
    getSingerSimilar(route.params.singerId);

    return {
      singerDetails,
      computeSingerAs,
      clickUserNameSkip_doc,
    };
  },
});
</script>

<style lang='less' scoped>
.singerDetails_content {
  display: flex;
  /deep/ .van-tabs__line {
    height: 5px;
  }
  /deep/ .van-tab--active {
    transform: scale(1.2);
  }
  .left {
    width: 25%;
    border: 1px solid red;
    h3 {
      padding-left: 5px;
      height: 35px;
      line-height: 35px;
      border-left: 4px solid #23d623;
    }
  }
  .right {
    padding-left: 20px;
    width: 75%;
    .details {
      display: flex;
      .backimg {
        width: 25%;
        img {
          width: 90%;
          object-fit: cover;
          border-radius: 10px;
        }
      }
      .info {
        width: 75%;
        p {
          margin: 10px 0;
          font: 500 16px "华文楷书";
        }
        .info_name {
          font: 700 22px "华文楷书";
        }
        .info_as {
        }
        .info_identify {
          img {
            margin-right: 10px;
            width: 4%;
            object-fit: cover;
          }
          span {
            font: 500 14px "华文楷书";
          }
        }
        .info_identities {
          display: flex;
          > span {
            span {
              padding: 3px 6px;
              margin: 0 10px 0 0;
              font: 700 14px "华文楷书";
              background-color: #f0483b;
              color: #fff;
              border-radius: 5px;
            }
          }
        }
        .info_buttons {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>