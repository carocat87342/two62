<template>
  <div class="vsignup-edtiable-field-wrapper" :class="[{ 'border-bottom': borderBottom }]">
    <div class="left" :class="[{ 'full-width': isEdit }]">
      <div class="title">{{ title }}<span v-if="required"> *</span></div>
      <div class="content">
        <div v-if="!isEdit">
          <div class="d-flex align-center">
            <img class="mr-10" v-if="img != '' && value" :src="img" />
            {{ field == "vendorCategory" || field == "secondaryVendorCategory" ? selectedCategory.name : value }}
          </div>
        </div>
        <div class="edit-content" v-else>
          <div v-if="field == 'vendorMainEmail'">
            <img class="inside-img" :src="img" v-if="img != ''" />
            <input class="default width-100" :class="[{ 'with-img': img != '' }, isEmailValid()]" v-model="value" />
          </div>
          <div v-else-if="field == 'vendorMainPhoneNumber'">
            <img class="inside-img" :src="img" v-if="img != ''" />
            <input
              class="default width-100"
              :type="field == 'vendorMainPhoneNumber' ? 'number' : 'text'"
              :class="[{ 'with-img': img != '' }]"
              v-model="value"
            />
          </div>
          <div v-else>
            <img class="inside-img" :src="img" v-if="img != ''" />
            <input class="default width-100" :class="[{ 'with-img': img != '' }]" v-model="value" />
          </div>
        </div>
      </div>
      <div class="action-cont" v-if="isEdit" :class="{ 'width-66': field === 'vendorCategories' }">
        <md-button class="maryoku-btn md-simple md-black" @click="cancel">Cancel</md-button>
        <md-button class="maryoku-btn md-red" :disabled="!isValidValue" @click="save()">Save</md-button>
      </div>
    </div>
    <div class="right" v-if="!isEdit">
      <a @click="isEdit = true">
        Edit
        <md-icon>navigate_next</md-icon>
      </a>
    </div>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import VSignupAddressEditor from "./VSignupAddress";
export default {
  name: "v-signup-editable-field",
  components: {
    VueElementLoading,
    VSignupAddressEditor,
  },
  props: {
    title: String,
    field: String,
    img: String,
    defaultVal: {
      type: [String, Array],
      defaultValue: () => null,
    },
    borderBottom: Boolean,
    required: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isLoading: true,
    isEdit: false,
    expanded: false,
    selectedCategory: {
      name: null,
      icon: null,
    },
    address: null,
    reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    categoryIconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Budget Elements/",
    value: null,
    iconUrl: `https://static-maryoku.s3.amazonaws.com/storage/icons/Budget Elements/`,
  }),
  mounted() {
    this.value = this.defaultVal;
    if (this.field == "vendorAddressLine1" || this.field == "vendorAddressLine2") {
      this.$refs.address.focus();
    }
  },
  methods: {
    save() {
      this.isEdit = false;
      this.$emit("save", { field: this.field, value: this.value });
    },
    cancel() {
      this.isEdit = false;
      this.value = this.defaultVal;
    },
    updateCategory(category) {
      this.selectedCategory = category;
      this.value = category.value;
      this.expanded = false;
    },
    isEmailValid: function () {
      // return (this.value == "")? "" : (this.reg.test(this.value)) ? 'has-success' : 'has-error';
      return this.reg.test(this.value) ? "" : "";
    },
  },
  watch: {
    defaultVal(newValue, oldValue) {
      this.value = newValue;
      if (this.field == "vendorAddressLine1" || this.field == "vendorAddressLine2") {
        this.$refs.address.focus();
      }
    },
  },
  computed: {
    isValidValue() {
      const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      if (this.field.indexOf("mail") >= 0) {
        return this.value && reg.test(this.value);
      } else return this.value;
    },
  },
};
</script>
<style lang="scss" scoped>
.vsignup-edtiable-field-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #050505;
  margin-top: 30px;

  &.border-bottom {
    padding-bottom: 35px;
    border-bottom: 1px solid #dddddd;
  }

  .left {
    width: 75%;
    .title {
      font: 800 16px Manrope-Regular, sans-serif;
    }
    .content {
      margin-top: 13px;
      font: normal 16px Manrope-Regular, sans-serif;
      img {
        width: 20px;
        position: relative;
      }
      .default {
        border: 1px solid #dddddd;
        font: normal 16px Manrope-Regular, sans-serif;

        &.with-img {
          padding-left: 60px;
        }
        &.has-error {
          border-color: #f51355;
        }
        &.has-success {
          border-color: green;
        }
      }
      .inside-img {
        z-index: 99;
        position: relative;
        top: 6px;
        left: 22px;
      }
      .dropdown {
        position: absolute;
        margin-top: -8px;
        width: 14px;
        margin-left: -35px;
      }
      .with-img {
        position: relative;
        top: -29px;
        margin-bottom: -30px;
      }
    }
    .droplist {
      input {
        cursor: pointer;
      }
    }
    .edit-content {
      ul {
        list-style: none;
        margin: 0;
        column-count: 2;
        padding: 40px;
        border: solid 1px #050505;
        box-shadow: 0 3px 25px 0 rgba(0, 0, 0, 0.16);

        li {
          cursor: pointer;
          margin-bottom: 40px;
          font: normal 16px Manrope-Regular, sans-serif;
          img {
            width: 22px;
          }
        }
      }
      .address-cont {
        background-image: url("https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/Asset 550.svg");
        background-repeat: no-repeat;
        background-size: 20px;
        background-position-x: 22px;
        background-position-y: 9px;
        #map {
          background: transparent;
          padding: 12px 20px 12px 60px;
          border: 1px solid #dddddd;
          border-bottom: none;
          border-radius: 0;
          font: normal 16px Manrope-Regular, sans-serif;
          width: 100%;
        }
      }
    }
    .action-cont {
      margin-top: 10px;
      text-align: right;

      a {
        cursor: pointer;
        padding: 8px 24px;
        &.cancel {
          color: #050505;
          font: 800 16px Manrope-Regular, sans-serif;
        }
        &.save {
          color: #ffffff;
          font: 800 16px Manrope-Regular, sans-serif;
          background-color: #f51355;
          &:hover {
            color: #ffffff !important;
          }
        }
      }
    }
    &.full-width {
      width: 100%;
    }
  }
  .right {
    a {
      font: 800 16px Manrope-Regular, sans-serif;
      color: #f51355;
      cursor: pointer;
      text-decoration: none !important;
      i {
        color: #f51355 !important;
        position: relative;
        top: -1px;
      }
    }
  }
}
</style>
