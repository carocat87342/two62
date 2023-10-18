<template>
  <div v-if="role==='OM'">
    <div class="employee-body">
      <div class="event_form-main">
        <div class="event_button-block">
          <Button text="next" :onClick="onNext" class="md-success md-fileinput button-md-common" />
        </div>
        <div class="event_form-block">
          <div>
            <Title
              class="event_emp-title"
              title="We're ready here..."
              titleText="event_titleStyle"
            />
          </div>
          <Datepicker
            labelStyle="event_label_input"
            label="Your bithday"
            fieldStyle="field_input"
            :value="bithday"
            name="bithday"
            :onChange="onChange"
          />
          <Datepicker
            labelStyle="event_label_input"
            label="When did you join the company"
            :value="join_to_company"
            name="join_to_company"
            :onChange="onChange"
          />
          <Select
            label="Which holidays do u celebrate?"
            labelStyle="event_label_input"
            :list="event_list"
            name="select_holiday"
            :valueName="['title','name']"
            :onChange="onChange"
            trim
          />
          <div
            class="events-add-new-date-block"
            v-if="add_dates.length!==0"
            v-for="item  in add_dates"
          >
            <div class="event-add-new-date_input">
              <InputText
                labelStyle="event_label_input"
                label="Description"
                fieldStyle="field_input"
                :value="item.description"
                name="description"
                :onChange="onChange"
                count
              />
            </div>
            <div class="event-add-new-date_datepicke">
              <Datepicker :key="date" :value="item.date" name="date" :onChange="onChange" count />
            </div>
            <div
              class="event-add-new-date-delete_button"
              @click.prevent="deleteDate(item.description)"
            >
              <md-icon class="event-add_icon">clear</md-icon>
            </div>
          </div>
          <Title
            title="The more we know about important dates, the more we can celebrate you."
            titleBlock="event_titleBlock"
            titleText="event_title-span"
            withSpan
            spanText=" Add dates"
            spanStyles="event_span-title"
            :onClick="onAddDate"
          />
        </div>
        <div class="event_button-block">
          <ButtonDiv buttonStyle="event_buttonStyle" text="skip" :onClick="onSkip" />
        </div>
      </div>
      <div class="event_logo-main">
        <div>
          <img
            class="event_emp-logo"
            src="https://static-maryoku.s3.amazonaws.com/storage/img/orical_power.png"
          />
          <Title
            title="Save time by automating"
            titleBlock="event_titleBlock"
            titleText="event_titleStyle"
          />
          <Title
            titleText="titleTextLogo"
            titleBlock="event_titleBlock"
            title="Automate individual congratulation cards to help you give that personal touch your guests crave, without the usual efford that comes with it"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="employee-body">
      <div class="event_form-main">
        <div class="event_button-block">
          <Button text="next" :onClick="onNext" class="md-success md-fileinput button-md-common" />
        </div>
        <div class="event_form-block">
          <div>
            <Title
              class="event_emp-title"
              title="We're ready here..."
              titleText="event_titleStyle"
            />
          </div>
          <Datepicker label="Your bithday" :value="bithday" name="bithday" :onChange="onChange" />
          <Datepicker
            label="When did you join the company"
            :value="join_to_company"
            name="join_to_company"
            :onChange="onChange"
          />
          <Select
            label="Which holidays do u celebrate?"
            labelStyle="event_label_input"
            :list="event_list"
            name="select_holiday"
            :valueName="['title','name']"
            :onChange="onChange"
            trim
          />
          <div
            class="events-add-new-date-block"
            v-show="add_dates.length!==0"
            v-for="(item,index)  in add_dates"
          >
            <div class="event-add-new-date_input">
              <InputText
                labelStyle="event_label_input"
                label="Description"
                fieldStyle="field_input"
                :value="item.description"
                name="description"
                :onChange="onChange"
                count
              />
            </div>
            <Datepicker :key="date" :value="item.date" name="date" :onChange="onChange" count />
            <div
              class="event-add-new-date-delete_button"
              @click.prevent="deleteDate(item.description)"
            >
              <md-icon class="event-add_icon">clear</md-icon>
            </div>
          </div>
          <Title
            title="The more we know about important dates, the more we can celebrate you."
            titleBlock="event_titleBlock"
            titleText="event_title-span"
            withSpan
            spanText=" Add dates"
            spanStyles="event_span-title"
            :onClick="onAddDate"
          />
        </div>
        <div class="event_button-block">
          <ButtonDiv buttonStyle="event_buttonStyle" text="skip" :onClick="onSkip" />
        </div>
      </div>
      <div class="event_logo-main">
        <div>
          <img
            class="event_emp-logo"
            src="https://static-maryoku.s3.amazonaws.com/storage/img/orical_power.png"
          />
          <Title
            title="Just give us a reason to selebrate"
            titleBlock="event_titleBlock"
            titleText="event_titleStyle"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// HELPER_FUNC
import { isWrong } from "@/utils/helperFunction";
// COMPONENTS
import InputText from "@/components/Inputs/InputText.vue";
import Datepicker from "@/components/Datepicker/Datepicker.vue";
import Select from "@/components/Select/Select.vue";
import Title from "@/components/Title/Title.vue";
import ButtonDiv from "@/components/Button/ButtonDiv.vue";
import Button from "@/components/Button/Button.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "Employee",
  props: {
    officeManager: String,
  },
  components: {
    Datepicker,
    Select,
    Title,
    ButtonDiv,
    Button,
    InputText,
    Modal,
  },
  data() {
    return {
      role: null,
      event_list: [
        {
          title: "Christian holidays",
          name: "Christian holidays",
        },
        {
          title: "Jewish holidays",
          name: "Jewish holidays",
        },
        {
          title: "Muslim holidays",
          name: "Muslim holidays",
        },
        {
          title: "Hindu holidays",
          name: "Muslim holidays",
        },
      ],
      select_holiday: "",
      bithday: "",
      join_to_company: "",
      add_dates: [],
      showModal: false,
      description: "",
      date: "",
      listComponentName: ["select_holiday", "bithday", "join_to_company"],
      new_number_of_event: 0,
    };
  },
  mounted: function () {
    const onboardingPath = this.$store.getters["user/getUser"].onboardingPath;
    this.role = onboardingPath;
  },
  methods: {
    onSkip: function () {
      this.$router.push("/dietary");
    },
    onChange: function (value, name, count) {
      this[name] = value;
      console.log(value, name, count);
      if (this.new_number_of_event && count) {
        this.add_dates[this.new_number_of_event - 1][name] = value;
      }
    },
    onNext: function () {
      console.log(this.add_dates);
      // const event=isWrong(this,this.listComponentName)
      // this.$store.dispatch("user/sendEvent",event)
      // this.$router.push('/dietary')
    },
    onAddDate: function () {
      const newDate = {
        description: "",
        date: "",
      };
      this.new_number_of_event = ++this.new_number_of_event;
      this.add_dates.push(newDate);
    },
    deleteDate: function (value) {
      console.log(value, this.add_dates);
      console.log(this.add_dates.filter((item) => item.description !== value));
      this.add_dates = this.add_dates.filter(
        (item) => item.description !== value,
      );
    },
  },
};
</script>
<style lang="scss">
.employee-body {
  display: flex;
  flex-direction: "column";
}

.event_form-main {
  width: 50%;
  height: 100vh;
  background-color: white;
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
}

.event_logo-main {
  width: 50%;
  height: 100vh;
  background: #23d0a1;
  display: flex;
  align-items: center;
}

.event_form-block {
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translateY(-10%);
}

.event_emp-logo {
  height: 100%;
  width: 100%;
  margin-bottom: -10%;
}

.event_emp-title {
  text-align: center;
  margin-bottom: 20px;
}

.event_label_input {
  font-size: 20px;
  padding-left: 10px;
}

.event_titleStyle {
  font-size: 40px;
  font-weight: 700;
}

.event_titleBlock {
  display: flex;
  justify-content: center;
}

.event_title-span {
  color: #b6b6b6;
  font-size: 22px;
  margin-top: 20px;
}

.event_buttonStyle {
  cursor: pointer;
  color: #23d0a1;
  font-size: 20px;
}

.event_button-block {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-bottom: 45px;
}

.event_span-title {
  color: red;
  cursor: pointer;
}

.titleTextLogo {
  text-align: center;
  width: 70%;
  color: white;
  font-size: 26px;
  margin-top: 20px;
  line-height: 147%;
}

.events-add-new-date-block {
  display: flex;
  width: 100%;
}

.event-add-new-date_input {
  width: 45%;
  margin-right: 20px;
}

.event-add-new-date_datepicke {
  width: 45%;
}

.event-add-new-date-delete_button {
  align-items: center;
  display: flex;
}

.event-add_icon {
  cursor: pointer;
}
</style>
