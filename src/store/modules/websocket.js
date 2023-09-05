import Vue from 'vue'

const state = {
  websocket: null,
  showMsgBoxTip: false
}

const mutations = {
  WS_INIT: (state, url) => {
    if (state.websocket != null) {
      state.websocket.close()
    }
    state.websocket = new WebSocket(url)
    state.websocket.onmessage = function(event) {
      // console.log(event.data);
      // 监控消息盒子红点
      if (event.data === 'newMsg') {
        state.showMsgBoxTip = true
      }
    }
  },
  SET_MSG_BOX_TIP: (state, data) => {
    state.showMsgBoxTip = data
  },
  SEND_MSG: (state, data) => {
    state.websocket.send(data)
  },
  CLOSE_WS: (state) => {
    if (state.websocket !== null) {
      state.websocket.close()
    }
  }
}

let heartCheck

const actions = {
  WebSocketInit({ commit }, uid) {
    heartCheck = {
      timeout: 6000, // 60秒
      timeoutObj: null,
      isReconnecting: false,
      reset: function() {
        clearTimeout(this.timeoutObj)
        return this
      },
      start: function() {
        this.timeoutObj = setTimeout(function() {
          if (state.websocket !== null) {
            switch (state.websocket.readyState) {
              case WebSocket.CONNECTING: // 表示正在连接。
                // console.log("正在连接");
                break
              case WebSocket.OPEN: // 表示连接成功，可以通信了。
                // console.log("已经连接");
                state.websocket.send('HeartBeat')
                heartCheck.start()
                break
              case WebSocket.CLOSING: // 表示连接正在关闭。
                // console.log("正在关闭,1秒后再次尝试连接");
                setTimeout(() => {
                  heartCheck.reconnect()
                }, 1000)
                break
              case WebSocket.CLOSED: // 表示连接已经关闭，或者打开连接失败
                // console.log("已经关闭,再次连接");
                heartCheck.reconnect()
                break
              default:
                // console.log(state.websocket.readyState);
                // this never happens
                break
            }
          } else {
            // console.log("websocket断开连接");
            heartCheck.reconnect()
          }
        }, this.timeout)
      },
      reconnect: function() {
        if (this.isReconnecting) return
        this.isReconnecting = true
        state.websocket = null
        commit(
          'WS_INIT',
          'ws://' + Vue.prototype.SOCKET_URL + '?uid=' + uid + '&opt=login'
        )
        heartCheck.reset().start()
        this.isReconnecting = false
      }
    }
    heartCheck.reconnect()
  },
  SetMsgBoxTip({ commit }, data) {
    commit('SET_MSG_BOX_TIP', data)
  },
  SendMsg({ commit }, data) {
    commit('SEND_MSG', data)
  },
  Close({ commit }) {
    commit('CLOSE_WS')
    heartCheck.reset()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
