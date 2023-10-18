<template>
    <svg
        :width="50"
        :height="150"
        :class="customClass"
        :style="{'paddingTop': `${5  * chartData.length}px`}"
    >
        <g
            v-for="(item, idx) in chartData"
            :key="idx"
            transform="translate(0, 0) scale(1, 1)"
        >
            <rect
                :x="10"
                :y="chartData.reduce((sum, it, index) => {
                      return index < idx ? sum + it.value * 1.5 - (idx > 0 ? 14 : 0) : sum
                      }, 0)"
                width="18"
                :rx="10"
                :ry="10"
                :height="item.value * 1.5"
                :style="`
                    fill: ${item.color}
                  `"
            ></rect>
        </g>
    </svg>
</template>
<script>
export default {
  props: {
    chartData: {
      type: Array,
      default: []
    },
    customClass:{
      type: String,
      default: null
    }
  },
};
</script>
<style lang="scss" scoped>
    .bar{
    }
</style>
