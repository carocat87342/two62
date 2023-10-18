export default {
  namespaced: true,
  state () {
    return {
      vendorsMemberData: {
        vendorDisplayName: null,
        productsCategory: null,
        vendorWebsite: null,
        vendorAddressLine1: null,
        vendorMainEmail: null,
        vendorMainPhoneNumber: null,
        vendorCategory: 'test',
        vendorAvailabilityOptions: 'test',
        vendorCancellationPolicy: 'test',
        vendorCity: 'test',
        vendorRefundPolicy: 'test'
      },
      csvFile: null
    }
  },
  mutations: {
    setMemberProperty (state, {key, actualValue}) {
      state.vendorsMemberData[key] = actualValue
    },
    setFileToState (state, file) {
      state.csvFile = file
    },
    resetForm (state) {
      state.vendorsMemberData.vendorDisplayName = null
      state.vendorsMemberData.productsCategory = null
      state.vendorsMemberData.vendorWebsite = null
      state.vendorsMemberData.vendorAddressLine1 = null
      state.vendorsMemberData.vendorMainEmail = null
      state.vendorsMemberData.vendorMainPhoneNumber = null
    }
  },

  actions: {}
}
