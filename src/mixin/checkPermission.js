import store from "@/store";
import user from "@/store/modules/user";

// 做一个混入对象

export default {
  // 混入对象是组件的 选项对象
  methods: {
    // 检查权限 要么有 没有 key 就是要检查的点
    checkPermission(key) {
      // 去用户的信息里面找 points 中没有key 如果有key 则认为有权限 如果没有key则认为不能点击

      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return user.roles.points.some(item => item === key)
      }
      return false  // 如果没进去 说明没权限
    }
  }
}