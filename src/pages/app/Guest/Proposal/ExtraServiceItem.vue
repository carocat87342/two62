<template>
  <div>
    <div class="align-center extra-service-item">
      <div class="item-title font-bold">
        {{ item.requirementTitle }}
      </div>
      <div class="item-qty text-center">
        <input v-model="item.requirementValue" v-if="!item.added" />
        <span v-else class="pb-15 pt-15 d-inline-block">{{ item.requirementValue }}</span>
      </div>
      <div class="item-price text-center">
        ${{ item.price }}
        {{ item.unit }}
      </div>
      <div class="item-added text-center">
        <template v-if="item.added">
          <img :src="`${$iconURL}budget+screen/png/Asset+31.png`" width="20" />
          Added
        </template>
        <md-button v-else class="md-red md-sm normal-btn" @click="addService">
          <md-icon class="mr-10">add_circle_outline</md-icon>Add
        </md-button>
      </div>
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
  methods: {
    addService() {
      this.$emit("add", this.item);
    },
  },
};
</script>
<style lang="scss" scoped>
.extra-service-item {
  display: grid;
  grid-template-columns: 50% 15% 15% 15% 5%;
  padding: 1em 0;
  .added-label {
    min-height: 35px;
  }
  .item-qty {
    position: relative;
    input {
      width: 100%;
      text-align: center;
    }
  }
  .expand-extra-item {
    i {
      color: #050505 !important;
    }
  }
}
</style>
