import Vuex from "vuex";
import axios from "axios";

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("accTkn"),
    pk: localStorage.getItem("pk"),
    userCart: localStorage.getItem("cart"),
    loginDomain: "http://127.0.0.1:8000/user/login/",
  },
  getters: {
    isLogin(state) {
      console.log(state.token);
      return state.token == null ? false : true;
    },
    isInCart: (state) => (beanId) => {
      return state.userCart.includes(beanId);
    }
  },
  mutations: {
    setToken(state, token) {
      console.log("setToken--");
      state.token = token;
      console.log(state.token);
    },
    setPk(state, pk) {
      console.log("setPk");
      state.pk = pk;
      console.log(state.pk);
    },
    expireToken(state) {
      console.log("expireToken");
      state.token = null;
      state.pk = null;
    },
    setUserCart(state, cart) {
      state.userCart = cart;
    },
    addUserCart(state, beanId){
      state.userCart.push(beanId);
    }
  },
  actions: {
    LOGIN({ state, commit }, userData) {
      console.log(state.loginDomain);
      console.log(userData);
      // set Token
      axios
        .post("http://reconi-backend.kro.kr:30005/user/login/", userData)
        .then((data) => {
          commit("setToken", data.data.access);
          commit("setPk", data.data.user.pk);
          localStorage.setItem("accTkn", data.data.access);
          localStorage.setItem("pk", data.data.user.pk);
          location.reload();
          // axios
          //   .get(
          //     "http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/user_cart_ids/",
          //     {
          //       headers: {
          //         Authorization: `Bearer ${this.state.token}`,
          //       },
          //     }
          //   )
          //   .then((getted) => {
          //     commit("setUserCart", getted.data.user_item_ids);
          //     localStorage.setItem("cart", getted.data.user_item_ids);
          //   });
        })
        .catch(() => {
          console.log('계정 정보가 잘못되었습니다.');
          alert("계정 정보가 잘못되었습니다.");
        });
    },
    LOGOUT({ commit }) {
      axios
        .get("http://reconi-backend.kro.kr:30005/user/logout/", {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
          },
        })
        .then(() => {
          commit("expireToken");
          localStorage.removeItem("accTkn");
          localStorage.removeItem("pk");
          localStorage.removeItem("cart")
          // location.reload();
        });
    },
  },
});
