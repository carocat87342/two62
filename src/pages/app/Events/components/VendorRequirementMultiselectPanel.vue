<template>
  <div class="requirement-section vendor-requirement-multiselect">
    <div class="d-flex">
      <img :src="`${$iconURL}Requirements/lookfor.svg`" class="mr-20" />
      <div>
        <div
          class="font-size-22 font-bold"
        >What kind of {{data.subCategory}} would go perfectly with your event?</div>
        <div class="font-size-14 mt-20">Feel free to mark more than just one</div>
      </div>
    </div>
    <div>
      <md-checkbox
        v-for="(option, index) in this.data.options"
        :key="index"
        v-model="option.selected"
        @change="changeState"
        class="option"
      >{{option.name}}</md-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {},
    },
    currentComponent: {
      type: Object,
      default: {},
    },
    index: {
      type: Number,
    }
  },
  data() {
    return {
      serviceNames: {
      },
    };
  },
  methods: {
    changeState() {
      this.$emit('change');
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-requirement-multiselect {
  .option {
    min-width: 150px;
  }
}
</style>
