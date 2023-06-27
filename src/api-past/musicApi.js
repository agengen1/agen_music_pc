import axios from "@/utils/request";

// 轮播图获取
export const getSwipePicapi = () => {
  return axios.get("/banner?type=1");
};
// 推荐歌单获取
export const getRePlayListapi = () => {
  return axios.get("/personalized?limit=10");
};
// 热门歌手获取
export const getHotSingerapi = () => {
  return axios.get("/top/artists?offset=0&limit=5");
};

// 歌手分类列表获取
export const getArtistCategoryListapi = (data_cat, offset) => {
  return axios.get(
    `/artist/list?type=${data_cat.typeid}&area=${data_cat.area}&offset=${
      offset * 30
    }&limit=30`
  );
};
