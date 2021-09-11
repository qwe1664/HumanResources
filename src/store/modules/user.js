// 导入对token的存，取和删除方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 导入登录的login 接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 导入路由里面导出的方法
import { resetRouter } from '@/router'
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

    setTimeStamp()  // 设置当前时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo() // 提交到mutaions 里面
    // 获取用户的详情 用户的详情数据，获取到图像 对数据进行拼接
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 这里给我们后期做权限的时候 留下一个伏笔
  },
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('reomveUserInfo')
    // 重置路由
    resetRouter()
    /* 
      去设置权限模块下路由为初始状态
      vuex子模块怎么调用子模块的action 都没有加锁的情况下 可以随意调用
      不加命名空间的情况下的 所有的mutations 和action 都是挂在全局上的 所有可以直接调用
      但是加了 命名空间的子模块 怎么调用另一个加了命名空间的子模块的 mutations
      mutations名称 载荷 payload 第三个参数 { root: true } 调用根级的mutations 或者action
    */

    context.commit('permission/setRoutes', [], { root: true })




  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
