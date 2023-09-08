import axios from "@/utils/request";

/**
 * 搜索建议获取
 * @param {string}   keyword ： 搜索关键字
 */
export const getSearchSuggestionsapi = (keyword) => {
  return axios.get(`/search/suggest?keywords=${keyword}`);
};

/**
 * 搜索结果获取
 * @param {string}   keyword ： 搜索关键字
 * @param {number}   type : 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
 * @param {number}   limit : 返回数量  默认为 0
 * @param {number }   offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , offset默认值为 0
 */
export const getSearchResultapi = (keyword, type, limit, offset) => {
  return axios.get(
    `/cloudsearch?keywords=${keyword}&limit=${limit}&offset=${
      (offset - 1) * limit
    }&type=${type}&timestamp=${Date.now()}`
  );
};
