<template>
  <div class="pt-40 pb-40 text-left font-size-16">
    <div class="font-size-20 font-bold">{{ setting.name }}</div>
    <div class="mt-10">{{ setting.description }}</div>
    <div v-for="option in setting.options" :key="option.name" class="d-flex justify-content-between align-center">
      <div>{{ option.name }}</div>
      <md-switch
        class="md-switch-vendor large-switch"
        v-model="option.enabled"
        @change="changeOption(option.field, option.enabled)"
      ></md-switch>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    setting: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    changeOption(option, value) {
      this.$emit("change", this.setting.settingName, option, value);
    },
  },
};
</script>