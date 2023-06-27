import axios from "@/utils/request";

// 获取每日推荐音乐
export const getRecommendMusicapi = () => {
  return axios.get("/personalized/newsong?limit=100");
};

// 获取推荐歌单
export const getRecommendSongSheetapi = () => {
  return axios.get("/personalized?limit=30");
};
