import axios from 'axios'
import router from '@/router'
import store from '@/store'
// 导入element-ul 中的提示错误对象
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间

const service = axios.create({
  // 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, //设置axios请求的基础地址
  timeout: 5000 //设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入 token
  if (store.getters.token) {
    // 只有在有token 的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true 表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      router.push('/login') // 跳转到登录页面
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config  // 必须要返回config
}, error => {
  return Promise.reject(error)
})
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
  // error 信息 里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当data中返回的code的值 等于 10002时表示 后端告诉我们 token超时了
    store.dispatch('user/logout') // 登出操作  删除 token
    router.push('/login') // 跳转到登录页面
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，进入catch
})
function IsCheckTimeOut() {
  var currentTime = Date.now()  // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
