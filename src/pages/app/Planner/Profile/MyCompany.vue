<template>

  <div class="md-layout">
    <div class="md-layout-item md-size-5" style="padding: 0; margin: 0;">
      <h4 class="md-title">
        <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon md-size-2x"><md-icon>arrow_back</md-icon>
        </md-button>
      </h4>
    </div>
    <div class="md-layout-item md-size-95">
      <h4 class="md-title" style="margin-bottom: 0; line-height: 51px;">
        Account Settings
      </h4>

      <div class="md-layout">

        <div class="md-layout-item md-size-45" style="padding-left: 0;">
          <company-dashboard-info></company-dashboard-info>
        </div>
        <div class="md-layout-item md-size-55">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-rose">
              <div class="card-icon">
                <md-icon>group</md-icon>
              </div>
              <h5 class="title profile-title">
                Contact Information
              </h5>
            </md-card-header>
            <md-card-content style="min-height: 320px;">
              <div class="md-layout" style="text-align: left;">
                <div class="md-layout-item md-size-10"><i class="fa fa-map-marker-alt text-gray"></i></div>
                <div class="md-layout-item md-size-90">
          <span class="text-gray" style="font-weight: 500;">
          <label-edit placeholder="Your Main Office Address"></label-edit>
        </span>
                </div>
                <div class="md-layout-item md-size-10"><i class="fa fa-phone-volume text-gray"></i></div>
                <div class="md-layout-item md-size-90">
          <span class="text-gray" style="font-weight: 500;">
            <label-edit placeholder="Phone Number"></label-edit>
          </span>
                </div>
                <div class="md-layout-item md-size-10"><i class="fa fa-envelope text-gray"></i></div>
                <div class="md-layout-item md-size-90">
          <span class="text-gray" style="font-weight: 500;">
            <label-edit placeholder="Email Address"></label-edit>
          </span>
                </div>
                <div class="md-layout-item md-size-10"><i class="fa fa-globe text-gray"></i></div>
                <div class="md-layout-item md-size-90">
          <span class="text-gray" style="font-weight: 500;">
            <label-edit  placeholder="Website address"></label-edit>
          </span>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </div>
        <!--<div class="md-layout-item md-size-33">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-warning">
              <div class="card-icon">
                <md-icon>language</md-icon>
              </div>
              <h5 class="title profile-title">
                Branches
              </h5>
            </md-card-header>
            <md-card-content style="min-height: 320px;">
              <div class="md-layout" style="text-align: left;">
                <div class="md-layout-item md-size-33"><span class="text-gray" style="font-weight: 500;">Branch 1</span></div>
                <div class="md-layout-item md-size-66 text-right"><h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">San Diego, CA</h6></div>
                <div class="md-layout-item md-size-50"><span class="text-gray" style="font-weight: 500;">Branch 2</span></div>
                <div class="md-layout-item md-size-50 text-right"><h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">Seatle, WA</h6></div>
                <div class="md-layout-item md-size-33"><span class="text-gray" style="font-weight: 500;">Branch 3</span></div>
                <div class="md-layout-item md-size-66 text-right"><h6 style="padding: 0;margin: 4px 0; text-transform: none !important;">New York, NY</h6></div>
              </div>
            </md-card-content>
          </md-card>
        </div>-->

      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from 'vue-element-loading'
import CompanyDashboardInfo from '../CompanyDashboard/CompanyDashboardInfo.vue'
import {LabelEdit} from '@/components'

export default {
  components: {
    VueElementLoading,
    CompanyDashboardInfo,
    LabelEdit
  },
  data () {
    return {
    }
  },
  methods: {
    closePanel () {
      this.$emit('closePanel')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
