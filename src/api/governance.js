import request from '@/plugin/axios'

export function getHostServer (query) {
  return request({
    url: '/api-eureka/eureka/apps',
    method: 'get',
    params: query
  })
}
