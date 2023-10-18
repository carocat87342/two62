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
      <md-radio
        v-for="(option, index) in this.data.options"
        :key="index"
        v-model="selected"
        @change="changeState"
        class="option"
        :value="index"
      >{{option.name}}</md-radio>
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
      selected: -1,
    };
  },
  methods: {
    changeState() {
      this.data.options.map((op, index) => {
        op.selected = index === this.selected;
      });

      this.$emit('change', this.data);
    },
  },
  watch: {
    data: {
      handler(newVal, oldVal){
        console.log("watch.data", newVal);
        if (newVal) {
          this.selected = this.data.options.findIndex(op => op.selected);
        }
      },
      deep: true,
    }
  },
  mounted() {
    this.selected = this.data.options.findIndex(op => op.selected);
  }
};
</script>
<style lang="scss" scoped>
.vendor-requirement-multiselect {
  .option {
    min-width: 150px;
  }
}
</style>
