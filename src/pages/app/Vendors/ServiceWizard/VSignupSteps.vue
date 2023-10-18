<template>
  <div class="v-signup-steps-wrapper">
    <div class="steps-cont">
      <ul class="progressbar">
        <!-- <li @click="goToStep(1)" :class="[{ active: step >= 1 }, { current: step == 1 }]">
          <span v-if="step == 0"><i>&#8226;</i></span>
          <span v-else><md-icon>check</md-icon></span>
          <br />
          <strong class="text">about your <br />company</strong>
        </li> -->
        <li @click="goToStep(2)" :class="[{ active: step >= 3 }, { current: step == 2 }, { inactive: step < 2 }]">
          <span v-if="step >= 3"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          <strong class="text">services &<br />amentities</strong>
        </li>
        <li @click="goToStep(3)" :class="[{ active: step >= 4 }, { current: step == 3 }, { inactive: step < 3 }]">
          <span v-if="step >= 4"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          <strong class="text">disclamer & <br />policy</strong>
        </li>
        <li @click="goToStep(4)" :class="[{ active: step >= 5 }, { current: step == 4 }, { inactive: step < 4 }]">
          <span v-if="step >= 5"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          <strong class="text">summary</strong>
        </li>
        <li @click="goToStep(5)" :class="[{ active: step >= 6 }, { current: step >= 5 }, { inactive: step < 5 }]">
          <span v-if="step >= 6"><md-icon>check</md-icon></span>
          <span v-else><i>&#8226;</i></span>
          <br />
          <strong class="text">get<br />recommendation</strong>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "v-signup-steps",
  components: {},
  props: {
    step: Number,
  },
  data() {
    return {};
  },
  methods: {
    goToStep(step) {
      if (step < this.step) {
        this.$root.$emit("go-to-signup-step", step);
      }
    },
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.v-signup-steps-wrapper {
  background-color: #ffffff;
  font-family: "Manrope-Regular", sans-serif;
  min-width: 800px;

  .steps-cont {
    width: 100%;
    margin: 0 auto;
    color: #a0a0a0;

    .progressbar {
      counter-reset: step;
      padding: 40px 0 0 0;
      margin: 0;
      display: flex;
      li {
        list-style-type: none;
        float: left;
        width: 20%;
        position: relative;
        text-align: center;
        text-transform: uppercase;
        cursor: pointer;
        flex-grow: 1;
        span {
          width: 34px;
          height: 34px;
          display: inline-block;
          border-radius: 50%;
          z-index: 2;
          position: relative;
          margin-bottom: 8px;
          color: #e0ae17;
        }

        strong.text {
          font: bold 14px Manrope-Regular, sans-serif;
        }

        &.active,
        &.current {
          span {
            background: #ffc001;
            box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.28);
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
}
</style>
