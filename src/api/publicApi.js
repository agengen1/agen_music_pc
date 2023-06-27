import axios from "@/utils/request";

/**
 * 歌单详情获取
 * @param {number} id 歌单id
 */
export const getSongSheet_desc_api = (id) => {
  return axios.get(`/playlist/detail?id=${id}`);
};

/**
 * 歌单所有音乐获取
 * @param {number} id 歌单id
 * @param {number} limit  限制获取歌曲的数量,默认值null 为空表示获取歌单所有歌曲
 * @param {number} offset  默认值为0,用于分页
 */
export const getSongSheet_Music_All_api = (id, limit = null, offset = 0) => {
  if (limit == null) {
    return axios.get(`/playlist/track/all?id=${id}&offset=${offset}`);
  } else {
    return axios.get(
      `/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`
    );
  }
};

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
