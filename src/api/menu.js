import request from '@/plugin/axios'

export function GetMenu () {
  return request({
    url: '/api-user/menus/current',
    method: 'get'
  })
}
export function fetchTree (query) {
  return request({
    url: '/api-user/menus/current',
    method: 'get',
    params: query
  })
}

export function findMenusByRoleId (roleId) {
  return request({
    url: '/api-user/menus/findMenusByRoleId/' + roleId,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/api-user/menus/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/api-user/menus/findMenusByMenuId/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/api-user/menus/delete/' + id,
    method: 'delete'
  })
}
