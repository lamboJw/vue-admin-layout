import { login, logout, info } from '@/api/user'
import { getToken, setToken, removeToken, setUid, getUid, removeUid } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    role: 0,
    uid: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token, id } = response.result
        commit('SET_TOKEN', token)
        commit('SET_UID', id)
        setToken(token)
        setUid(id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      info({ id: getUid() }).then(response => {
        const { role, name, permissions } = response.result
        if (!role) {
          reject('您还没有授权任何角色')
        }
        commit('SET_ROLE', role)
        commit('SET_NAME', name)
        commit('permission/SET_PERMISSIONS', permissions, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        removeUid()
        resetRouter()
        commit('RESET_STATE')
        commit('permission/RESET_STATE', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUid()
      commit('RESET_STATE')
      commit('permission/RESET_STATE', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

