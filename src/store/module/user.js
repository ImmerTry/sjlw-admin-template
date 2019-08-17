import {login, logout, getUserInfo} from '@/api/user'
import {setToken, getToken, deleteToken} from '@/libs/util'
import {Message} from 'iview'
import Cookies from 'js-cookie'

export default {
  state: {
    userName: '',
    userId: '',
    avatar: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator (state, avatar) {
      state.avatar = avatar
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, userName) {
      state.userName = userName
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    deleteToken (state, token) {
      state.token = token
      deleteToken()
    }
  },
  actions: {
    // 登录
    handleLogin ({commit}, {userName, password}) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          if (res.data.code !== 400) {
            const token = res.data.data;// 获取请求后返回json数据中的token
            commit('setToken', token);// 设置本地缓存的token用于getUserInfo方法
            Message.success('登录成功');
            resolve()
          } else {
            Message.error(res.data.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({state, commit}) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   resolve()
        // }).catch(err => {
        //   reject(err)
        // })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('deleteToken')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({state, commit}) {
      return new Promise((resolve, reject) => {

        try {
          getUserInfo(state.token).then(res => {
            const user = res.data.data; // 获取请求后 返回json数据中的信息
            commit('setAvator', user.avatar);// 设置用户头像
            commit('setUserName', user.nickName);// 设置用户名
            // commit('setUserId', user.id)// 设置用户ID
            commit('setAccess', user.access);
            commit('setHasGetInfo', true);
            resolve(user)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
