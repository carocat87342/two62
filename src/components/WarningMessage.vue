<template>
  <div class="error-message">
    <img :src="`${$iconURL}NewLandingPage/Group 1175 (10).svg`" />
    {{ label }}
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss">
.error-message {
  background-color: #ffe5ec;
  padding: 10px;
  border-radius: 3px;
  img {
    width: 20px;
  }
}
</style>