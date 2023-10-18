<template>
  <div class="collapse-panel">
    <div class="collapse-panel-header">
      <slot name="header"></slot>
      <md-button @click="toggle" class="md-icon-button md-simple collapse-button" :class="`mr-${spacing}`">
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
      isExpanded: true,
    };
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
  },
  created() {
    this.isExpanded = this.defaultStatus;
  },
  props: {
    defaultStatus: {
      type: Boolean,
      default: true,
    },
    spacing: {
      type: Number,
      default: 50,
    },
  },
};
</script>
<style lang="scss" scoped>
.collapse-panel {
  .collapse-panel-header {
    position: relative;
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