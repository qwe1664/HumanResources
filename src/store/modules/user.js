// 导入对token的存，取和删除方法
import { getToken, setToken, removeToken } from '@/utils/auth'
// 导入登录的login 接口
import { login } from '@/api/user'
const state = {
  token: getToken() // 设置token为共享状态，初始化vuex的时候，就要先从缓存中获取
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
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data)
    // axios 默认添加了一层data
    if (result.data.success) {
      // 如果为true，表示登录成功
      context.commit('setToken', result.data.data)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
