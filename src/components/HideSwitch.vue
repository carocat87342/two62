<template>
  <md-switch class="below-label large-switch md-switch-rose" v-model="data">
    <template v-if="label">
      <span v-if="data">Show {{label}}</span>
      <span v-if="!data">Hide {{label}}</span>
    </template>
  </md-switch>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: true,
    };
  },
  created() {
    this.data = this.value;
  },
  watch: {
    data(newValue, oldValue) {
      this.$emit("input", newValue);
    },
    value(newValue, oldValue) {
      this.data = this.value;
    },
  },
};
</script>
