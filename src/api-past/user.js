import axios from "@/utils/request";

// 获取用户登录状态
export const getLoginStatusapi = (time) => {
  return axios.get(`/login/status?timestamp=${time}`);
};

// 退出登录
export const getLoginOutapi = (time) => {
  return axios.get(`/logout?timestamp=${time}`);
};

// 获取二维码key - 必须带时间戳
export const getLoginKeyapi = (time) => {
  return axios.get(`/login/qr/key?timestamp=${time}`);
};

// 获取二维码 - 必须带时间戳
export const getLoginPicapi = (key, time) => {
  return axios.get(`/login/qr/create?key=${key}&timestamp=${time}&qrimg=true`);
};

// 轮询二维码 - 必须带时间戳
// 800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
export const getLoginisOkapi = (key, time) => {
  return axios.get(`/login/qr/check?key=${key}&timestamp=${time}`);
};

// 获取账号信息
export const getAccountapi = (time) => {
  return axios.get(`/user/account?timestamp=${time}`);
};

// 获取用户信息
export const getUserinfoapi = (id, time) => {
  return axios.get(`/user/detail?uid=${id}&timestamp=${time}`);
};

// 获取用户歌单
export const getUserPlayListapi = (id, time) => {
  return axios.get(`/user/playlist?uid=${id}&timestamp=${time}`);
};
