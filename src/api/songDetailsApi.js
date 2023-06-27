import axios from "@/utils/request";

/**
 * 歌曲歌词获取
 * @param {String} id 歌曲id
 */
export const getSongDetailsLyricapi = (id) => {
  return axios.get(`/lyric?id=${id}`);
};

/**
 * 歌曲热门评论获取
 * @param {String} id: 音乐 id
 * @param {String} type: 资源类型  ( 歌曲: 0 , mv: 1, 专辑: 2 , 歌单: 3 , 电台: 4, 视频: 5)
 */
export const getSongDetailsHotCommentapi = (id, type) => {
  return axios.get(`/comment/hot?id=${id}&type=${type}&limit=15&offset=${0}`);
};

/**
 * 歌曲评论获取
 * @param {String} id: 音乐 id
 * @param {String} limit: 取出评论数量 , 默认为 20
 * @param {String} offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @param {String} before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 */
export const getSongDetailsCommentapi = (id, limit, offset, before = null) => {
  if (before != null) {
    return axios.get(
      `/comment/music?id=${id}&limit=${limit}&offset=${
        (offset - 1) * limit
      }&before=${before}`
    );
  } else {
    return axios.get(
      `/comment/music?id=${id}&limit=${limit}&offset=${(offset - 1) * limit}`
    );
  }
};

/**
 * 歌曲详情获取
 * @param {String} ids 歌曲id，或多个歌曲id(用,分隔)
 */
export const getSongDetailsapi = (ids) => {
  return axios.get(`/song/detail?ids=${ids}`);
};

/**
 * 歌曲下载url获取 无黑胶VIP
 * @param {String} id 歌曲id
 */
export const getSongDetailsNoVipDownloadUrl = (id) => {
  return axios.get(`/song/url?id=${id}`);
};

/**
 * 歌曲下载url获取 有黑胶VIP
 * @param {String} id 歌曲id
 */
export const getSongDetailsHaveVipDownloadUrl = (id) => {
  return axios.get(`/song/download/url?id=${id}`);
};
