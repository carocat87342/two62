<template>
<div :class='inputBlock'>
<img :class="imgStyle" :src='srcLogo'>
<input
    :value='value'
    :name='name'
    :type='type'
    @input='triggerFunc($event)'
    :placeholder='placeholder'
    :class='inputStyle'/>
</div>
</template>
<script>
export default {
  name: 'InputWithIcon',
  model: {
  },
  props: {
    name: String,
    srcLogo: String,
    value: String,
    type: String,
    onChange: Function,
    inputBlock: String,
    placeholder: String,
    inputStyle: String,
    disabled: Boolean,
    imgStyle: String,
    inputStyle: String

  },
  methods: {
    triggerFunc: function (event) {
      this.onChange(event.target.value, event.target.name)
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
