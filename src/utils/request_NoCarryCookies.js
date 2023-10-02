import axios from "axios";
//不携带Cookies 请求
const xaxios = axios.create({
  baseURL: process.env.VUE_APP_SEVER_URL,
});

export default xaxios;
