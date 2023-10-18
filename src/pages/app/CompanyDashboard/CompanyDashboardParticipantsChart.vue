<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-blue">
      <div class="card-icon">
        <md-icon>timeline</md-icon>
      </div>
      <h5 class="title" style="padding-top: 6px;">
        Participants per Event
        <md-field class="pull-right md-xs" style="max-width: 120px; margin: 0; border: none;" md-inline>
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
    <md-card-content style="min-height: 120px">
      <vue-element-loading :active="loading" spinner="ring" color="#FF547C"/>
      <div class="filter"></div>
      <template v-for="item in items">
        <div class="bar-item">
          <h5 style="margin-bottom: 0; margin-top: 0; font-weight: 500; font-size: 14px;" >{{item.text}}</h5>
          <div class="text-gray small" style="padding-bottom: 6px;">{{item.theDate}} <span class="pull-right"><span class="black-color">{{item.actual}}</span> / {{item.invited}}</span></div>
          <md-progress-bar class="md-info" style="min-height: 18px;" :md-value="(item.actual/item.invited)*100"></md-progress-bar>
        </div>
      </template>
      <div class="" v-if="items.length === 0">
        <h6 style="text-align: center;">No participants information this month</h6>
      </div>
    </md-card-content>
  </md-card>
</template>
<script>
// import auth from '@/auth';
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import {

} from '@/components'
export default {
  name: 'company-dashboard-participants-chart',
  components: {
    VueElementLoading
  },
  props: {
    participantsPerEventPerYearMonthEventType: {
      type: Object
    }
  },
  watch: {
    participantsPerEventPerYearMonthEventType (newVal, oldVal) {
      this.loading = true
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
      if (this.participantsPerEventPerYearMonthEventType && this.participantsPerEventPerYearMonthEventType[this.filterYear]) {
        let keys = Object.keys(this.participantsPerEventPerYearMonthEventType[this.filterYear])
        if (keys.length > 0) {
          for (const key of keys) {
            let contents = this.participantsPerEventPerYearMonthEventType[this.filterYear][key]
            let contentsArray = []
            let types = Object.keys(contents)
            for (const type of types) {
              contentsArray.push({
                text: type,
                invited: contents[type].Invited,
                actual: contents[type].Actual,
                theDate: ''
              })
            }
            this.itemsPerMonth[key] = contentsArray
          }
        }

        let value = this.itemsPerMonth[this.filterMonth]
        if (value) {
          this.items = value
        } else {
          this.items = []
        }
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .md-menu.md-select {
    &i{
      background-color: #00b0ff !important;
    }
  }
  .md-select-value {
    font-size: 14px;
  }

  .md-select i {
    width: 13px !important;
    height: 13px;
    line-height: 13px;
  }
</style>
