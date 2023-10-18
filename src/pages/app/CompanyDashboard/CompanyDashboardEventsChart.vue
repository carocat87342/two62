<template>
  <chart-card
    header-animation="false"
    :chart-data="colouredLineChart.data"
    :chart-options="colouredLineChart.options"
    chart-type="Line"
    header-icon
    :no-footer="!displayByYearOrMonth"
    chart-inside-content
    background-color="green"
  :show-loader="loading">
    <template slot="chartInsideHeader">
      <div class="card-icon">
        <md-icon>timeline</md-icon>
      </div>
      <h3 class="title" >
        {{currentYearEventsCount}} <small style="font-size: 0.95rem; color: #7c7c7c;">Events on {{currentYear}}</small>
        <md-switch class="md-switch-info pull-right text-right" style="padding: 0; margin: 12px;" v-model="displayByYearOrMonth" v-tooltip.bottom="'Click to view Events Distribution by Year or Month'">
          Events by {{displayByYearOrMonth ? 'Month' : 'Year'}}
        </md-switch>
      </h3>
    </template>
    <template slot="footer" style="justify-content: center !important;" >
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <md-field class="">
            <label for="year">Start from year</label>
            <md-select v-model="filterYear" name="filterYear" id="filterYear">
              <md-option value="2019">2019</md-option>
              <md-option value="2018">2018</md-option>
              <md-option value="2017">2017</md-option>
              <md-option value="2016">2016</md-option>
              <md-option value="2015">2015</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-50">
          <md-field>
            <label for="month">Start from month</label>
            <md-select v-model="filterMonth" name="filterMonth" id="filterMonth">
              <md-option value="1">January</md-option>
              <md-option value="2">February</md-option>
              <md-option value="3">March</md-option>
              <md-option value="4">April</md-option>
              <md-option value="5">May</md-option>
              <md-option value="6">June</md-option>
              <md-option value="7">July</md-option>
              <md-option value="8">August</md-option>
              <md-option value="9">September</md-option>
              <md-option value="10">October</md-option>
              <md-option value="11">November</md-option>
              <md-option value="12">December</md-option>
            </md-select>
          </md-field>
        </div>
      </div>
    </template>
  </chart-card>
</template>
<script>
// import auth from '@/auth';
import Chartist from 'chartist'
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'

import {
  ChartCard
} from '@/components'

export default {
  name: 'company-dashboard-events-chart',
  components: {
    ChartCard,
    VueElementLoading
  },
  props: {
    currentYear: {
      type: String,
      default: 0
    },
    currentYearEventsCount: {
      type: Number,
      default: 0
    },
    numberOfEventsPerYear: {
      type: Object,
      default: () => { return {} }
    },
    numberOfEventsPerYearMonth: {
      type: Object,
      default: () => { return {} }
    }
  },
  watch: {
    numberOfEventsPerYear (newVal, oldVal) {
      this.loading = false
      let labels = []
      let series = []
      let keys = Object.keys(newVal)
      if (keys.length > 0) {
        for (const key of keys) {
          labels.push(key)
          series.push(newVal[key])
        }
      }

      this.byYearData = {
        labels: labels,
        series: [series]
      }

      if (!this.displayByYearOrMonth) {
        this.colouredLineChart.data = this.byYearData
      }
    },
    numberOfEventsPerYearMonth (newVal, oldVal) {
      let labels = []
      let series = []
      let keys = Object.keys(newVal)
      if (keys.length > 0) {
        keys = keys.sort()
        for (const key of keys) {
          let parts = key.split('__')
          if (parts[0] === '2019') {
            labels.push(`${parts[0]}-${parts[1]}`)
            series.push(newVal[key])
          }
        }
      }

      this.byYearMonthData = {
        labels: labels,
        series: [series]
      }

      if (this.displayByYearOrMonth) {
        this.colouredLineChart.data = this.byYearMonthData
      }
    },
    displayByYearOrMonth (newVal, oldVal) {
      if (newVal) {
        this.colouredLineChart.data = this.byYearMonthData
      } else {
        this.colouredLineChart.data = this.byYearData
      }
    }
  },
  data () {
    return {
      // auth: auth,
      loading: true,
      displayByYearOrMonth: false,
      byYearData: { labels: [], series: [[]]},
      byYearMonthData: { labels: [], series: [[]]},
      filterYear: moment().year(),
      filterMonth: '1',
      colouredLineChart: {
        data: {
          labels: [
          ],
          series: [[]]
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 1
          }),
          axisY: {
            showGrid: true,
            offset: 40
          },
          axisX: {
            showGrid: false
          },
          low: 0,
          /* high: 50, */
          showPoint: true,
          height: '100%',
          plugins: [
            // this.$Chartist.plugins.tooltip()
          ]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

  .tooltip {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
      background: #fff;
      color: black;
      border-radius: 16px;
      padding: 5px 10px 4px;
      border: 1px solid #64b5f6;
    }

    .tooltip-arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
      //border-color: black;
      z-index: 1;
      border-color: #64b5f6;
    }

  }

  .ct-horizontal {

    background-color: black;

    transform: rotate(-30deg);

    /* Safari */
    -webkit-transform: rotate(-30deg);

    /* Firefox */
    -moz-transform: rotate(-90deg);

    /* IE */
    -ms-transform: rotate(-90deg);

    /* Opera */
    -o-transform: rotate(-90deg);

    /* Internet Explorer */
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);

  }
</style>
