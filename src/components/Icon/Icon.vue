<template>
<div @click.prevent='checkImage' class='icon'>
<div :class='iconStyle'>
<img v-if='isChecked===true' :src="iconSourceOne" :class="imageStyle"/>
<img v-else :src="iconSourceTwo" :class="imageStyle"/>
</div>
<div class="label-logo">
    <span :class="titleStyle">{{toUpperCase}}</span>
</div>
</div>
</template>
<script>
export default {
  name: 'Icon',
  model: {
  },
  props: {
    iconSourceOne: String,
    iconSourceTwo: String,
    checked: Boolean,
    iconStyle: String,
    imageStyle: String,
    titleStyle: String,
    logoName: String,
    title: {
      type: String,
      default: ''
    },
    onClick: Function,
    name: String
  },
  data () {
    return {
      isChecked: true
    }
  },
  computed: {
    toUpperCase: function () {
      return this.title.toUpperCase()
    }
  },
  methods: {
    checkImage: function () {
      this.isChecked = !this.isChecked
      this.onClick(this.name)
    }
  }
}
</script>
<style lang="scss">
.icon{
    cursor:pointer
}
.label-logo{
    width:100%;
    display: flex;
    justify-content: center;
    padding-top:10px
}
</style>
