<template>
  <div class="schedule-btn d-flex">
    <md-button
      class="md-button md-red maryoku-btn schedule-campaign-btn"
      @click="showScheduleModal = true"
    >
      <span class="font-size-16 text-transform-capitalize">
        <img class="mr-20" :src="`${$iconURL}Campaign/Path 4377.svg`" />
        Schedule Campaign
      </span>
    </md-button>
    <md-menu
      md-size="medium"
      md-align-trigger
      md-direction="top-end"
      class="schedule-menu"
    >
      <md-button md-menu-trigger class="md-icon-button schedule-menu-btn">
        <md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
      </md-button>
      <md-menu-content>
        <md-menu-item class="text-center" @click="saveDraftCampaign">
          <span class="font-size-16 font-bold-extra">
            <img
              :src="`${$iconURL}Campaign/Group 1908.svg`"
              class="mr-10"
              style="width: 20px; height: 20px"
            />Save Draft
          </span>
        </md-menu-item>
        <md-menu-item class="text-center" @click="startCampaign">
          <span class="font-size-16 font-bold-extra">
            <img
              :src="`${$iconURL}Campaign/group-2428.svg`"
              class="mr-10"
              style="width: 20px; height: 20px"
            />Send Now
          </span>
        </md-menu-item>
      </md-menu-content>
    </md-menu>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
</script>