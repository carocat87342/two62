<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100 md-medium-size-100">
      <tabs
        :tab-name="['Dashboard', 'Company Profile', 'Approvals & Sign-Off', 'Billing', 'Settings']"
        plain
        color-button="rose">

        <!-- here you can add your content for tab-content -->
        <my-company-dashboard slot="tab-pane-1"></my-company-dashboard>

        <my-company-profile slot="tab-pane-2"></my-company-profile>

        <my-company-approvals slot="tab-pane-3"></my-company-approvals>

        <my-company-billing slot="tab-pane-4"></my-company-billing>

        <my-company-settings slot="tab-pane-5"></my-company-settings>
      </tabs>
    </div>
  </div>
</template>

<script>
import { Tabs, NavTabsCard } from '@/components'
import MyCompanyDashboard from 'src/pages/app/MyCompany/MyCompanyDashboard.vue'
import MyCompanyApprovals from 'src/pages/app/MyCompany/MyCompanyApprovals.vue'
import MyCompanyProfile from 'src/pages/app/MyCompany/MyCompanyProfile.vue'
import MyCompanyBilling from 'src/pages/app/MyCompany/MyCompanyBilling.vue'
import MyCompanySettings from 'src/pages/app/MyCompany/MyCompanySettings.vue'

export default {
  components: {
    Tabs,
    NavTabsCard,
    MyCompanyDashboard,
    MyCompanyApprovals,
    MyCompanyProfile,
    MyCompanyBilling,
    MyCompanySettings
  },
  data () {
    return {
      firstTabs: [
        {
          tab: 'Sign contract for "What are conference organizers afraid of?"'
        },
        {
          tab: 'Lines From Great Russian Literature? Or E-mails From My Boss?'
        },
        {
          tab:
            'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit'
        }
      ]
    }
  },
  methods: {
    onSelect: function (items) {
      this.selected = items
    }
  }
}
</script>
