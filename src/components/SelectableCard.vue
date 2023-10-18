<template>
  <div class="selectable-card" :class="{ selected: selected === value, purple: theme === 'purple' }" @click="change">
    <div>
      <img :src="icon" />
    </div>
    <div>
      {{ label }}
    </div>
    <div>
      <md-checkbox
        class="md-checkbox-circle"
        :class="{ 'md-red': theme === 'red', 'md-vendor': theme == 'purple' }"
        @change="change"
        v-model="selected"
        :value="value"
      ></md-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "red",
    },
    selected: {
      type: String,
      default: "",
    },
  },
  methods: {
    change() {
      this.selectedCheckbox = true;
      this.$emit("change", this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.selectable-card {
  cursor: pointer;
  padding: 20px 25px;
  width: 200px;
  height: 200px;
  border: solid 1px #cccccc;
  border-radius: 3px;
  margin: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &.selected {
    color: #f51355;
    box-shadow: 0 3px 10px 0 rgba(245, 19, 85, 0.43);
    border: solid 0.5px #f51355;
    font-family: "Manrope-Bold";
    &.purple {
      color: #641856;
      box-shadow: 0 3px 10px 0 rgba(71, 3, 24, 0.43);
      border: solid 0.5px #641856;
    }
  }
  .md-checkbox-circle {
    margin: 0px;
  }
}
</style>