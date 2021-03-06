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
router.beforeEach(async (to, from, next) => {
  nprogress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 只有有token的情况下 才能获取资料
    // 如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页
      next('/') // 跳转到主页
    } else {
      /*  只有放过的时候采取获取用户资料 
      如果当前vuex中有用户的资料的id 表示 已经有资料了
      不需要获取了 如果没有id 才需要获取
      */


      if (!store.getters.userId) {
        // 如果没有id 才表示当前用户资料没有获取过
        // async 函数所return 的内容 用await 就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成同步代码
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的动态路由

        // routes 就是筛选得到的动态路由
        console.log(routes);


        // addRoutes 必须 用 next(地址)  不能用next()

        // 添加后面这个、是为了解决刷新页面出现404的情况，需要讲404放到最后、到动态路由后面
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表 铺路

        // { path: '*', redirect: '/404', hidden: true }  第十三天、第6个视频
        next(to.path)
      } else {
        next()  // 否则放行
      }


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