import axios from "@/utils/request";

/**
 * 获取话题详情
 * @param {number | string} actid 话题id
 */
export function getSubjectDetails_api(actid) {
  return axios.get(`/topic/detail?actid=${actid}&timestamp=${Date.now()}`);
}

/**
 * 获取话题详情热门动态
 * @param {number | string} actid 话题id
 */
export function getSubjectHotListing_api(actid) {
  return axios.get(
    `/topic/detail/event/hot?actid=${actid}&timestamp=${Date.now()}`
  );
}
