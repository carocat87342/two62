<template>
  <div class="event-modal event_publish-modal">
    <div class="md-layout">
      <modal v-if="publishEventModal">
        <template slot="header">
          <div class="md-layout d-flex items-left">
            <h4 class="clear-margins">Publish Event</h4>
          </div>
          <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body">
          <div class="md-layout clear-margins">
            <div class="md-layout-item md-size-100">
              <h5 class="text-left clear-margins">Copy this link and send it to your event participants</h5>
            </div>
            <div class="md-layout-item md-size-100 clear-margins">
              <div class="md-layout">
                <div class="md-layout-item md-size-85">
                  <md-field v-if="event">
                    <md-input
                      v-model="publishUrl"
                      :value="publishUrl"
                      id="event-link"
                      v-focus
                      ref="publishUrlInput"
                    ></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-10 text-left" style="white-space: nowrap">
                  <md-button
                    style="top: 30%"
                    :disabled="copyDone"
                    class="md-success md-xs md-just-icon"
                    @click="copyLink"
                  >
                    <md-icon v-if="!copyDone">assignment</md-icon>
                    <md-icon v-if="copyDone">check</md-icon>
                    <md-tooltip>Copy to clipboard</md-tooltip>
                  </md-button>
                  <md-button
                    style="top: 30%"
                    :disabled="copyDone"
                    class="md-info md-xs md-just-icon"
                    @click="openInNewTab"
                  >
                    <md-icon>open_in_new</md-icon>
                    <md-tooltip>Open in a new tab</md-tooltip>
                  </md-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template slot="footer"> </template>
      </modal>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import { Modal } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";

export default {
  components: {
    Modal,
  },
  props: {
    event: Object,
  },
  data: () => ({
    // auth: auth,
    publishUrl: "",
    copyDone: false,
  }),

  created() {},
  mounted() {},
  methods: {
    ...mapMutations("EventPlannerVuex", ["setPublishEventModal"]),
    closeModal() {
      this.setPublishEventModal({ showModal: false });
    },
    copyLink() {
      let testingCodeToCopy = document.querySelector("#event-link");
      testingCodeToCopy.setAttribute("type", "text");
      testingCodeToCopy.select();

      try {
        var successful = document.execCommand("copy");
        if (successful) {
          this.copyDone = true;
          setTimeout(() => {
            this.copyDone = false;
          }, 2500);
        }
      } catch (err) {
        // alert('Oops, unable to copy');
      }
    },
    openInNewTab() {
      window.open(this.publishUrl, "_blank");
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["publishEventModal"]),
  },
  watch: {
    event(newVal, oldVal) {
      this.publishUrl = `${document.location.protocol}//${document.location.hostname}${
        document.location.port ? ":" + document.location.port : ""
      }/#/events/${this.event.id}/public`;
    },
    publishEventModal(newVal, oldVal) {
      if (newVal) {
        let that = this;
        setTimeout(() => {
          let testingCodeToSelect = document.querySelector("#event-link");
          testingCodeToSelect.select();
        }, 100);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";

.modal-container {
  max-width: 50% !important;
}
.md-tooltip {
  z-index: 9999 !important;
  background: $purple-500 !important;
  color: $white !important;

  &[x-placement="top"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="bottom"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="right"]:after {
    border-bottom-color: $purple-500 !important;
  }

  &[x-placement="left"]:after {
    border-bottom-color: $purple-500 !important;
  }
}
</style>
