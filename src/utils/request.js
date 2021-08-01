import axios from 'axios'
// 导入element-ul 中的提示错误对象
import { Message } from 'element-ui'
const service = axios.create({
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, //设置axios请求的基础地址
  timeout: 5000 //设置超时时间
})
service.interceptors.request.use()
// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认添加了层data
  // 将返回的数据 结构出来
  const { success, message, data } = response.data
  // 要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错了，手动new 一个错误对象 让他进入 catch
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，进入catch
})
export default service
