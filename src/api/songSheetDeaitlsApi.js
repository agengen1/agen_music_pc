import axios from "@/utils/request";

/**
 * 歌单广场标签获取
 */
export const getSongSheetList_label_api = () => {
  return axios.get("/playlist/catlist");
};

/**
 * 歌单广场歌单获取
 * @param {string} tag 标签名称
 * @param {number} limit 取出多少页
 * @param {number} pagNO 分页第几页
 */
export const getSongSheetList_api = (tag, limit, pagNO) => {
  if (tag === "全部") {
    return axios.get(
      `/top/playlist?limit=${limit}&offset=${(pagNO - 1) * limit}`
    );
  }
  return axios.get(
    `/top/playlist?limit=${limit}&offset=${(pagNO - 1) * limit}&cat=${tag}`
  );
};

/**
 * 歌单详情获取
 * @param {number} id 歌单id
 */
export const getSongSheet_desc_api = (id) => {
  return axios.get(`/playlist/detail?id=${id}&timestamp=${Date.now()}`);
};

/**
 * 歌单所有音乐获取
 * @param {number} id 歌单id
 * @param {number} limit  限制获取歌曲的数量,默认值null 为空表示获取歌单所有歌曲
 * @param {number} offset  默认值为0,用于分页
 */
export const getSongSheet_Music_All_api = (id, limit = null, offset = 0) => {
  if (limit == null) {
    return axios.get(`/playlist/track/all?id=${id}&offset=${offset}`);
  } else {
    return axios.get(
      `/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`
    );
  }
};

/**
 * 新建歌单
 * @param {string} name 歌单名称
 */
export const createNewSongSheet_api = (name) => {
  return axios.get(`/playlist/create?name=${name}`);
};

/**
 * 更新歌单信息
 * @param {number | string} id 歌单id
 * @param {string} name 歌单名称
 * @param {string} desc 歌单介绍
 */
export const updateSongSheet_info_api = (id, name, desc) => {
  return axios.get(`/playlist/update?id=${id}&name=${name}&desc=${desc}`);
};

/**
 * 删除我创建的歌单
 * @param {number|string} id 我创建的歌单id
 */
export const deleteMyCreateSongSheet_api = (id) => {
  return axios.get(`/playlist/delete?id=${id}`);
};

/**
 * 收藏/取消收藏 歌单
 * @param {number|string} id 歌单id
 * @param {number|string} type 类型：(1:收藏 - 2:取消收藏)
 */
export const manageSongSheet_api = (id, type) => {
  console.log(id, type);
  if (type === 1 || type === 2) {
    return axios.get(`/playlist/subscribe?t=${type}&id=${id}`);
  }
  return console.log("不通过");
};
