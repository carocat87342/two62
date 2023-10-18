<template>
  <div class="my-event-item white-card">
    <div class="my-event-item-header">
      <div>
        <img class="event-image" :src="event.concept && event.concept.images[0].url" />
        <span class="font-size-22 font-bold" style="padding: 20px">{{
          event.concept ? event.concept.name : event.title
        }}</span>
        <span class="color-gray font-size-14" style="padding: 20px"
          >Created on {{ $dateUtil.formatScheduleDay(event.dateCreated, "MMM DD YYYY") }}</span
        >
        <md-button class="edit-btn md-simple md-red" @click="editDetail(event.id)">Edit Details</md-button>
      </div>
      <span>
        <span style="padding: 30px">In progresss 20%</span>
        <md-button class="font-size-60 md-simple edit-btn" style="vertical-align: middle" @click="expanded = !expanded"
          ><md-icon class="font-size-60" style="font-size: 50px !important">keyboard_arrow_down</md-icon></md-button
        >
      </span>
    </div>
    <div v-if="expanded" class="my-event-item-content">
      <div class="event-info-item">
        <img :src="`${$iconURL}Event Page/event-duration.svg`" />
        <div class="info-wrapper d-flex justify-content-center flex-column">
          <div class="font-size-22">Date</div>
          <div class="font-size-16 mt-5">
            {{ $dateUtil.formatScheduleDay(event.eventStartMillis, "MMMM DD, YYYY") }} -
            {{ $dateUtil.formatScheduleDay(event.eventEndMillis, "MMMM DD, YYYY") }}
          </div>
        </div>
      </div>
      <div class="event-info-item">
        <img :src="`${$iconURL}Event Page/event-location.svg`" />
        <div class="info-wrapper d-flex justify-content-between align-center">
          <div>
            <div class="font-size-22">Location</div>
            <div class="font-size-16 mt-5">
              {{ event.location }}
            </div>
          </div>
          <div style="width: 30%">
            <img :src="getIconUrl(event.inOutDoor)" class="label-icon mr-20" />{{ event.inOutDoor }}
          </div>
        </div>
      </div>
      <div class="event-info-item">
        <img :src="`${$iconURL}Event Page/event-guest-number.svg`" />
        <div class="info-wrapper d-flex justify-content-between align-center">
          <div>
            <div class="font-size-22">Number Of Guests</div>
            <div class="font-size-16 mt-5">
              {{ event.numberOfParticipants | withComma }}
            </div>
          </div>
          <div style="width: 30%">
            <img :src="getIconUrl('guestType')" class="label-icon mr-20" />{{ event.guestType }}
          </div>
        </div>
      </div>
      <div class="event-info-item">
        <img :src="`${$iconURL}Event Page/event-type.svg`" />
        <div class="info-wrapper d-flex justify-content-between align-center">
          <div>
            <div class="font-size-22">Event type</div>
            <div class="font-size-16 mt-5">
              {{ event.eventType.name }}
            </div>
          </div>
          <div style="width: 30%">
            <img :src="getIconUrl('occasion')" class="label-icon mr-20" />{{ event.occasion }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.my-event-item {
  padding: 50px;
  margin: 20px 0;
  .my-event-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span,
    button {
      vertical-align: middle;
    }
    .event-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .my-event-item-content {
    margin-top: 20px;
  }
  .event-info-item {
    padding: 30px 0;
    border-top: solid 1px #dfdfdf;
    display: flex;
    .info-wrapper {
      margin-left: 50px;
      flex-grow: 1;
    }
  }
}
</style>
<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      expanded: false,
    };
  },
  methods: {
    editDetail(eventId) {
      this.$router.push(`/events/${eventId}/booking/overview`);
    },
    getIconUrl(name) {
      if (name === "outdoors") {
        return `${this.$secondIconURL}Event%20Page/botanical%20(1).svg`;
      } else if (name === "indoors") {
        return `${this.$iconURL}Requirements/All%20indoor.svg`;
      } else if (name === "guestType") {
        return `${this.$secondIconURL}Event%20Page/Path%204858.svg`;
      } else if (name === "occasion") {
        return `${this.$secondIconURL}Event%20Page/Path%204856.svg`;
      } else if (name === "virtual") {
        return `${this.$secondIconURL}Creation/group-11232.svg`;
      }
    },
  },
};
</script>