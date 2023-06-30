import { createRouter, createWebHistory } from "vue-router";

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
                component: () =>
                  import("@/views/Layout/home/charts/charts_details/index.vue"),
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
            path: "singer",
            name: "singer",
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
        ],
      },
      {
        path: "user",
        name: "user",
        meta: {
          title: "我的",
        },
        component: () => import("@/views/Layout/user/index.vue"),
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

export default router;
