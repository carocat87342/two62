<template>
  <div>
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <div class="steps-container">
      <div class="step" :class="[{'visited': step > 1}, {'active': step===1}]">
        <span>1</span> Create Event Details
      </div>
      <!--            <div class="step" :class="[{'visited': step > 2}, {'active': step===2}]">-->
      <!--                <span>2</span> Select Elements-->
      <!--            </div>-->
      <!--            <div class="step" :class="[{'active': step===3}]">-->
      <!--                Send to vendors-->
      <!--            </div>-->
    </div>
    <event-details v-if="step===1" @goToNextPage="goToNextPage" :new-event-data="newEvent" />
    <get-started
      v-else-if="step===2"
      @goToNextPage="goToNextPage"
      @goToPrevPage="goToPrevPage"
      :new-event="newEvent"
    />
    <!--        <brief-details v-show="step===2" @goToNextPage="goToNextPage" @goToPrevPage="goToPrevPage" />-->

    <div class="first-child">
      <div class="second-child">
        <div class></div>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from 'vue-element-loading'
import GetStarted from './GetStartedStep'
import BriefDetails from './BriefDetails'
import EventDetails from './EventDetails'

export default {
  name: 'event-steps',
  components: {
    VueElementLoading,
    GetStarted,
    BriefDetails,
    EventDetails
  },
  methods: {
    goToNextPage (eventData) {
      console.log('eventData => ', eventData)
      this.newEvent = eventData
      this.step++
    },
    goToPrevPage () {
      this.step--
    }
  },
  data () {
    return {
      isLoading: false,
      step: 1,
      newEvent: null
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";
/deep/ .margin-bottom-md {
  margin-bottom: 15px;
}

/deep/ .margin-bottom-xxl {
  margin-bottom: 25px;
}

/deep/ .bold {
  font-weight: bold;
}

/deep/ .md-error {
  color: $brand-danger;
}

.steps-container {
  display: flex;
  justify-content: flex-start;
  position: relative;
  text-align: center;
  margin-top: 15px;

  .step {
    padding: 20px 0;
    position: relative;
    width: 240px;
    background: #e3e3e3;
    color: #b6b6b6;
    font-weight: 500;
    font-size: 18px;

    &:first-child {
      border-radius: 5px 0 0 5px;
    }

    &:last-child {
      border-radius: 0 5px 5px 0;
    }

    span {
      border: 1px solid #c2c2c2;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: inline-block;
      padding-top: 6px;
      margin-right: 0.3em;
    }

    &.active {
      //color: $brand-primary;
      background: $brand-warning;
      color: $white-color;

      span {
        border-color: #fff;
      }

      &:before {
        border-color: $brand-primary;
        background: $brand-primary;
      }
    }

    &.visited {
      // background: $brand-warning;
      // color : $white-color;
    }
  }
}
</style>
