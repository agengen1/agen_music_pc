import axios from "@/utils/request";

// 热搜获取 - 20条数据
export const getHotSearchListapi = () => {
  return axios.get("/search/hot/detail");
};

// 搜索建议获取
export const getHotSearchSuggestionsapi = (data_val) => {
  return axios.get(`/search/suggest?keywords=${data_val}&type=mobile`);
};

// 搜索结果获取
// keyword ： 搜索关键字
// type : 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
// offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , offset默认值为 0
export const getSearchResultapi = (keyword, type, offset) => {
  return axios.get(
    `/search?keywords=${keyword}&offset=${offset * 30}&type=${type}`
  );
};
