import axios from "@/utils/request";

/**
 * 获取用户详情
 * @param { String | Number} id 用户id
 */
export function getUserDetailsapi(id) {
  return axios.get(`/user/detail?uid=${id}`);
}

/**
 * 获取用户歌单
 * @param { String|Number } id 用户id
 * @param { String|Number } limit : 返回数量 , 默认为 30
 * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserSongSheetDetailsapi(id, limit, offset) {
  return axios.get(`/user/playlist?uid=${id}&limit=${limit}&offset=${offset}`);
}

/**
 * 获取用户关注列表
 * @param { String|Number } id 用户id
 * @param { String|Number } limit : 返回数量 , 默认为 30
 * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollowsDetailsapi(id, limit, offset) {
  return axios.get(`/user/follows?uid=${id}&limit=${limit}&offset=${offset}`);
}

/**
 * 获取用户粉丝列表
 * @param { String|Number } id 用户id
 * @param { String|Number } limit : 返回数量 , 默认为 30
 * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollowedsDetailsapi(id, limit, offset) {
  return axios.get(`/user/followeds?uid=${id}&limit=${limit}&offset=${offset}`);
}
