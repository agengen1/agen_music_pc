import axios from "@/utils/request";

/**
 * 歌曲是否可用获取
 * @param {number} id 歌曲id
 */
export const getMusic_isUsable_api = (id) => {
  let now = Date.now();
  return axios.get(`/check/music?id=${id}&timestamp=${now}`);
};

/**
 * 歌曲url获取
 * @param {number} id 歌曲id
 */
export const getMusic_url_api = (id) => {
  return axios.get(`/song/url/v1?id=${id}&level=standard`);
};
