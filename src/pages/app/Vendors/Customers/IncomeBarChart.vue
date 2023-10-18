<template>
  <svg class="chart" width="450" height="300" aria-labelledby="title desc" role="img">
    <title id="title">A bar chart showing information</title>
    <desc id="desc">4 apples; 8 bananas; 15 kiwis; 16 oranges; 23 lemons</desc>
    <g v-for="(chartDataItem, index) in chartData" transform="translate(0,300) scale(1, -1)">
      <rect
        :x="25 + 36 * index"
        y="40"
        width="18"
        :height="getHeight(chartDataItem.value)"
        rx="10"
        :style="`fill: ${chartDataItem.future ? '#9F6B90' : 'white'}`"
      ></rect>
    </g>
    <g v-for="(chartDataItem, index) in chartData" :key="`chartItem-${index}`">
      <text
        :x="25 + 36 * index"
        y="280"
        fill="#a3809d"
        :transform="`rotate(30 ${25 + 36 * index},280)`"
        font-size="12px"
        style="fill: white"
      >
        {{ chartDataItem.label }}
      </text>
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    chartData: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
  },
  methods: {
    getHeight(value) {
      // console.log(value);
      // console.log("this.maxValue", this.maxValue);
      if (this.maxValue > 250) {
        return Math.round((value / this.maxValue) * 250);
      }
      return value;
    },
  },
  computed: {
    maxValue() {
      return this.chartData.reduce((max, prev) => {
        console.log(max);
        return max < prev.value ? prev.value : max;
      }, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  margin-left: 20px;
}
</style>
