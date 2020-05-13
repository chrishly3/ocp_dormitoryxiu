// Vue
import Vue from 'vue'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'
// 多国语
import i18n from './i18n'
import * as filters from './filters'

// 菜单和路由设置
import router from './router'
import { frameInRoutes } from '@/router/routes'
import VCharts from 'v-charts'
import util from '@/libs/util.js'
import { userCurrent } from '@/api/login'

// 核心插件
Vue.use(d2Admin)
Vue.use(VCharts)

// 全局filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 监听路由 控制侧边栏显示
    '$route.matched' (val) {
      const allMenu = this.$store.state.d2admin.user.menu
      if (val.length === 1) {
        console.log('----注销----')
        return
      }
      if (allMenu && allMenu.length !== 0) {
        const _side = allMenu.filter(function (menu) {
          if (menu.children != null) {
            return menu.children.filter(m => m.path === val[1].path)
          }
        })
        this.$store.commit('d2admin/menu/asideSet', _side.length > 0 ? _side : [])
      }
      // 手动强制刷新丢失，重新获取
      userCurrent(util.cookies.get('token')).then(res => {
        this.$store.commit('d2admin/user/SET_USER_INFO', { name: res.data.user.username }, { root: true })
      })
    }
  }
}).$mount('#app')
