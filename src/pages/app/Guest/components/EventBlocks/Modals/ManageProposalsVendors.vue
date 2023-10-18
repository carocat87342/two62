<template>
  <div class="md-layout"></div>
</template>
<script>
import EventComponentVendor from "@/models/EventComponentVendor";

export default {
  name: "manage-proposals-vendors",
  components: {},
  data() {
    return {
      isLoading: false,
      blockVendors: [],
      filteredBlockVendors: [],
    };
  },
  mounted() {},
  methods: {
    getBuildingBlocksVendors() {
      new EventComponentVendor()
        .for(calendar, event, selected_block)
        .get()
        .then((resp) => {
          this.isLoading = false;
          this.blockVendors = resp;
          this.filteredBlockVendors = this.blockVendors;
        })
        .catch((error) => {
          this.isLoading = false;
          console.log("EventComponentVendor error =>", error);
        });
    },
  },
  computed: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
</style>
