<template>
  <div class="select-proposal-sub-item-wrapper" @click="clickItem(item)">
    <div v-if="!selected" class="active">
      <span>{{ item.name }}</span>
      <img src="https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/Group 3668 (2).svg" />
    </div>
    <div v-else class="inactive">
      <span>{{ item.name }}</span>
      <md-icon>close</md-icon>
    </div>
  </div>
</template>
<script>
export default {
  name: "select-proposal-sub-item",
  components: {},
  props: {
    item: Object,
    selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: true,
    };
  },
  methods: {
    clickItem(item) {
      this.active = !this.active;
      this.$emit("click", item);
    },
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.select-proposal-sub-item-wrapper {
  margin-right: 1rem;
  display: inline-block;
  font-size: 14px;
  div {
    padding: 0.5rem 1rem;
    border-radius: 100px;
    background-color: #ffffff;
    font-weight: bold;
    cursor: pointer;
    float: left;

    &.active {
      float: left;
      border: solid 1px #f51355;
      color: #f51355;

      span {
        text-transform: capitalize;
        display: inline-block;
      }
      img {
        width: 22px;
        margin-left: 1rem;
        display: inline-block;
      }
    }
    &.inactive {
      border: solid 1px #818080;

      span {
        text-transform: capitalize;
      }
      i {
        color: #818080;
        margin-left: 8px;
        margin-top: -3px;
      }
    }
  }
}
</style>
