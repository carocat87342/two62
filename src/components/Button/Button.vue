<template>
<md-button @click.prevent='triggerFunc' :class='buttonStyle'>{{text}}</md-button>
</template>
<script>
export default {
  name: 'Button',
  model: {
  },
  props: {
    text: String,
    buttonStyle: String,
    onClick: Function
  },
  methods: {
    triggerFunc: function () {
      this.onClick()
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
    .required-logo{
        color:red;
    }
</style>
