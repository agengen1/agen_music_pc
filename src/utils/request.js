import axios from "axios";
//不携带Cookies 请求
const xaxios = axios.create({
  baseURL: "http://localhost:3000",
});

export default xaxios;
