<template>
   <div  :class='titleBlock' >
   <p :class="titleText">{{title}}<span :class='spanStyles' @click='triggerFunc'>{{spanText}}<slot></slot></span></p>
   </div>
</template>
<script>
export default {
  name: 'Title',
  model: {
  },
  props: {
    title: String,
    titleText: String,
    titleBlock: String,
    withSpan: Boolean,
    spanText: String,
    spanStyles: String,
    onClick: Function

  },
  methods: {
    triggerFunc: function (event) {
      this.onClick()
    }
  }
}
</script>
<style lang="scss">
</style>
