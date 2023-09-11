import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";

// 用户登录状态
let user_isLogin;

let CheackRouteNameArr = [
  "follow",
  "songSheetDetail",
  "singerDetails",
  "userDetails",
]; //需要验证的路由名称数组

const routes = [
  {
    path: "/",
    name: "root",
    meta: {
      title: "根路径",
    },
    redirect: "/layout",
  },
  {
    path: "/layout",
    name: "layout",
    meta: {
      title: "根布局",
    },
    redirect: "/layout/home",
    component: () => import("@/views/Layout/index.vue"),
    children: [
      {
        path: "home",
        name: "home",
        meta: {
          title: "音乐馆",
        },
        redirect: "/layout/home/recommend",
        component: () => import("@/views/Layout/home/index.vue"),
        children: [
          {
            path: "recommend",
            name: "recommend",
            meta: {
              title: "推荐",
            },
            component: () => import("@/views/Layout/home/recommend/index.vue"),
          },
          {
            path: "charts",
            name: "charts",
            meta: {
              title: "排行榜",
            },
            redirect: "/layout/home/charts/details/19723756",
            component: () => import("@/views/Layout/home/charts/index.vue"),
            children: [
              {
                path: "details/:id",
                name: "charts_details",
                meta: {
                  title: "排行榜榜单详情",
                },
                component: () => import("@/components/music_details/index.vue"),
              },
            ],
          },
          {
            path: "songSheet",
            name: "songSheet",
            meta: {
              title: "歌单",
            },
            component: () => import("@/views/Layout/home/songSheet/index.vue"),
          },
          {
            path: "singers",
            name: "singers",
            meta: {
              title: "歌手",
            },
            component: () => import("@/views/Layout/home/singer/index.vue"),
          },
          {
            path: "songDetails/:songId",
            name: "songDetails",
            meta: {
              title: "歌曲详情",
            },
            component: () => import("@/components/song_details/index.vue"),
          },
          {
            path: "userDetails/:userId",
            name: "userDetails",
            meta: {
              title: "用户详情",
            },
            component: () => import("@/components/user_details/index.vue"),
          },
          {
            path: "singerDetails/:singerId",
            name: "singerDetails",
            meta: {
              title: "歌手详情",
            },
            component: () => import("@/components/singer_details/index.vue"),
          },
          {
            path: "songSheetDetail/:id",
            name: "songSheetDetail",
            meta: {
              title: "歌单详情",
            },
            component: () =>
              import("@/views/Layout/home/songSheet/songSheetDetail/index.vue"),
          },
          {
            path: "mvs",
            name: "mv",
            meta: {
              title: "mv",
            },
            component: () => import("@/views/Layout/home/mv/index.vue"),
          },
          {
            path: "mvDetails/:mvId",
            name: "mvDetails",
            meta: {
              title: "mv详情",
            },
            component: () =>
              import("@/views/Layout/home/mv/mvDetails/index.vue"),
          },
          {
            path: "searchResult/:searchText",
            name: "searchResult",
            meta: {
              title: "搜索结果",
            },
            component: () =>
              import("@/components/search/searchResult/index.vue"),
          },
        ],
      },
      {
        path: "user",
        name: "user",
        meta: {
          title: "我的音乐",
        },
        component: () => import("@/views/Layout/user/index.vue"),
        children: [
          {
            path: "userMusicSongSheet/:id",
            name: "musicSongSheet",
            meta: {
              title: "我的音乐详情",
            },
            component: () => import("@/components/music_details/index.vue"),
          },
        ],
      },
      {
        path: "follow",
        name: "follow",
        meta: {
          title: "关注",
        },
        component: () => import("@/views/Layout/follow/index.vue"),
      },
      {
        path: "404",
        name: "404",
        meta: {
          title: "404",
        },
        component: () => import("@/components/404/index.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)",
    name: "NotFound",
    redirect: "/layout/404",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
  user_isLogin = localStorage.getItem("user_isLogin") || "false";
  //判断是否登录
  if (user_isLogin === "true") {
    document.title = "牛牛音乐-(" + to.meta.title + ")";
    //跳转路由页面滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滚动效果
    });
    next();
  } else {
    if (CheackRouteNameArr.includes(to.name)) {
      ElMessage.closeAll();
      ElMessage({
        type: "warning",
        message: "请先进行登录！",
      });
      if (from.name) {
        next(false);
      } else {
        next("/");
      }
    } else {
      document.title = "牛牛音乐-(" + to.meta.title + ")";
      //跳转路由页面滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: "smooth", // 平滑滚动效果
      });
      next();
    }
  }
});

export default router;
