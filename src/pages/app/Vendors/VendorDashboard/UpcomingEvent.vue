<template>
  <div class="upcoming-event-list">
    <div class="upcoming-event" v-for="(event, index) in events" :key="event.id">
      <div class="event-logo">
        <img :src="`${$iconURL}CalendarIcons/${eventIcon(index)}`">
      </div>
      <div class="event-detail flex-1">
        <div class="color-gray font-size-14">{{ getUpcomingPeriod(event.startTime) }}</div>
        <div class="font-bold mb-10" v-if="event.customer">{{ event.customer.name }} | {{ event.customer.email }}</div>
        <div>
          {{ event.companyName }} | <a :href="getProposalUrl(event.id)" class="color-purple" target="_blank">See proposal</a>
        </div>
      </div>
      <md-button class="md-simple md-icon-button" @click="selectEvent(event)">
        <md-icon class="color-black">east</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    events: {
      type: Array,
      default: [],
    },
  },
  data(){
      return {
          icons: [
              'Group 20904.svg',
              'Group 20909.svg',
              'Group 20912.svg',
              'Group 20915.svg',
              'Group 20918.svg',
              'Group 20919.svg',
              'Group 20922.svg',
              'Group 20925.svg',
              'Group 20928.svg',
              'Group 20929.svg',
              'Group 20932.svg',
              'Group 20935.svg',
              'Group 20936.svg',
              'Group 20941.svg',
              'Group 20944.svg',
              'Group 20951.svg',
              'Group 20954.svg',
              'Group 20957.svg',
              'Page-1.svg',
              'Page-1_2.svg',
              'Page-1_3.svg',
              'Page-1_4.svg',
              'Page-1_5.svg',
              'Page-1_6.svg',
              'Page-1_7.svg',
              'Page-1_8.svg',
              'Page-1_9.svg',
              'Page-1_10.svg',
          ]
      }
  },
  methods: {
    getUpcomingPeriod(dateString) {
      const d = new Date(dateString);
      if (this.$dateUtil.isToday(d)) {
        return "Today";
      } else if (this.$dateUtil.isTomorrow(d)) {
        return "Tomorrow";
      } else if (this.$dateUtil.isThisWeek(d)) {
        return "This Week";
      }
      const days = this.$dateUtil.getLeftDays(d);
      return `Within ${days} days`;
    },
    selectEvent(event) {
      this.$emit("showEvent", event);
    },
    eventIcon(idx){
      return this.icons[Math.ceil(Math.random() * 10 * idx) % this.icons.length];
    },
    getProposalUrl(eventId){
      console.log('proposalUrl', eventId, this.proposals.map(p => p))
      let proposal = this.proposals.find(p => p.nonMaryoku && p.eventData.id.toString() === eventId.toString());
      return proposal ? `${location.protocol}//${location.host}/#/unregistered/proposals/${proposal.id}` : null;
    }
  },
  computed:{
    proposals(){
      return this.$store.state.vendorDashboard.proposals;
    },
  }
};
</script>
<style lang="scss" scoped>
.upcoming-event-list {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  &::before {
    content: "";
    position: absolute;
    left: 25px;
    height: 100%;
    border-left: dashed 1px #707070;
  }
  .upcoming-event {
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    .event-logo {
      box-shadow: 0 3px 25px 0 rgba(0, 0, 0, 0.16);
      width: 50px !important;
      height: 50px !important;
      min-width: 50px;
      border-radius: 50%;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .event-detail {
      padding: 10px;
    }
  }
}
</style>
