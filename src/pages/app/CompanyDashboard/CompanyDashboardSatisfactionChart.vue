<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-warning">
      <div class="card-icon">
        <md-icon>timeline</md-icon>
      </div>
      <h5 class="title" style="padding-top: 6px;">
        Attendants Satisfaction Rate

        <md-field class="pull-right" style="max-width: 120px; margin: 0; border: none;" md-inline>
          <md-select v-model="filterMonth" name="filterMonth" id="filterMonth" @md-selected="filterMonthChanged($event)">
            <md-option value="01">January</md-option>
            <md-option value="02">February</md-option>
            <md-option value="03">March</md-option>
            <md-option value="04">April</md-option>
            <md-option value="05">May</md-option>
            <md-option value="06">June</md-option>
            <md-option value="07">July</md-option>
            <md-option value="08">August</md-option>
            <md-option value="09">September</md-option>
            <md-option value="10">October</md-option>
            <md-option value="11">November</md-option>
            <md-option value="12">December</md-option>
          </md-select>
        </md-field>
      </h5>
    </md-card-header>
    <md-card-content style="min-height: 120px;">
      <vue-element-loading :active="loading" spinner="ring" color="#FF547C"/>
      <div class="filter"></div>
      <template v-for="item in items">
        <div class="bar-item">
          <h5 style="margin-top: 0; font-weight: 500;font-size: 14px;" class="text-gray" >{{item.text}} <small class="pull-right black-color">{{item.value}}%</small></h5>
          <md-progress-bar class="md-warning" style="min-height: 18px;" :md-value="item.value"></md-progress-bar>
        </div>
      </template>
      <div class="" v-if="items.length === 0">
        <h6 style="text-align: center;">No satisfaction rates this month</h6>
      </div>
    </md-card-content>
    <md-card-actions style="justify-content: center;">
      <h4 class="title" style="font-weight: 500; text-align: center;">
        {{avgAttendanceSatisfaction}}% <small style="font-size: 0.95rem; color: #7c7c7c;">average attendance satisfaction this year</small>
      </h4>

    </md-card-actions>
  </md-card>
</template>
<script>
// import auth from '@/auth';
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import {

} from '@/components'
export default {
  name: 'company-dashboard-satisfaction-chart',
  components: {
    VueElementLoading
  },
  props: {
    satisfactionRatesPerYearMonth: {
      type: Object
    }
  },
  watch: {
    satisfactionRatesPerYearMonth (newVal, oldVal) {
      this.updateItems()
    }
  },
  data () {
    return {
      // auth: auth,
      loading: true,
      items: [],
      itemsPerMonth: {},
      amount2: 20,
      avgAttendanceSatisfaction: 0,
      filterMonth: (moment().month() + 1).padStart(2, '0'),
      filterYear: moment().year()
    }
  },
  methods: {
    filterMonthChanged (e) {
      this.loading = true
      this.updateItems()
    },
    updateItems () {
      if (this.satisfactionRatesPerYearMonth && this.satisfactionRatesPerYearMonth[this.filterYear]) {
        let keys = Object.keys(this.satisfactionRatesPerYearMonth[this.filterYear])
        if (keys.length > 0) {
          for (const key of keys) {
            let contents = this.satisfactionRatesPerYearMonth[this.filterYear][key]
            let contentsArray = []
            let types = Object.keys(contents)
            for (const type of types) {
              contentsArray.push({
                text: type,
                value: contents[type]
              })
            }
            this.itemsPerMonth[key] = contentsArray
          }
        }

        let value = this.itemsPerMonth[this.filterMonth]
        if (value) {
          this.items = value

          let totalValues = 0
          let countValues = 0

          this.items.forEach((item) => {
            totalValues += item.value
            countValues += 1
          })

          this.avgAttendanceSatisfaction = totalValues / countValues
        } else {
          this.items = []

          this.avgAttendanceSatisfaction = 0
        }
      }

      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
