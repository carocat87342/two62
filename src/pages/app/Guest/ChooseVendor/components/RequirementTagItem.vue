<template>
  <div class="requirement-tag-item">
    {{ label }}
    <md-button class="md-simple md-icon-button md-red" @click="remove"><md-icon>close</md-icon></md-button>
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
  methods: {
    remove() {
      this.$emit("remove");
    },
  },
};
</script>
<style lang="scss" scoped>
.requirement-tag-item {
  margin: 0 10.6px 0 0;
  padding: 10px 5px 10px 17px;
  border-radius: 100px;
  border: solid 1px #f51355;
  color: #f51355;
  font-size: 14px;
  display: inline-block;
}
</style>
