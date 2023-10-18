<template>
  <div class="rule">
    <div class="left v-grid-with-desc">
      {{ item.name }}
    </div>
    <div class="right d-flex justify-content-between">
      <div class="d-flex align-center">
        <div class="top">
          <template v-if="item.type == 'Boolean'">
            <div class="item" @click="setPolicy(null, 'option', item.name, true)">
              <img
                :src="theme === 'red' ? `${iconUrl}Group 5479 (2).svg` : `${$iconURL}common/checked-circle-purple.svg`"
                v-if="item.value"
              />
              <span class="unchecked" v-else></span>
              Yes
            </div>
            <div class="item" @click="setPolicy(null, 'option', item.name, false)">
              <img
                :src="theme === 'red' ? `${iconUrl}Group 5489 (3).svg` : `${$iconURL}common/close-circle-purple.svg`"
                v-if="!item.value"
              />
              <span class="unchecked" v-else></span>
              No
            </div>
          </template>
          <template v-if="item.type == String">
            <input class="text-center string-field" v-model="item.value" @input="setPolicy" />
            <!--<div class="item" v-if="!noteRules.includes(r)" @click="noteRule(r)">-->
            <!--<a class="note">+ Add Note</a>-->
            <!--</div>-->
            <!--<div class="item noflex" v-else>-->
            <!--<textarea placeholder="Except from the parking area" rows="3" />-->
            <!--<br />-->
            <!--<a class="cancel" @click="noteRule(r)">Cancel</a>-->
            <!--</div>-->
          </template>
          <template v-if="item.type == 'Selection'">
            <select class="unit-select" v-model="item.value">
              <option v-for="(option, index) in item.options" :key="index" :value="option">
                {{ option }}
              </option>
            </select>
          </template>
          <template v-if="item.type == 'Including'">
            <div class="item" @click="setPolicy(null, 'Including', item.name, true)">
              <img
                :src="theme === 'red' ? `${iconUrl}Group 5479 (2).svg` : `${$iconURL}common/checked-circle-purple.svg`"
                v-if="item.value"
              />
              <span class="unchecked" v-else></span>
              Included
            </div>
            <div class="item" @click="setPolicy(null, 'Including', item.name, false)">
              <img
                :src="theme === 'red' ? `${iconUrl}Group 5489 (3).svg` : `${$iconURL}common/close-circle-purple.svg`"
                v-if="!item.value"
              />
              <span class="unchecked" v-else></span>
              Not Included
            </div>
          </template>
          <template v-if="item.type == 'MultiSelection'">
            <category-selector
              v-if="item.options && item.options.length"
              :value="item.value"
              :categories="item.options"
              :multiple="true"
              @change="changeCategorySelector(...arguments)"
            ></category-selector>
          </template>
        </div>
        <div class="bottom no-margin" v-if="item.type == 'Number'">
          <template v-if="item.noSuffix">
            <div>
              <input
                type="number"
                class="text-center number-field"
                placeholder="00.00"
                v-model="item.value"
                @input="setPolicy"
              />
            </div>
          </template>
          <template v-else>
            <span v-if="item.isPercentage">Rate (%)</span>
            <span v-else>Extra Payment</span>
            <br />
            <div class="suffix percentage" v-if="item.isPercentage">
              <input type="number" placeholder="00.00" v-model="item.value" @input="setPolicy" />
            </div>
            <div class="suffix" v-else>
              <input type="number" placeholder="00.00" v-model="item.value" @input="setPolicy" />
            </div>
          </template>
        </div>
        <div class="bottom mt-0 ml-40" v-if="item.type == 'Including' && !item.value">
          <span>Extra Payment</span>
          <br />
          <div class="suffix">
            <input
              type="number"
              class="text-center number-field"
              placeholder="00.00"
              v-model="item.cost"
              @input="setPolicy"
            />
          </div>
        </div>
        <div class="bottom mt-0 ml-40" v-if="item.type == 'Boolean' && item.value && item.hasOwnProperty('cost')">
          <template v-if="item.noSuffix">
            <div>
              <input
                type="number"
                class="text-center number-field"
                placeholder="00.00"
                v-model="item.cost"
                @input="setPolicy"
              />
            </div>
          </template>
          <template v-else>
            <span v-if="item.isPercentage">Rate (%)</span>
            <span v-else>Extra Payment</span>
            <br />
            <div class="suffix percentage" v-if="item.isPercentage">
              <input type="number" placeholder="00.00" v-model="item.cost" @input="setPolicy" />
            </div>
            <div class="suffix" v-else>
              <input type="number" placeholder="00.00" v-model="item.cost" @input="setPolicy" />
            </div>
          </template>
        </div>
      </div>
      <div class="mt-0 ml-40 add-note" v-if="item.hasComment">
        <div class="item">
          <div
            class="cursor-pointer"
            @click="notable = !notable"
            :class="{ 'color-red': theme === 'red', 'color-purple': theme === 'purple' }"
          >
            <template v-if="!notable">
              <md-icon :class="{ 'color-red': theme === 'red', 'color-purple': theme === 'purple' }"> add </md-icon>
              Add Note
            </template>
            <template v-else>
              <md-icon :class="{ 'color-red': theme === 'red', 'color-purple': theme === 'purple' }"> remove </md-icon>
              Add Note
            </template>
          </div>
          <textarea
            v-if="item.hasComment && notable"
            class="desc"
            rows="3"
            v-model="item.desc"
            :placeholder="item.placeholder ? item.placeholder : `Except from the parking area`"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CategorySelector from "@/components/Inputs/CategorySelector";
export default {
  name: "vendor-policy-item",
  components: [CategorySelector],
  props: {
    item: {
      type: Object,
      required: true,
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      notable: false,
    };
  },
  methods: {
    setPolicy(e, type, name, value) {
      console.log("type", type);
      if ((type === "option" || type === "Including") && name) {
        this.item.value = value;
      } else {
        this.item.value = e.target.value;
      }
      console.log("setPolicy", this.item);
      this.$forceUpdate();
      this.$emit("update", this.item);
    },
    changeCategorySelector(value) {
      // console.log(type, item, value);
      this.item.value = value;
      this.$emit("update", this.item);
    },
  },
  watch: {
    item: {
      handler() {},
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.rule {
  padding: 2rem 0;
  border-bottom: 1px solid #dddddd;
  font: 600 16px Manrope-Regular, sans-serif;

  &:first-child {
    padding-top: 0;
  }
  display: flex;
  justify-content: flex-start;
  .left {
    flex: 1;
  }
  .v-grid-with-desc {
    display: grid;
    grid-template-rows: 20% 80%;
  }
  .right {
    flex: 1;
    align-items: flex-start;
    .top {
      display: flex;
      align-items: start;

      .item {
        display: flex;
        justify-content: flex-start;
        margin-right: 2rem;
        text-align: right;
        align-items: center;
        cursor: pointer;

        span {
          &.unchecked {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 1px solid #707070;
            border-radius: 50%;
            background: #ffffff;
            margin-right: 14px;
            position: relative;
          }
        }
        img {
          width: 30px;
          height: 30px;
          margin-right: 1rem;
          position: relative;
        }
        a {
          font: 800 16px Manrope-Regular, sans-serif;
          cursor: pointer;
          &.note {
            color: #f51355;
          }
          &.cancel {
            color: #050505;
          }
        }
        &:last-child {
          margin-right: 0;
        }
        textarea {
          width: 100% !important;
        }
        &.noflex {
          flex: 1;
          display: inline-block;
          cursor: none;
        }
      }
    }
    .bottom {
      margin-top: 2rem;
      span {
        font: normal 16px Manrope-Regular, sans-serif;
        margin-bottom: 1rem;
        display: inline-block;
      }
      .suffix {
        &:before {
          content: "$";
          position: absolute;
          font-size: 16px;
          color: #818080;
          margin-top: 13px;
          margin-left: 2rem;
        }
        &.percentage {
          &:before {
            content: "%";
          }
        }
        input {
          text-align: center;
          font-size: 16px;
          // padding: 12px 30px;
          /*width: 40%;*/
          width: 12rem;
          border: 1px solid #dddddd;
          border-radius: 0;
        }
      }
      .number-field {
        text-align: center;
        font-size: 16px;
        // padding: 22px 30px;
        /*width: 40%;*/
        width: 12rem;
        border: 1px solid #dddddd;
        // border-radius: 0;
      }
    }
    .add-note {
      width: 50%;
    }
    .string-field {
      text-align: left;
      font-size: 16px;
      width: 12rem;
      border: 1px solid #dddddd;
    }
  }
}
.flex-1 {
  flex: 1;
}
.no-margin {
  margin: 0 !important;
}
</style>
