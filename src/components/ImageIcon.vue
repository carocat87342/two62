<template>
  <img :src="`${$iconURL}${src}`" :style="`width:${width}px; margin-right:10px`"/>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 20
    }
  },
}
</script>