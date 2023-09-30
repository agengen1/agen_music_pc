import axios from "@/utils/request";

/**
 * 获取歌手分类列表
 * @param {number} type 取值:
 *                    -1:全部
 *                    1:男歌手
 *                    2:女歌手
 *                    3:乐队
 * @param {number} area 取值:
 *                    -1:全部
 *                    7华语
 *                    96欧美
 *                    8:日本
 *                    16韩国
 *                    0:其他
 * @param {number} limit : 返回数量 , 默认为 30
 * @param {number} offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export const getSingerClass_typeapi = (type, area, limit, offset) => {
  return axios.get(
    `/artist/list?type=${type}&area=${area}&limit=${limit}&offset=${
      (offset - 1) * limit
    }`
  );
};

/**
 * 歌手详情获取
 * @param {String | number} id 歌手id
 */
export const getSingerDetailsapi = (id) => {
  return axios.get(`/artist/detail?id=${id}&timestamp=${Date.now()}`);
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

/**
 * 收藏/取消收藏  歌手
 * @param {string | number} id : 歌手 id
 * @param {string | number} t : 1为收藏,2为取消收藏
 */
export function setSingerFollowerapi(id, t) {
  return axios.get(`/artist/sub?id=${id}&t=${t}&timestamp=${Date.now()}`);
}
