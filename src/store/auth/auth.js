import Vuex from "vuex";
import axios from "axios";

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("accTkn"),
    pk: localStorage.getItem("pk"),
    loginDomain: "http://127.0.0.1:8000/user/login/",
  },
  getters: {
    isLogin(state) {
      console.log(state.token);
      return state.token == null ? false : true
    },
  },
  mutations: {
    setToken(state, token) {
      console.log("setToken--");
      state.token = token;
      console.log(state.token);
    },
    setPk(state, pk){
      console.log("setPk");
      state.pk = pk;
      console.log(state.pk);
    },
    expireToken(state) {
      console.log("expireToken");
      state.token = null;
      state.pk = null;
    },
  },
  actions: {
    LOGIN({ state, commit }, userData) {
      console.log(state.loginDomain);
      console.log(userData);
      axios
        .post("http://127.0.0.1:8000/user/login/", userData)
        .then((data) => {
          commit("setToken", data.data.access);
          commit("setPk", data.data.user.pk);
          localStorage.setItem("accTkn", data.data.access);
          localStorage.setItem("pk", data.data.user.pk);
          location.reload()
        })
        .catch((e) => {
          console.log(e);
        });
    },
    LOGOUT({ commit }) {
      axios
        .get("http://127.0.0.1:8000/user/logout/", {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
        .then(() => {
          commit("expireToken");
          localStorage.removeItem("accTkn");
          localStorage.removeItem("pk");
          location.reload();
        });
    },
  },
});
