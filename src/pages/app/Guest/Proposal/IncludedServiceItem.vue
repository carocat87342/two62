<template>
  <div>
    <div class="align-center included-service-item">
      <div class="item-title font-bold">
        <img :src="`${$iconURL}Submit%20Proposal/Group 4781.svg`" />
        {{ item.requirementTitle }}
      </div>
      <div class="item-qty text-center">
        {{ item.requirementValue }}
      </div>
      <div class="item-price text-center"></div>
      <div class="item-actions" :class="{ expanded: expanded }" v-if="item.description">
        <md-button
          class="md-sm normal-btn md-simple md-just-icon expand-extra-item color-black"
          @click="expanded = !expanded"
        >
          <span class="color-black"><md-icon v-if="!expanded" class="color-black"> keyboard_arrow_right</md-icon></span>
          <span class="color-black"><md-icon v-if="expanded" class="color-black"> keyboard_arrow_down</md-icon></span>
        </md-button>
      </div>
    </div>
    <div class="item-description" v-if="expanded">
      {{ item.description }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
};
</script>
<style lang="scss" scoped>
.included-service-item {
  display: grid;
  grid-template-columns: 50% 15% 15% 15% 5%;
  padding: 1em 0;
  .item-title {
    img {
      width: 26px;
      height: 26px;
      margin-right: 10px;
    }
  }
  .expand-extra-item {
    i {
      color: #050505 !important;
    }
  }
}
</style>