<template>
  <div class="Frame">
    <div class="Frame10">
      <div class="Frame9">
        <span class="Frame9-title">
          정확한 추천을 위해 <br />
          당신에 대해 알려주세요.
        </span>
        <span class="Frame9-sub">
          응답해주신 기록을 바탕으로 당신에게 꼭 맞는 커피를 추천해드릴게요.
        </span>
      </div>
    </div>
    <Vueform :force-labels="true">
      <template #empty>
        <FormSteps>
          <FormStep
            name="Step1"
            label="Step1"
            :elements="['first_input', 'second_input']"
          />
          <FormStep
            name="Step2"
            label="Step2"
            :elements="['third_input']"
          />
          <FormStep
            name="Step3"
            label="Step3"
            :elements="['fourth_input', 'fifth_input', 'sixth_input', 'seventh_input']"
          />
        </FormSteps>

        <FormElements>
          <RadiogroupElement name="first_input" placeholder = "first_input" view="blocks"
          :items="[ { value:'남자', label:'남자' }, { value:'여자', label:'여자' }  ]"
          label="당신의 성별을 알려주세요"/>

          <RadiogroupElement name="second_input" placeholder = "second_input" view="blocks"
          :items="[ { value:'10대', label:'10대' }, { value:'20대', label:'20대' }, { value:'30대', label:'30대' }, { value:'40대', label:'40대' }, { value:'50대', label:'50대' }, { value:'60대 이상', label:'60대 이상' }]"
          label="당신의 연령대를 알려주세요"/>
          <RadiogroupElement name="third_input" placeholder = "third_input" view="blocks"
          :items="[ { value:'초콜릿향', label:'초콜릿향' }, { value:'고소한 견과류향', label:'고소한 견과류향' }, { value:'상큼한 과일향', label:'상큼한 과일향' }, { value:'은은한 꽃향', label:'은은한 꽃향' }]"
          label="커피를 드실 때 선호하는 향을 알려주세요"/>
          <SliderElement name="fourth_input" placeholder = "fourth_input" :defalut="5" :max="10" :min="0" :step="1"
          label="커피를 드실 때 선호하는 산미의 정도를 알려주세요"
          info="산미는 원두가 가지고 있는 신 맛의 정도를 나타냅니다." show-tooltip="focus" tooltip-position="bottom"/>
          <SliderElement name="fifth_input" placeholder = "fifth_input" :defalut="5" :max="10" :min="0" :step="1"
          label="커피를 드실 때 선호하는 단 맛의 정도를 알려주세요"
          info="단 맛은 원두가 가지고 있는 단 맛의 정도를 나타냅니다." show-tooltip="focus" tooltip-position="bottom"/>
          <SliderElement name="sixth_input" placeholder = "sixth_input" :defalut="5" :max="10" :min="0" :step="1"
          label="커피를 드실 때 선호하는 바디감의 정도를 알려주세요"
          info="바디감은 커피가 입 안으로 들어왔을 때 주는 무게감을 나타냅니다." show-tooltip="focus" tooltip-position="bottom"/>
          <SliderElement name="seventh_input" placeholder = "seventh_input" :defalut="5" :max="10" :min="0" :step="1"
          label="커피를 드실 때 선호하는 원두 로스팅의 정도를 알려주세요"
          info="로스팅은 원두를 가열하여 볶은 정도를 의미합니다." show-tooltip="focus" tooltip-position="bottom"/>
        </FormElements>
        <FormStepsControls />
      </template>
    </Vueform>
  </div>
  <TestResult v-if="test_done"></TestResult>
</template>

<script>
import TestResult from "./TestResult.vue";
export default {
  data() {
    return {
      gender: "",
      ageRange: "",
      flavor: "",
      acid: 0,
      sweet: 0,
      bodyRate: 0,
      roast: 0,
      test_done: false
    };
  },
  components: {
    TestResult,
  },
};
</script>

<style>
.Frame {
  display: inline-flex;
  padding: 50px 180px;
  flex-direction: column;
  align-items: center;
  gap: 102px;
  background: #fff;
}
.Frame10 {
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}
.Frame9 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}
.Frame9-title {
  width: 923px;
  color: var(--system-grey-900, #212121);
  text-align: center;
  font-family: Inter;
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 2.2px;
  text-transform: uppercase;
}
.Frame9-sub {
  width: 755px;
  color: var(--system-grey-600, #757575);
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.2px;
}

.Form-area {
  background-color: #f7f7f7;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.b-form-group {
  margin-bottom: 20px;
}

/* 레인지 인풋 스타일 */
b-form-input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  background-color: #f7f7f7;
  height: 10px;
  border-radius: 5px;
  outline: none;
  margin-top: 8px;
}

b-form-input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #007bff;
  cursor: pointer;
}

/* Submit 버튼 스타일 */
b-button {
  width: 100%;
}
</style>
