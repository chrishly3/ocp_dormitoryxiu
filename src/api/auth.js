import request from '@/plugin/axios'

export function fetchList (query) {
  return request({
    url: '/api-user/permissions/findPermissions',
    method: 'get',
    params: query
  })
}

export function fetchTree () {
  return request({
    url: '/api-user/permissions/preMenus',
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/api-user/permissions/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/api-user/permissions/delete/' + id,
    method: 'delete'
  })
}
