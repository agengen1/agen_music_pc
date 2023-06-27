import axios from "axios";
//携带Cookies 请求
const xaxios = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default xaxios;
