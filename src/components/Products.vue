<template>
  <div class="w-full bg-white">
    <b-modal v-model="this.modalShow" size="lg" hide-footer>
      <template #modal-title> </template>
      <ProductDetail
        style="display: inline-flex"
        :selectedBean="this.selectedBean"
      />
      <!-- {{ this.selectedBean }} -->
    </b-modal>
  </div>
  <div class="container d-md-flex align-items-stretch">
    <!-- Page Content -->
    <div
      id="content"
      class="p-4 p-md-5 pt-5"
      @scroll="handleNotificationListScroll"
    >
      <h2 class="mb-4">지금 우리와 함께 커피의 세계를 탐험해보세요</h2>
      <p style="word-break: keep-all;">
       매일 아침의 여유로운 커피 시간, 바쁜 날의 달콤한 작은 쉼표,
         <br> <br> 우리의 다양하고 특별한 커피 상품들과 풍부한
        정보가 여러분을 기다리고 있습니다. 
      </p>
      

      <b-container
        class="bv-example-row mr-4"
        style="display: flex; flex-wrap: wrap; justify-content: space-around"
      >
        <Card
          v-for="bean in bean_data"
          @openModal="
            this.modalShow = !this.modalShow;
            this.selectedBean = $event;
          "
          :key="bean"
          :bean="bean"
          style="width: 250px"
          class="mt-4"
        />
      </b-container>

      <b-button
        v-if="nextButtonState"
        block
        variant="primary"
        @click="handleNotificationListScroll"
        class="mt-4"
        >더 많은 원두 보기</b-button
      >
    </div>

    <nav id="sidebar">
      <div class="p-4 pt-5">
        <h5>Filter</h5>
        <ul class="list-unstyled components mb-5">
          <li>
            <a> 신맛 </a>
            <VueSlider
              v-model="acidRange"
              :max="10"
              :min="0"
              :enable-cross="false"
              :interval="1"
              :lazy="true"
              sync
            >
            </VueSlider>
          </li>
          <li>
            <a>단맛</a>
            <VueSlider
              v-model="sweetyRange"
              :max="10"
              :min="0"
              :enable-cross="false"
              :interval="1"
              :lazy="true"
              sync
            >
            </VueSlider>
          </li>
          <li>
            <a>바디감</a>
            <VueSlider
              v-model="bodyRange"
              :max="10"
              :min="0"
              :enable-cross="false"
              :interval="1"
              :lazy="true"
              sync
            >
            </VueSlider>
          </li>
          <li>
            <a>로스팅</a>
            <VueSlider
              v-model="roastRange"
              :max="10"
              :min="0"
              :enable-cross="false"
              :interval="1"
              :lazy="true"
              sync
            >
            </VueSlider>
          </li>
        </ul>
        <div class="mb-5">
          <h5>카페인 여부</h5>
          <div class="tagcloud mt-4">
            <a
              class="tag-cloud-link"
              style="color: black"
              v-for="decaf in ['디카페인']"
              :key="decaf"
              @click="selectDecaf"
              :style="isDecaf ? 'background-color : aliceblue' : ''"
              >{{ decaf }}</a
            >
          </div>
        </div>
        <div class="mb-5">
          <h5>원산지</h5>
          <div class="tagcloud mt-4">
            <a
              class="tag-cloud-link"
              style="color: black; cursor: pointer"
              v-for="origin in this.origins"
              :key="origin"
              @click="addOriginFilter(origin)"
              :style="getOriginColor(origin)"
              >{{ origin }}</a
            >
          </div>
        </div>
        <div class="mb-5">
          <h5>로스터리</h5>
          <div class="tagcloud mt-4">
            <a
              class="tag-cloud-link"
              v-for="roastery in this.roasteries"
              :key="roastery"
              @click="setRoastery(roastery)"
              style="color: black; cursor: pointer"
              :style="setRoasteryColor(roastery)"
              >{{ roastery }}</a
            >
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Card from "./Card.vue";
import ProductDetail from "./ProductDetail.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";

export default {
  name: "products-main",
  components: {
    Card,
    ProductDetail,
  },
  data() {
    return {};
  },
  // composition API
  setup() {
    // 원두 정보
    var page = ref(0);
    var prev = ref("");
    var next = ref("");
    var bean_data = ref([]);
    var origins = ref([]);
    var roasteries = ref([]);

    // 버튼 정보
    var nextButtonState = ref(false);

    // modal 정보
    var modalShow = ref(false);
    var selectedBean = ref(null);

    // filter 정보
    var acidRange = ref([0, 10]);
    var sweetyRange = ref([0, 10]);
    var bodyRange = ref([0, 10]);
    var roastRange = ref([0, 10]);
    var origins_country = ref([]);
    var roastery = ref("");
    var isDecaf = ref(false);

    watch(
      [
        () => acidRange.value[0],
        () => acidRange.value[1],
        () => sweetyRange.value[0],
        () => sweetyRange.value[1],
        () => bodyRange.value[0],
        () => bodyRange.value[1],
        () => roastRange.value[0],
        () => roastRange.value[1],
        origins_country.value,
        roastery,
      ],
      () => {
        filtering();
      }
    );

    function selectDecaf() {
      origins_country.value = [];
      roastery.value = "";
      if (!isDecaf.value) {
        axios
          .get(
            "http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/decaffeinated_coffee_beans/"
          )
          .then((getted) => {
            bean_data.value = getted.data;
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        getinitpage();
      }
      isDecaf.value = !isDecaf.value;
    }

    function setRoastery(input) {
      if (input == roastery.value) {
        roastery.value = "";
        getinitpage();
      } else {
        isDecaf.value = false;
        roastery.value = input;
      }
    }

    function setRoasteryColor(input) {
      return roastery.value === input ? "background-color : aliceblue" : "";
    }

    function getOriginColor(origin) {
      if (origin === null) return "";
      return origins_country.value.includes(origin)
        ? "background-color : aliceblue"
        : "";
    }

    function addOriginFilter(origin) {
      isDecaf.value = false;
      if (origins_country.value === []) {
        origins_country.value.push(origin);
        return;
      }
      if (origins_country.value.includes(origin)) {
        origins_country.value.splice(origins_country.value.indexOf(origin));
      } else {
        origins_country.value.push(origin);
      }
    }

    function filtering() {
      axios
        .get(getURL())
        .then((getted) => {
          bean_data.value = getted.data;
          console.log(getted);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    function getURL() {
      let query = `http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/category_filtered/?sweetness__gte=${sweetyRange.value[0]}&sweetness__lte=${sweetyRange.value[1]}&acidity__gte=${acidRange.value[0]}&acidity__lte=${acidRange.value[1]}&body__gte=${bodyRange.value[0]}&body__lte=${bodyRange.value[1]}&roasting_point__gte=${roastRange.value[0]}&roasting_point__lte=${roastRange.value[1]}`;
      // let query = `http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/category_filtered/?acidity__gte=${acidRange.value[0]}&acidity__lte=${acidRange.value[1]}&sweetness__gte=${sweetyRange.value[0]}&sweetness__lte=${sweetyRange.value[1]}&body__gte=${bodyRange.value[0]}&body__lte=${bodyRange.value[1]}&roasting_point__gte=${roastRange.value[0]}&roasting_point__lte=${roastRange.value[1]}`;
      if (origins_country.value.length != 0) {
        query += `&origins_country=${origins_country.value.join(",")}`;
      }
      if (roastery.value != "") {
        query += `&roastery=${roastery.value}`;
      }
      return query;
    }

    function getOrigins() {
      axios
        .get(
          "http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/unique_categories/"
        )
        .then((getted) => {
          origins.value = getted.data.origin;
          roasteries.value = getted.data.roastery;
          nextButtonState.value = true;
        })
        .catch(() => {
          console.log("실패😘");
        });
    }

    function getinitpage() {
      axios
        .get(
          "http://reconi-backend.kro.kr:30005/api/v1/coffee-beans/?page=1&page_size=30"
        )
        .then((getted) => {
          console.log(getted);
          prev.value = getted.data.previous;
          next.value = getted.data.next;
          nextButtonState.value = true;

          // port number insert
          if (!next.value.startsWith("http://reconi-backend.kro.kr:30005")) {
            next.value = next.value.replace(
              "http://reconi-backend.kro.kr",
              "http://reconi-backend.kro.kr:30005"
            );
          }

          // bean_data.value = bean_data.value.concat(getted.data.results);
          bean_data.value = getted.data.results;
        })
        .catch(() => {
          console.log("실패😘");
        });
    }
    function getNextPage() {
      axios
        .get(next.value)
        .then((getted) => {
          console.log(getted);
          prev.value = getted.data.previous;
          next.value = getted.data.next;

          // port number insert
          if (!next.value.startsWith("http://reconi-backend.kro.kr:30005")) {
            next.value = next.value.replace(
              "http://reconi-backend.kro.kr",
              "http://reconi-backend.kro.kr:30005"
            );
          }

          bean_data.value = bean_data.value.concat(getted.data.results);
          console.log("실행됨");
        })
        .catch((e) => {
          alert("마지막 페이지입니다.");
          nextButtonState.value = false;
          console.log("실패😘");
          console.log(e);
        });
    }

    function handleNotificationListScroll(e) {
      const { scrollHeight, scrollTop, clientHeight } = e.target;
      console.log(scrollHeight, scrollTop, clientHeight);
      const isAtTheBottom = scrollHeight === scrollTop + clientHeight;
      if (isAtTheBottom) {
        getNextPage();
      }
    }

    onMounted(() => {
      getOrigins();
      getinitpage();
    });

    return {
      getNextPage,
      filtering,
      addOriginFilter,
      getOriginColor,
      setRoastery,
      setRoasteryColor,
      selectDecaf,
      handleNotificationListScroll,
      getURL,

      origins,
      roasteries,
      page,
      bean_data,
      prev,
      next,
      modalShow,
      selectedBean,
      acidRange,
      sweetyRange,
      bodyRange,
      roastRange,
      origins_country,
      roastery,
      isDecaf,
      nextButtonState,
    };
  },
};
</script>

<style scoped>
@import "./style.css";

h5 {
  color: black;
}
</style>
