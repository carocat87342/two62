<template>
  <div class="maryoku_input">
    <md-autocomplete
      v-model="selectedLocation"
      :md-options="locations"
      :md-input-placeholder="placeholder"
      class="location"
      :class="{ active: selectedLocation, 'md-purple': theme === 'purple' }"
      @md-opened="updateSuggestionStyle"
    ></md-autocomplete>
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
    init(){
       this.locationService = new google.maps.places.AutocompleteService();
       this.geocoder = new google.maps.Geocoder();
    },
    handleInput(e) {
      this.$emit("input", this.content);
    },
    addressSuggestions(predictions, status) {
      console.log('addressSuggestions', predictions, status);
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      this.locations = [];
      predictions.forEach((item) => {
        this.locations.push(item.description);
        this.places.push({ id: item.place_id, name: item.description });
      });
      this.updateSuggestionStyle()
    },
    updateSuggestionStyle(){
        console.log('updateSuggestionStyle', this.theme, this.locations);
        if ( this.theme === 'purple' ) {
            console.log('purple')
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
        } else {
          setTimeout((_) => {
            $(".md-list-item-button").hover(
                    function (el) {
                      $(this).attr("style", "background-color:#f51355!important;color: #fff!important");
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
    this.init();
  },
  watch: {
    content: function (newValue) {
      this.$emit("input", this.content);
    },
    selectedLocation: function (newValue) {
      // console.log('selectedLocation', newValue);
      if (newValue.length < 3) {
        // this.locations = [];
        return;
      }
      this.init();
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
</style>
