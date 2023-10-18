<template>
  <div class="company-services-selector">
    <category-selector
      :value="value || ''"
      :categories="options.available"
      column="2"
      :multiple="true"
      @change="updateExChecked"
    ></category-selector>
  </div>
</template>
<script>
import CategorySelector from "@/components/Inputs/CategorySelector";
export default {
  components: {
    CategorySelector,
  },
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    defaultValue: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    console.log(this.defaultValue);
    this.value = this.defaultValue;
  },
  data() {
    return {
      checked: true,
      value: "",
      categories: [],
    };
  },
  methods: {
    updateExChecked(selectedValues) {
      this.$emit("change", selectedValues);
    },
  },
};
</script>