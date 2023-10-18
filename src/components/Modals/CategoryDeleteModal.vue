<template>
  <modal class="budget-category-delete-modal">
    <template slot="header">
      <div class="model__header">
        <div class="minus-value color-red d-flex align-center justify-content-start">
          <span>- ${{ category.allocatedBudget | withComma }}</span>
        </div>
        <h2 class="font-bold font-size-30">
          You have removed
          <span class="category-name">"{{ category.fullTitle }}"</span>
        </h2>
        <div class="header-description">What would you like to do?</div>
      </div>
    </template>
    <template slot="body">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="unexpected"
            ><span calss="option-label"></span> Add that money to ‘Unexpected’ category</md-radio
          >
          <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="total"
            ><span calss="option-label"></span> Reduce total budget</md-radio
          >
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-simple md-black add-category-btn" @click="cancel">Cancel</md-button>
      <md-button class="md-red add-category-btn" @click="selectOption">Select</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal } from "@/components";
export default {
  name: "budget-handle-minus-modal",
  components: {
    Modal,
  },
  props: {
    show: [Boolean],
    category: [Object],
  },
  data: () => {
    return {
      selectedOption: "unexpected",
    };
  },
  methods: {
    selectOption() {
      this.$emit("select", { selectedOption: this.selectedOption, offset: this.category.allocatedBudget });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.budget-category-delete-modal {
  .category-name {
    white-space: nowrap;
  }
}
.modal-container {
  max-width: 900px !important;
}
.model__header {
  padding: 0px 20px;
  text-align: left !important;
  .arrow {
    margin: 10px 0px 20px;
    font-size: 40px;
    i {
      color: #050505 !important;
    }
  }
  .minus-value {
    font-size: 40px;
  }
}
.md-layout {
  text-align: left !important;
  padding-left: 15px;
  padding-bottom: 40px;
  .md-layout-item {
    padding-left: 0px;
    .option-label {
      color: #050505 !important;
    }
  }
}
</style>