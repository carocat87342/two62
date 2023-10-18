<template>
  <div class="planner-header d-flex justify-content-between align-center">
    <div class="d-flex align-center">
      <img :src="`${$iconURL}common/maryoku-logo-white.png`" />
      <div class="ml-20 mr-10 d-flex align-center">
        Who are we and why are we great?
        <md-button
          @click="gotoAbout"
          class="md-button md-red md-just-icon md-theme-default scroll-top-button md-reverse"
        >
          <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
        </md-button>
      </div>
    </div>
    <div class="d-flex align-center">
      <span class="font-bold off-price">Get 50$ OFF Today!</span>
      <md-button class="md-simple maryoku-btn md-white" @click="login">Login</md-button>
      <md-button class="maryoku-btn md-red md-reverse" @click="register()">Register</md-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    gotoAbout() {},
    login() {
      const currentUrl = this.$route;
      this.$router.push(`/signin?redirectUrl=${this.$route.fullPath}`);
    },
    register() {
      const currentUrl = this.$route;
      this.$router.push(`/signup?redirectUrl=${this.$route.fullPath}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.planner-header {
  padding: 20px 30px;
  background-color: #f5f5f5;
  color: white;
  .off-price {
    color: #ffbf48;
  }
  .scroll-top-button {
    img {
      transform: rotate(90deg);
    }
  }
}
</style>