import axios from "@/utils/request";

/**
 * 获取动态消息
 * @param {number} pagesize 每页数据,默认 20
 * @param {number} lasttime : 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 * @
 * 返回结果的type参数对应:
 * 18 分享单曲
 * 19 分享专辑
 * 17、28 分享电台节目
 * 22 转发
 * 39 发布视频
 * 35、13 分享歌单
 * 24 分享专栏文章
 * 41、21 分享视频
 */
export function getMyFollowerData_api(pagesize, lasttime) {
  if (lasttime <= 0) {
    return axios.get(`/event?pagesize=${pagesize}&timestamp=${Date.now()}`);
  }
  return axios.get(
    `/event?pagesize=${pagesize}&lasttime=${lasttime}&timestamp=${Date.now()}`
  );
}
