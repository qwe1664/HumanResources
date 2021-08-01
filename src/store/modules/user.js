// 导入对token的存，取和删除方法
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入登录的login 接口
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 设置token为共享状态，初始化vuex的时候，就要先从缓存中获取
  userInfo: {} // 这里定义一个空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token  // 讲数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null  // 讲vuex的数据滞空
    removeToken()  // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result  //这样是响应式的
    // state.userInfo = [...result] 这也是响应式的 属于浅拷贝
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    // axios 默认添加了一层data,在响应拦截器中已经将外层data去除了
    // 如果为true，表示登录成功
    context.commit('setToken', result) // 设置token
  },
  async getUserInfo() {
    const result = await getUserInfo() // 提交到mutaions 里面
    context.commit('setUserInfo', result)
    return result // 这里给我们后期做权限的时候 留下一个伏笔
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
