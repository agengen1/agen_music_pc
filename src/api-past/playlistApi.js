import axios from "@/utils/request";

// 歌单详情获取
export const getPlaylistDetailapi = (id) => {
  return axios.get(`/playlist/detail?id=${id}`);
};

// 完整音乐列表获取
export const getMusicListapi = (ids) => {
  return axios.get(`/song/detail?ids=${ids}`);
};

// 歌曲歌词获取
export const getMusicSongWordsapi = (id) => {
  return axios.get(`/lyric?id=${id}`);
};

// 歌单标签获取
export const getSingingListLabelapi = () => {
  return axios.get("/playlist/catlist");
};

// 歌单广场歌单获取
export const getSingingListapi = (data_val, offset) => {
  return axios.get(
    `/top/playlist?limit=30&offset=${offset * 30}&cat=${data_val}`
  );
};

// 歌单评论获取
export const getCommentListapi = (data_id, offset, time) => {
  return axios.get(
    `/comment/playlist?limit=100&offset=${
      offset * 100
    }&id=${data_id}&before=${time}`
  );
};
