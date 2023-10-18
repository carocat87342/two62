<template>
  <div class="vendor-address-editor">
    <vue-google-autocomplete
      :id="`map-${index}`"
      ref="address"
      :placeholder="defaultValue ? defaultValue : 'Enter an an address, zipcode, or location'"
      v-on:placechanged="getAddressData"
    />
  </div>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";

export default {
  name: "v-signup-address-editor",
  components: {
    VueGoogleAutocomplete,
  },
  props: {
    title: String,
    field: String,
    img: String,
    defaultValue: String,
    index: Number,
  },
  data: () => ({
    isLoading: true,
    isEdit: false,
    reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    value: null,
  }),
  mounted() {
    this.value = this.defaultValue;
    if (this.value) document.getElementById(`map-${this.index}`).value = this.value;
  },
  methods: {
    getAddressData: function (addressData, placeResultData, id) {
      this.value = `${addressData.route}, ${addressData.administrative_area_level_1}, ${addressData.country}`;
      this.$emit("change", this.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-address-editor {
  font: normal 16px Manrope-Regular, sans-serif;
  width: 100%;
  input {
    font: normal 16px Manrope-Regular, sans-serif;
    width: 100%;
  }
}
</style>
