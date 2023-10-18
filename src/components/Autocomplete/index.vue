<template>
  <div class="autocomplete-field">
    <input
      v-if="filteredSuggestItems[selectedSuggestItemIndex]"
      class="suggested-place-holder"
      :value="getOptionLabel(filteredSuggestItems[selectedSuggestItemIndex])"
    />
    <input
      v-model="searchWord"
      class="input-value label-input"
      :class="{ isFilled: !!searchWord }"
      type="text"
      :placeholder="placeholder"
      @keypress="startSearch"
      @blur="stopSearch"
      @input="input"
    />
    <div class="auto-complete-panel" v-if="showAutoCompletePanel && filteredSuggestItems.length > 0">
      <div
        class="suggest-item font-bold"
        v-for="(item, index) in filteredSuggestItems"
        :key="getOptionLabel(item)"
        @mouseenter="hoverSuggestItem(index)"
        @click="selectSuggestItem(index)"
      >
        <div>{{ getOptionLabel(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Autocomplete",
  data() {
    return {
      selectedSuggestItemIndex: -1,
      showAutoCompletePanel: false,
      searchWord: "",
    };
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: [String, Array],
      default: "label",
    },
    selectedValue: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    hoverSuggestItem(index) {
      this.selectedSuggestItemIndex = index;
      this.qty = this.filteredSuggestItems[index].qty;
      this.unit = this.filteredSuggestItems[index].price;
      // this.searchWord = this.getOptionLabel(this.filteredSuggestItems[index]).slice(0, this.searchWord.length);
    },
    selectSuggestItem(index) {
      this.qty = this.filteredSuggestItems[index].qty;
      this.unit = this.filteredSuggestItems[index].price;
      this.$emit("change", this.filteredSuggestItems[index]);
      this.searchWord = this.getOptionLabel(this.filteredSuggestItems[index]);
      this.selectedSuggestItemIndex = -1;
      this.showAutoCompletePanel = false;
    },
    startSearch() {
      this.showAutoCompletePanel = true;
    },
    input(e){
      this.$emit('input', e);
    },
    stopSearch() {
      setTimeout(() => {
        this.showAutoCompletePanel = false;
        this.selectedSuggestItemIndex = -1;
      }, 500);
    },
    getOptionLabel(option) {
      if (typeof this.label === "string") {
        return option[this.label];
      } else {
        const labels = this.label.map((label) => option[label]);
        return labels.join(" / ");
      }
    },
  },
  mounted() {
      console.log('Autocomplete.mounted', this.selectedValue, this.options);
      if (this.selectedValue) {
          this.selectedSuggestItemIndex = this.filteredSuggestItems.findIndex(it =>
              it.companyName === this.selectedValue.companyName && it.name === this.selectedValue.name)
      }

  },
  computed: {
    filteredSuggestItems() {
      return this.options.filter((item) =>
        this.getOptionLabel(item).toLowerCase().includes(this.searchWord.toLowerCase()),
      );
    },
  },
  watch: {
    selectedValue(newValue, oldValue) {
      console.log('selectedValue', newValue);
      this.searchWord = `${newValue.companyName} / ${newValue.name}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.autocomplete-field {
  position: relative;
  input {
    font-size: 16px;
    width: 100%;
    border: 1px solid #b7b7b7;
    box-shadow: none;
    font: normal 16px "Manrope-Regular", sans-serif;
    color: #050505;
    &.isFilled {
      border: 1px solid #b7b7b7;
    }
    &:disabled {
      color: #828282;
    }
    width: 100%;
  }
  .suggested-place-holder {
    position: absolute;
  }
  .suggested-place-holder,
  .isSuggeted {
    color: #e8ae03;
  }
  .label-input {
    background-color: transparent;
  }
  .auto-complete-panel {
    z-index: 10;
    padding: 30px 0;
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    position: absolute;
    width: 100%;
    .suggest-item {
      display: grid;
      grid-template-columns: 50% 30% 20%;
      padding: 10px 20px;
      cursor: pointer;
      &:hover {
        background-color: #ffedb7;
      }
    }
  }
}
</style>
