<template>
  <div class="white-card mt-40 mb-40 rsvp-analytics">
    <collapse-panel>
      <template slot="header">
        <div class="d-flex align-center p-50">
          <div>
            <div class="font-size-30 font-bold-extra color-black">
              Let's talk numbers
              <img :src="`${$iconURL}Campaign/Group 9087.svg`" class=":" />
            </div>
          </div>
        </div>
      </template>
      <template slot="content">
        <hr />
        <div class="savedate-analytics-content p-50">
          <div>
            <div class="d-flex align-center color-dark-gray font-size-20">
              <span class="font-bold">
                Send on
                <span>{{ $dateUtil.formatScheduleDay(new Date().getTime(), "MM.DD.YY") }}</span>
              </span>
              <span class="vertical-line"></span>
              <img :src="`${$iconURL}Campaign/users-gray.svg`" style="width: 28px" />
              <img :src="`${$iconURL}Campaign/Group 9222.svg`" class="ml-20" />
              <div class="text-center ml-10" style="margin-top: 25px">
                <div class="font-size-50 font-bold font-bold color-black line-height-1">
                  {{ rsvpStatisData.rsvpCount }}
                </div>
                <div class="font-size-16">RSVP</div>
              </div>
              <div class="slash"></div>
              <div class="text-center" style="margin-top: 25px">
                <div v-if="rsvpStatisData.rsvpRequests" class="ml-20 mr-20 font-size-50 font-regular font-regular color-gray line-height-1">
                  {{ rsvpStatisData.rsvpRequests.length * (isPlusOne ? 2 : 1) }}
                </div>
                <div class="font-size-16">Invited Guests (Including +1)</div>
              </div>
              <div class="flex-1"></div>
              <md-button class="md-simple md-default md-red edit-btn">
                <img :src="`${$iconURL}Campaign/download-red.svg`" style="width: 20px; margin-right: 10px" />
                Download Rsvp Excel
              </md-button>
            </div>
            <multistate-progressbar :data="analyticsData" class="mt-40"></multistate-progressbar>
            <div class="text-center mb-50">
              <md-button class="md-simple maryoku-btn md-red md-outlined" @click="sendEmailsAgain">
                <image-icon src="Campaign/Group 1908.svg" />Send again to invitees who haven't replyed yet
              </md-button>
            </div>
          </div>
          <hr />
          <!-- <div class="d-flex mt-60 mb-20">
            <div class="flex-1">
              <div class="font-size-20 font-bold-extra d-flex align-center">
                <image-icon src="Campaign/email-dark.svg"></image-icon>Opened This Email
                <span class="vertical-line"></span>
                <span class="font-size-16 font-regular">From</span>
                <span class="font-size-30 font-weight-bold p-5">{{ numberOfEmails }}</span>
                <span class="font-size-16 font-regular">Total emails sent</span>
              </div>
              <div class="openedemails-pie-container d-flex">
                <radial-progress :percentage="openedPercentage"></radial-progress>
                <div class="ml-50 vertical-center">
                  <color-dot-label class="mb-40" color="#00bcd4">
                    <span class="font-bold">Opened</span>
                    ({{ openedCount }})
                  </color-dot-label>
                  <color-dot-label class="mb-40" color="#C4C1C1">
                    <span class="font-bold">Didn't Open</span>
                    ({{ numberOfEmails - openedCount }})
                  </color-dot-label>
                </div>
              </div>
            </div>
            <div class="flex-1 rsvp-chart">
              <div class="font-size-20 font-bold-extra d-flex align-center">
                <image-icon src="Campaign/user-plus.svg"></image-icon>Coming With Plus+
                <span class="vertical-line"></span>
                <span class="font-size-16 font-regular">From</span>
                <span class="font-size-30 font-weight-bold p-5">{{ rsvpStatisData.total }}</span>
                <span class="font-size-16 font-regular">Total RSVP</span>
              </div>
              <div class="openedemails-pie-container d-flex">
                <radial-progress
                  :percentage="(rsvpStatisData.openedCount / rsvpStatisData.total) * 100"
                  color="#ffc001"
                ></radial-progress>
                <div class="ml-50 vertical-center">
                  <color-dot-label class="mb-40" color="#ffc001">
                    <span class="font-bold">Opened</span> ({{ rsvpStatisData.openedCount }})
                  </color-dot-label>
                  <color-dot-label class="mb-40" color="#C4C1C1">
                    <span class="font-bold">Didn't Open</span> ({{ rsvpStatisData.total - rsvpStatisData.openedCount }})
                  </color-dot-label>
                </div>
              </div>
            </div>
          </div>
          <hr /> -->
          <div class="food-limitations mt-50">
            <div class="font-size-20 font-bold-extra">Food Limitations</div>
            <rsvp-food-limitations
              v-if="Object.keys(foodLimitations).length"
              :data="foodLimitations"
            ></rsvp-food-limitations>
            <div class="text-center" style="padding: 10px" v-else>Nobody replied yet.</div>
          </div>
        </div>
      </template>
    </collapse-panel>
  </div>
</template>
<style lang="scss" scoped>
.rsvp-analytics {
  .slash {
    border-left: solid 1px #a0a0a0;
    transform: rotate(25deg);
    height: 4em;
    margin: 15px 10px 0 30px;
  }
  .rsvp-chart {
    border-left: solid 1px #dfdfdf;
    width: 50%;
    padding-left: 50px;
  }
}
</style>
<script>
import CollapsePanel from "../CollapsePanel";
import RadialProgress from "@/components/ProgressBar/Radial";
import ColorDotLabel from "@/components/ColorDotLabel";
import ImageIcon from "@/components/ImageIcon";
import MultistateProgressbar from "./MultiState";
import RsvpFoodLimitations from "./RSVPFoodLimitations";
export default {
  components: {
    CollapsePanel,
    RadialProgress,
    ColorDotLabel,
    ImageIcon,
    MultistateProgressbar,
    RsvpFoodLimitations,
  },

  data() {
    return {
      campaignData: {},
      rsvpStatisData: {
        total: 0,
        openedCount: 0,
      },
      analyticsData: [
        { value: 0, label: "Yes", color: "#2cde6b", list: [], category: "accepted" },
        { value: 0, label: "No", color: "#f3423a", list: [], category: "rejected" },
        { value: 0, label: "Don't know yet", color: "#ffc001", list: [], category: "considering" },
        { value: 0, label: "Online Participants", color: "#43536a", list: [], category: "online" },
        { value: 0, label: "No reply", color: "#cbc8c8", list: [], category: "noreply" },
      ],
      foodLimitations: [
        {
          value: 26,
          label: "Vegetarian",
          icon: "RSVP/milk.svg",
          color: "#2cde6b",
        },
        {
          value: 6,
          label: "Vegan",
          icon: "RSVP/food+(4).svg",
          color: "#f3423a",
        },
        { value: 13, label: "Milk", icon: "RSVP/kosher.svg", color: "#ffc001" },
        {
          value: 2,
          label: "Kosher",
          icon: "RSVP/food+(2).svg",
          color: "#43536a",
        },
        {
          value: 6,
          label: "Halal",
          icon: "RSVP/spiritual.svg",
          color: "#cbc8c8",
        },
        { value: 2, label: "Other", icon: "", color: "#cbc8c8" },
      ],
      timer: null,
    };
  },
  created() {
    this.campaignData = this.$store.state.campaign["RSVP"];
    const totalEmailCount = this.campaignData.guestEmails.length;
    let openedEmails = 0;
    this.campaignData.guestEmails.forEach((item) => {
      if (item.isOpened) {
        openedEmails++;
      }
    });
    this.percentage = Math.round((openedEmails / totalEmailCount) * 100);
    this.getAnalyzingData();
    this.timer = setInterval(() => {
      this.getAnalyzingData();
    }, 5000);
  },
  methods: {
    sendEmailsAgain() {
      this.$http
        .get(`${process.env.SERVER_URL}/1/campaigns/remind/${this.campaignData.id}`, {
          headers: this.$auth.getAuthHeader(),
        })
        .then((response) => response.data)
        .then((json) => {
          Swal.fire({
            title: `We sent reminder emails to guests who didn't reply yet.`,
            buttonsStyling: false,
            type: "success",
            confirmButtonClass: "md-button md-success",
          });
        });
    },
    getAnalyzingData() {
      this.$http.get(`${process.env.SERVER_URL}/1/rsvp-requests/statistics/${this.campaignData.id}`).then((res) => {
        this.rsvpStatisData = res.data;
        this.analyticsData[0].list = this.rsvpStatisData.guests;
        this.analyticsData[1].list = this.rsvpStatisData.rsvpRequests.filter((item) => item.status == "REJECTED");
        this.analyticsData[2].list = this.rsvpStatisData.rsvpRequests.filter((item) => item.status == "CONSIDERED");
        this.analyticsData[3].list = this.rsvpStatisData.rsvpRequests.filter((item) => item.status == "VIRTUAL");
        this.analyticsData[4].list = this.rsvpStatisData.rsvpRequests.filter((item) => item.status == "REQUESTED");
        this.foodLimitations = res.data.limitations;
      });
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
  computed: {
    numberOfEmails() {
      return this.campaignData.guestEmails ? this.campaignData.guestEmails.length : 0;
    },
    openedCount() {
      let openedEmails = 0;
      this.campaignData.guestEmails.forEach((item) => {
        if (item.isOpened) {
          openedEmails++;
        }
      });
      return openedEmails;
    },
    openedPercentage() {
      return Math.round((this.openedCount / this.numberOfEmails) * 100);
    },
    isPlusOne() {
      if ("isPlusOne" in this.$store.state.event) {
        return this.$store.state.event.isPlusOne;
      } else {
        return (
          this.$store.state.event.guestType === "employees-spouses" || this.$store.state.event.guestType === "families"
        );
      }
    },
  },
};
</script>
