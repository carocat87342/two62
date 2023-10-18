<template>
  <div class="proposal-service-table-item" v-if="serviceType == 'cost'">
    <div class="proposal-service-item-wrapper align-start" v-if="!isEdit">
      <div class="item-cont">
        {{ item.requirementTitle }}
        <span class="complementary-badge" v-if="item.isComplimentary">
          Complimentary
          <md-button class="md-simple md-black remove-button edit-btn" @click="setValue('isComplimentary', false)">
            <md-icon>close</md-icon>
          </md-button>
        </span>
      </div>
      <div class="qty-cont editor-wrapper text-center">
        {{ item.priceUnit === "total" ? 1 : item.requirementValue | formatQty }}
      </div>
      <div class="price-cont editor-wrapper text-right" :class="{ complimentary: item.isComplimentary }">
        $ {{ item.price | withComma }}
      </div>
      <div class="total-cont editor-wrapper text-right" :class="{ complimentary: item.isComplimentary }">
        $ {{ item.priceUnit == "total" ? item.price : (item.price * item.requirementValue) | withComma }}
      </div>
      <div class="action-cont editor-wrapper">
        <md-menu md-size="medium"
                 :md-offset-x="240"
                 :md-offset-y="-36"
                 class="action-menu"
                 v-if="!isEdit"
                 @md-opened="isOpened"
        >
          <md-button md-menu-trigger class="edit-btn md-simple" style="height: 40px">
            <md-icon style="font-size: 40px !important">more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item class="md-purple" @click="isEdit = true">
              <span> <img :src="`${$iconURL}common/edit-dark.svg`" class="label-icon mr-10" />Edit</span>
            </md-menu-item>
            <md-menu-item class="md-purple" @click="removeRequirement(item)">
              <span> <img :src="`${$iconURL}common/trash-dark.svg`" class="label-icon mr-10" />Delete</span>
            </md-menu-item>
            <md-menu-item class="md-purple" @click="editingComment = true">
              <span>
                <img :src="`${$iconURL}common/comment-dark.svg`" class="label-icon mr-10" />{{
                  item.comment ? `Edit Comment` : `Add comment`
                }}</span
              >
            </md-menu-item>
            <md-menu-item class="md-purple" @click="addAlternative">
              <span>
                <md-icon class="color-black mr-10">add_circle_outline</md-icon>
                Add an alternative
              </span>
            </md-menu-item>
            <md-menu-item class="md-purple" @click="setValue('isComplimentary', !item.isComplimentary)">
              <span>
                <img :src="`${$iconURL}common/gift-dark.svg`" class="label-icon mr-10" />
                {{ !item.isComplimentary ? "Mark as complimentary" : "Remove complimentary" }}
              </span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </div>
    <div class="proposal-service-item-wrapper" v-else>
      <div class="item-cont">
        <input v-model="item.requirementTitle" />
      </div>
      <div class="qty-cont editor-wrapper text-center">
        <input class="input-value" type="number" v-model="item.requirementValue" />
      </div>
      <div class="price-cont editor-wrapper text-right" :class="{ complimentary: item.isComplimentary }">
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
      </div>
      <div class="total-cont editor-wrapper text-right" :class="{ complimentary: item.isComplimentary }">
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
        <!-- <div class="text-left">$ {{ subTotal | withComma }}</div> -->
        <money
          :value="subTotal"
          v-bind="{
            decimal: '.',
            thousands: ',',
            prefix: '$ ',
            suffix: '',
            precision: 2,
            masked: false,
          }"
          readonly
          class="input-value mr-10"
        />
      </div>
      <div class="action-cont editor-wrapper"></div>
    </div>
    <div class="proposal-service-item-wrapper">
      <div class="comment-area font-regular" v-if="!editingComment">{{ item.comment }}</div>
      <div class="text-right" v-else>
        <textarea class="mt-20" v-model="item.comment"></textarea>
        <div>
          <md-button class="md-black md-simple maryoku-btn" @click="editingComment = false">Cancel</md-button>
          <md-button class="md-vendor maryoku-btn" @click="save(item)">Save</md-button>
        </div>
      </div>
    </div>
    <div v-if="isEdit" class="text-right save-button mt-10">
      <md-button class="md-black maryoku-btn md-simple cancel" @click="cancel()">Cancel</md-button>
      <md-button class="md-vendor maryoku-btn save" @click="save(item)">Save</md-button>
    </div>
    <div class="planner-options" v-if="item.plannerOptions.length > 0">
      <img
        :src="`${$iconURL}Onboarding/enter-gray.svg`"
        style="margin-right: 10px; position: absolute; margin-top: 30px"
      />
      <div v-for="(plannerOption, index) in item.plannerOptions" :key="`planner-${index}`" class="planner-options-item">
        <div class="font-size-14 font-regular color-gray pl-50">Option {{ ("0" + (index + 1)).slice(-2) }}</div>
        <div class="planner-options-item-row" v-if="plannerOption.isEdit">
          <div class="ml-50">
            <input
              v-model="plannerOption.description"
              class="input-value"
              type="text"
              :placeholder="`Type option here`"
              :class="{ isFilled: !!plannerOption.description }"
            />
          </div>
          <div>
            <input
              v-model="plannerOption.qty"
              class="input-value text-center"
              type="text"
              :placeholder="`Type qty here`"
            />
          </div>
          <money
            v-model="plannerOption.price"
            v-bind="{
              decimal: '.',
              thousands: ',',
              prefix: '$ ',
              suffix: '',
              precision: 2,
              masked: false,
            }"
            class="input-value text-center"
          />
          <div class="font-size-16 font-regular color-gray text-center" style="padding: 12px">
            $ {{ (plannerOption.price * plannerOption.qty) | withComma }}
          </div>
          <div class="d-flex align-center">
            <!-- <md-button class="md-simple maryoku-btn md-black" @click="cancelAlternative(index)"> Cancel </md-button>
            <md-button class="maryoku-btn md-vendor" @click="saveAlternative(index)"> Save </md-button> -->
          </div>
        </div>
        <div class="planner-options-item-row" v-else>
          <div class="pl-50">
            {{ plannerOption.description }}
          </div>
          <div class="text-center">{{ plannerOption.qty | formatQty }}</div>
          <div class="text-right">${{ plannerOption.price | withComma }}</div>
          <div class="font-size-16 font-regular color-gray text-right">
            $ {{ (plannerOption.price * plannerOption.qty) | withComma }}
          </div>
          <div class="text-right">
            <md-button class="md-simple edit-btn" @click="editAlternative(index)">
              <img :src="`${$iconURL}common/edit-dark.svg`" class="label-icon mr-10" />
            </md-button>

            <md-button class="md-simple edit-btn" @click="removeAlternative(index)">
              <img :src="`${$iconURL}common/trash-dark.svg`" class="label-icon mr-10" />
            </md-button>
          </div>
        </div>
        <div class="text-right pt-10" v-if="plannerOption.isEdit">
          <md-button class="md-simple maryoku-btn md-black" @click="cancelAlternative(index)"> Cancel </md-button>
          <md-button class="maryoku-btn md-vendor" @click="saveAlternative(index)"> Save </md-button>
        </div>
      </div>
      <div class="planner-options-item">
        <div class="ml-50">
          <md-button class="md-simple edit-btn md-vendor" @click="addAlternative">
            <md-icon>add_circle_outline</md-icon>
            Add option {{ ("0" + (item.plannerOptions.length + 1)).slice(-2) }}
          </md-button>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="serviceType == 'included'" class="proposal-service-table-item included-services">
    <div class="proposal-service-item-wrapper">
      <div class="item-cont">
        <img :src="`${$storageURL}ok%20check%20V.svg`" class="mr-10">
        {{ item.requirementTitle }}
        <!-- <span class="madatory-badge" v-if="item.isMandatory">Mandatory</span> -->
        <span class="complementary-badge" v-if="item.isComplimentary">
          Complementary
          <md-button class="md-simple md-black remove-button edit-btn" @click="setValue('isComplimentary', false)">
            <md-icon>close</md-icon>
          </md-button>
        </span>
      </div>
      <div class="qty-cont editor-wrapper text-center">
        <template v-if="!isEdit">{{ item.priceUnit === "total" ? 1 : item.requirementValue | formatQty }}</template>
        <template v-else>
          <input class="input-value" type="number" v-model="item.requirementValue" />
        </template>
      </div>
      <div class="price-cont editor-wrapper text-right">
        <template v-if="isEdit && isAddingPrice">
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
      <div class="total-cont editor-wrapper text-right"></div>
      <div class="action-cont editor-wrapper text-right">
        <template v-if="isEdit">
          <a class="cancel" @click="cancel()">Cancel</a>
          <a class="save" @click="save(item)">Save</a>
        </template>
<!--        <md-button class="md-simple edit-btn md-dark" @click="isExpanded = !isExpanded">-->
<!--          <md-icon class="color-dark" v-if="isExpanded">keyboard_arrow_down</md-icon>-->
<!--          <md-icon class="color-dark" v-else>keyboard_arrow_right</md-icon>-->
<!--        </md-button>-->
        <md-menu md-size="medium"
                 :md-offset-x="240"
                 :md-offset-y="-36"
                 class="action-menu"
                 v-if="!isEdit"
                 @md-opened="isOpened"
        >
          <md-button md-menu-trigger class="edit-btn md-simple" style="height: 40px">
            <md-icon style="font-size: 40px !important">more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item @click="isEdit = true">
              <span> <img :src="`${$iconURL}common/edit-dark.svg`" class="label-icon mr-10" />Edit</span>
            </md-menu-item>
            <md-menu-item @click="removeRequirement(item)">
              <span> <img :src="`${$iconURL}common/trash-dark.svg`" class="label-icon mr-10" />Delete</span>
            </md-menu-item>
            <md-menu-item @click="addPriceToIncludeItem">
              <span>
                <img
                  :src="`${$iconURL}budget+screen/SVG/Asset%2010.svg`"
                  class="label-icon mr-10"
                  style="height: 30px"
                />
                Add price
                <span>
                  <md-icon class="color-gray" style="font-size: 40px; margin-left: 10px">help_outline</md-icon>
                  <md-tooltip md-direction="top" class="bg-gray">
                    Clicking ‘Add price’ will move this item to <br />the “Paid elements” table above
                  </md-tooltip>
                </span>
              </span>
            </md-menu-item>
            <md-menu-item @click="editingComment = true">
              <span>
                <img :src="`${$iconURL}common/comment-dark.svg`" class="label-icon mr-10" />
                {{ item.comment ? `Edit Comment` : `Add comment` }}
              </span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </div>
    <div class="proposal-service-item-wrapper">
      <div class="comment-area font-regular" v-if="!editingComment">{{ item.comment }}</div>
      <div class="text-right" v-else>
        <textarea class="mt-20" v-model="item.comment"></textarea>
        <div>
          <md-button class="md-black md-simple maryoku-btn" @click="editingComment = false">Cancel</md-button>
          <md-button class="md-vendor maryoku-btn" @click="save(item)">Save</md-button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="serviceType == 'extra'" class="proposal-service-table-item included-services">
    <div class="proposal-service-item-wrapper">
      <div class="item-cont">
        {{ item.requirementTitle }}
      </div>
      <div class="qty-cont editor-wrapper text-center">
        <template v-if="!isEdit">{{ item.priceUnit === "total" ? 1 : item.requirementValue | formatQty }}</template>
        <template v-else>
          <input class="input-value" type="number" v-model="item.requirementValue" />
        </template>
      </div>
      <div class="price-cont editor-wrapper text-right">
        <template v-if="!isEdit">+${{ item.price | withComma }} </template>
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
      <div class="total-cont editor-wrapper pl-10 text-right" v-if="!isEdit">${{ subTotal | withComma }}</div>
      <money
        v-else
        :value="subTotal"
        v-bind="{
          decimal: '.',
          thousands: ',',
          prefix: '$ ',
          suffix: '',
          precision: 2,
          masked: false,
        }"
        readonly
        class="input-value mr-10 text-center"
      />
      <div class="action-cont editor-wrapper">
<!--        <md-button class="md-simple edit-btn md-dark" @click="isExpanded = !isExpanded">-->
<!--          <md-icon class="color-dark" v-if="isExpanded">keyboard_arrow_down</md-icon>-->
<!--          <md-icon class="color-dark" v-else>keyboard_arrow_right</md-icon>-->
<!--        </md-button>-->
        <md-menu md-size="medium"
                 :md-offset-x="240"
                 :md-offset-y="-36"
                 class="action-menu"
                 v-if="!isEdit"
                 @md-opened="isOpened"
        >
          <md-button md-menu-trigger class="edit-btn md-simple" style="height: 40px">
            <md-icon style="font-size: 40px !important">more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item class="md-purple" @click="isEdit = true">
              <span> <img :src="`${$iconURL}common/edit-dark.svg`" class="label-icon mr-10" />Edit</span>
            </md-menu-item>
            <md-menu-item class="md-purple" @click="removeRequirement(item)">
              <span> <img :src="`${$iconURL}common/trash-dark.svg`" class="label-icon mr-10" />Delete</span>
            </md-menu-item>
            <md-menu-item class="md-purple" @click="editingComment = true">
              <span>
                <img :src="`${$iconURL}common/comment-dark.svg`" class="label-icon mr-10" />{{
                  item.comment ? `Edit Comment` : `Add comment`
                }}</span
              >
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </div>
    <div class="proposal-service-item-wrapper">
      <div class="comment-area font-regular" v-if="!editingComment">{{ item.comment }}</div>
      <div class="text-right" v-else>
        <textarea class="mt-20" v-model="item.comment"></textarea>
        <div>
          <md-button class="md-black md-simple maryoku-btn" @click="editingComment = false">Cancel</md-button>
          <md-button class="md-vendor maryoku-btn" @click="save(item)">Save</md-button>
        </div>
      </div>
    </div>
    <div v-if="isEdit" class="text-right save-button mt-10">
      <md-button class="md-black maryoku-btn md-simple cancel" @click="cancel()">Cancel</md-button>
      <md-button class="md-vendor maryoku-btn save" @click="save(item)">Save</md-button>
    </div>
  </div>
</template>
<script>
import { Money } from "v-money";

export default {
  name: "proposal-service-item",
  components: {
    Money,
  },
  props: {
    defaultItem: {
      type: Object,
      default: () => {},
    },
    active: Boolean,
    step: Number,
    index: Number,
    serviceType: {
      type: String,
      default: "cost",
    },
  },
  data() {
    return {
      isHover: false,
      isEdit: false,
      editingComment: false,
      // isEdit: false,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      isExpanded: false,
      isAddingAlternative: false,
      item: {},
      isAddingPrice: false,
    };
  },
  created() {
    this.item = Object.assign({}, this.defaultItem);
  },
  computed: {
    subTotal() {
      return Math.round(this.item.price * this.item.requirementValue * 100) / 100;
    },
  },
  methods: {
    removeRequirement(item) {
      this.$root.$emit("remove-proposal-requirement", item);
      this.$emit("remove", this.index);
    },
    addPriceToIncludeItem(item) {
      this.isAddingPrice = true;
      this.isEdit = true;
      // this.$store.dispatch("vendorProposal/addPrice");
    },
    save(item) {
      this.isEdit = false;
      this.editingComment = false;
      this.$root.$emit("save-proposal-requirement", { index: this.index, item });
      this.$emit("save", { index: this.index, item });
      // if (isAddingPrice) {
      //   this.$store.dispatch("vendorProposal/addPrice", {category})
      // }
    },
    setValue(key, value) {
      const item = this.item;
      // item[key] = value;
      this.$set(item, key, value);
      this.$emit("save", { index: this.index, item });
    },
    cancel() {
      this.item = Object.assign({}, this.defaultItem);
      this.isEdit = false;
    },
    addAlternative() {
      this.item.plannerOptions.push({ description: "", price: this.item.price, isEdit: true });
    },
    removeAlternative(index) {
      this.item.plannerOptions.splice(index, 1);
      this.$root.$emit("save-proposal-requirement", { index: this.index, item });
      this.$emit("save", { index: this.index, item });
    },
    editAlternative(index) {
      this.$set(this.item.plannerOptions[index], "isEdit", true);
      // this.$root.$emit("save-proposal-requirement", { index: this.index, item });
      // this.$emit("save", { index: this.index, item });
    },
    saveAlternative(index) {
      this.$set(this.item.plannerOptions[index], "isEdit", false);
      this.$root.$emit("save-proposal-requirement", { index, item: this.item });
      this.$emit("save", { index, item: this.item });
    },
    cancelAlternative(index) {
      this.$set(this.item, "plannerOptions", Object.assign([], this.defaultItem.plannerOptions));
      this.$set(this.item.plannerOptions[index], "isEdit", false);
      console.log(this.item);
      // this.item.plannerOptions = Object.assign([], this.defaultItem.plannerOptions);
    },
    isOpened(){
      setTimeout(_ => {
          $('li.md-list-item').hover(function(el){
              if ($(this).find('img').length) {
                  $(this).find('img').attr('style', "filter:brightness(0) invert(1)")
              } else if ($(this).find('i')) {
                  $(this).find('i').addClass("color-white");
                  $(this).find('i').removeClass("color-black");
              }
              $(this).find('button').addClass('bg-purple');
          }, function(){
              if ($(this).find('img').length) {
                  $(this).find('img').attr('style', "filter:brightness(0) invert(0)")
              } else if ($(this).find('i')) {
                  $(this).find('i').removeClass("color-white")
                  $(this).find('i').addClass("color-black")
              }
              $(this).find('button').removeClass('bg-purple');
          })
      }, 0)
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.proposal-service-table-item {
  padding: 30px 0;
  border-top: 1px solid #d5d5d5;
  border-bottom: none;
  font-family: "Manrope-Regular", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &.included-services {
    // padding: 20px 0px;
    border-top: 1px solid #d5d5d5;
    border-left: none;
    border-right: none;
  }
  .proposal-service-item-wrapper {
    display: grid;
    // grid-template-columns: 40% 14% 14% 14% 14%;
    grid-template-columns: 50% 10% 12% 14% 10%; // 40% 10% 20% 20% 10%;
    gap: 1%;
    align-items: center;
    input {
      font-size: 16px;
      width: 100%;
      border: 1px solid #b7b7b7;
      box-shadow: none;
      font: normal 16px "Manrope-Regular", sans-serif;
      color: #050505;
      &.isFilled {
        border: 1px solid #828282;
      }
    }
    .action-menu {
      visibility: hidden;
    }
    &:hover {
      .action-menu {
        visibility: unset;
      }
    }
    &.containPlannerOptions {
      display: grid;
      grid-template-columns: 80%;
      .description-wrapper {
        display: grid;
        grid-template-columns: 40% 10% 50%;
      }
    }

    .madatory-badge {
      color: #641856;
      font-weight: normal;
      font-size: 11px;
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
      font-size: 11px;
      display: inline-block;
      border: solid 1px #ba8d05;
      padding: 4px 8px;
      border-radius: 30px;
      margin-left: 0.5em;
      line-height: 1em;
      position: relative;
      .remove-button {
        visibility: hidden;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.29);
        position: absolute;
        background-color: white !important;
        top: -5px;
        /deep/ .md-button-content {
          width: 100%;
        }
        &:hover {
          visibility: unset;
        }
      }
      &:hover {
        .remove-button {
          visibility: unset;
        }
      }
    }
    .comment-area {
      word-break: break-word;
    }
    div {
      &.item-cont {
        text-transform: capitalize;
      }
      &.action-cont {
        text-align: right;
        display: flex;
        justify-content: flex-end;
        .edit {
          width: 21px;
          margin-right: 31px;
          cursor: pointer;
        }
        .trash {
          width: 21px;
          cursor: pointer;
        }
      }
    }
    &.step-3 {
      border: none;
      border-top: 1px solid #818080;
      margin: 0 38px;
      padding: 50px 0;
      grid-template-columns: 40% 15% 15% 15% 15%;

      .whole-cont {
        span {
          font-weight: normal;
        }
      }
    }
    .editor-wrapper {
      // margin: 0 5px;
      .input-value {
        border: 1px solid #dddddd;
        text-align: center;
        width: 100%;
      }
    }

    a {
      cursor: pointer;
      padding: 8px 20px;

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
  .planner-options-item {
    // border-bottom: solid 2px #dadada;
    padding: 20px 0 0;
    &::after {
      content: "";
      border-bottom: solid 1px #dadada;
      height: 1px;
      display: block;
      margin-left: 50px;
      margin-top: 20px;
    }
    &:last-child::after {
      border-bottom: none;
    }
    &-row {
      display: grid;
      grid-template-columns: 50% 10% 12% 14% 10%;
      gap: 1%;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      input {
        width: 100%;
      }
    }
  }
  .total-cont {
    &.complimentary {
      text-decoration: line-through;
    }
  }
  .price-cont {
    &.complimentary {
      text-decoration: line-through;
    }
  }
  .comment-section {
    width: 30%;
  }
}
.md-menu-content {
  max-height: max-content !important;
}
</style>
