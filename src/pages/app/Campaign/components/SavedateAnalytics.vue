<template>
  <div class="white-card mt-40 mb-40 delivery-setting">
    <collapse-panel>
      <template slot="header">
        <div class="d-flex align-center p-50">
          <div>
            <div class="font-size-30 font-bold-extra color-black">Analytics</div>
          </div>
        </div>
      </template>
      <template slot="content">
        <hr />
        <div class="savedate-analytics-content p-50">
          <div class="d-flex align-center color-dark-gray font-size-20">
            <span class="font-bold">
              Send on
              <span>{{ $dateUtil.formatScheduleDay(new Date().getTime(), "MM.DD.YY") }}</span>
            </span>
            <span class="vertical-line"></span>
            <img :src="`${$iconURL}Campaign/email-gray.svg`" style="width: 28px" />
            <span class="ml-20 mr-20 font-size-30 font-bold font-bold color-black">{{ numberOfEmails }}</span>
            Total emails sent
          </div>
          <div class="font-size-20 font-bold-extra mt-60 mb-20">Opened This Email</div>
          <div class="openedemails-pie-container d-flex">
            <radial-progress :percentage="percentage"></radial-progress>
            <div class="ml-50">
              <div>
                <color-dot-label class="mb-40" color="#00bcd4">
                  <span class="font-bold">Opened</span>
                  ({{ openedCount }})
                </color-dot-label>
                <color-dot-label class="mb-40" color="#C4C1C1">
                  <span class="font-bold">Didn't Open</span>
                  ({{ numberOfEmails - openedCount }})
                </color-dot-label>
              </div>
              <md-button class="md-simple md-red maryoku-btn md-outlined" @click="sendEmailsAgain"
                >Send again</md-button
              >
              <div class="mt-10">Send to invitees who haven't opened this email</div>
            </div>
          </div>
        </div>
      </template>
    </collapse-panel>
  </div>
</template>
<script>
import CollapsePanel from "../CollapsePanel";
import RadialProgress from "@/components/ProgressBar/Radial";
import ColorDotLabel from "@/components/ColorDotLabel";
export default {
  components: {
    CollapsePanel,
    RadialProgress,
    ColorDotLabel,
  },
  data() {
    return {
      campaignData: {},
      percentage: 90,
    };
  },
  created() {
    this.campaignData = this.$store.state.campaign["SAVING_DATE"];
    const totalEmailCount = this.campaignData.guestEmails.length;
    let openedEmails = 0;
    if (this.campaignData.guestEmails) {
      this.campaignData.guestEmails.forEach((item) => {
        if (item.isOpened) {
          openedEmails++;
        }
      });
    }
    this.percentage = Math.round((openedEmails / totalEmailCount) * 100);
  },
  computed: {
    numberOfEmails() {
      return this.campaignData.guestEmails ? this.campaignData.guestEmails.length : 0;
    },
    openedCount() {
      let openedEmails = 0;
      if (this.campaignData.guestEmails) {
        this.campaignData.guestEmails.forEach((item) => {
          if (item.status == "opened") {
            openedEmails++;
          }
        });
      }
      return openedEmails;
    },
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
            title: `We sent reminder emails to guests who didn't open emails.`,
            buttonsStyling: false,
            type: "success",
            confirmButtonClass: "md-button md-success",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>