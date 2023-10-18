<template>
  <div class="md-layout actual-cost-wrapper">
    <md-icon v-if="showIcon">{{icon}}</md-icon>
    <md-tooltip md-direction="top">
      <div class="tooltip-wrapper">
        <strong>Down payment has been paid</strong>
        <span>Paid Amount: {{paidAmount | withComma}}</span>
        <span>Date: {{paidDate}}</span>
      </div>
    </md-tooltip>
  </div>
</template>
<script>
// MAIN MODULES
import moment from 'moment'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import EventComponent from '@/models/EventComponent'
import EventComponentVendor from '@/models/EventComponentVendor'

export default {
  name: 'event-actual-cost-icon-tooltip',
  props: {
    icon: String,
    item: Object,
    event: Object
  },
  components: {},
  data () {
    return {
      paidAmount: 0,
      paidDate: 'N/A',
      showIcon: false
    }
  },
  mounted () {
    this.getDownPayment(this.item)
  },
  methods: {
    getDownPayment: function (item) {
      if (item.proposalsCount > 0) {
        let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
        let event = new CalendarEvent({ id: this.event.id })
        let selected_block = new EventComponent({ id: item.id })

        // new EventComponentVendor()
        //   .for(calendar, event, selected_block)
        //   .get()
        //   .then(response => {
        //     this.isLoading = false
        //     item.vendors = response
        //     item.vendorsCount = response.length
        //
        //     let vendorsWithProposals = _.filter(response, function (item) {
        //       return item.proposals && item.proposals.length
        //     })
        //
        //     let proposals = []
        //
        //     _.each(vendorsWithProposals, v => {
        //       // if ( v.proposals[0].accepted ) {
        //       this.showIcon = v.proposals[0].accepted
        //
        //       if (v.proposals[0].downPaymentStatus === 'paid') {
        //         proposals = v.proposals
        //
        //         _.each(proposals, p => {
        //           this.paidAmount += p.cost
        //           this.paidDate = this.getDateAsString(p.lastUpdated)
        //         })
        //       }
        //     })
        //   })
        //   .catch(error => {
        //     this.isLoading = false
        //   })
      }
    },
    getDateAsString (paidMillis) {
      let x = new Date(paidMillis)
      return x.getFullYear() + '/' + x.getMonth() + '/' + x.getDate()
    }
  },
  computed: {},
  filters: {
    withComma (amount) {
      return amount ? amount.toLocaleString() : 0
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.tooltip-wrapper {
  strong {
    font-size: 13px;
    font-weight: 400;
  }
  span {
    font-size: 12px;
    color: #666666;
  }
}
</style>
