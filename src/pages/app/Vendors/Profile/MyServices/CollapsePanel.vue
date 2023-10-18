<template>
  <div class="collapse-panel">
    <div class="collapse-panel-header font-bold-extra text-transform-uppercase" @click="toggle">
      <slot name="header"></slot>
      <md-button @click="toggle" class="md-icon-button md-simple collapse-button mr-50">
        <md-icon class="icon" v-if="isExpanded">keyboard_arrow_down</md-icon>
        <md-icon class="icon" v-if="!isExpanded">keyboard_arrow_right</md-icon>
      </md-button>
    </div>
    <div class="collapse-panel-content" v-if="isExpanded">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggle(event) {
      event.stopPropagation();
      this.isExpanded = !this.isExpanded;
      this.$emit("toggle", this.isExpanded);
    },
  },
  created() {
    this.isExpanded = this.defaultStatus;
  },
  props: {
    defaultStatus: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.collapse-panel {
  .collapse-panel-header {
    position: relative;
    padding: 50px;
    font-size: 30px;
    font-weight: bolder;
    border-top: solid 1px #050505;
    cursor: pointer;
    .collapse-button {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      .icon {
        font-size: 35px !important;
      }
    }
  }
}
</style>