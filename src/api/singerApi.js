import axios from "@/utils/request";

/**
 * 歌手详情获取
 * @param {String | number} id 歌手id
 */
export const getSingerDetailsapi = (id) => {
  return axios.get(`/artist/detail?id=${id}`);
};

/**
 * 歌手描述获取
 * @param {String | number} id 歌手id
 */
export const getSingerDescapi = (id) => {
  return axios.get(`/artist/desc?id=${id}`);
};

/**
 * 相似歌手获取 --- 需要登录，才可以获取到
 * @param {String | number} id 歌手id
 */
export const getSingerSimilarapi = (id) => {
  return axios.get(`/simi/artist?id=${id}`);
};

/**
 * 歌手单曲获取
 * @param {String | number} id 歌手id
 */
export const getSingerSongListapi = (id) => {
  return axios.get(`/artists?id=${id}`);
};

/**
 * 获取歌手专辑
 * @param {String | number}  id 歌手 id
 * @param { number } limit 取出数量 , 默认为 30
 * @param { number } offset  偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 */
export const getSingerAlbumapi = (id, limit, offset) => {
  return axios.get(
    `/artist/album?id=${id}&limit=${limit}&offset=${(offset - 1) * limit}`
  );
};

/**
 * 获取喜欢的歌手
 * @param {number}  limit: 取出歌单数量 , 默认为 25
 * @param {number}  offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*25, 其中 25 为 limit 的值
 */
export const getSingerMeLikeapi = (limit, offset) => {
  return axios.get(
    `/artist/sublist?limit=${limit}&offset=${(offset - 1) * limit}`
  );
};
