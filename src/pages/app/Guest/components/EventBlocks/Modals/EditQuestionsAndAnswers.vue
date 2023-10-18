<template>
  <div class="event_questions-answers-modal">
    <div class="md-layout">
      <div
        class="md-layout-item md-size-100 d-flex items-left"
        style="justify-content: space-between; margin-bottom: 2em"
      >
        <h4 style="margin: 0">Add Questions to Event</h4>
        <div class="pull-right">
          <md-button class="md-info md-sm add-question-btn" @click="addQuestion">
            <md-icon>add</md-icon> Add Question
          </md-button>

          <md-button class="md-success md-sm move-right" @click="saveQuestoinsList"> Save </md-button>
        </div>
      </div>
      <div class="md-layout-item md-size-100">
        <div class="question-item" v-for="(item, index) in questionsList" :key="index">
          <md-field>
            <label>Question</label>
            <md-input v-model="item.question"></md-input>
            <md-button
              class="md-danger md-sm md-just-icon md-simple"
              v-if="questionsList.length > 1"
              @click="removeQuestion(index)"
            >
              <md-icon>delete_outline</md-icon>
            </md-button>
          </md-field>
          <md-field>
            <label>Answer</label>
            <md-textarea v-model="item.answer"></md-textarea>
          </md-field>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import { Modal } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";

export default {
  components: {
    Modal,
  },
  props: {
    event: Object,
  },
  data: () => ({
    // auth: auth,
    questionsList: [],
    questionTemplate: {
      question: "",
      answer: "",
    },
  }),

  created() {
    this.questionsList = this.event.eventPage.qnas || [];
  },
  mounted() {},
  methods: {
    saveQuestoinsList() {
      this.$parent.isLoading = true;
      let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let editedEvent = new CalendarEvent({
        id: this.event.id,
        eventPage: {
          id: this.event.eventPage.id,
          qnas: this.questionsList,
        },
      });

      editedEvent
        .for(_calendar)
        .save()
        .then((response) => {
          console.log(response);
          this.$parent.isLoading = false;
          this.$parent.editMode = false;
          this.$root.$emit("refreshEvent");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addQuestion() {
      let block = Object.assign({}, this.questionTemplate);
      this.questionsList.push(block);
    },
    removeQuestion(index) {
      this.questionsList.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scope>
.md-datepicker {
  .md-icon.md-date-icon {
    display: none;
    & ~ label {
      left: 0;
    }
  }
  input {
    margin-left: 0 !important;
  }
  &.md-field::before,
  &.md-field::after {
    width: 100%;
  }
}
.md-field > .md-icon ~ .md-input {
  margin: 0;
}
/*.modal-container {*/
  /*max-width: 570px;*/
/*}*/
</style>
<style lang="scss">
.modal-z-index {
  z-index: 5;
}
.large-z-index {
  z-index: 6;
  position: relative;
}
.move-center {
  margin: 0 auto !important;
}
.move-left {
  margin-left: 0 !important;
  margin-right: auto !important;
}
.move-right {
  margin-right: 0 !important;
  margin-left: auto !important;
}
.text-center {
  text-align: center;
}
.d-flex {
  display: flex;
}
.items-center-v {
  align-items: center;
}
.items-center-g {
  justify-content: center;
}
.justify-beetwen {
  justify-content: space-between;
}
.md-field .md-error {
  text-align: left;
}
.swal2-container {
  z-index: 10000;
}
</style>
