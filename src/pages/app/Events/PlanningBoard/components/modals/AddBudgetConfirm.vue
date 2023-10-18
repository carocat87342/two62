<template>
  <modal class="add-budget-confirm-modal">
    <template slot="header">
      <div class="add-category-model__header">
        <div class="d-flex align-center">
          <img :src="`${$iconURL}${serviceCategory.icon}`" class="mr-10" />
          <div>Would you like to add the {{ serviceCategory.name }} category to your budget?</div>
        </div>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button p-absolute" @click="$emit('cancel')">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="text-left">
        <div class="font-size-16 mt-20">
            Looks like you haven’t allocated any money to this service. No problem – simply add it to your budget whenever you’re ready.
        </div>
        <div class="mt-20">Just remember that you’ll only receive proposals for services that appear in your budget.</div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-simple md-black maryoku-btn" @click="$emit('cancel')">
        Not now
      </md-button>
      <md-button class="md-red maryoku-btn" @click="addBudget"> Add To Budget </md-button>
    </template>
  </modal>
</template>
<script>

const components = {
    Modal: () => import("@/components/Modal.vue"),
    MaryokuInput: () => import("@/components/Inputs/MaryokuInput.vue")
}

export default {
  components,
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
    addBudget() {
      this.$emit("addNewBudget");
    },
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
