<template>
  <div class="md-layout amounts-wrapper">
    <div class="amounts">
      <span class="text-left">
        Paid: ${{paid | numeral('0,0')}}
      </span>
      <span class="text-right">
        Total: ${{total | numeral('0,0')}}
      </span>
    </div>
    <div class="percentage">
      <div class="inner" :style="percentageStyle"></div>
    </div>
    <h3>${{toBePaid | numeral('0,0')}} to be paid</h3>
  </div>
</template>
<script>
// MAIN MODULES
import moment from 'moment'

export default {
  name: 'event-paid-total-amounts',
  props: {
    paid: Number,
    total: Number,
    toBePaid: Number
  },
  components: {
  },
  data () {
    return {

    }
  },
  mounted () {
  },
  methods: {
  },
  computed: {
    percentageStyle () {
      const percentage = 100 / this.total * this.paid
      return {
        width: percentage > 100 ? '100%' : percentage + '%'
      }
    }
  },
  filters: {
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/md/_colors.scss';
  .amounts-wrapper {
    flex-direction: column;
    h3 {
      text-transform: capitalize;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
    }
    .amounts {
      display: flex;
      span {
        flex: 1;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
      }
    }
    .percentage {
      height: 5px;
      background: #d8dce5;
      .inner {
        background: #ff9800;
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
