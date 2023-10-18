<template>
  <div class="proposals-bar">
    <div
      class="flex-1 proposal-item"
      v-for="proposal in proposals"
      :class="{ isActive: proposal.id === selectedId }"
      :key="proposal.id"
      @click="handleClick(proposal)"
      :style="`background: url('${headerBackgroundImage(proposal)}') center center no-repeat 100%`"
    >
      <img :src="`${headerBackgroundImage(proposal)}`" />
      <div class="proposal-content">
        <div class="font-size-30">${{ proposal.cost | withComma }}</div>
        <div class="font-size-22 mt-30" :class="{ 'font-bold-extra': proposal.id === selectedId }">
          {{ proposal.vendor.companyName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    proposals: {
      type: Array,
      default: () => [],
    },
    selectedId: {
      type: String,
      default: "",
    },
  },

  methods: {
    handleClick(proposal) {
      this.$emit("goDetail", proposal);
    },
    headerBackgroundImage(proposal) {
      if (proposal.inspirationalPhotos && proposal.inspirationalPhotos[0]) return proposal.inspirationalPhotos[0].url;
      if (proposal.vendor.images && proposal.vendor.images[0]) return proposal.vendor.images[0];
      if (proposal.vendor.vendorImages && proposal.vendor.vendorImages[0]) return proposal.vendor.vendorImages[0];
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.proposals-bar {
  width: 100%;
  display: flex;
  background-color: white;
  height: 162px;
  cursor: pointer;
  .proposal-item {
    color: white;
    overflow: hidden;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      background-color: black;
      opacity: 0.4;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      object-fit: cover;
    }
    .proposal-content {
      position: absolute;
      z-index: 1;
      padding: 30px;
    }
    &:not(:last-child) {
      margin-right: 3px;
    }
    &.isActive {
      font-weight: bold;
      border-bottom: solid 3px #f51355;
    }
  }
}
</style>