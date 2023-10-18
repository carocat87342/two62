<template>
  <div class="md-layout event-details-component">
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <event-overview-section
          v-for="(section, index) in sections"
          :key="index"
          :section="section"
          @change="changeEvent"
        ></event-overview-section>
      </div>
    </div>
  </div>
</template>
<script>

import EventOverviewSection from "./EventOverviewSection";

export default {
  name: "event-detail",
  components: {
    EventOverviewSection,
  },
  props: {
    event: Object,
  },
  data() {
    return {
      // auth: auth,
      sections: [],
    };
  },
  methods: {
    changeEvent(e) {
      if (e.hasOwnProperty("dateData")) {
        this.event.startTime = e.dateData.startTime;
        this.event.endTime = e.dateData.endTime;
      } else if (e.hasOwnProperty("location")) {
        this.event.location = e.location.name;
        this.event.locationId = e.location.id;
      } else if (e.hasOwnProperty("numberOfParticipants")) {
        this.event.numberOfParticipants = e.numberOfParticipants;
      } else if (e.hasOwnProperty("eventType")) {
        let eventType = this.eventTypeList.find((it) => it.name === e.eventType);
        if (!this.event.eventType) this.event.eventType = {};
        this.event.eventType.name = eventType.name;
        this.event.eventType.key = eventType.key;
        this.event.eventType.id = eventType.id;
      }
      this.$emit('change', this.event);
      this.setSection();
    },
    setSection() {

      this.sections = [
        {
           title: "Date",
           key: "date",
           img_src: `${this.$secondIconURL}Event Page/Group 8708.svg`,
           warning: "",
           startTime: this.event.startTime,
           endTime: this.event.endTime,
        },
        {
          title: "Location",
          key: "location",
          img_src: `${this.$secondIconURL}Event Page/Group 10492.svg`,
          warning: "",
          location: this.event.location,
        },
        {
          title: "Number OF Guests",
          key: "number_of_guest",
          img_src: `${this.$secondIconURL}Event Page/Group 10482.svg`,
          warning: null,
          numberOfParticipants: this.event.numberOfParticipants,
        },
        {
          title: "Event type",
          key: "event_type",
          img_src: `${this.$secondIconURL}Event Page/Group 10495.svg`,
          warning: null,
          eventType: this.event.eventType ? this.event.eventType.name : "",
        },
      ];
    },
    init() {
      this.isLoading = false;
      this.setSection();
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    event(newVal, oldVal) {
      this.$root.$emit("set-title", this.event, this.routeName === "EditBuildingBlocks", true);
      console.log('event.detail.watch', newVal);
    },
    eventTypeList(newVal) {
      this.init();
    },
  },
  computed: {
    eventTypeList() {
      return this.$store.state.common.eventTypes;
    },
  },
};
</script>
<style lang="scss">
.event-details-component {
  .title.budget {
    h4 {
      color: $purple-500;
    }
  }

  .event-details-header {
    height: 325px;
    position: relative;
    background: #fff;
    padding: 0;

    .header-detail {
      flex-grow: 1;
      margin: 0 100px 0 40px;
    }

    .header-actions {
      // position : absolute;
      // right : 2em;
      // top : 2em;
      padding: 2em 0px 0px;
      margin-right: 65px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .status-bar {
      padding: 2rem 0;

      .status-info {
        margin-left: 40%;
      }

      .description {
        .status-title {
          font-size: 16px;
          line-height: 1.31;
          text-align: center;
          color: #050505;
        }

        .status-percentage {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.29;
          text-align: center;
          color: #48c775;
        }

        .status-tasks {
          font-size: 14px;
          text-align: center;
          color: #050505;
        }
      }
    }
  }

  .align-center {
    align-items: center;
  }

  .align-self-center {
    align-self: center;
  }
}

.event-footer-container {
  position: relative;
  margin-top: 50px;
  margin-bottom: 10px;
  padding: 0;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background: white;
  font-family: "Manrope-Regular", sans-serif;
}

.multiple-selection {
  min-width: 350px;
  display: inline-block;
  margin-top: 16px;
  height: 55px;
  .multiselect__select {
    top: 15px;
  }
  .multiselect__tags {
    height: 55px;
    border: solid 0.5px #bcbcbc;

    .multiselect__single {
      line-height: 30px;
    }
    .multiselect__tags-wrap {
      display: flex;
      overflow: hidden;

      span {
        margin-right: 5px;
        flex-shrink: 0;
        font-size: 16px;
        font-family: "Manrope-regular";
      }
    }
  }

  .multiselect__content {
    z-index: 100;
  }

  .multiselect__input {
    height: 30px;
    text-transform: capitalize;
  }
  .multiselect__placeholder {
    line-height: 20px;
  }
}
</style>
