<template>
  <modal class="vendor-cancel">
    <template slot="header">
      <div class="model__header" v-if="step == 1">
        <div class="d-flex align-center justify-content-start">
          <span class="font-size-20 crosslinedText">{{ vendor.vendor.companyName }}</span>
        </div>
      </div>
      <div class="model__header" v-if="step == 2">
        <md-icon>west</md-icon>
      </div>
    </template>
    <template slot="body">
      <div class="md-layout" v-if="step == 1">
        <div class="font-bold font-size-30" style="line-height: 1.5em">
          Are You Sure You Want To
          <br />
          Cancel This Vendor?
        </div>
        <div class="header-description mt-20">
          <img :src="`${$iconURL}Event Page/warning-circle-gray.svg`" class="label-icon" />
          Some of the proposals we suggested you earlier might not be available anymore
        </div>
      </div>
      <div class="md-layout" v-if="step == 2">
        <div class="md-layout-item md-size-100 d-flex align-center">
          <img
            :src="`${this.$iconURL}Budget Elements/${this.categoryItem.componentId}.svg`"
            class="page-icon"
            style="width: 30px"
          />

          <span class="font-size-20 font-bold">&ensp;&ensp;{{ this.categoryItem.fullTitle }}</span>
        </div>
        <div class="md-layout-item md-size-100">
          <h2 class="font-bold font-size-30">What would you like to do instead?</h2>
        </div>
        <div class="md-layout-item md-size-100">
          <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="findAnother"
            ><span calss="option-label"></span> Find me alternative vendor</md-radio
          >
          <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="haveAlready"
            ><span calss="option-label"></span> I already have a vendor for this category</md-radio
          >
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-simple md-red md-red md-outlined" @click="cancel">No, take me back</md-button>&ensp;&ensp;
      <md-button class="md-red" @click="selectOption">Yes I'm sure</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal } from "@/components";
export default {
  name: "vendor-cancel-modal",
  components: {
    Modal,
  },
  props: {
    categoryItem: [Object],
    vendor: [Object],
  },
  data: () => {
    return {
      step: 1,
      selectedOption: "findAnother",
    };
  },
  methods: {
    selectOption() {
      if (this.step === 1) {
        this.step += 1;
      } else {
        this.$emit("select", { selectedOption: this.selectedOption, offset: this.newValue - this.value });
      }
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-cancel {
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