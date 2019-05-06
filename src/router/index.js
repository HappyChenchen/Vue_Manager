import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const NotFound = () => import('@/views/404')
const ProjectInfo = () => import('@/views/pdfview/ProjectInfo')
const RecordEvents = () => import('@/views/RecordEvents')
const OverallSituation = () => import('@/views/OverallSituation')
import NewsList from '@/views/News/NewsList'
import NewsDetail from '@/views/News/NewsDetail'
const ThematicMap = () => import('@/views/Map/thematicMap')

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: Login, hidden: true},
  {path: '/404', component: NotFound, hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: Home,
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '',
    component: Layout,
    name: 'projectInfo',
    children: [{
      path: 'info',
      name: 'info',
      component: ProjectInfo,
      meta: {title: '项目资料', icon: 'egBook'},
    }],
  },
  {
    path: '',
    component: Layout,
    name: 'overallCharts',
    children: [{
      path: 'overall',
      name: 'overall',
      component: OverallSituation,
      meta: {title: '总体情况', icon: 'totalCheck'},
    }],
  },
  {
    path: '',
    component: Layout,
    name: 'map',
    meta: {title: '专题图', icon: 'map'},
    children: [{
      path: 'thematicmap',
      name: 'thematicmap',
      component: ThematicMap,
      meta: {title: '专题地图', icon: 'map'},
    }],
  },
  {
    path: '',
    component: Layout,
    name: 'recordEvents',
    children: [{
      path: 'events',
      name: 'events',
      component: RecordEvents,
      meta: {title: '大事记', icon: 'thingRecord'},
    }],
  },
  {
    path: '',
    component: Layout,
    name: 'overallCharts',
    children: [{
      path: 'newslist',
      name: 'newslist',
      component: NewsList,
      meta: {title: '新闻中心', icon: 'news'},
    }],
  },

  {path: '*', redirect: '/404', hidden: true},
  {
    path: '/newslist/:id',
    component: Layout,
    children: [{
      path: '/newslist/:id',
      name: 'newsDetail',
      component: NewsDetail
    }]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

