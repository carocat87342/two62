<template>
  <div class="planningboard-tag-item" :class="{ selected: isSelected, red: theme === 'red' }" @click="handleClick">
    <span>{{ tagLabel }}</span>
    <md-icon class="icon">add_circle</md-icon>
  </div>
</template>
<script>
export default {
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
    tagLabel: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "gray",
    },
  },
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss" scoped>
.planningboard-tag-item {
  margin-bottom: 10px;
  border: solid 1px #f51355;
  // height: 50px;
  border-radius: 25px;
  display: inline-block;
  padding: 10px 20px;
  font-size: 14px;
  font-family: "Manrope-Bold";
  color: #f51355 !important;
  cursor: pointer;
  .icon {
    margin-left: 10px;
    color: #f51355 !important;
    font-size: 30px !important;
  }
  &.selected {
    border: solid 1px #a0a0a0;
    color: #a0a0a0 !important;
    .icon {
      color: #a0a0a0 !important;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
  &.red.selected {
    border: solid 1px #f51355;
    color: white !important;
    background-color: #f51355;
    .icon {
      color: white !important;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
</style>
