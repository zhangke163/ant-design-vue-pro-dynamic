// eslint-disable-next-line
import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/views/dashboard/Workplace'),
  'Analysis': () => import('@/views/dashboard/Analysis'),

  // form
  'BasicForm': () => import('@/views/form/BasicForm'),
  'StepForm': () => import('@/views/form/stepForm/StepForm'),
  'AdvanceForm': () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  'TableList': () => import('@/views/list/TableList'),
  'StandardList': () => import('@/views/list/StandardList'),
  'CardList': () => import('@/views/list/CardList'),
  'SearchLayout': () => import('@/views/list/search/SearchLayout'),
  'SearchArticles': () => import('@/views/list/search/Article'),
  'SearchProjects': () => import('@/views/list/search/Projects'),
  'SearchApplications': () => import('@/views/list/search/Applications'),
  'ProfileBasic': () => import('@/views/profile/basic/Index'),
  'ProfileAdvanced': () => import('@/views/profile/advanced/Advanced'),

  // result
  'ResultSuccess': () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
  'ResultFail': () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),

  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),

  // equip
  'EquipMap': () => import(/* webpackChunkName: "fail" */ '@/views/equip/EquipMap'),
  'EquipList': () => import(/* webpackChunkName: "fail" */ '@/views/equip/EquipList'),
  'EquipStatic': () => import(/* webpackChunkName: "fail" */ '@/views/equip/EquipStatic')
}

// 前端未找到页面路由（固定不用改）
// const notFoundRouter = {
//   path: '*', redirect: '/404', hidden: true
// }

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  path: '',
  component: 'BasicLayout',
  redirect: '/equip',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (data) => {
  return new Promise((resolve, reject) => {
    const menuNav = []
    const childrenNav = []
    //      后端数据, 根级树数组,  根级 PID
    console.log(data)
    const mydata = [
      {
        "name": "equip",
        "parentId": 0,
        "id": 1,
        "meta": {
          "icon": "dashboard",
          "title": "在线监控",
          "show": true
        },
        "path": "",
        "component": "RouteView",
        "redirect": "/equip/EquipList"
      },
      {
        "name": "EquipMap",
        "parentId": 1,
        "id": 2,
        "meta": {
          "icon": "",
          "title": "设备地图",
          "show": true
        },
        "path": "/equip/EquipMap",
        "component": "EquipMap",
        "redirect": ""
      },
      {
        "name": "EquipList",
        "parentId": 1,
        "id": 7,
        "meta": {
          "icon": null,
          "title": "设备列表",
          "show": true
        },
        "path": null,
        "component": "EquipList",
        "redirect": null
      },
      {
        "name": "EquipStatic",
        "parentId": 1,
        "id": 8,
        "meta": {
          "icon": null,
          "title": "统计分析",
          "show": true
        },
        "path": null,
        "component": "EquipStatic",
        "redirect": null
      }
    ]
    // listToTree(data, childrenNav, 0)
    listToTree(data, childrenNav, 0)
    // debugger
    // rootRouter.children = changedata(childrenNav)
    rootRouter.children = childrenNav
    menuNav.push(rootRouter)
    const routers = generator(menuNav)
    routers.push({ path: '/dashboard/workplace' })
    // routers.push(rootRouter)
    resolve(routers)
  })
}
export const changedata = (mdata) => {
  const data = mdata[0]
  data.redirect = '/dashboard/workplace'
  data.component = 'RouteView'
  for (let i = 0; i < data.children.length; i++) {
    if (data.children[i].key === 'user-add1') {
      data.children[i].path = ''
      data.children[i].redirect = ''
      data.children[i].component = 'Workplace'
    } else if (data.children[i].key === 'user-update') {
      data.children[i].path = ''
      data.children[i].redirect = '/dashboard/analysis'
      data.children[i].component = 'Analysis'
    }
  }
  return data
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    // debugger
    const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      // component: constantRouterComponents[item.component || item.key] || () => import(`@/views/${item.component}`),

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: title, icon: icon || undefined, hiddenHeaderContent: hiddenHeaderContent, target: target, permission: item.name }
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
