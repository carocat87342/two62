<template>
  <div class="white-card mt-20 additional-requirements" v-if="sittingArrangement">
    <div class="p-40" :class="{ 'd-none': getSelectedOption(sittingArrangement.options).length == 0 }">
      <div>
        <img :src="`${$iconURL}common/seating-purple.png`" />
        <span class="ml-20 font-size-30 font-bold">
          {{ sittingArrangement.item || sittingArrangement.subCategory }}
        </span>
      </div>
      <div
        class="mt-40"
        v-if="sittingArrangement.item == 'Sitting arrangement'"
      >
        <div class="d-flex align-stretch" >
            <div class="d-flex mb-30">
                <template v-for="(sit, index) in sittingArrangement.options">
                    <div
                        v-if="sit.selected"
                        :key="`sitarrangement-${index}`"
                        class="d-flex flex-column justify-content-between seat-type"
                    >
                        <div class="font-bold">'{{ sit.item }}'</div>
                        <div><img :src="`${$iconURL}Requirements/${sit.icon}`" /></div>
                    </div>
                </template>
                <div v-if="sittingArrangement.hasOtherOption" class="d-flex flex-column seat-type">
                    <div class="font-bold">'Other'</div>
                    <div class="mt-20">{{ sittingArrangement.otherOptionContent }}</div>
                </div>
            </div>
            <div v-if="!editingNewSeating" class="d-flex align-center">
                <md-button class="md-simple md-outlined md-vendor maryoku-btn" @click="editingNewSeating = true">
                    Suggest new seating arrangement
                </md-button>
            </div>
            <div v-else class="p-10" style="min-width: 350px">
                <div class="font-bold mb-10">Suggest new seating arrangement</div>
                <textarea v-model="suggestedNewSeatings" rows="4" placeholder="Type your idea here"></textarea>
            </div>
        </div>

        <div class="p-40" style="background-color: #ffd9e4">
          <md-checkbox class="md-vendor" v-model="agreeTerms">I read this section & I agree</md-checkbox>
        </div>
      </div>
      <div
        v-else
        class="align-center mt-40"
        :class="{ 'd-none': getSelectedOption(sittingArrangement.options).length == 0 }"
      >
        <div v-for="option in getSelectedOption(sittingArrangement.options)" :key="option.name" class="ml-20">
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>
<script>
export default {
  data() {
    return {
      agreeTerms: false,
      newSeatingSuggest: "",
      editingNewSeating: false,
    };
  },
  created() {
    this.newSeatingSuggest = this.$store.state.vendorProposal.suggestedNewSeatings;
  },
  methods: {
    getSelectedOption(options) {
      return options.filter((it) => it.selected);
    },
    saveNewSeating() {
      if (this.newSeatingSuggest.trim()) {
        let suggestedNewSeatings = this.$store.state.vendorProposal.suggestedNewSeatings;
        if (!suggestedNewSeatings) suggestedNewSeatings = "";
        suggestedNewSeatings = this.newSeatingSuggest;
        this.$store.commit("vendorProposal/setValue", { key: "suggestedNewSeatings", value: suggestedNewSeatings });
        this.editingNewSeating = false;
        // this.newSeatingSuggest = "";
      }
    },
  },
  computed: {
    vendor() {
      return this.$store.state.vendorProposal.vendor;
    },
    sittingArrangement() {
      const plannerRequirements = this.proposalRequest.plannerRequirement;
      if (!plannerRequirements) return null;
      if (!plannerRequirements.mainRequirements) return null;
      return plannerRequirements.mainRequirements.special.find((item) => {
        return item.subCategory === "Sitting arrangement";
      });
    },
    proposalRequest() {
      return this.$store.state.vendorProposal.proposalRequest;
    },
    suggestedNewSeatings: {
      get: function () {
        return this.$store.state.vendorProposal.suggestedNewSeatings;
      },
      set: function (value) {
        if (!value) {
          this.editingNewSeating = false;
        }
        return this.$store.commit("vendorProposal/setValue", { key: "suggestedNewSeatings", value });
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.additional-requirements {
  .seat-type {
    margin-right: 30px;
    position: relative;
    padding: 10px;
    &.suggested-seat {
      display: flex;
      justify-content: start;
      align-items: center;
    }
    &::after {
      content: "Or";
      position: absolute;
      left: 100%;
      top: 50%;
    }
    &:last-child::after {
      content: "";
      display: none !important;
    }
  }
  .group-card {
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: center;
    // border: solid 1px #707070;
    margin-left: 20px;
    padding-left: 20px;
    border-left: solid 1px #ececec;
  }
}
</style>
