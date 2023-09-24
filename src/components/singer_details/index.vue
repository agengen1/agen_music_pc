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
              <el-button type="primary" :icon="FolderAdd">收藏</el-button>
              <el-button
                v-if="singerDetails.user && singerDetails.user.userId"
                type="success"
                color="#6f10ff"
                :icon="User"
                @click="clickUserNameSkip_doc(singerDetails.user.userId)"
                >个人主页</el-button
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
      <div class="right">
        <h3>相似歌手</h3>
        <Loading
          v-if="similarSinger_flag"
          textColor="#409eff"
          title="加载中..."
        ></Loading>
        <div class="left_con" v-else>
          <ul>
            <li v-for="item in similarSinger" :key="item.id">
              <div class="singer_content_left">
                <img v-lazy="item.picUrl + '?param=80y80'" :alt="item.name" />
              </div>
              <div class="singer_content_right">
                <p>
                  <span @click="clickSkipSingerDetails(item.id)">{{
                    item.name
                  }}</span>
                  <span v-if="item.trans != null">{{ item.trans }}</span>
                </p>
                <p>
                  <span>{{ item.albumSize }}个专辑</span>
                  <span>{{ item.musicSize }}首音乐</span>
                </p>
              </div>
            </li>
          </ul>
        </div>
        <el-empty v-if="similarSinger.length <= 0" description="暂无相似歌手" />
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
    allAlbum,
    hotSongs,
    singerDesc,
  },
  setup() {
    let route = useRoute();
    let router = useRouter();
    let singerDetails = ref({}); //歌手详情
    let similarSinger = ref({}); //相似歌手数据
    let similarSinger_flag = ref(true); //相似歌手请求状态
    watch(
      () => route.params.singerId,
      (newVal) => {
        similarSinger_flag.value = true;
        singerDetails.value = {};
        getSingerDetails(newVal);
        getSingerSimilar(newVal);
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
     * 点击跳转歌手详情页面
     * @param {string |number} singerId
     */
    function clickSkipSingerDetails(singerId) {
      // TODO:
      router.push(`/layout/home/singerDetails/${singerId}`);
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
     * 相似歌手获取
     * @param {String | number} id 歌手id
     */
    async function getSingerSimilar(id) {
      const { data: res } = await getSingerSimilarapi(id);
      similarSinger_flag.value = false;
      if (res && res.code === 200) {
        similarSinger.value = res.artists;
      }
    }

    return {
      singerDetails,
      computeSingerAs,
      clickUserNameSkip_doc,
      similarSinger_flag,
      similarSinger,
      FolderAdd,
      User,
      clickSkipSingerDetails,
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

  .right {
    width: 25%;
    h3 {
      padding-left: 5px;
      height: 35px;
      line-height: 35px;
    }
    .left_con {
      padding: 0 10px;
      ul {
        li {
          padding: 8px;
          display: flex;
          width: 100%;
          &:hover {
            background-color: #f3f3f3;
          }
          .singer_content_left {
            width: 20%;
            img {
              width: 100%;
            }
          }
          .singer_content_right {
            padding-left: 5px;
            width: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
              &:nth-child(1) {
                span {
                  font-size: 14px;
                  color: #333;
                  font-weight: 700;
                  &:nth-child(1) {
                    cursor: pointer;
                    &:hover {
                      text-decoration: underline;
                      color: #409eff;
                    }
                  }
                  &:nth-child(2) {
                    margin-left: 5px;
                    color: #a8abb2;
                    font-size: 12px;
                  }
                }
              }
              &:nth-child(2) {
                span {
                  color: #898989;
                  margin-right: 5px;
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