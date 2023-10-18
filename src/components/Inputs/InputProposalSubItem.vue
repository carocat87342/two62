<template>
  <div class="input-proposal-sub-item-wrapper">
    <h6 class="title" v-if="title">{{ title }}</h6>
    <input
      type="text"
      :name="name"
      class="input-proposal"
      :disabled="disabled"
      :placeholder="placeholder"
      :style="`padding-left: ${icon || img ? '3rem' : '1.2rem'}`"
      @change="changeValue"
      v-if="!items"
    />
    <input
      type="text"
      :name="name"
      class="input-proposal category"
      :disabled="disabled"
      :placeholder="items[0]"
      :value="selectedItem"
      readonly
      @click="expanded = !expanded"
      v-else
    />
    <md-icon v-if="icon">{{ icon }}</md-icon>
    <img v-if="img != '' && !items" :src="img" />
    <img
      v-else
      :src="img"
      :style="`
        right: .5rem;
        left: unset;
        transform: rotate(90deg);
        width: 12px;
      `"
    />
    <ul v-if="expanded && items">
      <li v-for="(item, index) in items" :key="index" @click="selectValue(item)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "input-proposal-sub-item",
  model: {},
  props: {
    name: String,
    title: String,
    placeholder: String,
    icon: String,
    img: String,
    bkImg: String,
    disabled: Boolean,
    isLeft: Boolean,
    items: Array,
  },
  data() {
    return {
      expanded: false,
      selectedItem: null,
      value: "",
    };
  },
  created() {},
  methods: {
    selectValue(item) {
      this.selectedItem = item;
      this.expanded = false;
      this.$emit("change", item);
    },
    changeValue(event) {
      this.$emit("change", event.target.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.input-proposal-sub-item-wrapper {
  margin-right: 22px;
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;
  text-align: left;
  position: relative;

  .title {
    color: #050505;
    padding: 0;
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 7px;
    margin-top: 0;
    margin-bottom: 7px;
    text-transform: capitalize;
  }
  .input-proposal {
    padding: 22px 26px;
    font-size: 16px;
    width: 100%;
    border-radius: 3px;
    border: solid 0.5px #707070;

    &.category {
      font: normal 16px "Manrope-Regular", sans-serif;
      cursor: pointer;
      color: #050505;
    }
  }
  i {
    position: absolute;
    left: calc(3em + 16px);
    margin-top: 12px;
  }
  img {
    position: absolute;
    // left: calc(3rem + 12px);
    top: 46px;
    left: 1rem;
    width: 20px;
    margin-right: 12px;
  }
  ul {
    list-style: none;
    padding: 20px 26px;
    border: 1px solid #050505;
    margin: 0;
    position: absolute;
    background: #ffffff;
    z-index: 99;
    width: 100%;

    li {
      font: normal 16px Manrope-Regular, sans-serif;
      cursor: pointer;
      margin-bottom: 1em;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
