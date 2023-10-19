import axios from "axios";
import { ElMessage } from "element-plus";

//携带Cookies 请求
const xaxios = axios.create({
  baseURL: process.env.VUE_APP_SEVER_URL,
  withCredentials: true,
});

// 添加请求拦截器
xaxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    console.log("NetworkError");
    // 对请求错误做些什么
    throw error;
  }
);

// 添加响应拦截器
xaxios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 处理无网络连接的情况
    if (error.response.status === 502) {
      ElMessage({
        type: "error",
        grouping: true,
        message: "NetworkError\n查看网络连接是否正常",
      });
      return Promise.resolve(error);
    } else if (error.response.status === 400) {
      ElMessage({
        type: "error",
        grouping: true,
        message: "操作失败！",
      });
      return Promise.resolve(error.response.data);
    } else if (error.response.status === 404) {
      ElMessage({
        type: "error",
        grouping: true,
        message: "未找到此资源！",
      });
      return Promise.resolve(error);
    } else if (error.response.status === 405) {
      ElMessage({
        type: "error",
        grouping: true,
        message: "请求过于频繁",
      });
      return Promise.resolve(error);
    } else {
      ElMessage({
        type: "error",
        grouping: true,
        message: "网络错误！",
      });
      return Promise.resolve(error);
    }
  }
);

export default xaxios;
