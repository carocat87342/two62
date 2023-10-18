<template>
  <div>
    <div :id="chartId" class="ct-chart"></div>
  </div>
</template>
<script>
export default {
  name: 'chart-component',
  props: {
    chartType: {
      type: String,
      default: 'Line' // Line | Pie | Bar
    },
    chartOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chartResponsiveOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    chartAnimation: {
      type: Array,
      default: () => {
        return []
      }
    },
    chartData: {
      type: Object,
      default: () => {
        return {
          labels: [],
          series: []
        }
      }
    },
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hoverCount: 0,
      imgHovered: false,
      fixedHeader: false,
      chartId: 'no-id'
    }
  },
  computed: {
    headerDown () {
      return this.hoverCount > 15
    }
  },
  methods: {
    headerBack: function () {
      this.fixedHeader = false
    },
    fixHeader: function () {
      this.hoverCount = 0
      this.fixedHeader = true

      setTimeout(this.headerBack, 480)
    },
    onMouseOver: function () {
      if (this.headerAnimation === 'true') {
        this.imgHovered = true
        this.hoverCount++
      }
    },
    onMouseLeave: function () {
      if (this.headerAnimation === 'true') {
        this.imgHovered = false
      }
    },

    getClass: function (backgroundColor) {
      return 'md-card-header-' + backgroundColor + ''
    },
    /***
       * Initializes the chart by merging the chart options sent via props and the default chart options
       */
    initChart () {
      var chartIdQuery = `#${this.chartId}`
      this.$Chartist[this.chartType](
        chartIdQuery,
        this.chartData,
        this.chartOptions,
        this.chartResponsiveOptions
      )
    },
    /***
       * Assigns a random id to the chart
       */
    updateChartId () {
      var currentTime = new Date().getTime().toString()
      var randomInt = this.getRandomInt(0, currentTime)
      this.chartId = `div_${randomInt}`
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
  },
  mounted () {
    this.updateChartId()
    this.$nextTick(this.initChart)
  },
  watch: {
    chartData () {
      this.updateChartId()
      this.$nextTick(this.initChart)
    }
  }
}
</script>
