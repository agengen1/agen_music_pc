<template>
  <div class="searchResultUser">
    <Loading
      v-if="searchResultUser_flag"
      textColor="#409eff"
      title="加载中..."
    ></Loading>
    <div class="content" v-else>
      <ul>
        <li
          class="info"
          v-for="(item, index) in userList"
          :key="item.userId"
          :class="{ odd_backColor: index % 2 != 0 }"
        >
          <div class="person">
            <img
              v-lazy="item.avatarUrl + '?param=60y60'"
              :alt="item.nickname"
              class="user_avatar"
            />
            <div class="other">
              <div class="top">
                <span
                  class="text_exceed_hide_one user_name"
                  v-html="SearchTextHighlight(key, item.nickname)"
                  @click="clickUserNameSkip_doc(item.userId)"
                >
                </span>
                <img
                  v-if="item.avatarDetail"
                  v-lazy="item.avatarDetail.identityIconUrl + '?param=30y30'"
                  class="user_icon"
                />
                <span class="user_gander">
                  <el-icon :size="18" color="#409EFF" v-if="item.gender === 1"
                    ><Female
                  /></el-icon>
                  <el-icon :size="18" color="#ff006d" v-if="item.gender === 2"
                    ><Male
                  /></el-icon>
                </span>
              </div>
              <div class="personDesc text_exceed_hide_one">
                {{ item.signature.trim() }}
              </div>
            </div>
          </div>
          <div class="operate">
            <el-button
              type="success"
              :icon="Check"
              disabled
              size="small"
              v-if="item.followed"
              >已关注</el-button
            >
            <el-button
              type="primary"
              :icon="Plus"
              size="small"
              v-else
              @click="clickFollow_button(item.userId)"
              >关　注</el-button
            >
          </div>
          <div class="play_number">歌单：{{ item.playlistCount }}</div>
          <div class="fans">粉丝：{{ item.followeds }}</div>
        </li>
      </ul>
    </div>
    <div class="paginatio">
      <el-pagination
        background
        layout="total,slot,prev, pager, next,jumper"
        :total="total"
        :default-page-size="pagCount"
        :current-page="pagNo"
        @current-change="handlerCurrentChange($event)"
        :disabled="searchResultUser_flag"
        hide-on-single-page
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { getSearchResultapi } from "@/api/searchApi";
import { SearchTextHighlight } from "@/assets/public";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Plus, Check, Female, Male } from "@element-plus/icons-vue";
import { setFollowerapi, CreatedVerifyapi } from "@/api/userDetailsApi";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "searchResultUser",
  props: {
    keyWord: {
      type: String,
      required: true,
    },
  },
  components: {
    Female,
    Male,
  },
  setup(props) {
    let router = useRouter();
    let store = useStore();
    let searchResultUser_flag = ref(true); //加载状态
    let total = ref(0); //共有多少条数据
    let pagCount = ref(30); //每一页数据 默认30条
    let pagNo = ref(1); //第几页
    let key = ref(""); //搜索内容
    let userList = ref([]); //返回用户数据
    watch(
      () => props.keyWord,
      (newVal) => {
        if (newVal) {
          pagNo.value = 1;
          key.value = newVal;
          getSearchResult(
            props.keyWord,
            1002,
            pagCount.value,
            pagNo.value,
            false
          );
        }
      },
      { immediate: true }
    );

    /**
     * 点击分页触发
     */
    function handlerCurrentChange(No) {
      pagNo.value = No;
      searchResultUser_flag.value = true;
      getSearchResult(props.keyWord, 1002, pagCount.value, pagNo.value, true);
    }
    /**
     * 点击跳转用户详情页面
     * @param {string | number} id 用户id
     */
    function clickUserNameSkip_doc(id) {
      router.push("/layout/home/userDetails/" + id);
    }
    /**
     * 点击按钮关注
     */
    function clickFollow_button(id) {
      setFollower(id, 1);
    }
    /**
     * 搜索结果获取
     * @param {string}   keyword ： 搜索关键字
     * @param {number}   type : 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
     * @param {number}   limit : 返回数量  默认为 0
     * @param {number }   offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , offset默认值为 0
     * @param { boolean }   flagScroll :标记是否为分页请求
     */
    async function getSearchResult(keyword, type, limit, offset, flagScroll) {
      const { data: res } = await getSearchResultapi(
        keyword,
        type,
        limit,
        offset
      );
      searchResultUser_flag.value = false;
      if (res && res.code === 200) {
        userList.value = res.result.userprofiles;
        if (res.result.userprofileCount) {
          total.value = res.result.userprofileCount;
        }
        if (flagScroll) {
          window.scrollTo({
            top: 300,
            behavior: "smooth", // 平滑滚动效果
          });
        }
      }
    }
    /**
     * 关注/取消关注  用户
     * @param {string | number} id : 用户 id
     * @param {string | number} t : 1为关注,2为取消关注
     */
    async function setFollower(id, t) {
      const { data: res } = await setFollowerapi(id, t);
      if (res && res.code === 200) {
        ElMessage.closeAll();
        ElMessage({
          type: "success",
          message: "关注成功，谢谢关注!",
        });
      } else {
        ElMessage.closeAll();
        // ElMessage({
        //   type: "error",
        //   message: "关注失败!",
        // });
        CreatedVerify(
          res.verifyId,
          res.verifyType,
          res.verifyToken,
          res.params.event_id,
          res.params.sign
        );
      }
    }
    /**
     * 验证接口-二维码生成（用于关注等接口验证）
     * @param {number} vid: 触发验证后,接口返回的verifyId
     * @param {number} type:触发验证后,接口返回的verifyType
     * @param {string} token:触发验证后,接口返回的verifyToken
     * @param {string} evid:触发验证后,接口返回的params的event_id
     * @param {string} sign:触发验证后,接口返回的params的sign
     */
    async function CreatedVerify(vid, type, token, evid, sign) {
      const { data: res } = await CreatedVerifyapi(
        vid,
        type,
        token,
        evid,
        sign
      );
      if (res && res.code === 200) {
        store.commit("verify/SETVERIFYOPENSTATUS", true);
        store.commit("verify/SETVERIFYURL", res.data.qrurl);
        store.commit("verify/SETVERIFYCODE", res.data.qrCode);
      }
    }
    return {
      searchResultUser_flag,
      key,
      pagCount,
      pagNo,
      total,
      userList,
      handlerCurrentChange,
      SearchTextHighlight,
      clickUserNameSkip_doc,
      clickFollow_button,
      Plus,
      Check,
    };
  },
});
</script>

<style lang='less' scoped>
.searchResultUser {
  padding: 20px;
  .content {
    min-height: 40vh;
    width: 100%;
    > ul {
      width: 100%;
      .info {
        padding: 5px;
        width: 100%;
        height: 60px;

        display: flex;
        align-items: center;
        > div {
          width: 14%;
          text-align: center;
        }
        .person {
          width: 58%;
          display: flex;
          .user_avatar {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
            border: 0.5px solid #efefef;
          }
          .other {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .top {
              display: flex;
              .user_name {
                &:hover {
                  color: #409eff;
                  text-decoration: underline;
                }
              }

              span {
                margin-left: 10px;
                font: 700 16px "";
                color: #000;
                cursor: pointer;
                i {
                  font-weight: 700;
                }
              }
              .user_icon {
                margin: 0 4px;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                object-fit: cover;
              }
              .user_gander {
                margin-left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            .personDesc {
              margin-left: 10px;
              text-align: left;
              font-size: 12px;
              color: #a19e9e;
            }
          }
        }
      }
      .odd_backColor {
        background-color: #f9f9f9;
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
</style>