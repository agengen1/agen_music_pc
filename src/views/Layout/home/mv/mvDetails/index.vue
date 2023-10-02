<template>
  <div class="mvDetails">
    <goBack></goBack>
    <Loading
      title="加载中...."
      textColor="#409eff"
      v-if="mvDetails_loading_flag"
    ></Loading>
    <div class="content" v-else>
      <div class="left">
        <div class="playV">
          <!-- 视频播放组件 -->
          <VIDEOPLAYER
            :mvSrc="mvUrl_data"
            :coverPic="mvDetails_data.cover + '?param=1012y585'"
          >
          </VIDEOPLAYER>
        </div>
        <div class="videoInfo">
          <p class="mvName">{{ mvDetails_data.name }}</p>
          <div class="personInfo" v-if="mvDetails_data.artists.length > 0">
            <img
              v-lazy="mvDetails_data.artists[0].img1v1Url + '?param=50y50'"
              :alt="mvDetails_data.artists[0].name"
              @click="clickSingerSkipDetails(mvDetails_data.artists[0].id)"
            />

            <span
              @click="clickSingerSkipDetails(mvDetails_data.artists[0].id)"
              >{{ mvDetails_data.artists[0].name }}</span
            >
          </div>
          <div class="otherInfo">
            <span>发布：{{ mvDetails_data.publishTime }}</span>
            <span
              >播放：{{ playCountTransform(mvDetails_data.playCount) }}次</span
            >
          </div>
        </div>
      </div>
      <div class="right">
        <h3>相关推荐</h3>
        <Loading
          title="加载中...."
          textColor="#409eff"
          v-if="mvDetailsSimilar_loading_flag"
        ></Loading>
        <div class="right_content" v-else>
          <div
            class="info"
            v-for="item in mvDetailsSimilar_data"
            :key="item.id"
            @click="clickMvSkipDetails(item.id)"
          >
            <div class="info_left">
              <img
                v-lazy="item.cover + '?param=450y260'"
                :alt="item.name"
                :title="item.name"
              />
              <div class="mask">
                <van-icon name="play" />
              </div>
              <div class="playCount">
                <van-icon name="play" />{{ playCountTransform(item.playCount) }}
              </div>
              <div class="mvTime">
                {{ computeMusicTimeDuration(item.duration) }}
              </div>
            </div>
            <p class="text_exceed_hide_one mvName">
              {{ item.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { getMvDetailsapi, getMvPlayUrlapi, getMvSimilarapi } from "@/api/mvApi";
import { useRoute, useRouter } from "vue-router";
import { computeMusicTimeDuration, playCountTransform } from "@/assets/public";

export default defineComponent({
  name: "mvDetails",
  setup() {
    let router = useRouter();
    let route = useRoute();
    let mvDetails_loading_flag = ref(true); //mv信息加载状态
    let mvDetailsSimilar_loading_flag = ref(true); //相关mv信息加载状态
    let mvDetails_data = ref({}); //mv数据
    let mvDetailsSimilar_data = ref([]); //相关mv列表
    let mvUrl_data = ref(""); //mv播放地址

    watch(
      () => route.params.mvId,
      (newVal) => {
        if (newVal) {
          mvDetails_loading_flag.value = true;
          mvDetailsSimilar_loading_flag.value = true;
          getMvDetails(newVal);
          getMvSimilar(newVal);
        }
      },
      { immediate: true }
    );

    /**
     * 点击跳转mv详情
     * @param {number | string} mvId
     */
    function clickMvSkipDetails(mvId) {
      router.push(`/layout/home/mvDetails/${mvId}`);
    }
    /**
     * 点击跳转歌手详情
     * @param {number | string} singerId
     */
    function clickSingerSkipDetails(singerId) {
      router.push(`/layout/home/singerDetails/${singerId}`);
    }

    /**
     * 获取mv数据详情
     * @param {string | number} id mvId
     */
    async function getMvDetails(id) {
      const { data: res } = await getMvDetailsapi(id);
      if (res && res.code === 200) {
        mvDetails_data.value = res.data;
        getMvPlayUrl(mvDetails_data.value.id, 1080);
      }
    }
    /**
     * 获取mv播放url
     * @param {string | number} id mvId
     * @param {string | number} rr mv分辨率 默认 1080,
     */
    async function getMvPlayUrl(id, rr) {
      const { data: res } = await getMvPlayUrlapi(id, rr);
      mvDetails_loading_flag.value = false;
      if (res && res.code === 200) {
        mvUrl_data.value = res.data.url;
      }
    }
    /**
     * 获取相似mv列表
     * @param {string | number} id mvId
     */
    async function getMvSimilar(id) {
      const { data: res } = await getMvSimilarapi(id);
      mvDetailsSimilar_loading_flag.value = false;
      if (res && res.code === 200) {
        mvDetailsSimilar_data.value = res.mvs;
      }
    }

    return {
      mvDetails_loading_flag,
      mvDetailsSimilar_loading_flag,
      mvDetails_data,
      mvDetailsSimilar_data,
      mvUrl_data,
      playCountTransform,
      computeMusicTimeDuration,
      clickMvSkipDetails,
      clickSingerSkipDetails,
    };
  },
});
</script>

<style lang='less' scoped>
.mvDetails {
  padding-bottom: 20px;
  .content {
    display: flex;
    .left {
      margin-right: 2%;
      width: 73%;
      display: flex;
      flex-direction: column;
      .videoInfo {
        margin-top: 5px;
        .mvName {
          padding-left: 5px;
          margin: 5px 0;
          font: 700 28px "黑体";
          color: #333;
        }
        .personInfo {
          margin-top: 5px;
          display: flex;
          align-items: center;
          img {
            width: 4vw;
            height: 4vw;
            object-fit: cover;
            border-radius: 50%;
            cursor: pointer;
          }
          span {
            cursor: pointer;
            margin-left: 6px;
            font: 700 18px "黑体";
            color: #333;
            &:hover {
              color: #409eff;
              text-decoration: underline;
            }
          }
        }
        .otherInfo {
          margin-top: 5px;
          padding-left: 5px;
          span {
            margin: 0 25px 0 0;
            color: #8e8e8e;
          }
        }
      }
    }
    .right {
      width: 25%;
      .right_content {
        display: flex;
        flex-direction: column;
        .info {
          padding: 10px 1.5%;
          display: flex;
          align-items: center;
          &:hover {
            background-color: #6eb6ff42;
          }
          cursor: pointer;
          .info_left {
            position: relative;
            width: 60%;
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
            .mask {
              position: absolute;
              transform: translateY(30px) translateX(-20px);
              transition: all 0.3s;
              left: 50%;
              top: 0;
              width: 40px;
              height: 40px;
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
              right: 0;
              top: 75%;
              background-color: #00000061;
              color: #ffffff;
              font-size: 14px;
              border-radius: 5px;
              border-bottom-right-radius: 10px;
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
          .mvName {
            flex: 1;
            padding-left: 10px;
            font: 500 14px "华文楷书";
          }
        }
      }
    }
  }
}
</style>