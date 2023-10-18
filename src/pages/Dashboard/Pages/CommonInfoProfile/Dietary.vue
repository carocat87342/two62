<template>
  <div v-if="role==='OM'">
    <div class="dietery_employee-body">
      <div class="dietary_form-main">
        <div class="dietary_form-block">
          <div>
            <Title class="emp-title" title="It's time to come clean" titleText="titleStyle" />
            <Title
              title="Mark you dietary constrints, so that we'll know to order for you"
              titleBlock="dietary_titleBlock"
              titleText="dietary_title-span"
            />
          </div>
          <div class="dietary-check-block">
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gluten_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gluten_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="cluten"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/lactose_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/lactose_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="lactuz"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gmo_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gmo_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="gmo"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/egg_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/egg_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="egg"
            />
          </div>
          <div class="dietary-check-block">
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/sugar_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/sugar_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="sugar"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/peanut_free_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/peanut_free_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="peanut"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/kosher_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/kosher_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="kosher"
            />
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/organic_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/organic_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="organic"
            />
          </div>
          <div class="dietary-check-block">
            <Icon
              iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/eco_off.png"
              iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/eco_on.png"
              imageStyle="dietary-icon_logo"
              :onClick="onSelect"
              name="ecofood"
            />
            <div class="dietary_other-options">
              <InputText
                labelStyle="label_input"
                label="Other"
                fieldStyle="field_input"
                :value="another_food"
                name="another_food"
                :onChange="onChange"
              />
            </div>
          </div>
        </div>
        <div class="button-block">
          <ButtonDiv buttonStyle="dietary_buttonStyle" text="skip" :onClick="onSkip" />
          <Button text="next" :onClick="onNext" class="md-success md-fileinput button-md-common" />
        </div>
      </div>
      <div class="dietary_logo-main">
        <div>
          <img
            class="emp-logo"
            src="https://static-maryoku.s3.amazonaws.com/storage/img/syncer.png"
          />
          <Title
            title="All Guests Preferences in one place"
            titleBlock="titleBlock"
            titleText="titleStyle"
          />
          <Title
            titleText="dietary_addition-text"
            titleBlock="titleBlock"
            title="Keeping track on everyone's dietory preferences can be a hassle, when each employee manages their personal preferences, all you have to do is lay back and enjoy"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="dietery_employee-body">
      <div class="dietary_form-main">
        <div class="dietary_form-block">
          <div>
            <Title class="emp-title" title="It's time to come clean" titleText="titleStyle" />
            <Title
              title="Mark you dietary constrints, so that we'll know to order for you"
              titleBlock="event_titleBlock"
              titleText="dietary_title-span"
            />
          </div>
          <div>
            <div class="dietary-check-block">
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gluten_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gluten_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="cluten"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/lactose_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/lactose_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="lactuz"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gmo_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/gmo_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="gmo"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/egg_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/egg_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="egg"
              />
            </div>
            <div class="dietary-check-block">
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/sugar_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/sugar_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="sugar"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/peanut_free_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/peanut_free_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="peanut"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/kosher_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/kosher_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="kosher"
              />
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/organic_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/organic_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="organic"
              />
            </div>
            <div class="dietary-check-block">
              <Icon
                iconSourceOne="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/eco_off.png"
                iconSourceTwo="https://static-maryoku.s3.amazonaws.com/storage/img/dietary/eco_on.png"
                imageStyle="dietary-icon_logo"
                :onClick="onSelect"
                name="ecofood"
              />
              <div class="dietary_other-options">
                <InputText
                  labelStyle="label_input"
                  label="Other"
                  fieldStyle="field_input"
                  :value="another_food"
                  name="another_food"
                  :onChange="onChange"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="button-block">
          <ButtonDiv buttonStyle="dietary_buttonStyle" text="skip" :onClick="onSkip" />
          <Button text="next" :onClick="onNext" class="md-success md-fileinput button-md-common" />
        </div>
      </div>
      <div class="dietary_logo-main">
        <div>
          <img
            class="emp-logo"
            src="https://static-maryoku.s3.amazonaws.com/storage/img/syncer.png"
          />
          <Title title="You gutta eat, right?" titleBlock="titleBlock" titleText="titleStyle" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import InputText from "@/components/Inputs/InputText.vue";
import Select from "@/components/Select/Select.vue";
import Title from "@/components/Title/Title.vue";
import ButtonDiv from "@/components/Button/ButtonDiv.vue";
import Button from "@/components/Button/Button.vue";
import Icon from "@/components/Icon/Icon.vue";

export default {
  name: "Employee",
  props: {
    officeManager: String,
  },
  components: {
    InputText,
    Select,
    Title,
    ButtonDiv,
    Icon,
    Button,
  },
  data() {
    return {
      role: null,
      dietary: [],
      another_food: "",
    };
  },
  mounted: function () {
    const onboardingPath = this.$store.getters["user/getUser"].onboardingPath;
    this.role = onboardingPath;
  },
  methods: {
    onSkip: function () {
      this.$router.push("/company");
    },
    onSelect: function (food) {
      if (!this.dietary.includes(food)) {
        this.dietary.push(food);
      } else {
        this.dietary = this.dietary.filter((item) => item !== food);
      }
    },
    onChange: function (value, name) {
      this[name] = value;
    },
    onNext: function () {
      const data = {};
      data["dietary"] = this.dietary;
      data["another_food"] = this.another_food;
      this.$store.dispatch("user/sendCompanyInfo", data);
      this.$router.push("/company");
    },
  },
};
</script>
<style lang="scss">
.dietery_employee-body {
  display: flex;
  flex-direction: "column";
}
.dietary_form-main {
  width: 50%;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.dietary_logo-main {
  width: 50%;
  height: 100vh;
  background: #67b5dd;
  display: flex;
  align-items: center;
}
.dietary_form-block {
  width: 75%;
  display: flex;
  flex-direction: column;
}
.emp-logo {
  height: 100%;
  width: 100%;
}
.emp-title {
  text-align: center;
  margin-bottom: 20px;
}
.label_input {
  font-size: 20px !important;
  padding-left: 10px;
}
.titleStyle {
  font-size: 40px;
  font-weight: 700;
}
.titleBlock {
  display: flex;
  justify-content: center;
}
.dietary_buttonStyle {
  cursor: pointer;
  color: #67b5dd;
  font-size: 20px;
  padding: 10px 0px;
}
.button-block {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0px 40px;
}
.dietary_addition-text {
  text-align: center;
  width: 70%;
  color: white;
  font-size: 26px;
  margin-top: 20px;
  line-height: 147%;
}
.dietary-icon_logo {
  width: 150px;
  height: 150px;
}
.dietary-check-block {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}
.dietary_other-options {
  padding-top: 30px;
  width: 75%;
}
.dietary_icon-title {
  font-weight: 800;
  color: #b6b6b6;
}
.dietary_title-span {
  color: #b6b6b6;
  font-size: 22px;
  margin-top: 20px;
}
.dietary_titleBlock {
  display: flex;
  justify-content: center;
}
</style>
