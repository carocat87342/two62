<template>
<div :class='controlBlockStyle'>
<div  class='previus_button' @click.prevent='onPrevious'><md-icon  class='icon-control-panel'>keyboard_arrow_left</md-icon></div>
<span>{{month[currentMonth]}}</span>
<div  class='next_button' @click.prevent='onNext'><md-icon  class='icon-control-panel'>keyboard_arrow_right</md-icon></div>
</div>
</template>
<script>
export default {
  name: 'Button',
  mounted () {
    this.currentMonth = new Date().getMonth()
    console.log(this.currentMonth)
  },
  data () {
    return {
      month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      currentMonth: ''
    }
  },
  props: {
    text: String,
    buttonStyle: String,
    onClick: Function,
    controlBlockStyle: String
  },
  methods: {
    onNext () {
      this.currentMonth = ++this.currentMonth
      if (this.currentMonth === 12) {
        this.currentMonth = 0
      }
      if (this.currentMonth === -1) {
        this.currentMonth = 11
      }
      this.onClick(this.month[this.currentMonth])
    },
    onPrevious () {
      this.currentMonth = --this.currentMonth
      if (this.currentMonth === 12) {
        this.currentMonth = 0
      } if (this.currentMonth === -1) {
        this.currentMonth = 11
      }
      this.onClick(this.month[this.currentMonth])
    },
    triggerFunc () {

    }
  }
}
</script>
<style lang="scss">
    .input-default{
        border: none;
        padding: 15px;
        width: 100%;
        border-bottom: 1px solid #e4e4e4
    }
    .icon-control-panel{
        cursor:pointer;
        color:white !important;
    }
</style>
