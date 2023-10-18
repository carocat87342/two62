<template>
  <div class="event-wizard-vibes">
    <div class="container">
      <div class="title">5/5</div>
      <div class="event-basic-info">
        <div class="text-center mt-2">Here is a fun question for you,</div>
        <div class="setting-title mt-2">Try describing your guest’s vibes using a song</div>
        <div class="mt-3 types">
          <music-card
            :class="{ selected: song.id == selectedSong.id }"
            v-for="song in songs"
            :key="song.id"
            :data="song"
            :selected="song.id == selectedSong.id"
            @select="selectSong"
          >
          </music-card>
        </div>
      </div>
    </div>
    <wizard-status-bar :currentStep="5" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
  </div>
</template>

<script>
import GoBack from "./componenets/GoBack";
import SelectedValue from "./componenets/SelectedValue";
import WizardStatusBar from "./componenets/WizardStatusBar";
import MusicCard from "./componenets/MusicCard";
import { MaryokuInput } from "@/components";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import Swal from "sweetalert2";
import eventService from "@/services/event.service";
export default {
  components: {
    GoBack,
    SelectedValue,
    WizardStatusBar,
    MaryokuInput,
    MusicCard,
  },
  beforeCreate() {
    const savedEvent = JSON.parse(localStorage.getItem("event"));
    if (savedEvent) {
      eventService
        .saveEvent(savedEvent)
        .then((newEvent) => {
          localStorage.setItem("currentEventId", newEvent.id);
          localStorage.removeItem("event");
          if (newEvent.isFirstEvent) {
            this.$router.push({ path: `/welcome/event` });
          } else {
            this.$router.push({ path: `/events/${newEvent.id}/booking/concept` });
          }
        })
        .catch((err) => {});
    }
  },
  created() {
    this.$http.get(`${process.env.SERVER_URL}/1/eventSongs`).then((res) => {
      this.songs = res.data;
    });
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setCurrentStep"]),
    validateDate() {
      return this.$refs.datePicker.$el.classList.contains("md-has-value");
    },
    validateAndSubmit() {
      // this.$emit('goToNextPage');
      //  return;
      let vm = this;

      this.cerrors = {};
      this.validating = true;

      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          // this.$parent.isLoading = true;

          if (this.eventId) {
            vm.updateEvent();
          } else {
            vm.createEvent();
          }
        } else {
          this.showNotify();
        }
      });

      if (!this.eventType) {
      } else {
        // this.$emit('goToNextPage');
      }
    },
    showNotify() {
      this.$notify({
        message: "Please, check all required fields",
        icon: "warning",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "danger",
      });
    },
    goToNext() {
      this.setEventProperty({ key: "eventSongId", actualValue: this.selectedSong.id });
      localStorage.setItem("event", JSON.stringify(this.getEventData()));
      // location.href="https://www.maryoku.com/signup-beta"  //tempary code
      // return;

      console.log(location.href);
      if (!this.isLoggedIn) {
        this.$router.push({ path: `/signin?lastUrl=${btoa(location.href)}&action=${this.$queryEventActions.planner}` });
      } else {
        this.createEvent();
      }
    },
    getEventData() {
      return new CalendarEvent({
        ...this.publicEventData,
        calendar: this.defaultCalendar,
        budgetPerPerson: 0,
        totalBudget: 0,
        status: "draft",
        currency: "USD",
        eventType: this.publicEventData.eventType.id,
        category: "Holidays", //! this.publicEventData.editable ? 'Holidays' : 'CompanyDays',
        editable: true,
      });
    },
    createEvent() {
      const tenantId = this.$authService.resolveTenantId();
      if (tenantId.toLowerCase() === "default" || !this.tenantUser.tenants.includes(tenantId)) {
        localStorage.setItem("event", JSON.stringify(this.getEventData()));
        this.$router.push({ path: `/create-workspace` });
      } else {
        const eventData = this.getEventData();
        eventService
          .saveEvent(eventData)
          .then((newEvent) => {
            localStorage.setItem("currentEventId", newEvent.id);
            if (newEvent.isFirstEvent) {
              this.$router.push({ path: `/welcome/event` });
            } else {
              this.$router.push({ path: `/events/${newEvent.id}/booking/concept` });
            }
          })
          .catch((err) => {
            Swal.fire({
              title: `<div style="text-align:center; width:100%;">Sorry, Some informations are invalid. <br/> Please check your information. </div>`,
              buttonsStyling: false,
              icon: "warning",
              confirmButtonClass: "md-button md-success",
            });
            console.log(err);
          });
      }
    },
    skip() {
      this.$router.push({ path: `/signup?action=${this.$queryEventActions.planner}` });
    },
    back() {
      if (this.publicEventData.religion) {
        this.$router.push({ path: `/event-wizard-religion` });
      } else if (this.publicEventData.occasion) {
        this.$router.push({ path: `/event-wizard-celebrating` });
      } else {
        this.$router.push({ path: `/event-wizard-type` });
      }
    },
    selectSong(song) {
      this.selectedSong = song;
    },
  },
  data() {
    return {
      selectedSong: {},
      songs: [],
    };
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData"]),
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    tenantUser() {
      return this.$store.state.auth.user;
    },
  },
};
</script>
<style lang="scss">
.event-basic-info {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  min-height: 440px;
}

.event-wizard-vibes {
  .md-checkbox-circle {
    margin: 0px;
  }
  .input-name {
    width: 80%;
    text-align: right;
    .form-input {
      width: 280px;
      margin: 0 0 0 auto;
      display: inline-block;
    }
  }
  .indicator-reverse {
    transform: scaleX(-1);
    margin-left: 20px;
  }
}
</style>
