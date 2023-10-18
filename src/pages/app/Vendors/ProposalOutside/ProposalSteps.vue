<template>
  <div class="proposal-steps-wrapper">
    <div class="title-cont">
      <div class="d-flex justify-content-center font-size-30 mb-10">
        <img :src="`${$iconURL}Budget Elements/${eventCategory.icon}`" class="page-icon" />
        <span> {{ vendor.eventCategory.fullTitle }} Proposal &nbsp;</span>
        <span class="color-vendor font-size-30 font-bold">{{ vendor.companyName }}</span>
      </div>
    </div>
    <div class="steps-cont">
      <ul class="progressbar">
        <li :class="[{ active: step >= 0 }, { current: step == 0 }]" @click="goToStep(0)">
          <span v-if="step == 0"><i>&#8226;</i></span>
          <span v-else><md-icon>check</md-icon></span>
          <br />
          Event Details
        </li>
        <li :class="[{ active: step > 1 }, { current: step == 1 }, { inactive: step < 1 }]" @click="goToStep(1)">
          <span v-if="step >= 2"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          What's your vision
        </li>
        <li :class="[{ active: step >= 3 }, { current: step == 2 }, { inactive: step < 2 }]" @click="goToStep(2)">
          <span v-if="step >= 3"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          Propose <br />Your Bid
        </li>
        <li :class="[{ current: step >= 3 }, { inactive: step < 3 }]" @click="goToStep(3)">
          <span v-if="step >= 3"><i>&#8226;</i></span>
          <span v-else><i>&#8226;</i></span>
          <br />Preview <br />Proposal
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "proposal-steps",
  components: {},
  props: {
    eventCategory: Object,
    vendor: Object,
    proposalRequest: Object,
  },
  data() {
    return {
      lookingFor: [],
    };
  },
  methods: {
    goToStep(step) {
      this.$store.commit("proposalForNonMaryoku/setWizardStep", step);
    },
  },
  created() {},
  computed: {
    step() {
      return this.$store.state.proposalForNonMaryoku.wizardStep;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.proposal-steps-wrapper {
  background-color: #ffffff;
  border-radius: 3px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  padding: 46px;
  font-family: "Manrope-Regular", sans-serif;

  .steps-cont {
    width: 100%;
    margin: 0 auto;
    color: #a0a0a0;

    .progressbar {
      counter-reset: step;
      display: flex;
      li {
        list-style-type: none;
        float: left;
        width: 33.33%;
        position: relative;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        span {
          cursor: pointer;
          width: 34px;
          height: 34px;
          display: inline-block;
          border-radius: 50%;
          z-index: 2;
          position: relative;
          margin-bottom: 8px;
          color: #e0ae17;
        }

        &.active,
        &.current {
          span {
            background: #ffc001;
            box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.26);
            i {
              color: white;
              position: relative;
              top: 3px;
            }
          }
        }

        &.current {
          span {
            i {
              position: relative;
              top: 4px;
              left: 1px;
              font-size: 30px;
              font-style: normal;
              display: inline;
              text-shadow: 0 2px 3px rgba(0, 0, 0, 0.42);
            }
          }
        }

        &.inactive {
          span {
            i {
              color: #707070;
              position: relative;
              top: 2px;
              font-size: 50px;
              font-style: normal;
            }
          }
        }
        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: #707070;
          top: 15px;
          left: -50%;
        }
        &:first-child:after {
          content: none;
        }
        &.active,
        &.current {
          color: #e0ae17;
        }
        &.active:before,
        &.current:before {
          background-color: #ffc001;
          color: white;
        }
        &.active:after,
        &.current:after {
          background-color: #ffc001;
        }
      }
    }
  }

  .title-cont {
    text-align: center;
    h3 {
      font-size: 30px;
      margin: 0;
      font-weight: 800;
      color: #050505;
      margin-bottom: 10px;
      text-transform: capitalize;
      img {
        width: 30px;
        height: 30px;
      }
    }
    span {
      display: inline-block;
      line-height: 35px;
      max-width: 50%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &.seperator {
        border-right: solid 1px #e2e2e2;
        height: 35px;
        margin: 0 20px;
      }
    }
  }
}
</style>
