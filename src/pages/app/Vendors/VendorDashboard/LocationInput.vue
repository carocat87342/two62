<template>
  <div class="maryoku_input">
    <md-autocomplete
      class="location md-vendor"
      v-model="selectedLocation"
      :md-options="locations"
      :class="{ active: !!selectedLocation, 'md-purple': theme === 'purple' }"
      @md-opened="updateSuggestionStyle"
    >
    </md-autocomplete>
  </div>
</template>
<script>
export default {
  name: "maryoku-input",
  model: {},
  props: {
    /**
     * Data binding
     * @model
     */
    value: String,
    name: String,
    srcLogo: String,
    type: String,
    onChange: Function,
    inputBlock: String,
    placeholder: String,
    disabled: Boolean,
    imgStyle: String,
    inputStyle: String,
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      selectedLocation: this.value,
      addressSearch: null,
      locations: [],
      places: [],
      locationService: null,
      geocoder: null,
      results: [],
    };
  },
  methods: {
    handleInput(e) {
      this.$emit("input", this.content);
    },
    addressSuggestions(predictions, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      this.locations = [];
      predictions.forEach((item) => {
        this.locations.push(item.description);
        this.places.push({ id: item.place_id, name: item.description });
      });
      this.updateSuggestionStyle();
    },
    updateSuggestionStyle(){
      console.log('updateSuggestionStyle', this.theme);
      if ( this.theme === 'purple' ) {
        setTimeout((_) => {
          $(".md-list-item-button").hover(
                  function (el) {
                    $(this).attr("style", "background-color:#641856!important;color: #fff!important");
                  },
                  function () {
                    $(this).attr("style", "background-color:#fff;color:#000");
                  },
          );
        }, 0);
      }
    }
  },
  computed: {
    getClass: function () {
      return `${this.inputStyle} ${this.value ? "active" : ""}`;
    },
  },
  mounted() {
    this.selectedLocation = this.value;
    this.locationService = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
  },
  watch: {
    content: function (newValue) {
      this.$emit("input", this.content);
    },
    selectedLocation: function (newValue) {
      if (newValue.length < 3) {
        // this.locations = [];
        return;
      }
      this.$emit("input", newValue);
      const locationObject = this.places.find((item) => item.name === newValue);
      this.$emit("change", locationObject);

      this.locationService.getPlacePredictions(
        {
          input: newValue,
          types: ["geocode"],
          // componentRestrictions: { country: ['us', 'ca'] },
        },
        this.addressSuggestions,
      );
    },
    value: function (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.selectedLocation = newValue;
      }
    },
  },
};
</script>
<style lang="scss">
.input-default {
  border: none;
  padding: 15px;
  width: 100%;
  border-bottom: 1px solid #e4e4e4;
}
.required-logo {
  color: red;
}
/*.md-menu-content:not(.md-select-menu) .md-menu-content-container .md-list {*/
  /*.md-list-item {*/
    /*.md-list-item-button {*/
      /*&:hover {*/
        /*background-color: #641856 !important;*/
      /*}*/
    /*}*/
  /*}*/
/*}*/
</style>
