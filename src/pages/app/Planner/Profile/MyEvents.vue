<template>
  <div class="profile-my-events white-card">
    <div class="title profile-title font-size-30 font-bold-extra d-flex justify-content-between align-center">
      <span> <img :src="`${$iconURL}Planner Profile/group-9901.svg`" class="mr-10" />My Events</span>
      <md-button class="md-simple md-outlined md-red maryoku-btn" @click="createNewEvent">Create New Event</md-button>
    </div>
    <div>
      <my-event-item v-for="event in myEvents" :key="event.id" :event="event"></my-event-item>
    </div>
  </div>
</template>

<script>
import { Collapse } from "@/components";
import EventDetails from "./EventDetails";
import CalendarEvent from "@/models/CalendarEvent";
import VueElementLoading from "vue-element-loading";
import MyEventItem from "./components/MyEventItem.vue";
export default {
  components: {
    Collapse,
    EventDetails,
    VueElementLoading,
    MyEventItem,
  },
  data() {
    return {
      isLoading: true,
      myEvents: [],
      eventLocation: "",
      eventDate: "",
      eventDressCode: "",
      emptyEvents: "",
      eventTitleFromCollaps: "",
    };
  },
  props: {
    userInfo: Object,
  },
  mounted() {
    if (!this.userInfo) {
      this.isLoading = true;
    } else {
      this.events = this.userInfo.myEvents || [];
      this.isLoading = false;
      console.log(this.events);
      console.log(JSON.stringify(this.events, null, 4));
    }
    let filters = {
      filters: {
        myEvents: true,
      },
    };
    this.$http
      .get(`${process.env.SERVER_URL}/1/events`, {
        params: filters,
      })
      .then((response) => {
        this.myEvents = response.data;
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  methods: {
    createNewEvent() {
      this.$router.push("/create-event-wizard");
    },
  },
};
</script>

<style lang="scss">
.profile-my-events {
  padding: 60px;
}
.title-My-Events {
  width: 81px;
  height: 18px;
  font-family: Roboto;
  font-size: 18px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: var(--slate);
  padding-top: 20px;
}

.header-icon-myEvents {
  width: 63px;
  height: 64px;
  border-radius: 3px;
  box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
  background-image: linear-gradient(to right, #ffa625, #fb8d02), linear-gradient(to top, #000000, #ffffff);
}

.my-event {
  width: 513px;
  height: 842px;
  border-radius: 6px;
  // box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.14);
  // background-color: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px;
  margin: 0px;
}
</style>
