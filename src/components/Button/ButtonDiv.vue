<template>
<div @click.prevent='triggerFunc' :class='[classChenger?buttonStyle:secondClass]'>{{text}}</div>
</template>
<script>
export default {
  name: 'Button',
  model: {
  },
  props: {
    text: String,
    buttonStyle: String,
    onClick: Function,
    filter: String,
    secondClass: {type: String, default: ''},
    classChenger: {type: Boolean, default: true}
  },
  methods: {
    triggerFunc: function () {
      if (this.filter) { this.onClick(this.filter) }
      this.onClick()
    }
  }

}
</script>
<style lang="scss">

</style>
