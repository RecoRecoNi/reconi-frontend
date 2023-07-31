<template>
  <div>
    <b-card
      :subtitle="bean?.roastery"
      :img-src="getImgUrl(bean?.thumbnail)"
      img-alt="Image"
      img-top
      tag="article"
      style="max-width: 20rem"
      class="mb-2"
      :style="styleObject"
    >
      <b-card-title style="word-break:keep-all; min-height:12vh; display: flex; justify-content: center; align-content: center; flex-wrap: wrap">{{ bean?.title }}</b-card-title>
      <b-card-text style="min-height:2vh; font-size:0.8rem">
        <!-- {{ bean?.description }} -->
        {{ get_keywords }}
      </b-card-text>

      <b-container>
        <b-row class="text-center">
          <b-col cols="8">
            <b-button
              variant="primary"
              @click="$emit('openModal', bean)"
              >보러가기</b-button
            >
          </b-col>
          <b-col>
            <img
              v-if="!this.$store.getters.isInCart(bean?.id)" 
              @click="addCart(bean?.id)"
              src="../../public/unlike.png"
              alt="UnLike"
              style="width: 40px; height: 40px; cursor:pointer;"
            />
            <img
              v-else
              @click="removeFromCart(bean?.id)"
              src="../../public/like.png"
              alt="Like"
              style="width: 40px; height: 40px; cursor:pointer;"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-card>

        <!-- <b-button v-if="!this.$store.getters.isInCart(bean?.id)" @click="addCart(bean?.id)" variant="primary">담기</b-button> -->

  </div>
</template>

<script>
import axios from "axios";


export default {
  name: "main-product-sample-card",
  props: {
    bean: Object,
  },
  data() {
    return {
      styleObject: {
        fontSize: "10px",
        modalShow: false,
        new_url: null,
      },
    };
  },
  computed:{
    get_keywords(){
      let keywords = '';
      if (this.bean?.aroma >= 8){
        keywords += '#향이 강한  '
      }
      if (this.bean?.acidity >= 7){
        keywords += '#신맛  '
      }
      if (this.bean?.sweetness >= 8){
        keywords += '#단맛  '
      }
      if (this.bean?.body >= 8){
        keywords += '#묵직한  '
      } else if (this.bean?.body <= 4){
        keywords += '#가벼운  '
      }
      if (this.bean?.origins.length >= 2){
        keywords += '#블렌디드'
      } 
      return keywords;
    }
  },
  methods: {
    getImgUrl(url) {
      if (typeof url == "string") {
        if (url.startsWith("/media")) {
          return "http://reconi-backend.kro.kr:30005/" + url;
        }
        if (!url.startsWith("http://reconi-backend.kro.kr:30005/")) {
          this.new_url = url.replace(
            "http://reconi-backend.kro.kr",
            "http://reconi-backend.kro.kr:30005"
          );
          return this.new_url;
        }
      } else {
        return "http://reconi-backend.kro.kr:30005/" + url;
      }
    },
    addCart(beanId) {
      if (this.$store.getters.isLogin){
        axios
          .post(
            "http://reconi-backend.kro.kr:30005/api/v1/coffee-cart/add_to_cart/",
            { coffee_bean_id: beanId },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
              },
            }
          )
          .then(() => {
            this.$store.commit("addUserCart", beanId);
          })
          .catch((e) => {
            console.log(e);
          });
      } else{
        alert('로그인을 먼저 진행해주세요!')
      }
    },
    removeFromCart(beanId){
      axios.
        post(
          "http://reconi-backend.kro.kr:30005/api/v1/coffee-cart/remove_from_cart/",
          { coffee_bean_id : beanId},
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        )
        .then(() => {
          this.$store.commit("removeFromCart", beanId);
        })
        .catch((e) => {
          console.log(e)
        })
    }
  },
  components: {},
};
</script>

<style></style>
