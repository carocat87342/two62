<template>
  <div class="empty-request-card white-card p-20">
      <img class="mb-0" :src="`${$iconURL}vendordashboard/group-17116.png`" style="width: 55px; height: 55px" />
      <div class="ml-15">
          <div class="font-size-18 font-bold text-uppercase color-vendor">No Open opportunities</div>
          <p class="my-10 font-size-14">
              We couldn't find any more opportunities for you at this point. Increase your exposure by improving your
              profile
          </p>
          <div class="d-flex">
              <md-button class="md-simple ml-auto md-vendor md-outlined" style="height: 30px">Optimize Profile</md-button>
          </div>
      </div>
  </div>
</template>
<script>

export default {
  props: {
  },
  data() {
    return {

    };
  },
  methods: { },
  mounted() {},
};
</script>
<style lang="scss" scoped>
</style>
