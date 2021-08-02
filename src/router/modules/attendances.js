import Layout from '@/layout'
// 导出员工的路由规则
export default {
  // 路由规则
  path: '/attendances', // 路由地址 
  name: 'attendances', // 给模块的一级路由加一个name，会在做权限管理时用到
  component: Layout,
  children: [{
    // 二级路由的path 表示二级路由默认的路由
    path: '',
    component: () => import('@/views/attendances'),
    // 路由元信息 就是存储数据的地方 可以放任何内容
    meta: {
      title: '考勤' // 因为左侧导航读取了这里的title属性 ，根据遍历这个属性来循环左侧导航
    }
  }]
}