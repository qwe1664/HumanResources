import Layout from '@/layout'
// 导出员工的路由规则
export default {
  // 路由规则
  path: '/employees', // 路由地址 
  name: 'employees', // 给模块的一级路由加一个name，会在做权限管理时用到
  component: Layout,
  children: [{
    // 二级路由的path 表示二级路由默认的路由
    path: '',
    component: () => import('@/views/employees'),
    // 路由元信息 就是存储数据的地方 可以放任何内容
    meta: {
      title: '员工管理', // 因为左侧导航读取了这里的title属性 ，根据遍历这个属性来循环左侧导航
      icon: 'people'
    }
  }, {
    path: 'detail/:id', // 动态路由，表示该地址后面需要跟上一个当前点击数据的id,如果 加一个 ? 表示可以传值也可以不传值都能进行访问
    component: () => import('@/views/employees/detail'),
    meta: {
      title: '员工详情'
    },
    hidden: true // 表示该内容 不再左侧显示
  }]
}