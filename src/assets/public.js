// 一些公共方法
import provinceData from "@/utils/provinceData"; //省份数字代码数据
import cityData from "@/utils/cityData"; //城市数字代码数据
import { ElMessageBox } from "element-plus";

/**
 * computeMusicTimeDuration
 * 计算歌曲时长
 * @param {number} data_time_duration
 * @return {string}
 */
export function computeMusicTimeDuration(data_time_duration) {
  let hours = Math.floor(data_time_duration / (1000 * 60 * 60));
  hours = hours >= 10 ? hours : "0" + hours;
  let minutes = Math.floor(
    (data_time_duration % (1000 * 60 * 60)) / (1000 * 60)
  );
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  let seconds = Math.floor((data_time_duration % (1000 * 60)) / 1000);
  seconds = seconds >= 10 ? seconds : "0" + seconds;

  if (hours === "00") {
    return `${minutes}:${seconds}`;
  } else {
    return `${hours}:${minutes}:${seconds}`;
  }
}

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
  const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
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
 * 搜索文本高亮显示
 * @param {string} repText 替换内容
 * @param {string} SearchBeRepText 被替换的内容
 */
export function SearchTextHighlight(repText, SearchBeRepText) {
  repText = repText.trim();
  let str = SearchBeRepText;
  let newStr = str.replace(
    repText,
    `<span class='Highlight'>${repText}</span>`
  );
  return newStr;
}

/**
 * 动态消息话题高显
 * @param {object} repObj 需要转换的数据
 */
export function FollowWordHighlight(repObj) {
  let regex = /#([^#]+)#/g;
  let str = repObj.text;
  str = str.replace(/\r\n/g, "<br/>");
  let arr = str.match(regex);
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let ar = repObj.actArr.filter((el) => {
        return `#${el.name}#` === arr[i];
      });
      if (ar.length > 0) {
        str = str.replace(
          arr[i],
          `<span data-actId="${ar[0].id}" class="follow_Highlight Highlight" >${arr[i]}</span>`
        );
      } else {
        str = str.replace(
          arr[i],
          `<span data-actId="${0}" class="follow_Highlight Highlight" >${
            arr[i]
          }</span>`
        );
      }
    }
  }
  return str;
}

/**
 * 网页链接_@人名高亮
 * @param {object} repObj 需要转换的数据
 */
export function FollowA_userNameHighlight(repObj) {
  let str = repObj.text;
  let repArr_Ait = str.match(/(@[^\s]+\s{1})/g);
  if (repArr_Ait && repArr_Ait.length > 0) {
    for (let i = 0; i < repArr_Ait.length; i++) {
      str = str.replace(
        repArr_Ait[i],
        `<i class="follow_Highlight">${repArr_Ait[i]}</i>`
      );
    }
  }
  let repArr = str.match(/https?:\/\/[^\s]+/g);
  if (repArr && repArr.length > 0) {
    for (let i = 0; i < repArr.length; i++) {
      let newSrc = repArr[i].replace(/#/g, ".=+*");
      console.log(newSrc);
      str = str.replace(
        repArr[i],
        `<a class="A_link_button" data-href="${newSrc}" href="javasrcipt:;"><i class="iconfont icon-lianjie"></i>网页链接</a>`
      );
    }
  }

  str = str.replace(/\r\n/g, "<br/>");
  str = FollowWordHighlight({
    text: str,
    actArr: repObj.actArr,
  });

  return str;
}

/**
 * 播放量转换 （万、亿）
 * @param {number} playCount
 */
export function playCountTransform(playCount) {
  playCount = parseInt(playCount);
  if (playCount > 100000000) {
    let playCount_w = (playCount / 100000000).toFixed(1);
    return `${playCount_w}亿`;
  } else if (playCount > 10000) {
    let playCount_w = (playCount / 10000).toFixed(1);
    return `${playCount_w}万`;
  } else {
    return playCount;
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

/**
 * 消息确认框（二次封装）
 * @param {string} title 标题
 * @param {string} message 内容
 * @param {object} options 其他配置项--详细查看elementPlus官网
 */
export function PackageMessageBox(message = "", title = "", options = {}) {
  message = message != "" ? message : "消息";
  title = title != "" ? title : "标题";
  options = JSON.stringify(options) != "{}" ? options : {};
  return ElMessageBox.confirm(message, title, options);
}

window.stamp_time = stamp_time;
window.getProvince = getProvince;
window.getCity = getCity;
window.computeMusicTimeDuration = computeMusicTimeDuration;
window.playCountTransform = playCountTransform;
window.SearchTextHighlight = SearchTextHighlight;
window.FollowWordHighlight = FollowWordHighlight;
window.FollowA_userNameHighlight = FollowA_userNameHighlight;
