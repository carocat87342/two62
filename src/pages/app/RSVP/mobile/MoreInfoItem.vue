<template>
  <div class="rsvp-info-item">
    <div class="rsvp-info-item-header">
      <slot name="header"> This is the default header! </slot>
      <button class="expand-button" @click="opened = !opened">
        <md-icon v-if="!opened">keyboard_arrow_down</md-icon>
        <md-icon v-if="opened">keyboard_arrow_up</md-icon>
      </button>
    </div>
    <div v-if="opened" class="rsvp-info-item-content">
      <slot name="content"> This is the default text! </slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      opened: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.rsvp-info-item {
  border: 1px solid #11f1c6;
  background-color: #d5fcf3;
  border-radius: 10px;
  padding: 20px;
  &-header {
    .expand-button {
      width: 27.6px;
      height: 27.6px;
      padding: 0;
      border-radius: 50%;
      box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.08);
      background-color: #ffffff;
      border: none;
      i {
        color: black;
      }
      float: right;
    }
  }
  &-content {
    margin-top: 20px;
  }
}
</style>