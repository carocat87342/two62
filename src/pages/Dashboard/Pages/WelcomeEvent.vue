<template>
  <div class="weclome-event-page">
    <div class="welcome-event-content white-card">
      <div class="header d-flex justify-content-between">
        <img :src="`${$iconURL}Onboarding/maryoku-logo-dark%402x%403x.png`" />
        <md-button class="md-simple edit-btn" @click="closePanel">
          <md-icon class="color-black">close</md-icon>
        </md-button>
      </div>
      <div class="title text-center">
        <img :src="`${$iconURL}common/welcome-header.png`" />
        <h1 class="font-size-50 font-bold">Welcome to your event rachel!</h1>
        <div class="summary">
          <span>Your on board summary:</span>
          <span class="font-bold summary-item">
            <img :src="`${$iconURL}common/calendar-dark.svg`" class="label-icon" />
            {{ $dateUtil.formatScheduleDay(event.eventStartMills, "MMMM DD, YYYY") }}(Flexible)</span
          >
          <span class="font-bold summary-item">
            <img :src="`${$iconURL}common/users-dark.svg`" class="label-icon" />{{
              event.numberOfParticipants | withComma
            }}
            Invited</span
          >
          <span class="font-bold summary-item">
            <img :src="`${$iconURL}common/location-dark.svg`" class="label-icon" />{{ event.location }}</span
          >
        </div>
      </div>
      <div class="text-center mt-100 font-size-22 font-bold">Explore Mayroku's Main Features</div>
      <div class="video-list mt-50">
        <div v-for="(video, index) in videos" :key="video.title" class="video-item">
          <div class="video-item-wrapper">
            <div class="video-item-title font-bold-extra">
              {{ video.title }}
            </div>
            <md-button class="md-icon-button md-red md-raised play-button" @click="playVideo(video.id)">
              <md-icon>play_arrow</md-icon>
            </md-button>
          </div>
          <img :src="video.thumbnail" />
        </div>
      </div>

      <youtube-player :videoId="selectedVideoId" v-if="openPlayer" @close="openPlayer = false"></youtube-player>
    </div>
    <div class="weclome-event-page-footer white-card">
      <md-button class="md-red maryoku-btn" @click="gotoEvent">Let's Begin</md-button>
    </div>
    <!-- <youtube video-id="BBJa32lCaaY" /> -->
  </div>
</template>
<script>
import YoutubePlayer from "@/components/YoutubePlayer.vue";
import CalendarEvent from "@/models/CalendarEvent";
export default {
  components: {
    YoutubePlayer,
  },
  data() {
    return {
      selectedVideoId: "",
      openPlayer: false,
      videos: [
        { title: "Guest Communicator", id: "Kgb4RrDsB3w", thumbnail: `${this.$storageURL}Video%20Thumbnail/Campaign%20-%20Rsvp%205.png` },
        { title: "Inspiration Board", id: "os-XRfWUkC4", thumbnail: `${this.$storageURL}Video%20Thumbnail/Concept5-1.png`  },
        { title: "Budget Wizard", id: "QIDa2Og0L1Q", thumbnail: `${this.$storageURL}thumbnails/budget.png` },
        { title: "Booking Engine", id: "TTohnW1tfy8", thumbnail: `${this.$storageURL}Video%20Thumbnail/Planning board 2.png`  },
        { title: "Event Scheduler", id: "XihWhW8eadE", thumbnail: `${this.$storageURL}Video%20Thumbnail/timeline.png`  },
        { title: "Control Panel", id: "nXQ2EwlI3jM", thumbnail: `${this.$storageURL}Video%20Thumbnail/Coose Vendor1.png`},
      ],
      event: {},
    };
  },
  mounted() {
    const eventId = localStorage.getItem("currentEventId");
    if (eventId) {
      CalendarEvent.find(eventId).then((event) => {
        this.event = event;
      });
    }
  },
  methods: {
    playVideo(id) {
      this.selectedVideoId = id;
      this.openPlayer = true;
    },
    playing() {
      console.log("o/ we are watching!!!");
    },
    gotoEvent() {
      const currentEventId = localStorage.getItem("currentEventId");
      this.$router.push({ path: `/events/${currentEventId}/booking/overview?walkWithMe=true` });
    },
    closePanel() {
      const currentEventId = localStorage.getItem("currentEventId");
      this.$router.push({ path: `/events/${currentEventId}/booking/overview` });
    },
  },
};
</script>
<style lang="scss" scoped>
.weclome-event-page {
  .welcome-event-content {
    background: linear-gradient(#fdf0f4 0%, #fdf0f4 60%, white 60%, white 100%);
    margin: 60px;
    padding: 50px;
    .summary {
      .label-icon {
        margin: 0 15px;
      }
      &-item {
        margin: 0 20px;
      }
    }
    .header {
      img {
        width: 200px;
      }
    }
    .video-list {
      text-align: center;
      max-width: 1200px;
      margin: 50px auto;
      .video-item {
        display: inline-block;
        width: 320px;
        height: 180px;
        position: relative;
        margin: 25px;
        border-radius: 5px;
        overflow: hidden;
        iframe {
          height: 100%;
          border: none;
        }
        img {
          width: 100%;
          height: 100%;
        }
        &-title {
          margin-top: 15%;
          color: white;
        }
        &-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          top: 0px;
          .play-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            i {
              font-size: 20px;
            }
          }
        }
      }
    }
  }
  &-footer {
    text-align: right;
    padding: 10px 60px;
  }
}
</style>
