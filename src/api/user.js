import request from '@/utils/request'

// 登录接口的封装
export function login(data) {
  // 返回一个promise 对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户资料接口
export function getUserInfo() {
  return request({
    ulr: '/sys/profile',
    methods: 'post',
  })
}

export function logout() {
}
