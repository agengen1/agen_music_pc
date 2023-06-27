import axios from "@/utils/request";

// 歌手详情获取
export const getSingerDetailsapi = (data_id) => {
  return axios.get(`/artist/detail?id=${data_id}`);
};

// 歌手描述获取
export const getSingerDescapi = (data_id) => {
  return axios.get(`/artist/desc?id=${data_id}`);
};
// 歌手50首热门歌曲获取
export const get50_HotSingerListapi = (data_id) => {
  return axios.get(`/artist/top/song?id=${data_id}`);
};
