<template>
    <div>
        <div
            v-if="component.title !== 'Total'"
            class="event-budget-component d-flex"
            :class="{ editable: editable }"
            :style="`border-left: 10px solid ${component.color}; color: ${fontColor}`"
        >
            <div class="font-size-20 font-bold name">
                <img class="icon" :src="`${$iconURL}Budget Elements/${component.icon}`" />
                {{ component.title }}
                <span v-if="component.eventCategory">
                    <img :src="`${$iconURL}Campaign/Group 9087.svg`" class="label-icon" />
                    <md-tooltip>
                      <div class="font-size-14 tab-tooltip">{{ component.eventCategory.tooltipText }}</div>
                    </md-tooltip>
                </span>
            </div>

            <template v-if="!isEditing">
                <div class="text-right font-size-20 flex-1 budget" v-if="type == 'perguest'">
                    ${{ (component.allocatedBudget / participants).toFixed(2) | withComma }}
                </div>
                <div class="text-right font-size-20 flex-1 budget" v-else>${{ component.allocatedBudget | withComma(Number) }}</div>
                <div class="actions" v-if="component">
                    <md-button class="edit-btn md-simple" @click="editBudget" :disabled="component.title === 'Unused'">
                        <img :src="`${$iconURL}Event%20Page/edit-dark.svg`" />
                    </md-button>
                    <md-button class="edit-btn md-simple" @click="deleteComponent" :disabled="component.title === 'Unused'">
                        <img class="trash" :src="`${$iconURL}Timeline-New/Trash.svg`" />
                    </md-button>
                </div>
            </template>
            <template v-if="isEditing">
                <div class="text-right font-size-20 flex-1 budget d-flex">
                    <maryoku-input inputStyle="budget" v-model="newBudget"></maryoku-input>
                    <md-button class="normal-btn md-simple md-red" @click="isEditing = false"> Cancel </md-button>
                    <md-button class="normal-btn md-red" @click="updateComponent"> Save </md-button>
                </div>
            </template>
        </div>
        <div v-else class="event-budget-component d-flex total">
            <div class="font-size-20 font-bold name">
                {{ component.title }}
            </div>
            <div class="text-right font-size-20 flex-1" v-if="type == 'perguest'">
                ${{ (component.allocatedBudget / participants) | withComma }}
            </div>
            <div class="text-right font-size-20 flex-1" v-else>${{ component.allocatedBudget | withComma(Number) }}</div>
            <div class="actions"></div>
        </div>
        <budget-resize-modal
            v-if="showBudgetResizeModal"
            :newValue="newBudget"
            :value="component.allocatedBudget"
            :categoryName="component.fullTitle"
            @select="resizeBudget"
            @cancel="showBudgetResizeModal = false"
        ></budget-resize-modal>
        <category-delete-modal
            v-if="showCategoryDeleteModal"
            :category="component"
            @select="deleteItem"
            @cancel="showCategoryDeleteModal = false"
        ></category-delete-modal>
    </div>
</template>
<script>
import Swal from "sweetalert2";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import BudgetResizeModal from "@/components/Modals/BudgetResizeModal";
import EventComponent from "@/models/EventComponent";
import CalendarEvent from "@/models/CalendarEvent";
import CategoryDeleteModal from "@/components/Modals/CategoryDeleteModal";
export default {
  components: {
      BudgetResizeModal,
      CategoryDeleteModal,
      MaryokuInput
  },
  data() {
    return {
      isEditing: false,
      newBudget: "",
      prevBudget: 0,
      showBudgetResizeModal: false,
      showCategoryDeleteModal: false,
    };
  },
  props: {
    component: {
      type: Object,
      default: {},
    },
    type: {
      type: String,
      default: "total",
    },
    participants: {
      type: Number,
      default: 1,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    // console.log(this.component);
    this.newBudget = this.component.allocatedBudget;
    this.prevBudget = this.component.allocatedBudget;
  },
  methods: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
    editBudget() {
      this.isEditing = true;
    },
    deleteComponent() {
      Swal.fire({
        title: `<div class="text-left"><div class="d-flex align-center font-size-30 cross-line"><img class="mr-5" src="${this.$iconURL}Budget Elements/${this.component.icon}" width="30"/>${this.component.title}</div>
                  <div >Are You Sure You Want To <br/>Delete This Category?
                  </div></div>`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes I'm sure",
        cancelButtonText: "No, take me back",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          let offset = this.component.allocatedBudget;
          if (this.component.title === 'Unexpected' || this.component.title === 'Extra') {
            this.$emit('delete', {selectedOption: 'total', offset, title: this.component.title})
          } else {
            this.showCategoryDeleteModal = true;
          }
        }
      });
    },
    updateComponent() {
      let offset = this.newBudget - this.component.allocatedBudget;
      if (this.component.title === 'Unexpected' || this.component.title === 'Extra') {
          Swal.fire({
              title: `<div class="text-left">
                  <div class="color-red">$${this.withComma(this.component.allocatedBudget)} -> $${this.withComma(this.newBudget)}</div>
                  <div class="font-size-20">You have ${offset > 0 ? 'increased':'decreased'} the budget of "${this.component.title}". It will ${offset > 0? 'increase' : 'decrease'} the total budget.
                  </div></div>`,
              showCancelButton: true,
              confirmButtonClass: "md-button md-success",
              cancelButtonClass: "md-button md-danger",
              confirmButtonText: "Okay",
              cancelButtonText: "Cancel",
              buttonsStyling: false,
          }).then((result) => {
              if (result.value) {
                  this.isEditing = false
                  this.$emit('updateCategory', {selectedOption: 'total', offset: offset, title: this.component.title})
              }
          });
      } else {
          this.showBudgetResizeModal = true;
      }

    },
    resizeBudget(selectedOption){
        this.showBudgetResizeModal = false;
        let selected_block = new EventComponent({ id: this.component.id, allocatedBudget: this.newBudget });
        selected_block
            .for(new CalendarEvent({ id: this.component.calendarEvent.id }))
            .save()
            .then((res) => {
                this.isEditing = false;
                this.$emit("updateCategory", selectedOption);
        });
    },
    deleteItem(selectedOption) {
          let selected_block = new EventComponent({ id: this.component.id, allocatedBudget: this.newBudget });
          selected_block
              .for(new CalendarEvent({ id: this.component.calendarEvent.id }))
              .delete()
              .then((res) => {
                  this.isEditing = false;
                  this.$emit("delete", selectedOption);
              });
      },
  },
  computed: {
    fontColor() {
      if (this.component.fontColor) return this.component.fontColor;
      if (this.component.componentId == "unexpected") return this.component.color;
      return "";
    },
  },
};
</script>
<style lang="scss" scoped>
.event-budget-component {
  height: 88px;
  border-radius: 3px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;
  cursor: pointer;
  .name {
    width: 50%;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    .icon {
      width: 30px;
    }
  }

  .actions {
    opacity: 0;
    width: 160px;
    margin-left: 30px;
    img {
      max-width: 22px;
      max-height: 20px;
      margin: 10px;
      width: 20px;
      height: 20px;
    }
  }
  &.editable:hover {
    .actions {
      opacity: 1;
    }
    .budget {
      font-weight: bold;
    }
  }
  &.total {
    border-left: 10px solid #434343;
    background-color: #434343;
    color: white;
    height: 72px;
  }
}
</style>
