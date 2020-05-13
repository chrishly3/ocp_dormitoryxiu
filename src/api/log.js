import request from '@/plugin/axios'

export function sysLog (query) {
  return request({
    url: '/api-log/sysLog',
    method: 'get',
    params: query
  })
}
