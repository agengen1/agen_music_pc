import axios from "@/utils/request";

/**
 * mv列表获取
 * @param {String } area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param {String } type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param {String } order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param {number} limit: 取出数量 , 默认为 30
 * @param {number} offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 */
export const getMvlistapi = (area, type, order, limit, offset) => {
  return axios.get(
    `/mv/all?area=${area}&type=${type}&limit=${limit}&offset=${
      (offset - 1) * limit
    }&order=${order}&timestamp=${Date.now()}`
  );
};

/**
 * 获取mv数据详情
 * @param {string | number} id mvId
 */
export const getMvDetailsapi = (id) => {
  return axios.get(`/mv/detail?mvid=${id}`);
};

/**
 * 获取mv播放url
 * @param {string | number} id mvId
 * @param {string | number} rr mv分辨率 默认 1080,
 */
export const getMvPlayUrlapi = (id, rr = 1080) => {
  return axios.get(`/mv/url?id=${id}&r=${rr}`);
};

/**
 * 获取相似mv列表
 * @param {string | number} id mvId
 */
export const getMvSimilarapi = (id) => {
  return axios.get(`/simi/mv?mvid=${id}`);
};
