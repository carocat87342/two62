<template>
  <div class="requirement-section">
    <div class="d-flex align-start mb-30">
      <div class="d-flex align-center" style="min-width: 300px">
        <img :src="`${$iconURL}Requirements/special-request-red.svg`" class="mr-20" />
        <div class="title">
          <div class="font-size-22 font-bold">Special Requests</div>
          <div class="mt-10">
            Would you like to add
            <br />one of those items?
          </div>
        </div>
      </div>

      <div>
        <template v-for="(property, index) in specialRequirements">
          <div
            class="additional-request-tag"
            :class="{ selected: property.isSelected }"
            @click="setRequirement(index)"
            :key="index"
          >
            {{ property.subCategory }}
            <md-icon class="icon color-red">add_circle</md-icon>
          </div>
        </template>
      </div>
    </div>
    <div v-for="(property, idx) in specialRequirements">
      <special-requirement-item
        v-if="property.isSelected"
        :index="idx"
        :data="property"
        @change="handleChangeItem"
      ></special-requirement-item>
    </div>
    <div class="anything-else-section">
      <h4>Get me a pink unicorn please</h4>

      <div class="mt-10">We love a good challenge! Tell us whatever you need, and we’ll add it to your proposal.</div>
      <div class="anything-else-section-options mt-10">
        <textarea
          placeholder="Type name of element here..."
          v-model="anythingElse"
          @input="handleNoteChange"
        ></textarea>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import SpecialRequirementItem from "./SpecialRequirementItem";

export default {
  components: {
    SpecialRequirementItem,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    currentComponent: {
      type: Object,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      specialRequirements: [],
      anythingElse: this.note,
    };
  },
  methods: {
    getSpecialRequirements() {
      console.log("specialRequirements", this.anythingElse);
      this.specialRequirements = this.data;
    },
    handleChangeItem() {
      console.log("handleChangeItem", this.data);
      this.$emit("change");
    },
    handleNoteChange() {
      this.$emit("change", { note: this.anythingElse });
    },
    setRequirement(index) {
      this.data[index].isSelected = !this.data[index].isSelected;
      this.$emit("change", this.data);
    },
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getSpecialRequirements();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getSpecialRequirements();
  },
};
</script>
