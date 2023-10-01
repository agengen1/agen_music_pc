import axios from "@/utils/request";

/**
 * 获取专辑内容
 * @param {number | string} id  专辑id
 */
export function getAlbumData_api(id) {
  return axios.get(`/album?id=${id}&timestamp=${Date.now()}`);
}

/**
 * 获取最新专辑
 */
export function getNewAlbum_api() {
  return axios.get("/album/newest");
}
