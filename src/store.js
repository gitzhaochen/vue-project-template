import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user_data: {}
  },
  getters: {},
  mutations: {
    update_user_data(state, payload) {
      state.user_data = payload
    }
  }
})
