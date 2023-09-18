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
export function getUserSongSheetDetailsapi(id, limit, offset = 1) {
  return axios.get(
    `/user/playlist?uid=${id}&limit=${limit}&offset=${
      (offset - 1) * limit
    }&timestamp=${Date.now()}`
  );
}

/**
 * 获取用户关注列表
 * @param { String|Number } id 用户id
 * @param { String|Number } limit : 返回数量 , 默认为 30
 * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollowsDetailsapi(id, limit, offset = 1) {
  return axios.get(
    `/user/follows?uid=${id}&limit=${limit}&offset=${(offset - 1) * limit}`
  );
}

/**
 * 获取用户粉丝列表
 * @param { String|Number } id 用户id
 * @param { String|Number } limit : 返回数量 , 默认为 30
 * @param { String|Number } offset : 偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollowedsDetailsapi(id, limit, offset = 1) {
  return axios.get(
    `/user/followeds?uid=${id}&limit=${limit}&offset=${(offset - 1) * limit}`
  );
}

/**
 * 获取用户播放记录
 * @param {String | number} id 用户id
 * @param {String | number} type 播放记录类型  type=1时只返回weekData(本周播放记录), type=0时返回allData(全部播放记录)
 */
export function getUserPlayRecordsapi(id, type) {
  return axios.get(`/user/record?uid=${id}&type=${type}`);
}

/**
 * 获取用户喜欢音乐列表
 * @param { String | Number} id 用户id
 */
export function getUserLikeMusicListapi(id) {
  return axios.get(`/likelist?uid=${id}&timestamp=${Date.now()}`);
}

/**
 * 喜欢音乐/取消喜欢音乐
 * @param { String | Number} id 歌曲id
 * @param { boolean } like  布尔值 , 默认为 true 即喜欢 , 若传 false, 则取消喜欢
 */
export function setUserLikeStatusapi(id, like) {
  return axios.get(`/like?id=${id}&like=${like}&timestamp=${Date.now()}`);
}

/**
 * 关注/取消关注  用户
 * @param {string | number} id : 用户 id
 * @param {string | number} t : 1为关注,2为取消关注
 */
export function setFollowerapi(id, t) {
  return axios.get(`/follow?id=${id}&t=${t}&timestamp=${Date.now()}`);
}

/**
 * 验证接口-二维码生成（用于关注等接口验证）
 * @param {number} vid: 触发验证后,接口返回的verifyId
 * @param {number} type:触发验证后,接口返回的verifyType
 * @param {string} token:触发验证后,接口返回的verifyToken
 * @param {string} evid:触发验证后,接口返回的params的event_id
 * @param {string} sign:触发验证后,接口返回的params的sign
 */
export function CreatedVerifyapi(vid, type, token, evid, sign) {
  return axios.get(
    `/verify/getQr?vid=${vid}&type=${type}&token=${token}&evid=${evid}&sign=${sign}&timestamp=${Date.now()}`
  );
}

/**
 * 验证接口-二维码检测
 * @param {string}  qr: /verify/getQr接口返回的qr字符串
 * @param 返回结果说明：
 * qrCodeStatus:0,detailReason:0 二维码生成成功
 * qrCodeStatus:0,detailReason:303 账号不一致
 * qrCodeStatus:10,detailReason:0 二维码已扫描,并且手机号相同
 * qrCodeStatus:20,detailReason:0 验证成功
 * qrCodeStatus:21,detailReason:0 二维码已失效
 */
export function eventLoopVerifyapi(qr) {
  return axios.get(`/verify/qrcodestatus?qr=${qr}&timestamp=${Date.now()}`);
}

/**
 * 获取用户关注列表
 * @param {number | string} uId 用户id
 * @param {number } limit  返回数量 , 默认为 30
 * @param {number} offset  偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFollowedListapi(uId, limit, offset) {
  return axios.get(
    `/user/follows?uid=${uId}&limit=${limit}&offset=${
      (offset - 1) * limit
    }&timestamp=${Date.now()}`
  );
}

/**
 * 获取用户粉丝列表
 * @param {number | string} uId 用户id
 * @param {number } limit  返回数量 , 默认为 30
 * @param {number} offset  偏移数量，用于分页 ,如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export function getUserFansListapi(uId, limit, offset) {
  return axios.get(
    `/user/followeds?uid=${uId}&limit=${limit}&offset=${
      (offset - 1) * limit
    }&timestamp=${Date.now()}`
  );
}
