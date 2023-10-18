<template>
  <span v-if="customStyle" :style="customStyleContents">
    {{prefix}}{{animatedNumber | withComma}}{{suffix}}
  </span>
  <span v-else :class="[{'text-color-pink': isNegative}]">
    {{prefix}}{{animatedNumber | withComma}}{{suffix}}
  </span>
</template>
<script>
import TWEEN from '@tweenjs/tween.js'

export default {
  props: {
    value: {
      default: 0,
      type: Number
    },
    duration: {
      type: Number,
      default: 800
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    customStyle: {
      type: Boolean,
      default: false
    },
    customStyleContents: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      animatedNumber: 0
    }
  },
  methods: {
    initAnimation (newValue, oldValue) {
      let vm = this

      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween({ tweeningNumber: oldValue })
        .easing(TWEEN.Easing.Quadratic.Out)
        .to({ tweeningNumber: newValue }, this.duration)
        .onUpdate(function (object) {
          vm.animatedNumber = parseFloat(object.tweeningNumber.toFixed(vm.decimalDigits))
        })
        .start()

      animate()
    }
  },
  computed: {
    decimalDigits () {
      return (`${this.value}`.split('.')[1] || []).length > 2 ? 2 : (`${this.value}`.split('.')[1] || []).length
    },
    isNegative () {
      return this.animatedNumber <= 0
    }
  },
  mounted () {
    this.initAnimation(this.value, 0)
  },
  filters: {
    withComma (amount) {
      return amount ? amount.toLocaleString() : 0
    }
  },
  watch: {
    value (newValue, oldValue) {
      this.initAnimation(newValue, oldValue)
    }
  }
}
</script>
<style scoped>
  span {
    font-size: 18px;
    font-weight: 500;
  }
  .text-color-pink {
    color: #ff4470;
  }
</style>
