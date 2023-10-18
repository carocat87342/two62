<template>
  <div class="event-state-message">
    <div class="event-state-message-image">
      <img v-if="data.type==='positive'" :src="`${$iconURL}messages/positive.svg`" />
      <img v-if="data.type==='action'" :src="`${$iconURL}messages/CTA.svg`" />
      <img v-if="data.type==='benchmark'" :src="`${$iconURL}messages/Benchmark.svg`" />
      <img v-if="data.type==='alert'" :src="`${$iconURL}messages/Alert.svg`" />

    </div>
    <div v-if="data.type==='positive'" class="event-state-message-content">
      <div class="message-title">{{data.title}}</div>
      <div class="message-content">{{data.message}}</div>
      <div class="message-action">
        <div class="message-action-content">{{data.action}}</div>
        <div class="message-action-button">
          <md-button class="md-bold add-category-btn md-black md-simple" @click="closeMessage()">Cancel</md-button>
<!--          <md-button class="md-red md-bold add-category-btn">Send</md-button>-->
        </div>
      </div>
    </div>
    <div v-if="data.type==='action'"  class="event-state-message-content">
      <div class="message-title">{{data.title}}</div>
      <div class="message-content">{{data.message}}</div>
      <div class="message-action">
        <div class="message-action-content">{{data.action}}</div>
        <div class="message-action-button">
          <md-button class="md-bold add-category-btn md-black md-simple" @click="closeMessage()">Cancel</md-button>
          <md-button class="md-red md-bold add-category-btn">Send</md-button>
        </div>
      </div>
    </div>
    <div v-if="data.type==='benchmark'"  class="event-state-message-content">
      <div class="message-title benchmark">{{data.title}}</div>
      <div class="message-content benchmark">{{data.message}}</div>
      <div class="message-action">
        <div class="message-action-content benchmark">{{data.action}}</div>
        <div class="message-action-button">
          <md-button
            class="md-red md-simple normal-btn"
          >Ok, Thanks</md-button>
        </div>
      </div>
    </div>
    <div v-if="data.type==='alert'"  class="event-state-message-content">
      <div class="message-title alert-message">
        <md-icon class="color-minus">remove_circle_outline</md-icon>
        $ 2,200
      </div>
      <div class="message-title alert-message">{{data.title}}</div>
      <div class="message-action">
        <div class="message-action-content alert-message">{{data.message}}</div>
        <div class="message-action-button">
          <md-button
            class="md-bold add-category-btn md-black md-simple"
          >No, Thanks</md-button>
          <md-button class="md-red md-bold add-category-btn">Add Money</md-button>
        </div>
      </div>
    </div>
    <div class="close-button">
      <md-button @click="closeMessage()" class="md-icon-button md-default md-simple md-black">
        <md-icon>close</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
const messages = [
  {
    title: "Great Job!",
    message: "You saved money on the catering deal!  Seems like you could use this extra money and get a video photographer. ",
    action: "Want to upgrade  our event and get fantastic clip?",
    type: "positive"
  },
  {
    title: "So where are we with the event budget? ",
    message: " Are we ready to go?",
    action: "Click here to approve the budget or use share option to get inputs from collegues",
    type: "action"
  },
  {
    title: "Manage your risks!",
    message: "You may want to keep some budget for unexpected issues and day-of expenses. ",
    action: "Typically, 10%-15% of total budget should be enough",
    type: "benchmark"
  },
  {
    title: "Ooops, your in minus",
    message: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo",
    type: "alert"
  }
]
import { BUDGET_MESSAGES } from "@/constants/messages";
export default {
  name: "event-state-message",
  props: {
    state: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      data: {}
    }
  },
  methods: {
    init(){
      // console.log('event.state.message', this.state);
      this.data = BUDGET_MESSAGES.find(m => m.key === this.state.key)
      if (this.state.key === 'higher_than_average') {
        let {message} = this.data;
        this.$set(this.data, 'message', message.replace('X%', `${this.state.percent}%`));
      }
    },
    closeMessage() {
      this.$emit("closeMessage");
    }
  },
  mounted() {
     this.init();
  }
}
</script>
<style lang="scss" scoped>
  .event-state-message {
    height: 200px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    padding:20px 60px;
    display: flex;
    align-items: center;

    &-image {
      width: 92px;
      margin-right: 40px;
    }
    &-content {
      flex-grow: 1;
    }
    .message-title {
      font-family: "Manrope-ExtraBold";
      font-size: 20px;
      color: #0fac4c;
      margin-bottom: 15px;
      &.benchmark {
        color: #e0ae17;
      }
      &.alert-message {
        color: #9f0000;
      }
    }
    .message-content {
      margin-bottom: 15px;
      &.benchmark {
        font-family: "Manrope-ExtraBold";
      }
    }
    .message-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-content {
        font-family: 'Manrope-Bold';
        font-size: 16px;
        &.benchmark {
          font-family: "Manrope-Regular";
        }
        &.alert-message {
          font-family: "Manrope-Regular";
        }
      }
      &-button {
        white-space: nowrap;
      }
    }
    .close-button {
      position: absolute;
      right: 60px;
      top: 30px;
      i {
        font-size: 30px !important;
        color: #050505;
      }
    }
  }
</style>
