<template>
  <div class="event-created">
    <div class="page-banner">
      <img
        src="https://static-maryoku.s3.amazonaws.com/storage/wizard-icons/Group 577@2x.png"
        width="110"
      />
      <h3>One event coming right up!</h3>
    </div>

    <div class="page-content">
      Great Job!
      <br />We have everything we need to start planning your event.
    </div>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import numeral from "numeral";
import EventComponent from "@/models/EventComponent";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";

export default {
  components: {
    GoBack,
  },
  data() {
    return {};
  },
  created() {
    // create new event
    // this.$auth.currentUser(this, false, () => {
    //   let publicEventData = this.publicEventData
    //   delete publicEventData['id']
    //   new CalendarEvent(this.publicEventData).save().then(resp => {
    //     console.log(resp)
    //   })
    // })
  },
  methods: {},
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;
html,
body {
  height: 100%;
  > div,
  .create-event {
    height: 100%;
  }
}

.event-created {
  background: $baseColor;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  text-align: center;
  color: #fff;
  padding-top: 140px;
  .page-banner {
    margin-bottom: 2em;
    h3 {
      margin: 1em auto;
      font-weight: 500;
      font-size: 32px;
    }
  }
  .page-content {
    font-size: 18px;
  }
}
</style>
