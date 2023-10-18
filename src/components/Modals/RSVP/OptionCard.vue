<template>
  <div class="option-card" @click="clickCard" :class="{selected: selected}" >
    <img :src="`${$iconURL}RSVP/${icon}`" class="mb-10">
    <div class="text-center">
      {{label}}
    </div>
    <div class="check-mark" v-if="selected"></div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickCard() {
      this.$emit("select")
    }
  },
}
</script>
<style lang="scss" scoped>
.option-card{
    width: 165px;
    height: 165px;
    border-radius: 3px;
    border: solid 0.5px #818080;
    background-color: #ffffff;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 30px;
    padding: 30px;
    &:first-child{
      margin-left: 0px;
    }
    &.selected {
      box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.17);
      border: solid 0.5px #050505;
      font-weight: bold;
      .check-mark {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: #f51355;
        border-radius: 50%;
        right: -15px;
        top: -15px;
        &:after {
          content: '';
          position: absolute;
          z-index: 7;
          border: 3px solid white;
          border-top: 0;
          border-left: 0;
          top: 6px;
          left: 10px;
          width: 9px;
          height: 14px;
          opacity: 1;
          transform: rotate(45deg) scale3D(1, 1, 1);
          transition: 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
      }
    }
  }
</style>