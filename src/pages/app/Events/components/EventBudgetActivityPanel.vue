<template>
  <div class="text-left card-activity-content">
    <span class="card-activity-title">Budget was created but not approved</span>
    <div>
      Feeling ready to approve your budget? Click here or get your colleagues inputs by clicking the share button
    </div>
    <p class="text-bold-extra">
      Want to upgrade your event and get a fantastic clip?
    </p>
    <p class="card-activity-buttons">
      <md-button class="md-default md-maryoku md-simple md-theme-default"> No, Thanks</md-button>
      <md-button class="md-default md-red md-maryoku"> Get Video Proposals</md-button>
    </p>
  </div>
</template>
<script>
export default {
  name: "event-budget-activity-panel",
  data() {
    return {
      title: "",
      description: "",
      isNeededAction: false,
    }
  },
};
</script>
<style lang="scss" scoped>
</style>