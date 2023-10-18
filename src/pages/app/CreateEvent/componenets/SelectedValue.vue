<template>
  <div class="selected-value">
    <img :src="`${$iconURL}Onboarding/${icon}`"/>
    <div>
      {{this.value}}
    </div>
    <div>
      <md-icon style="color:#f51355">keyboard_arrow_right</md-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    property: {
      type:String,
      default: ""
    }
  },
  computed: {
    icon() {
      if (!this.property) return ""
      return `${this.property}-red.svg`
    }
  },
}
</script>
<style lang="scss" scoped>
  .selected-value {
    img {
      width: 21px;
    }
    font-size: 20px;
    border: solid 1px #f53555;
    color: #f53555;
    border-radius: 2px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    max-width: 500px;
    margin: auto;
  }
</style>