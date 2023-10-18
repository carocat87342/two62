<template>
  <div class="employee-body">
    <div class="form-main">
      <div class="form-block">
        <div>
          <Title class="emp-title" title="Oh, wow so thats you" titleText="titleStyle" />
        </div>
        <InputText
          labelStyle="label_input"
          label="Full Name"
          fieldStyle="field_input"
          required
          name="full_name"
          :onChange="onChange"
          :isErrors="isErrors"
          :value="full_name"
        />
        <InputText
          labelStyle="label_input"
          label="Email Address"
          required
          name="email"
          :onChange="onChange"
          :isErrors="isErrors"
          :value="email"
        />
        <div class="om_phone-block">
          <div class="phone_country-code">
            <Select
              label="Country code"
              labelStyle="om_label_input"
              :list="list_code"
              name="country_code"
              required
              :onChange="onChange"
              :valueName="['name','dial_code']"
              withSpan
              :trim="isTrim"
              :isErrors="isErrors"
            />
          </div>
          <InputText
            labelStyle="om_label_input"
            label="Phone Number"
            :value="phone"
            name="phone"
            :onChange="onChange"
            :isErrors="isErrors"
            required
          />
        </div>
      </div>
      <div class="button-block">
        <Button text="next" :onClick="submitForm" class="md-success md-fileinput button-md-common" />
      </div>
    </div>
    <div class="logo-main">
      <div>
        <img
          class="emp-logo"
          src="https://static-maryoku.s3.amazonaws.com/storage/img/secure_booker.png"
        />
        <Title title="Join the Hive" titleBlock="titleBlock" titleText="titleStyle" />
      </div>
    </div>
  </div>
</template>
<script>
// CONSTANTS
import country_code from "@/constants/country_code";

// HELPER_FUNC
import { isWrong } from "@/utils/helperFunction";

// COMPONENTS
import InputText from "@/components/Inputs/InputText.vue";
import Select from "@/components/Select/Select.vue";
import Title from "@/components/Title/Title.vue";
import Button from "@/components/Button/Button.vue";

export default {
  name: "Employee",
  components: {
    InputText,
    Select,
    Title,
    Button,
  },
  data() {
    return {
      full_name: "",
      email: "",
      phone: "",
      isErrors: false,
      country_code: "",
      list_code: country_code,
    };
  },
  computed: {
    isTrim() {
      return this.country_code === "";
    },
  },
  methods: {
    submitForm: function () {
      this.validFunc(this);
      if (this.isErrors === false) {
        const info = isWrong(this, [
          "full_name",
          "email",
          "phone",
          "country_code",
        ]);
        this.$store.dispatch("user/sendCompanyInfo", info);
        this.$router.push("/events-data");
      }
    },
    onChange: function (value, name) {
      this[name] = value;
    },
    validFunc: function (ctx, required) {
      const errorsObj = [];
      if (ctx["full_name"] === "") {
        errorsObj.push("full_name");
      }
      if (ctx["email"] === "") {
        errorsObj.push("email");
      }
      if (ctx["phone"] === "") {
        errorsObj.push("phone");
      }
      if (ctx["country_code"] === "") {
        errorsObj.push("country_code");
      }
      if (errorsObj.length !== 0) {
        ctx.isErrors = true;
      } else {
        ctx.isErrors = false;
      }
    },
  },
};
</script>
<style lang="scss">
.employee-body {
  display: flex;
  flex-direction: "column";
}
.form-main {
  width: 50%;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
}
.logo-main {
  width: 50%;
  height: 100vh;
  background: #ff527c;
  display: flex;
  align-items: center;
}
.form-block {
  width: 75%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.emp-logo {
}
.emp-title {
  text-align: center;
  margin-bottom: 20px;
}
.label_input {
  font-size: 20px;
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
.buttonStyle {
  cursor: pointer;
  color: #ff527c;
  font-size: 20px;
  margin-right: 20px;
  border: 1px solid;
  padding: 10px 15px;
  border-radius: 10px;
}
.button-block {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 45px;
}
.om_phone-block {
  display: flex;
  .phone_country-code {
    margin-right: 40px;
    width: 30%;
  }
  &.phone-number {
  }
}
</style>
