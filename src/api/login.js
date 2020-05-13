import request from '@/plugin/axios'

/**
 * 登录
 * @param {用户名} username
 * @param {密码} password
 * @param {验证码} code
 * @param {验证码随机字符串} randomStr
 */
export const loginByUsername = (username, password, code, randomStr) => {
  var grantType = 'password'
  var scope = 'app'
  var clientId = 'jeecp'
  var clientSecret = 'webApp'
  return request({
    url: '/api-auth/oauth/token',
    headers: {
      'Authorization': 'Basic amVlY3A6amVlY3A='
    },
    method: 'post',
    params: { username, password, 'deviceId': randomStr, 'validCode': code, 'grant_type': grantType, scope, 'client_id': clientId, 'client_secret': clientSecret }
  })
}

export const userCurrent = (accesstoken) => {
  return request({
    url: '/api-auth/oauth/userinfo?access_token=' + accesstoken,
    method: 'get'
  })
}

/**
 * 手机号登录
 *
 * @param {手机号} mobile
 * @param {验证码} code
 */
export const loginByMobile = (mobile, code) => {
  return request({
    url: '/api-auth/authentication/sms',
    headers: {
      'Authorization': 'Basic amVlY3A6amVlY3A='
    },
    method: 'post',
    params: { mobile, code }
  })
}

/**
 * 退出登录
 * @param {请求token} accesstoken
 */
export const logout = (accesstoken) => {
  return request({
    url: 'api-auth/oauth/remove/token?access_token=' + accesstoken,
    method: 'post'
  })
}
