<template>
  <div>
    <div class="editable-proposal-sub-item-wrapper" :class="[{ 'step-3': step == 3 }]" v-if="!item.plannerOptions.length">
      <div class="item-cont">
        {{ item.requirementTitle }}
        <span class="madatory-badge" v-if="item.isMandatory">Mandatory</span>
        <span class="complementary-badge" v-if="item.isComplimentary">Complementary</span>
      </div>
      <div class="qty-cont editor-wrapper">
        <template v-if="!isEdit">{{ item.priceUnit === "total" ? 1 : item.requirementValue }}</template>
        <template v-else>
          <input class="input-value" type="number" v-model="item.requirementValue" />
        </template>
      </div>
      <div class="price-cont editor-wrapper">
        <template v-if="!isEdit">
          $
          {{
            item.priceUnit == "total"
              ? parseFloat(String(item.price).replace(/,/g, "")) / item.requirementValue
              : item.price | withComma
          }}
        </template>
        <template v-else>
          <money
            v-model="item.price"
            v-bind="{
              decimal: '.',
              thousands: ',',
              prefix: '$ ',
              suffix: '',
              precision: 2,
              masked: false,
            }"
            class="input-value"
          />
        </template>
      </div>
      <div class="total-cont editor-wrapper">
        <template v-if="!isEdit"
          >$ {{ item.priceUnit == "total" ? item.price : (item.price * item.requirementValue) | withComma }}</template
        >
        <template v-else>
          <!-- <input class="input-value" v-model="item.price" type="number" /> -->
          <money
            v-if="item.priceUnit == 'total'"
            v-model="item.price"
            v-bind="{
              decimal: '.',
              thousands: ',',
              prefix: '$ ',
              suffix: '',
              precision: 2,
              masked: false,
            }"
            class="input-value"
          />
          <div>$ {{ subTotal }}</div>
        </template>
      </div>
      <div class="action-cont editor-wrapper">
        <div v-if="!isEdit" class="editing-buttons">
          <md-button @click="isEdit = true" class="md-simple edit-btn">
            <img class="edit" :src="`${iconUrl}Asset 585.svg`" />
          </md-button>
          <md-button @click="removeRequirement(item)" class="md-simple edit-btn">
            <img class="trash" :src="`${iconUrl}Asset 586.svg`" />
          </md-button>
        </div>
        <template v-else>
          <a class="cancel" @click="cancel()">Cancel</a>
          <a class="save" @click="save(item)">Save</a>
        </template>
      </div>
    </div>
    <div class="p-40 alternative-items" v-if="item.plannerOptions.length > 0">
      <div>
        <span class="font-size-14">Please choose:</span>
      </div>
      <div
        class="editable-proposal-sub-item-wrapper alternative-option"
        :class="[{ 'step-3': step == 3 }]"
        v-for="(option, index) in item.plannerOptions"
        :key="index"
      >
        <div class="item-cont">
          <md-radio
            v-model="item.selectedOption"
            :class="theme === 'red' ? 'md-red' : 'md-purple'"
            :value="index"
          ></md-radio>
          {{ option.description }}
        </div>
        <div class="qty-cont editor-wrapper">
          <template v-if="!isEdit">{{ option.qty }}</template>
          <template v-else>
            <input class="input-value" type="number" v-model="option.qty" />
          </template>
        </div>
        <div class="price-cont editor-wrapper">
          <template v-if="!isEdit"> $ {{ option.price | withComma }} </template>
          <template v-else>
            <money
              v-model="option.price"
              v-bind="{
                decimal: '.',
                thousands: ',',
                prefix: '$ ',
                suffix: '',
                precision: 2,
                masked: false,
              }"
              class="input-value"
            />
          </template>
        </div>
        <div class="total-cont editor-wrapper">
          <template v-if="!isEdit">$ {{ (option.price * option.qty) | withComma }}</template>
          <template v-else>
            <!-- <input class="input-value" v-model="item.price" type="number" /> -->
            <money
              v-if="item.priceUnit == 'total'"
              v-model="item.price"
              v-bind="{
                decimal: '.',
                thousands: ',',
                prefix: '$ ',
                suffix: '',
                precision: 2,
                masked: false,
              }"
              class="input-value"
            />
            <!-- <div>$ {{ subTotal }}</div> -->
          </template>
        </div>
        <div class="action-cont editor-wrapper">
          <div v-if="!isEdit" class="editing-buttons">
            <md-button @click="isEdit = true" class="md-simple edit-btn">
              <img class="edit" :src="`${iconUrl}Asset 585.svg`" />
            </md-button>
            <md-button @click="removeRequirement(item)" class="md-simple edit-btn">
              <img class="trash" :src="`${iconUrl}Asset 586.svg`" />
            </md-button>
          </div>
          <template v-else>
            <a class="cancel" @click="cancel()">Cancel</a>
            <a class="save" @click="save(item)">Save</a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Money } from "v-money";

export default {
  name: "editable-proposal-sub-item",
  components: {
    Money,
  },
  props: {
    item: Object,
    active: Boolean,
    step: Number,
    index: Number,
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      isHover: false,
      isEdit: false,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
    };
  },
  computed: {
    subTotal() {
      console.log("subtotal");
      return this.item.price * this.item.requirementValue;
    },
  },
  methods: {
    removeRequirement(item) {
      this.$root.$emit("remove-proposal-requirement", item);
      this.$emit("remove", this.index);
    },
    save(item) {
      this.isEdit = false;
      this.$root.$emit("save-proposal-requirement", { index: this.index, item });
      this.$emit("save", { index: this.index, item });
    },
    cancel() {
      this.isEdit = false;
    },
  },
  created() {},
  mounted() {
    console.log(this.item);
  },
  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.alternative-items {
  // border-top: 1px solid #818080;
  padding: 0px 40px 0 40px;
  margin-top: -40px;
  .alternative-option {
    padding: 30px !important;
  }
}
.editable-proposal-sub-item-wrapper {
  padding: 26px 20px;
  border: 2px solid #d5d5d5;
  border-bottom: none;
  font-family: "Manrope-Regular", sans-serif;
  font-size: 16px;
  font-weight: 600;
  display: grid;
  grid-template-columns: 30% 10% 10% 12% 15% 23%;
  align-items: center;
  cursor: pointer;
  .madatory-badge {
    color: #641856;
    font-weight: normal;
    font-size: 0.75em;
    display: inline-block;
    border: solid 1px #641856;
    padding: 4px 8px;
    border-radius: 30px;
    margin-left: 0.5em;
    line-height: 1em;
  }
  .complementary-badge {
    color: #ba8d05;
    font-weight: normal;
    font-size: 0.75em;
    display: inline-block;
    border: solid 1px #ba8d05;
    padding: 4px 8px;
    border-radius: 30px;
    margin-left: 0.5em;
    line-height: 1em;
  }
  &:hover {
    .editing-buttons {
      visibility: visible;
    }
  }
  .editing-buttons {
    visibility: hidden;
  }
  .action-cont {
    display: flex;
    justify-content: flex-end;
    .edit {
      width: 20px;
      height: 20px;
      margin-right: 31px;
      cursor: pointer;
    }
    .trash {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  div {
    &.item-cont {
      text-transform: capitalize;
      display: flex;
      align-items: center;
    }
  }
  &.step-3 {
    border: none;
    border-top: 1px solid #818080;
    padding: 50px 40px;
    grid-template-columns: 40% 15% 15% 15% 15%;

    .whole-cont {
      span {
        font-weight: normal;
      }
    }
  }
  .editor-wrapper {
    margin: 0 5px;
    text-align: center;
    .input-value {
      border: 1px solid #dddddd;
      text-align: center;
      width: 100%;
    }
  }

  a {
    cursor: pointer;
    padding: 8px 26px;

    &.cancel {
      font: 800 16px "Manrope-Regular", sans-serif;
      color: #050505;
      background: transparent;
    }
    &.save {
      font: 800 16px "Manrope-Regular", sans-serif;
      color: white;
      background: #641856;
      border-radius: 3px;
    }
    &:hover {
      color: #dddddd !important;
    }
  }
  span {
    &.grid-cell {
      font-size: 16px;
      font-weight: normal;

      &:first-child {
        text-transform: capitalize;
      }
    }
  }
}
</style>
