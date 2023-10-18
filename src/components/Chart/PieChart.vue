<template>
  <div class="pie-chart-wrapper" :class="{ row: options.direction === 'row' }">
    <svg
      id="pie_chart"
      ref="pie_chart"
      :width="options.width"
      :height="options.height"
      v-if="sortedData"
      :class="{ 'd-none': showImage, 'd-block': !showImage }"
      :style="`min-width: ${options.width}px; height:${options.height}`"
    >
      <g
        v-for="(item, index) in reorderingData"
        :key="index"
        :ref="`tooltip_${index}`"
        @mousemove="setTooltipPos($event, item)"
        @mouseleave="hideToolTip"
        :id="`g_${index}`"
        :style="{ transform: `rotate(${item.rotate}deg)`, transformOrigin: 'center' }"
      >
        <circle
          class="pie-chart-value"
          cx="50%"
          cy="50%"
          :r="radius"
          :style="`
            fill: none;
            stroke-width: ${options.strokWidth};
            stroke-linecap: round;
            opacity: 1;
            stroke-dasharray: ${item.strikeDash};
            stroke: ${item.color};
            display: ${item.value === 0 && totalValue != 0 ? 'none' : 'inherit'};
          `"
        />
      </g>

      <g
        :transform="`translate(${x},${y})`"
        class="tooltip"
        :visibility="`${toolTipStatus}`"
        ref="tooltip"
        v-if="showTooltip"
      >
        <path
          id="svgMask"
          d="M3,92 L182,92 182,43 190,38 182,33 182,3 3,3 z"
          fill="#e6e5e5"
          v-if="toolTipPosition == 'left'"
        />
        <path
          id="svgMask"
          d="M12,92 L190,92 190,3 12,3 12,43 3,38 12,33 z"
          fill="#e6e5e5"
          v-if="toolTipPosition == 'right'"
        />
        <circle
          class="pie-chart-value"
          cx="30"
          cy="25"
          r="5"
          :style="`
                fill: ${toolTip.color};
              `"
        />
        <text
          id="tooltip"
          x="40"
          y="30"
          style="fill: #050505; font-family: 'Manrope-Regular'; font-size: 16px; font-weight: 800"
          v-if="toolTip.category"
        >
          {{ toolTip.category.substr(0, 15) }}{{ toolTip.category.length > 15 ? "..." : "" }}
          <tspan x="25" dy="1.6em" style="font-size: 16px; font-weight: 300">Planned budget</tspan>
          <tspan x="25" dy="1.3em" style="font-size: 16px; font-weight: 300">${{ toolTip.budget | withComma }}</tspan>
        </text>
      </g>
    </svg>
    <img
      :src="blobURL"
      v-if="showImage"
      style="min-height: 300px"
      id="pie_chart_image"
      :class="{ 'd-none': showImage }"
    />
    <canvas id="pie-chart-canvas" v-if="showImage" width="300" height="300"></canvas>
    <div class="items-cont">
      <ul class="items-list">
        <li v-for="(item, index) in sortedData" :key="index" :class="`columns-${columns}`">
          <div class="d-flex align-center">
            <span :style="`background-color: ${item.color};`" class="icon"></span>
            <img class="pie_svg_img ml-5" v-if="item.image" :src="item.image" width="24" />
            <span class="ml-10 text-gray">{{ item.category }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import _ from "underscore";
import { mapGetters } from "vuex";

export default {
  props: {
    chartData: [Array, Function],
    type: {
      type: String,
      default: "total",
    },
    columns: {
      type: [String, Number],
      default: 2,
    },
    showImage: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {
        return {
          width: 300,
          height: 300,
          strokWidth: 60,
          direction: "column",
        };
      },
    },
    theme: {
      type: String,
      default: "",
    },
    showTooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      blobURL: "",
      dashArray: [],
      circleLength: 0,
      totalValue: 0,
      radius: (this.options.width - 20) / 2,
      eventBuildingBlocks: [],
      sortedData: [],
      categories: [],
      fillColor: null,
      endTooltip: null,
      toolTipStatus: "hidden",
      toolTip: {},
      toolTipPosition: "left",
      maxValue: 0,
      x: 0,
      y: 0,
      colors: [
        "#0FAC4C",
        "#FFC001",
        "#641956",
        "#F3423A",
        "#8CB9B4",
        "#43536A",
        "#A4A6A5",
        "#00BFD2",
        "#24C796",
        "#FE537A",
        "#D9FFE7",
        "#2CDE6B",
      ],
      defaultColor: "#641956",
    };
  },
  methods: {
    setTooltipPos: function (event, item) {
      let CTM = this.$refs.pie_chart.getScreenCTM();

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
    drawChart() {
      this.isLoading = true;
      let res = this.chartData;
      this.circleLength = Math.PI * (this.radius * 2);
      let spaceLeft = this.circleLength;

      // initialize
      this.sortedData = [];
      this.dashArray = [];
      this.categories = [];
      this.eventBuildingBlocks = [];
      this.totalValue = 0;

      this.$set(this, "eventBuildingBlocks", res);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);

      this.eventBuildingBlocks.forEach((item) => {
        this.categories.push(item.title);
        if (item.value) {
          this.totalValue += parseFloat(item.value);
        }
      });
      // remove duplicated categories
      this.categories = [...new Set(this.categories)];
      // sort data with updated categories
      var startValue = 0;
      this.chartData.forEach((item) => {
        const budgetValue = (item.value / this.totalValue) * this.circleLength;
        this.sortedData.push({
          category: item.title,
          value: item.value,
          color: item.color,
          image: item.image,
          strikeDash: `${budgetValue} ${this.circleLength - budgetValue} ${this.circleLength}`,
          rotate: (startValue / this.circleLength) * 360,
        });
        startValue += budgetValue;
        spaceLeft -= budgetValue;
      });

      // Set dash on circle
      this.sortedData.forEach((item, index) => {
        if (item.value) {
          this.dashArray.push("0 " + (this.circleLength - spaceLeft) + " " + this.circleLength);
          // Subtract current value from spaceLeft
          spaceLeft -= (item.value / this.totalValue) * this.circleLength;
          if (this.maxValue < item.value) this.maxValue = item.value;
          if (item === this.sortedData.filter((sd) => sd.value !== 0)[0]) {
            this.fillColor = this.sortedData[index].color;
            this.endTooltip = this.sortedData[index];
          }
        } else {
          this.dashArray.push(spaceLeft + " " + this.circleLength);
        }
      });
      this.$forceUpdate();
      setTimeout(() => {
        this.drawImage();
      }, 1000);
    },
    drawImage() {
      var svgElement = document.getElementById("pie_chart");
      var img = document.querySelector("#pie_chart_image");

      var xml = new XMLSerializer().serializeToString(svgElement);
      var svg64 = btoa(xml);
      var b64Start = "data:image/svg+xml;base64,";
      this.blobURL = b64Start + svg64;

      setTimeout(() => {
        var canvas = document.querySelector("#pie-chart-canvas");
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
        }
      });
      this.$forceUpdate();
    },
    getElementColor(category) {
      let element = _.findWhere(this.components, { title: category });
      if (element === undefined) {
        return this.defaultColor;
      }
      return element.color;
    },
    hideToolTip() {
      this.toolTipStatus = "hidden";
    },
    onResize() {
      this.$refs.pie_chart.style.display = this.$refs.pie_chart.style.display === "inline" ? "inline-block" : "inline";
      this.drawChart();
    },
  },
  computed: {
    reorderingData() {
      let maxIndex = this.sortedData.findIndex((item) => item.value == this.maxValue);
      const endData = { ...this.sortedData[maxIndex] };
      endData.strikeDash = 2 + " " + (this.circleLength - 2) + " " + this.circleLength;
      if (maxIndex == 0) maxIndex = this.sortedData.length - 1;
      else maxIndex -= 1;
      const newData = [...this.sortedData.slice(maxIndex), ...this.sortedData.slice(0, maxIndex)];
      newData.push(this.sortedData[maxIndex]);
      newData.push(endData);
      if (maxIndex >= 0) {
        return newData;
      }
      return this.sortedData;
    },
  },
  mounted() {
    this.drawChart();
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener("resize", this.onResize);
  },
  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  watch: {
    event(newVal, oldVal) {
      this.drawChart();
    },
    items(newVal, oldVal) {
      this.drawChart();
    },
    chartData() {
      this.drawChart();
    },
  },
};
</script>
<style lang="scss" scoped>
.pie-chart-wrapper {
  padding-bottom: 1em;
  canvas {
    margin: auto;
    display: block;
  }
  &.row {
    display: flex;
  }
  .items-cont {
    display: flex;
    align-items: center;
  }
}

#pie_chart {
  height: 300px;
  width: 100%;
  &:hover {
    &:last-child {
      visibility: visible;
    }
  }
}
.pie-chart-value {
  fill: none;
  stroke-width: 60;
  stroke-linecap: round;
  opacity: 1;

  &:hover {
    & + g {
      visibility: visible;
    }
  }
}

.items-list {
  list-style: none;
  padding: 0px;
  li {
    font-size: 16px;
    &.columns-1 {
      width: calc(100% - 5px);
      font-size: 16px;
      padding: 10px 1rem;
    }
    &.columns-2 {
      width: calc(50% - 5px);
    }
    display: inline-block;
    padding: 5px 15px;

    .icon {
      min-width: 14px;
      width: 14px;
      height: 14px;
      display: block;
      border-radius: 50%;
      display: inline-block;
      margin: 4px 5px;
    }
    .text {
      display: inline-block;
    }
  }
}
</style>
