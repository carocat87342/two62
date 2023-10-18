<template>
  <div class="refer-modal-item-wrapper">
    <div class="title-cont" @click="handleSelection">
      <div class="left-side">
        <img v-if="isSelected" :src="`${$iconURL}Submit%20Proposal/group-5661.svg`" />
        <img v-else :src="`${iconUrl}Rectangle 1245 (2).svg`" />
        <h3 class="title"><img :src="img" />{{ category.title }}</h3>
      </div>
      <div class="right-side">
        <img :src="`${iconUrl}Component 36 (2).svg`" :style="`transform: ${isSelected ? 'rotate(90deg)' : ''}`" />
      </div>
    </div>
    <div class="vendor-info-cont" v-if="isSelected">
      <input-proposal-sub-item
        :title="`Vendor's Name`"
        :placeholder="`Type vendor's name here`"
        @change="setReferredVendorProperty('companyName', ...arguments)"
      >
      </input-proposal-sub-item>
      <input-proposal-sub-item
        :title="`Email`"
        :placeholder="`Type email address here`"
        :img="`${iconUrl}Asset 620.svg`"
        @change="setReferredVendorProperty('vendorMainEmail', ...arguments)"
      >
      </input-proposal-sub-item>
      <input-proposal-sub-item
        :title="`Link to Website`"
        :placeholder="`Paste link here`"
        :img="`${iconUrl}Asset 619.svg`"
        @change="setReferredVendorProperty('social.website', ...arguments)"
      >
      </input-proposal-sub-item>
    </div>
  </div>
</template>
<script>
import InputProposalSubItem from "@/components/Inputs/InputProposalSubItem.vue";

export default {
  name: "refer-modal-item",
  components: {
    InputProposalSubItem,
  },
  props: {
    category: Object,
    img: String,
    iconUrl: String,
  },
  data() {
    return {
      isSelected: false,
      vendorInfo: {
        componentId: this.category.id,
        companyName: "",
        vendorCategory: this.category.componentId,
        vendorMainEmail: "",
        social: {
          website: "",
        },
      },
    };
  },
  methods: {
    handleSelection() {
      this.isSelected = !this.isSelected;
      if (!this.isSelected) {
        this.$emit("cancel", this.vendorInfo.vendorCategory);
      }
    },
    setReferredVendorProperty(property, value) {
      if (property.includes(".")) {
        const properties = property.split(".");
        this.vendorInfo[properties[0]][properties[1]] = value;
      } else if (property == "vendorCategory") {
        this.vendorInfo[property] = this.findVendorCategoryByTitle(value);
      } else {
        this.vendorInfo[property] = value;
      }
      this.$emit("set", this.vendorInfo);
    },
  },
  created() {},
  mounted() {},
  computed: {},
};
</script>
<style lang="scss" scoped>
.refer-modal-item-wrapper {
  padding: 34px 0;
  border-top: 1px solid #a0a0a0;
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;

  .title-cont {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .left-side {
      display: flex;
      align-items: center;

      img {
        width: 33px;
      }

      .title {
        i {
          margin-right: 22px;
          margin-left: 55px;
        }
      }

      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 800;

        img {
          width: 34px;
          margin-left: 55px;
          margin-right: 22px;
          top: -2px;
          position: relative;
        }
      }
    }
    .right-side {
      img {
        width: 12px;
      }
    }
  }
  .vendor-info-cont {
    text-align: left;

    .input-proposal-sub-item-wrapper {
      margin-bottom: 43px;
      &:first-child {
        margin-top: 32px;
      }
      &:last-child {
        margin-bottom: 34px;
      }
    }
  }
  &:last-child {
    border-bottom: 1px solid #a0a0a0;
  }
}
</style>
