import Vuex from "vuex";
import axios from "axios";

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("accTkn") || "",
    loginDomain: "http://127.0.0.1:8000/user/login/",
  },
  getters: {
    isLogin(state) {
      return state.token !== "";
    },
  },
  mutations: {
    setToken(state, token) {
      console.log("mutation");
      state.token = token;
    },
  },
  actions: {
    LOGIN({ commit }, userData) {
      console.log(this.state.loginDomain);
      console.log(userData);
      axios
        .post("http://127.0.0.1:8000/user/login/", userData)
        .then((data) => {
          commit("setToken", data.data.access);
          localStorage.setitem("accTkn", data.access);
          return data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
});
