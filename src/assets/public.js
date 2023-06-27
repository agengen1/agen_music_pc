// 一些公共方法
import provinceData from "@/utils/provinceData"; //省份数字代码数据
import cityData from "@/utils/cityData"; //城市数字代码数据
/**
 * computeMusicTimeDuration
 * 计算歌曲时长
 * @param {number} data_time_duration
 * @return {string}
 */
export function computeMusicTimeDuration(data_time_duration) {
  let second = Math.floor(data_time_duration / 1000);
  let hour =
    Math.floor(second / 60) >= 10
      ? Math.floor(second / 60)
      : "0" + Math.floor(second / 60);
  let min = second % 60 >= 10 ? second % 60 : "0" + (second % 60);
  return hour + ":" + min;
}
window.computeMusicTimeDuration = computeMusicTimeDuration;
/**
 * computeSingerAs
 * 计算歌手别名
 * @param {Array} data_SingerAs
 * @return {string}
 */
export function computeSingerAs(data_SingerAs) {
  if (data_SingerAs.length > 0) {
    let str = "";
    data_SingerAs.forEach((item) => {
      if (typeof item === "object") {
        str += " - " + item.name;
      } else {
        str += " - " + item;
      }
    });
    return str.substring(2);
  } else {
    return "";
  }
}

/**
 * stamp_time
 * 时间戳转完整时间
 *  @param {number} time
 *  @param {boolean} all  true表示返回完整时间(包括时分秒),否则返回年月日
 * 功能：返回完整时间
 */
export function stamp_time(time, all = false) {
  const date = new Date(time);
  const Y = date.getFullYear();
  const M =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const D = date.getDate();
  if (all) {
    const H = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
    const F =
      date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
    const S =
      date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
    return `${Y}-${M}-${D} ${H}:${F}:${S}`;
  } else {
    return `${Y}-${M}-${D}`;
  }
}

/**
 * 数字代码获取省份
 * @param {string | number} province 省份数字代码
 */
export function getProvince(province) {
  let arr = provinceData.filter((item) => {
    return item.code == province;
  });
  if (arr.length > 0) {
    return arr[0].name;
  } else {
    return null;
  }
}

/**
 * 数字代码获取城市
 * @param {string | number} city 城市数字代码
 */
export function getCity(city) {
  let arr = cityData.filter((item) => {
    return item.code == city;
  });
  if (arr.length > 0) {
    return arr[0].name;
  } else {
    return null;
  }
}

window.stamp_time = stamp_time;
window.getProvince = getProvince;
window.getCity = getCity;
