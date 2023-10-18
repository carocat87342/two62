<template>
  <modal class="add-budget-modal">
    <template slot="header">
      <div class="add-category-model__header">
        <h2 class="font-size-30 font-bold-extra">
          <img :src="`${$iconURL}Budget+Elements/${selectedCategory.icon}`" style="width: 30px; margin-right: 0.5em" />
          Add Budet To {{ selectedCategory.fullTitle }}
        </h2>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="md-layout">
        <div class="md-layout-item md-size-50 form-group maryoku-field text-left">
          <label class="font-size-16 font-bold-extra color-black"> Budget </label>
          <div class="mb-10">
            <small class="font-size-14">You have ${{ availableBudget | withComma }} to use</small>
          </div>
          <maryoku-input inputStyle="budget" v-model="budget" />
        </div>
        <div class="md-error d-flex align-center" v-if="availableBudget < budget">
          <img :src="`${$iconURL}Event Page/warning-circle-gray.svg`" style="width: 20px" />
          <span style="padding: 0 15px">Oops! Seems like you don’t have enough cash in your “Unexpected” category</span>
          <md-button
            class="md-button md-rose md-sm md-simple edit-btn md-theme-default md-bold-extra"
            @click="addMoreMoney"
          >
            Add More Money
          </md-button>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-default md-simple cancel-btn md-bold" @click="close">Cancel</md-button>
      <md-button :disabled="!isAvailable" class="md-red add-category-btn md-bold" @click="addNewBudget">
        Add Budget
      </md-button>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import EventComponent from "@/models/EventComponent";
import CalendarEvent from "@/models/CalendarEvent";

export default {
  components: {
    Modal,
    MaryokuInput,
  },
  props: {
    serviceCategory: {
      type: Object,
      default: {},
    },
  },
  created: async function () {},
  data() {
    return {
      filteredEventBlocks: null,
      budget: 0,
      newBuildingBlock: {
        category: "",
        name: "",
        budget: "",
      },
    };
  },
  methods: {
    close() {
      this.$emit("cancel");
    },
    async addNewBudget() {
      let newBlock = {
        componentId: this.selectedCategory.key,
        componentCategoryId: this.selectedCategory.key,
        calendarEvent: { id: this.event.id },
        allocatedBudget: this.budget,
        order: this.event.components.length,
        icon: this.selectedCategory.icon,
        category: this.selectedCategory,
      };

      let event = new CalendarEvent({
        id: this.event.id,
      });

      new EventComponent(newBlock)
        .for(event)
        .save()
        .then((res) => {
          this.$store.dispatch(
            "event/saveEventAction",
            new CalendarEvent({
              id: this.event.id,
              unexpectedBudget: this.event.unexpectedBudget - Number(this.budget),
            }),
          );
          this.$emit("save", res.item);
        })
        .catch((error) => {
          console.log("Error while saving ", error);
        });
    },
    addMoreMoney() {},
  },
  computed: {
    availableBudget() {
      return this.event.unexpectedBudget;
    },
    isAvailable() {
      return Number(this.budget) > 0;
    },
    event() {
      return this.$store.state.event.eventData;
    },
    selectedCategory() {
      return this.$store.state.common.serviceCategories.find(
        (item) => item.key === this.serviceCategory.serviceCategory,
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.add-budget-modal {
  text-align: left;
}
</style>
