import axios from "@/utils/request";

// 排行榜获取
export const getRankingListapi = () => {
  return axios.get("/toplist/detail");
};
