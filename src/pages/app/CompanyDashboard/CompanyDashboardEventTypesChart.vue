<template>
  <chart-card
    header-animation="false"
    :chart-data="colouredLineChart.data"
    :chart-options="colouredLineChart.options"
    chart-type="Bar"
    header-icon
    chart-inside-content
    no-footer
    background-color="blue"
  :show-loader="loading">
    <template slot="chartInsideHeader">
      <div class="card-icon">
        <md-icon>timeline</md-icon>
      </div>
      <h5 class="title" style="padding-top: 6px;">
        Event Categories Comparison
      </h5>
    </template>
  </chart-card>
</template>
<script>
// import auth from '@/auth';
import Chartist from 'chartist'
import {
  ChartCard
} from '@/components'
export default {
  name: 'company-dashboard-satisfaction-chart',
  components: {
    ChartCard
  },
  props: {
    eventsPerCategory: {
      type: Object,
      default: () => { return {} }
    }
  },
  watch: {
    eventsPerCategory (newVal, oldVal) {
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

      this.colouredLineChart.data = {
        labels: labels,
        series: [series]
      }
    }
  },
  data () {
    return {
      // auth: auth,
      loading: true,
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

</style>
