<template>
  <svg class="chart" width="630" height="300" aria-labelledby="title desc" role="img" id="bar_chart" ref="bar_chart">
    <title id="title">A bar chart showing information</title>
    <desc id="desc">4 apples; 8 bananas; 15 kiwis; 16 oranges; 23 lemons</desc>
    <g
      v-for="(chartDataItem, index) in chartData"
      :key="index"
      transform="translate(0,300) scale(1, -1)"
      @mousemove="setTooltipPos($event, chartDataItem)"
      @mouseleave="hideToolTip"
    >
      <rect
        :x="45 + 49 * index"
        y="40"
        width="15"
        :height="(chartDataItem.value / max) * 250"
        rx="8"
        :style="`fill: ${chartDataItem.future ? '#9F6B90' : 'white'}`"
      >
        <title>{{ chartDataItem.value | withComma }}</title>
      </rect>
    </g>
    <g v-for="(chartDataItem, index) in chartData" :key="`chartItem-${index}`">
      <text :x="45 + 49 * index" y="280" fill="#a3809d" :transform="`rotate(30 ${45 + 49 * index},280)`">
        {{ chartDataItem.label }}
      </text>
    </g>
    <g :transform="`translate(${x},${y})`" class="tooltip" :visibility="`${toolTipStatus}`" ref="tooltip">
      <path
        id="svgMask"
        d="M3,72 L182,72 182,53 190,47 182,42 182,23 3,23 z"
        fill="#e6e5e5"
        v-if="toolTipPosition == 'left'"
      />
      <path
        id="svgMask"
        d="M12,72 L190,72 190,23 12,23 12,52 3,47 12,42 z"
        fill="#e6e5e5"
        v-if="toolTipPosition == 'right'"
      />
      <text
        id="tooltip"
        x="40"
        y="30"
        style="fill: #050505; font-family: 'Manrope-Regular'; font-size: 16px; font-weight: 800"
      >
        <tspan x="25" dy="1.3em" style="font-size: 16px; font-weight: 300">${{ toolTip.value | withComma }}</tspan>
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
  data() {
    return {
      endTooltip: null,
      toolTipStatus: "hidden",
      toolTip: {},
      toolTipPosition: "left",
      maxValue: 0,
      x: 0,
      y: 0,
    };
  },
  computed: {
    max() {
      return this.chartData.reduce((s, item) => {
        if (item.value > s) {
          s = item.value;
        }
        return s;
      }, 0);
    },
  },
  methods: {
    setTooltipPos: function (event, item) {
      let CTM = this.$refs.bar_chart.getScreenCTM();

      let mouseX = (event.clientX - CTM.e) / CTM.a;

      let mouseY = (event.clientY - CTM.f) / CTM.d;
      this.x = mouseX - 193 / CTM.a;
      this.y = mouseY - 40 / CTM.d;
      if (this.x < 0) {
        this.x = mouseX + 3 / CTM.a;
        this.toolTipPosition = "right";
      } else {
        this.toolTipPosition = "left";
      }
      this.toolTipStatus = "visible";
      this.toolTip = item;
    },
    hideToolTip() {
      this.toolTipStatus = "hidden";
    },
  },
};
</script>
<style lang="scss" scoped>
.bar {
}
</style>
