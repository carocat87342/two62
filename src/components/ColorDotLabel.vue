<template>
  <div class="dot-label">
    <span class="color-dot" v-if="color" :style="`background-color:${color}`"></span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'badge',
  props: {
    color: {
      type: String,
      default: ''
    },
  }
}
</script>
<style lang="scss" scoped>
.dot-label {
  .color-dot {
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
