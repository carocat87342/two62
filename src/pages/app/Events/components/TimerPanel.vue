<template>
  <div class="proposal-time-counter" :class="theme">
    <div class="font-bold" v-if="isExpired">This offer has expired</div>
    <div class="font-bold" v-else>This offer will expire in</div>
    <hr />
    <timer size="big" :target="target"></timer>
    <template v-if="approved">
      <hr />
      <div class="font-bold font-size-14">More Time Granted</div>
    </template>
    <template v-else-if="declined">
      <hr />
      <div class="font-bold font-size-14">Request Denied</div>
    </template>
    <template v-else-if="pending">
      <hr />
      <div class="font-bold font-size-14">Waiting reply</div>
    </template>
    <div v-else-if="section !== 'card'" class="button-wrapper">
      <md-button
        class="maryoku-btn md-simple"
        :class="`md-${theme === 'red' ? 'red' : 'vendor'}`"
        @click="updateExpireTime"
        >Ask for more time</md-button
      >
    </div>
  </div>
</template>
<script>

const components = {
    Timer: () => import("@/components/Timer.vue"),
    TimeCounter: () => import("./TimeCounter.vue"),
}

export default {
  components,
  props: {
    target: {
      type: [Date, Number],
      default: new Date(),
    },
    approved:{
      type: Boolean,
      default: false,
    },
    declined:{
      type: Boolean,
      default:false,
    },
    pending:{
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "red",
    },
    section: {
      type: String,
      default: "detail"
    }
  },
  methods: {
    updateExpireTime() {
      this.$emit("updateExpireDate");
    },
  },
  computed: {
    isExpired() {
      return new Date(this.target).getTime() - new Date().getTime() < 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.proposal-time-counter {
  width: 300px;
  max-width: 90%;
  color: white;
  text-align: center;
  padding: 20px;
  border-radius: 3px;
  &.red {
    background-color: #f51355;
  }
  &.purple {
    background-color: #641865;
  }
  &.mobile-red {
     background-color: white;
  }
  .button-wrapper {
    background-color: white !important;
    margin: auto;
    width: max-content;
    .md-button {
      background-color: white !important;
      &:hover {
        background-color: white !important;
      }
    }
  }
  hr {
    background-color: white;
    opacity: 0.5;
  }

  &.mobile {
    color: #f51355;
    border: 2px solid #f51355;
    background-color: white;
    padding: 20px 0 0 0;

    .button-wrapper {
      background-color: #f51355 !important;
      width: 100%;
      .md-button {
          background-color: #f51355 !important;
          &:hover {
              background-color: #f51355 !important;
          }
      }
    }

    /deep/ .md-button-content {
        color: white !important;
    }

    hr{
        background-color: #f51355;
    }
  }
}

</style>
