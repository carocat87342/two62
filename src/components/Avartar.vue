<template>
  <div class="avatar-symbol" :style="`background-color:${color}`">
    {{ symbol }}
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#F51355",
    },
  },
  computed: {
    symbol() {
      const phrases = this.name.split(" ");
      console.log(phrases);
      if (phrases.length >= 2) {
        return `${phrases[0].substr(0, 1)}${phrases[1].substr(0, 1)}`.toUpperCase();
      }
      return phrases[0].substr(0, 2).toUpperCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-symbol {
  background-color: #f51355;
  font-size: 16px;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>