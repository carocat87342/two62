<template>
  <div class="md-layout">
    <div class="md-layout-item md-small-size-100 md-medium-size-50 md-large-size-33">
      <company-dashboard-events-chart :numberOfEventsPerYear="statistics.numberOfEventsPerYear" :number-of-events-per-year-month="statistics.numberOfEventsPerYearMonth" :current-year="currentYear" :current-year-events-count="statistics.numberOfEventsPerYear[currentYear]"></company-dashboard-events-chart>
      <company-dashboard-costs-chart :event-cost-per-employee-per-year-month="statistics.eventCostPerEmployeePerYearMonth"></company-dashboard-costs-chart>
    </div>
    <div class="md-layout-item md-small-size-100 md-medium-size-50 md-large-size-33">
      <company-dashboard-event-types-chart :events-per-category="statistics.eventsPerCategory"></company-dashboard-event-types-chart>
      <company-dashboard-satisfaction-chart :satisfaction-rates-per-year-month="statistics.satisfactionRatesPerYearMonth"></company-dashboard-satisfaction-chart>
    </div>
    <div class="md-layout-item md-small-size-100 md-medium-size-50 md-large-size-33">
      <company-dashboard-participants-chart :participants-per-event-per-year-month-event-type="statistics.participantsPerEventPerYearMonthEventType"></company-dashboard-participants-chart>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import CompanyDashboardInfo from './CompanyDashboardInfo'
import CompanyDashboardEventsChart from './CompanyDashboardEventsChart'
import CompanyDashboardEventTypesChart from './CompanyDashboardEventTypesChart'
import CompanyDashboardParticipantsChart from './CompanyDashboardParticipantsChart'
import CompanyDashboardSatisfactionChart from './CompanyDashboardSatisfactionChart'
import CompanyDashboardCostsChart from './CompanyDashboardCostsChart'

import Customer from '@/models/Customer'

import moment from 'moment'

export default {
  components: {
    CompanyDashboardInfo,
    CompanyDashboardEventsChart,
    CompanyDashboardEventTypesChart,
    CompanyDashboardParticipantsChart,
    CompanyDashboardSatisfactionChart,
    CompanyDashboardCostsChart
  },
  data () {
    return {
      // auth: auth,
      statistics: {numberOfEventsPerYear: {}, satisfactionRatesPerYearMonth: {}, participantsPerEventPerYearMonthEventType: {}},
      currentYear: moment().year().toString()
    }
  },
  mounted () {
    this.$auth.currentUser(this, true, () => {
      new Customer({id: this.$auth.user.customer.id})
        .statistics()
        .get()
        .then(res => {
          this.statistics = res[0]
        })
        .catch(e => console.log(e, 'chart api errors'))
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
