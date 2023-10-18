<template>
<canvas  :style="classStyle" :id="id" :width="width" :height="height"></canvas>
</template>
<script>
import * as Chart from 'chart.js'
export default {
  name: 'LineChart',
  data(){
      return {
      }
  },
  mounted () {
    const chart = document.getElementById(this.id).getContext('2d');
    new Chart(chart, {
      type: this.type,
      data: this.getData(),
      options: this.optionChart
    })
  },
  methods: {
    getData (chart) {

      return this.dataChart

    }
  },
  props: {
    dataChart: Object,
    type: String,
    optionChart: Object,
    id: String,
    width: String,
    height: String,
    classStyle: String

  },
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  updated () {
    console.log('updated', this.data)
  }

}
</script>
<style lang="scss">

</style>
