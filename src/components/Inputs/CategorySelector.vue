<template>
  <div class="selector-wrapper" :style="{ width: multiple ? '150px' : '' }">
    <div class="droplist" v-if="!expanded">
      <template v-if="multiple">
        <input readonly class="default" v-model="_value" @click="expanded = true" />
      </template>
      <template v-else>
        <img class="inside-img cursor-pointer" :src="`${selectedCategory.icon}`" v-if="selectedCategory && selectedCategory.icon" @click="expanded = true"/>
        <input readonly class="default with-img" v-model="_value" @click="expanded = true" />
      </template>
      <img class="dropdown cursor-pointer" src="https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/Asset 523.svg" @click="expanded = true"/>
    </div>
    <ul :style="{ 'column-count': column, 'min-width': column > 1 ? '670px' : '350px' }" v-click-outside="close" v-else>
      <li
        v-for="(category, cIndex) in categories"
        :key="cIndex"
        @click="updateCategory(category)"
        :class="{ 'mb-40': cIndex < categories.length - 1 }"
      >
        <template v-if="multiple">
          <div class="d-flex align-center">
            <img
              class="mr-10"
              :src="theme === 'red' ? `${iconUrl}Group 5479 (2).svg` : `${$iconURL}common/checked-circle-purple.svg`"
              v-if="_includes(selectedCategory, category)"
            />
            <span class="unchecked" v-else></span>
            <span class="text-transform-capitalize">{{ _option(category) }}</span>
          </div>
        </template>
        <template v-else>
          <img class="mr-10" v-if="category.icon" :src="`${category.icon}`" />
          {{ _option(category) }}
        </template>
      </li>
      <li v-if="additional">
        <div class="mt-20">
          <p>Other</p>
          <input class="default with-img" v-model="additionalValue" @input="input" />
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { capitalize } from "@/utils/string.util";
export default {
  name: "category-selector",
  props: {
    value: {
      type: [String, Array],
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
    column: {
      type: String,
      required: false,
      default: "1",
    },
    multiple: {
      type: Boolean,
      required: false,
    },
    additional: {
      type: Boolean,
      required: false,
    },
    trackBy: {
      type: String,
      required: false,
    },
    customClass: {
      type: String,
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  data: () => ({
    iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    expanded: false,
    selectedCategory: null,
    additionalValue: null,
    reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
  }),
  mounted() {
    // console.log("category-selector.mounted", this.value);
    this.getSelectedCategory(this.value);
  },
  computed: {
    _value() {
      if (!this.selectedCategory) return null;
      if (this.multiple) {
        if (this.trackBy) {
          return this.selectedCategory.map((it) => it[this.trackBy]);
        } else {
          return this.selectedCategory;
        }
      } else {
        if (this.trackBy) {
          return this.selectedCategory[this.trackBy];
        } else {
          return this.selectedCategory;
        }
      }
    },
  },
  methods: {
    updateCategory(category) {
      console.log("updateCategory", category);
      if (this.multiple) {
        if (!this.selectedCategory) this.selectedCategory = [];
        if (this._find(this.selectedCategory, category)) {
          this.selectedCategory = this._filter(this.selectedCategory, category);
        } else {
          this.selectedCategory.push(category);
        }

        this.$emit("change", this.selectedCategory);
      } else {
        this.selectedCategory = category;
        this.expanded = false;
        this.$emit("change", this._value);
      }
    },
    _filter(array, value) {
      if (!array) return false;
      if (this.trackBy) {
        return array.filter((el) => el[this.trackBy] !== value[this.trackBy]);
      } else {
        return array.filter((el) => el !== value);
      }
    },
    _find(array, value) {
      if (!array) return false;
      if (this.trackBy) {
        return array.find((el) => el[this.trackBy] === value[this.trackBy]);
      } else {
        return array.find((el) => el === value);
      }
    },
    _includes(array, value) {
      if (!array) return false;
      if (this.trackBy) {
        // return array.includes(value[this.trackBy]);
        return array.findIndex((el) => el[this.trackBy] === value[this.trackBy]) > -1;
      } else {
        return array.includes(value);
      }
    },
    _option(option) {
      return this.trackBy ? option[this.trackBy] : option;
    },
    input() {
      this.$emit("input", this.additionalValue);
    },
    close() {
      this.expanded = false;
    },
    getSelectedCategory(value) {
      if (value) {
        if (this.multiple) {
          if (value.length) {
            this.selectedCategory = this.categories.filter((it) => this._includes(value, it));
          } else {
            this.selectedCategory = [];
          }
        } else {
          if (this.trackBy) {
            this.selectedCategory = this.categories.find((it) => it[this.trackBy] === value);
          } else {
            this.selectedCategory = this.categories.find((it) => it.value === value);
          }
        }
      } else {
        if (this.multiple) this.selectedCategory = [];
      }
    },
  },
  watch: {
    value(newValue, oldValue) {
      this.getSelectedCategory(newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.selector-wrapper {
  min-width: 350px;
  width: 100%;
  font: normal 16px Manrope-Regular, sans-serif;
  .droplist {
    position: relative;
    .inside-img {
      width: 22px;
      z-index: 1;
      position: absolute;
      top: 15px;
      left: 15px;
    }
    input {
      min-height: 55px;
      font-size: 16px;
      font-family: "Manrope-Regular";
      padding-left: 40px;
      cursor: pointer;
      width: 100%;
      border: solid 0.5px #bcbcbc;
      text-transform: capitalize;
    }
    .dropdown {
      position: absolute;
      margin-top: 20px;
      width: 14px;
      right: 15px;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 40px;
    border: solid 1px #050505;
    box-shadow: 0 3px 25px 0 rgba(0, 0, 0, 0.16);
    background: white;
    width: 100%;
    li {
      cursor: pointer;
      font: normal 16px Manrope-Regular, sans-serif;
      list-style-position: inside;
      -webkit-column-break-inside: avoid;
      page-break-inside: avoid;
      break-inside: avoid;
      img {
        width: 30px !important;
      }

      p {
        font-weight: bold;
        margin: 0 0 10px;
      }

      span.unchecked {
        display: inline-block;
        width: 30px;
        min-width: 30px !important;
        height: 30px;
        border: 1px solid #707070;
        border-radius: 50%;
        background: #ffffff;
        margin-right: 14px;
        position: relative;
      }

      input {
        width: 100%;
      }
    }
  }

  &.service .droplist input {
    border: solid 1px #707070 !important;
  }
}
</style>
