// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

/* 不需要导出 因为只需要让代码执行即可
  前置守卫
  next 是前置守卫必须执行的钩子 next必须执行 如果不执行 页面就死了
  next() 放过
  next() 跳转终止
  next(地址) 跳转到某个地址
*/

const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach((to, from, next) => {
  nprogress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页
      next('/') // 跳转到主页
    } else {
      next()  // 否则放行
    }
  } else {
    // 没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单， 放行通过
      next()
    } else {
      // 表示没有token 也没有在白名单，那么跳转到登录页
      next('/login')
    }
  }
  nprogress.done() // 解决手动切换地址时，进度条不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条的意思
})