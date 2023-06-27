<template>
  <div class="recommend">
    <div class="carousel">
      <el-carousel :interval="4000" type="card" height="220px">
        <el-carousel-item v-for="item in banners_arr" :key="item.targetId">
          <img v-lazy="item.imageUrl" :alt="item.typeTitle" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="content">
      <div class="main">
        <div class="songsheet">
          <h2><span>歌单推荐</span><span>更多</span></h2>
          <div class="songsheet_content">
            <el-carousel height="440px" direction="vertical" :interval="5000">
              <el-carousel-item>
                <div class="box">
                  <div
                    class="one_songsheet"
                    v-for="item in songSheet_arr[0]"
                    :key="item.id"
                    @click="clickSongSheet_one(item)"
                  >
                    <div>
                      <img
                        v-lazy="item.picUrl + '?param=550y550'"
                        :alt="item.name"
                      />
                      <p></p>
                    </div>
                    <p>{{ item.name }}</p>
                  </div>
                </div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="box">
                  <div
                    class="one_songsheet"
                    v-for="item in songSheet_arr[1]"
                    :key="item.id"
                    @click="clickSongSheet_one(item)"
                  >
                    <div>
                      <img
                        v-lazy="item.picUrl + '?param=550y550'"
                        :alt="item.name"
                      />
                      <p></p>
                    </div>
                    <p class="text_exceed_hide_two">{{ item.name }}</p>
                  </div>
                </div>
              </el-carousel-item>
              <el-carousel-item>
                <div class="box">
                  <div
                    class="one_songsheet"
                    v-for="item in songSheet_arr[2]"
                    :key="item.id"
                    @click="clickSongSheet_one(item)"
                  >
                    <div>
                      <img
                        v-lazy="item.picUrl + '?param=550y550'"
                        :alt="item.name"
                      />
                      <p></p>
                    </div>
                    <p>{{ item.name }}</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="music">
          <h2><span>音乐推荐</span><span>更多</span></h2>
          <div class="music_content">
            <div
              class="music_one"
              v-for="item in music_arr"
              :key="item.id"
              @click="clickMusic_one(item)"
            >
              <div class="music_one_left">
                <img v-lazy="item.picUrl + '?param=120y120'" :alt="item.name" />
              </div>
              <div class="music_one_right">
                <div class="left">
                  <p class="text_exceed_hide_one">{{ item.name }}</p>
                  <p
                    class="text_exceed_hide_one"
                    v-if="item.song.artists.length > 0"
                  >
                    {{ item.song.artists[0].name }}
                  </p>
                </div>
                <div class="right">
                  {{ computeMusicTimeDuration(item.song.hMusic.playTime) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="charts">
          <h2><span>排行榜</span><span>更多</span></h2>
          <div class="charts_content">
            <div
              class="charts_one"
              v-for="item in ranking_arr_three"
              :key="item.id"
            >
              <div class="charts_one_top">
                <p>{{ item.name }}</p>
                <p class="text_exceed_hide_two">{{ item.description }}</p>
              </div>
              <div class="charts_one_line"></div>
              <div class="charts_one_content">
                <p
                  v-for="(itemMusic, index) in item.ranking_musics"
                  :key="itemMusic.id"
                  @click="clickCharts_one(itemMusic)"
                >
                  <span>{{ index + 1 }}</span>
                  <span class="text_exceed_hide_one">{{ itemMusic.name }}</span>
                  <span>{{ computeMusicTimeDuration(itemMusic.dt) }}</span>
                </p>

                <p class="view_all" @click="clickCharts_view_all(item)">
                  查看全部
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="side_info">
        <div class="userinfo">
          <div class="userinfo_show" v-if="isLogin">
            <!-- 登录过显示此区域 -->
            登录过
          </div>
          <div class="userinfo_hide" v-else>
            <!-- 未登录过显示此区域 -->
            <p>你暂未登录,登录享受更多功能！</p>
            <button @click="clickLogin">点击登录</button>
          </div>
        </div>
        <div class="singer">
          <h2><span>热门歌手</span><span>更多</span></h2>
          <div class="singer_content">
            <div
              class="singer_one"
              v-for="item in singer_arr"
              :key="item.id"
              @click="clickSinger_one(item)"
            >
              <div class="singer_one_left">
                <img
                  v-lazy="item.img1v1Url + '?param=120y120'"
                  :alt="item.name"
                  :title="item.name"
                />
              </div>
              <div class="singer_one_right">
                <p class="text_exceed_hide_one">{{ item.name }}</p>
                <p v-if="item.alias.length > 0" class="text_exceed_hide_one">
                  {{ computeSingerAs(item.alias) }}
                </p>
                <p class="text_exceed_hide_one">粉丝：{{ item.fansCount }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { defineComponent, markRaw, reactive, ref } from "vue";
import {
  getSwipePicapi,
  getRecommendMusicapi,
  getRecommendSongSheetapi,
  getHotSingerapi,
  getRankingListapi,
} from "@/api/recommendApi";
import { getSongSheet_Music_All_api } from "@/api/publicApi";
import { computeMusicTimeDuration, computeSingerAs } from "@/assets/public";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "recommend",
  setup() {
    /**
     * 此处不用reactive的原因是，ajax获取到的数据无需响应式
     * 所以使用ref和markRaw来取消响应式
     */
    let banners_arr = ref([]);
    let music_arr = ref([]);
    let songSheet_arr = ref([]);
    let singer_arr = ref([]);
    let isLogin = ref(false);
    let ranking_arr_three = reactive([]);
    let router = useRouter();

    /**
     * clickSongSheet_one
     * @param {String} SongSheetID 歌单ID
     * 功能：点击跳转，通过传递的参数跳转到歌单详情页
     */
    function clickSongSheet_one(SongSheetID) {
      console.log(SongSheetID);
      // 跳转歌单详情页 TODO:
    }
    /**
     * clickMusic_one
     * @param {Object} data_Music
     * 功能：点击播放歌曲，添加播放列表
     */
    function clickMusic_one(data_Music) {
      console.log(data_Music);
      // TODO:
    }
    /**
     * clickSinger_one
     * @param {Object} data_Singer
     * 功能：点击歌手卡片，跳转歌手详情页
     */
    function clickSinger_one(data_Singer) {
      console.log(data_Singer);
      // TODO:
    }
    /**
     * clickCharts_one
     * @param {Object} data_Charts
     * 功能：点击音乐名称，跳转音乐详情页
     */
    function clickCharts_one(data_Charts) {
      console.log(data_Charts);
      // TODO:
    }
    /**
     * clickCharts_view_all
     * @param {Object} data_Charts_view_all
     * 功能：点击查看全部，跳转排行榜详情
     */
    function clickCharts_view_all(data_Charts_view_all) {
      // TODO:
      router.push(`/layout/home/charts/details/${data_Charts_view_all.id}`);
    }
    /**
     * clickLogin
     * 没有参数
     * 功能：点击登录
     */
    function clickLogin() {
      console.log("登录");
      // TODO:
    }
    /**
     * getSwipePic
     * 获取轮播图函数 ：没有参数
     * 返回promise对象
     */
    async function getSwipePic() {
      let { data: res } = await getSwipePicapi();
      if (res.code == 200) {
        banners_arr.value = markRaw(res.banners);
      }
    }
    /**
     * getRecommendMusic
     * 获取热门音乐函数 ：没有参数--10条
     * 返回promise对象
     */
    async function getRecommendMusic() {
      let { data: res } = await getRecommendMusicapi();
      if (res.code == 200) {
        music_arr.value = markRaw(res.result);
      }
    }
    /**
     * getRecommendSongSheet
     * 获取热门歌单函数 ：没有参数--30条
     * 返回promise对象
     */
    async function getRecommendSongSheet() {
      let { data: res } = await getRecommendSongSheetapi();
      if (res.code == 200) {
        let songSheet_1 = [];
        let songSheet_2 = [];
        let songSheet_3 = [];
        res.result.forEach((item, index) => {
          if (index < 10) {
            songSheet_1.push(item);
          } else if (index < 20) {
            songSheet_2.push(item);
          } else {
            songSheet_3.push(item);
          }
        });
        songSheet_arr.value = markRaw([songSheet_1, songSheet_2, songSheet_3]);
      }
    }
    /**
     * getHotSinger
     * 获取热门歌手函数 ：没有参数--10条
     * 返回promise对象
     */
    async function getHotSinger() {
      let { data: res } = await getHotSingerapi();
      if (res.code == 200) {
        singer_arr.value = markRaw(res.artists);
      }
    }
    /**
     * getRankingList
     * 获取排行榜详情 -- 排行榜音乐(5首) 函数
     * 返回promise对象
     */
    async function getRankingList() {
      let { data: res } = await getRankingListapi();
      if (res.code === 200) {
        res.list.forEach((item, index) => {
          if (index < 3) {
            ranking_arr_three.push(item);
          }
        });
        //下面为获取排行榜的音乐(获取5首)
        for (let i = 0; i < ranking_arr_three.length; i++) {
          let { data: res } = await getSongSheet_Music_All_api(
            ranking_arr_three[i].id,
            5
          );
          ranking_arr_three[i]["ranking_musics"] = res.songs;
        }
      }
    }
    getSwipePic();
    getRecommendMusic();
    getRecommendSongSheet();
    getHotSinger();
    getRankingList();
    return {
      banners_arr,
      music_arr,
      songSheet_arr,
      singer_arr,
      ranking_arr_three,
      isLogin,
      clickSongSheet_one,
      clickLogin,
      clickMusic_one,
      clickSinger_one,
      clickCharts_one,
      clickCharts_view_all,
      computeMusicTimeDuration,
      computeSingerAs,
    };
  },
});
</script>
  
<style lang="less" scoped>
/deep/ .el-carousel__indicator.is-active button {
  background-color: #ff006c;
}
/deep/ .el-carousel__button {
  background-color: #989191;
}
.recommend {
  .carousel {
    margin: 20px 0 10px;
    .el-carousel__item--card {
      border-radius: 10px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .content {
    display: flex;
    .main {
      padding: 0 25px;
      width: 75%;
      .songsheet {
        h2 {
          display: flex;
          font-size: 22px;
          height: 40px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #23d623;
          span {
            color: #000;
            &:nth-child(2) {
              font-size: 14px;
              color: #989898;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .songsheet_content {
          width: 100%;
          .box {
            padding-right: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            background-color: #f6f6f6;
            .one_songsheet {
              width: 160px;
              height: 200px;
              margin: 10px 5px;
              cursor: pointer;
              div {
                position: relative;
                width: 100%;
                height: 160px;
                border-radius: 10px;
                overflow: hidden;
                &:hover img {
                  transform: scale(1.2);
                }
                &:hover p {
                  transform: scale(1);
                  opacity: 1;
                }
                p {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  margin-left: -25px;
                  margin-top: -25px;
                  width: 50px;
                  height: 50px;
                  background-color: #fffffff6;
                  border-radius: 50%;
                  border: 1px solid #d8d8d8;
                  z-index: 2;
                  transform: scale(0);
                  opacity: 0;
                  transition: all 0.4s;
                }
                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 10px;
                  object-fit: cover;
                  transition: all 0.5s;
                }
              }
              p {
                margin-top: 5px;
                color: #000;
                &:hover {
                  color: #ff006c;
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
      .music {
        margin-top: 15px;
        h2 {
          display: flex;
          font-size: 22px;
          height: 40px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #ff006c;
          span {
            color: #000;
            &:nth-child(2) {
              font-size: 14px;
              color: #989898;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .music_content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          background-color: #f6f6f6;

          .music_one {
            margin: 8px 0;
            border-radius: 10px;
            padding: 5px 0;
            width: 32%;
            display: flex;
            cursor: pointer;
            transition: all 0.5s;
            &:hover {
              box-shadow: 2px 2px 10px 2px #989191;
              transform: translateY(-5px);
            }
            .music_one_left {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 30%;
              img {
                width: 80%;
                object-fit: cover;
                border-radius: 10px;
              }
            }
            .music_one_right {
              display: flex;
              width: 70%;
              .left {
                width: 70%;
                p {
                  &:nth-child(1) {
                    font-size: 18px;
                    font-weight: 550;
                    color: #000;
                    &:hover {
                      color: #23d623;
                      text-decoration: underline;
                    }
                  }
                  &:nth-child(2) {
                    margin-top: 10px;
                  }
                }
              }
              .right {
                width: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
              }
            }
          }
        }
      }
      .charts {
        margin-top: 15px;

        h2 {
          display: flex;
          font-size: 22px;
          height: 40px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #409eff;
          span {
            color: #000;
            &:nth-child(2) {
              font-size: 14px;
              color: #989898;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .charts_content {
          padding: 10px 0 20px;
          background-color: #f6f6f6;
          display: flex;
          .charts_one {
            border-radius: 10px;
            flex: 1;
            margin: 0 5px;
            &:nth-child(1) {
              background-color: #23d623;
            }
            &:nth-child(2) {
              background-color: #409eff;
            }
            &:nth-child(3) {
              background-color: #fe036e;
            }
            .charts_one_top {
              padding: 50px 15px 20px;
              color: #fff;
              p {
                text-align: center;
                &:nth-child(1) {
                  margin: 10px 0;
                  font: 700 24px "";
                }
              }
            }
            .charts_one_line {
              margin: 15px auto 30px;
              width: 15%;
              height: 3px;
              background-color: #fff;
            }
            .charts_one_content {
              padding: 0 10px;
              p {
                line-height: 40px;
                width: 100%;
                height: 40px;
                margin: 10px 0;
                color: #fff;
                font-size: 16px;
                display: flex;
                span {
                  height: 100%;
                  &:nth-child(1) {
                    width: 20%;
                    text-align: center;
                    line-height: 40px;
                  }
                  &:nth-child(2) {
                    cursor: pointer;
                    width: 60%;
                    &:hover {
                      text-decoration: underline;
                    }
                  }
                  &:nth-child(3) {
                    width: 20%;
                    text-align: center;
                    line-height: 40px;
                  }
                }
              }
              .view_all {
                width: 100%;
                display: flex;
                font-size: 14px;
                justify-content: flex-end;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                  color: #7f7f7f;
                }
              }
            }
          }
        }
      }
    }

    .side_info {
      width: 25%;
      padding: 0 15px;
      background-color: #f6f6f6;
      .userinfo {
        .userinfo_hide {
          padding: 30px 0 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          p {
            font-size: 16px;
          }
          button {
            width: 60%;
            height: 40px;
            border-radius: 5px;
            color: #fff;
            background-color: #fe036e;
            outline: none;
            font-size: 16px;
            border: 1px solid #eeeeee;
            margin: 15px 0 10px;
          }
        }
      }

      .singer {
        h2 {
          display: flex;
          font-size: 18px;
          height: 40px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #409eff;
          span {
            color: #000;
            &:nth-child(2) {
              font-size: 14px;
              color: #989898;
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        .singer_content {
          .singer_one {
            margin: 10px 0;
            padding: 5px;
            border-radius: 10px;
            display: flex;
            background-color: #fff;
            transition: all 0.4s;
            &:hover {
              transform: scale(1.1);
            }
            cursor: pointer;
            .singer_one_left {
              width: 30%;
              display: flex;
              justify-content: center;
              img {
                width: 80%;
                border-radius: 10px;
                object-fit: cover;
              }
            }
            .singer_one_right {
              width: 70%;
              p {
                &:nth-child(1) {
                  font-size: 18px;
                  color: #000;
                  font-weight: 550;
                  &:hover {
                    color: #ff006c;
                    text-decoration: underline;
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