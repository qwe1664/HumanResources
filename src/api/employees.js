import request from '@/utils/request'

/* 
  获取员工简单列表
*/
export function getEmployessSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/* 
  获取员工综合列表
*/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/* 
  删除员工接口
*/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/* 
  新增员工的接口
*/
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/* 
  批量导入员工数据接口
  参数data是一个数组类型
*/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/* 
  保存员工的基本信息
*/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}