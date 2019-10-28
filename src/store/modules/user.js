import Vue from 'vue'
import { login, logout } from '@/api/login'
import { GetMenuByRID } from '@/api/menu'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    rid: '',
    menus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_MENU: (state, menu) => {
      state.menus = menu
    },
    SET_RID: (state, rid) => {
      state.rid = rid
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          commit('SET_RID', result.rid)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetMenu ({ commit }, rid) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('rid', rid)
        GetMenuByRID(formData).then(response => {
          const result = response.data
          // 所有的菜单都挂上去
          commit('SET_MENU', result)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          // commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
