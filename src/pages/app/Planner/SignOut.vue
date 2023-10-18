<template>
  <div class="md-layout">
    <div class="md-layout-item" style="text-align: center">
      <!-- <img src="https://static-maryoku.s3.amazonaws.com/storage/img/calendar-loader-3.gif" class="text-center" style="width: 64px;"/> -->
      <img src="/static/img/maryoku-loader.gif" />
      <h2 class="title text-center" slot="title" style="text-align: center">One moment please ...</h2>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  methods: {},
  created() {
    const that = this;
    this.$store.dispatch("auth/logout").then(() => {
      if (this.$route.meta.isVendor) {
        this.$router.push({ path: "/vendor/signin" });
      } else {
        this.$router.push({ path: "/signin" });
      }
      if (process.env.NODE_ENV === "production") {
        try {
          window.heap.resetIdentity();
        } catch (e) {
          console.error(e);
        }

        try {
          this.$Tawk.$endChat();
        } catch (e) {
          console.error(e);
        }

        this.$gtm.trackEvent({
          event: "user_signed_out", // Event type [default = 'interaction'] (Optional)
          category: "Users",
          action: "signout",
          label: "User Signed Out",
          value: this.$auth.user.emailAddress,
          noninteraction: false, // Optional
        });
      }
    });
  },
  data() {
    return {
      serverURL: process.env.SERVER_URL,
    };
  },
};
</script>
<style>
</style>
