import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      }
    ]
  },
  // iframe
  {
    path: '/myiframe',
    redirect: '/myiframe',
    component: layoutHeaderAside,
    children: [
      {
        path: ':routerPath',
        name: 'iframe',
        meta: {
          auth: true,
          title: 'iframe'
        },
        component: () => import('@/views/system/iframe')
      }
    ]
  },
  {
    path: '/admin',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '系统管理'
    },
    children: [
      {
        path: '/admin/user',
        name: 'user',
        meta: {
          auth: true,
          title: '用户管理'
        },
        component: () => import('@/views/jeecp/admin/user')
      },
      {
        path: '/admin/menu',
        name: 'menu',
        meta: {
          auth: true,
          title: '菜单管理'
        },
        component: () => import('@/views/jeecp/admin/menu')
      },
      {
        path: '/admin/role',
        name: 'role',
        meta: {
          auth: true,
          title: '角色管理'
        },
        component: () => import('@/views/jeecp/admin/role')
      },
      {
        path: '/admin/auth',
        name: 'auth',
        meta: {
          auth: true,
          title: '权限管理'
        },
        component: () => import('@/views/jeecp/admin/auth')
      }
    ]
  },
  {
    path: '/jeecp-admin',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '系统监控'
    },
    children: [
      {
        path: '/admin/eureka',
        name: 'eureka',
        meta: {
          auth: true,
          title: '注册中心'
        },
        component: () => import('@/views/jeecp/service/eureka')
      },
      {
        path: '/admin/swagger',
        name: 'swagger',
        meta: {
          auth: true,
          title: '接口文档'
        },
        component: () => import('@/views/jeecp/service/swagger')
      },
      {
        path: '/admin/file',
        name: 'file',
        meta: {
          auth: true,
          title: '文件中心'
        },
        component: () => import('@/views/jeecp/service/file')
      },
      {
        path: '/admin/log',
        name: 'log',
        meta: {
          auth: true,
          title: '日志管理'
        },
        component: () => import('@/views/jeecp/service/log')
      },
      {
        path: '/admin/governance',
        name: 'governance',
        meta: {
          auth: true,
          title: '服务治理'
        },
        component: () => import('@/views/jeecp/service/governance')
      }
    ]
  },
  {
    path: '/jeecp-job',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '任务中心'
    },
    children: [
      {
        path: '/admin/jobinfo',
        name: 'jobinfo',
        meta: {
          auth: true,
          title: '任务管理'
        },
        component: () => import('@/views/jeecp/job/info')
      },
      {
        path: '/admin/joblog',
        name: 'joblog',
        meta: {
          auth: true,
          title: '调度日志'
        },
        component: () => import('@/views/jeecp/job/log')
      },
      {
        path: '/admin/jobgroup',
        name: 'jobgroup',
        meta: {
          auth: true,
          title: '执行器管理'
        },
        component: () => import('@/views/jeecp/job/group')
      }
    ]
  },
  {
    path: '/jeecp-manager',
    component: layoutHeaderAside,
    meta: {
      auth: true,
      title: '运营中心'
    },
    children: [
      {
        path: '/admin/channel',
        name: 'channel',
        meta: {
          auth: true,
          title: '渠道管理'
        },
        component: () => import('@/views/jeecp/manager/channel')
      },
      {
        path: '/admin/business',
        name: 'business',
        meta: {
          auth: true,
          title: '运营数据'
        },
        component: () => import('@/views/jeecp/manager/business')
      },
      {
        path: '/admin/apply',
        name: 'apply',
        meta: {
          auth: true,
          title: '应用管理'
        },
        component: () => import('@/views/jeecp/manager/apply')
      },
      {
        path: '/admin/member',
        name: 'member',
        meta: {
          auth: true,
          title: '会员管理'
        },
        component: () => import('@/views/jeecp/manager/member')
      },
      {
        path: '/admin/customer',
        name: 'customer',
        meta: {
          auth: true,
          title: '客户管理'
        },
        component: () => import('@/views/jeecp/manager/customer')
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
