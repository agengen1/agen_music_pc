import axios from "@/utils/request";

// 轮播图获取
export const getSwipePicapi = () => {
  return axios.get("/banner?type=0");
};

// 热门推荐音乐
export const getRecommendMusicapi = () => {
  return axios.get(`/personalized/newsong?limit=12&timestamp=${Date.now()}`);
};

// 热门推荐歌单
export const getRecommendSongSheetapi = () => {
  return axios.get(`/personalized?limit=30&timestamp=${Date.now()}`);
};

// 热门歌手获取
export const getHotSingerapi = () => {
  return axios.get("/top/artists?offset=0&limit=10");
};

// 排行榜获取
export const getRankingListapi = () => {
  return axios.get("/toplist/detail");
};
