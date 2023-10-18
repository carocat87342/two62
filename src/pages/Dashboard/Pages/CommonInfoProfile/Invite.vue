<template>
  <div class="invite_body">
    <div class="invite_form-main">
      <div class="invite_button-block">
        <Button text="next" :onClick="onNext" class="md-success md-fileinput button-md-common" />
      </div>
      <div class="invite_form-block">
        <div>
          <Title class="invite_emp-title" title="Time to say hello" titleText="invite_titleStyle" />
        </div>
        <div class="invite_massage-block">
          <InputText
            labelStyle="company_label_input"
            label="Website"
            :value="employee_email"
            name="employee_email"
            :onChange="onChange"
          />
          <div class="send-button">
            <Button text="Send" :onClick="onSend" class="md-success md-fileinput button-md-common" />
          </div>
        </div>
        <Title
          title="Or upload guests' emails from csv file."
          titleBlock="invite_titleBlock"
          titleText="invite_title-span"
          withSpan
          spanText=" Browse file"
          spanStyles="invite_event-title"
          :onClick="UploadCSV"
        >
          <input type="file" id="csv-upload" @change="onFileChange($event)" style="display:none" />
        </Title>
      </div>
      <div class="invite_button-block">
        <ButtonDiv buttonStyle="invite_buttonStyle" text="skip" :onClick="onSkip" />
      </div>
    </div>
    <div class="invite_logo-main">
      <div>
        <img
          class="invite_emp-logo"
          src="https://static-maryoku.s3.amazonaws.com/storage/img/propasal_manager.png"
        />
        <Title
          title="Come on, introduce us"
          titleBlock="invite_titleBlock"
          titleText="invite_titleStyle"
        />
        <Title
          titleText="invite_titleTextLogo"
          titleBlock="invite_titleBlock"
          title="Enchance the experience for your guests using variouns Participants Tools such as RSVP, Feedback, Group Segregation, After party options and so much more"
        />
      </div>
    </div>
  </div>
</template>
<script>
// HELPER FUNC
import { isWrong } from "@/utils/helperFunction";

// COMPONENTS
import InputText from "@/components/Inputs/InputText.vue";
import Select from "@/components/Select/Select.vue";
import Title from "@/components/Title/Title.vue";
import ButtonDiv from "@/components/Button/ButtonDiv.vue";
import Button from "@/components/Button/Button.vue";

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
    Button,
  },
  data() {
    return {
      employee_email: "",
      isErrors: false,
    };
  },
  methods: {
    onSkip: function () {
      this.$router.push("/officeManager-form");
    },
    onChange: function (value, name) {
      this[name] = value;
    },
    UploadCSV: function () {
      document.getElementById("csv-upload").click();
    },
    onFileChange: function (e) {
      console.log(e, "@ eto func");
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    },
    onSend: function () {
      if (this.employee_email) {
        const massages = this.employee_email
          .split(",")
          .map((item) => item.trim());
        this.$store.dispatch("user/sendEvent", massages);
      }
    },
    onNext: function () {
      if (this.employee_email) {
        const massages = this.employee_email
          .split(",")
          .map((item) => item.trim());
        this.$store.dispatch("user/sendEvent", massages);
      }
      this.$router.push("/officeManager-form");
    },
  },
};
</script>
<style lang="scss">
.invite_body {
  display: flex;
  flex-direction: "column";
}
.invite_form-main {
  width: 50%;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
}
.invite_logo-main {
  width: 50%;
  height: 100vh;
  background: #23d0a1;
  display: flex;
  align-items: center;
}
.invite_form-block {
  width: 75%;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  justify-content: center;
  transform: translateY(-10%);
}
.invite_emp-logo {
  height: 100%;
  width: 100%;
  margin-bottom: -10%;
}
.invite_emp-title {
  text-align: center;
  margin-bottom: 20px;
}
.invite_label_input {
  font-size: 20px !important;
  padding-left: 10px;
}
.invite_titleStyle {
  font-size: 40px;
  font-weight: 700;
}
.invite_titleBlock {
  display: flex;
  justify-content: center;
}
.invite_title-span {
  color: #b6b6b6;
  font-size: 22px;
  margin-top: 20px;
}
.invite_buttonStyle {
  cursor: pointer;
  color: #23d0a1;
  font-size: 20px;
}
.invite_button-block {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 45px;
}
.invite_event-title {
  color: #23d0a1;
  cursor: pointer;
}
.invite_titleTextLogo {
  text-align: center;
  width: 70%;
  color: white;
  font-size: 26px;
  margin-top: 20px;
  line-height: 147%;
}
.invite_input-img {
  width: 36px;
}
.invite_input {
  border: none;
  width: 75%;
  font-size: 20px;
  color: #b6b6b6;
}
.invite_input-block {
  border: 1.5px solid #b6b6b6;
  padding: 10px;
  width: 80%;
  height: 100%;
}
.invite_massage-block {
  display: flex;
  .send-button {
    display: flex;
    align-items: center;
    margin-left: 40px;
  }
}
</style>
