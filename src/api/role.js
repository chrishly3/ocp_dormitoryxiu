import request from '@/plugin/axios'

export function roleList () {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

export function fetchAllList (query) {
  return request({
    url: '/api-user/roles/findRoles',
    method: 'get',
    params: query
  })
}

export function deptRoleList (deptId) {
  return request({
    url: '/admin/role/roleList/' + deptId,
    method: 'get'
  })
}

export function getObj (id) {
  return request({
    url: '/api-user/roles/findRoleById/' + id,
    method: 'get'
  })
}

export function addObj (obj) {
  return request({
    url: '/api-user/roles/saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function rolesMenus (obj) {
  return request({
    url: '/api-user/roles/rolesMenus',
    method: 'post',
    data: obj
  })
}
export function rolesPermission (obj) {
  return request({
    url: '/api-user/roles/rolesPermission',
    method: 'post',
    data: obj
  })
}

export function menusPermission () {
  return request({
    url: '/api-user/roles/menusPermission',
    method: 'get'
  })
}

export function findPermissionByRoleId (roleId) {
  return request({
    url: '/api-user/roles/findPermissionByRoleId/' + roleId,
    method: 'get'
  })
}

export function findMenusByRoleId (roleId) {
  return request({
    url: '/api-user/menus/findMenusByRoleId/' + roleId,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/api-user/roles/deleteRole/' + id,
    method: 'delete'
  })
}

export function fetchRoleTree (roleName) {
  return request({
    url: '/admin/menu/roleTree/' + roleName,
    method: 'get'
  })
}
