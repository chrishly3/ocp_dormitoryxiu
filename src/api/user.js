import request from '@/plugin/axios'

export function fetchList (query) {
  return request({
    url: '/api-user/users/findUsers',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/api-user/users/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api-user/users/findUserById/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function updateEnabled (id, enabled) {
  return request({
    url: '/api-user/users/updateEnabled?id=' + id + '&enabled=' + enabled,
    method: 'get'
  })
}

export function putObj (obj) {
  return request({
    url: '/api-user/users/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function sendSmsCode (mobile) {
  return request({
    url: `/api-auth/sms/send?mobile=${mobile}`,
    method: 'get'
  })
}
