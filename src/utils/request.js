import axios from "axios";
import { Message } from "element-ui";

//创建axios 赋给变量service
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/api";
const service = axios.create({
  baseURL: BASEURL, // http://localhost:8080(端口)/api ==> 等价于 vue.config.js  proxy 'api'对应路径
  timeout: 10000 //超时时间
});

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers["Token"] = "111";
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    let data = response.data;
    if (data.resCode != 0) {
      Message.error(data.message);
      return Promise.reject(data);
    }
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

//import service from '@/utils/request'
export default service;
