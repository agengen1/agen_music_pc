import axios from "axios";
import { h } from "vue";
import { ElNotification } from "element-plus";
import { Download } from "@element-plus/icons-vue";
/**
 * 此函数为暴露出去的下载函数
 * @param {Object} music_obj -- music_obj包括以下属性：name(音乐名称),url(音乐url),type(音乐类型)
 */
export default async function (music_obj) {
  const { music_name, music_url, music_type } = music_obj;
  ElNotification({
    title: "歌曲下载",
    message: h("p", {}, [
      h("span", { style: "color: #ff006d;font-size:18px" }, music_name),
      h("span", { style: "color: #848484;font-size:14px" }, "  开始下载..."),
    ]),
    icon: Download,
    duration: 2000,
  });
  const { data: blob } = await getUrlAudiobinary(music_url);
  download(blob, music_name, music_type);
}

/**
 * 读取音频文件二进制
 * 由于冲突原因 -- 在这里封装一个请求方法
 * @param {String} url 音频url
 */
function getUrlAudiobinary(url) {
  return axios({
    url: url,
    method: "GET",
    responseType: "blob", // 设置响应类型为二进制数据
  });
}
/**
 * 下载歌曲操作
 * @param data_blob 音频二进制数据
 */
function download(data_blob, audioName, audioType) {
  const url = window.URL.createObjectURL(data_blob);
  const download_el = document.createElement("a");
  download_el.href = url;
  download_el.download = audioName + "." + audioType;
  document.body.appendChild(download_el);
  download_el.click();
  window.URL.revokeObjectURL(url); // 释放对象 URL
  document.body.removeChild(download_el); // 移除下载元素
}
