<template>
  <div class="manage-groups-panel">
    <div class="md-layout" style="max-height: 100vh">
      <div class="md-layout-item md-size-100 preview-section">
        <h4 class="section-title">
          <b>Edit {{ selectedInteraction.title }} Design</b>
        </h4>

        <div
          class="preview-item"
          :style="`background-image: url(https://static-maryoku.s3.amazonaws.com/storage/img/interactions/${selectedInteraction.templateImage}.png)`"
        >
          <!--<iframe src="https://static-maryoku.s3.amazonaws.com/storage/img/interactions/interaction-1.html"></iframe>-->

          <h2 class="interaction-title">{{ selectedInteraction.line1 }}</h2>
          <h4 class="interaction-date">{{ selectedInteraction.line2 }}</h4>
          <p class="interaction-desc">{{ selectedInteraction.line3 }}</p>
        </div>

        <div class="interaction-images md-layout-item md-size-100">
          <h4>Select Image for your interaction</h4>
          <ul class="images-list">
            <li
              class="list-item"
              v-for="(image, index) in selectedInteraction.options"
              @click="selectTemplateImage(image)"
            >
              <div
                class="image-item"
                :style="`background-image: url(https://static-maryoku.s3.amazonaws.com/storage/img/interactions/${image}.png)`"
                :class="{ selected: selectedInteraction.templateImage === image }"
              ></div>
            </li>
          </ul>
        </div>

        <md-field>
          <label>Title</label>
          <md-input v-model="selectedInteraction.line1" type="text"></md-input>
        </md-field>
        <md-field>
          <label>Date</label>
          <md-input v-model="selectedInteraction.line2" type="text"></md-input>
        </md-field>
        <md-field>
          <label>Your Message</label>
          <md-textarea v-model="selectedInteraction.line3" type="text"></md-textarea>
        </md-field>
        <md-button
          name="event-planner-tab-invitees-management-interaction-save"
          class="event-planner-tab-invitees-management-interaction-save md-success pull-right"
          @click="editInteractionDesign()"
          >Save</md-button
        >
      </div>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import EventPageHeaderImage from "@/models/EventPageHeaderImage";
import { Modal, LabelEdit } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import EventInviteeGroup from "@/models/EventInviteeGroup";
import EventInvitee from "@/models/EventInvitee";

import EventInteraction from "@/models/EventInteraction";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import _ from "underscore";

export default {
  components: {
    LabelEdit,
  },
  props: {
    event: Object,
    selectedInteraction: Object,
  },
  data: () => ({
    auth: auth,
  }),

  created() {},
  mounted() {
    if (!this.selectedInteraction.templateImage) {
      // alert(JSON.stringify(this.selectedInteraction.options[3]));
      this.selectTemplateImage(this.selectedInteraction.options[2]);
    }
  },
  methods: {
    cancel() {
      this.adding = false;
    },
    editInteractionDesign() {
      this.$parent.isLoading = true;

      // Edit event interaction
      let interaction = new EventInteraction({
        id: this.selectedInteraction.hashed_id,
      });

      interaction.templateId = this.selectedInteraction.id;
      interaction.line1 = this.selectedInteraction.line1;
      interaction.line2 = this.selectedInteraction.line2;
      interaction.line3 = this.selectedInteraction.line3;
      interaction.templateImage = this.selectedInteraction.templateImage;

      interaction.event = { id: this.event.id };

      interaction
        .save()
        .then((resp) => {
          this.$parent.isLoading = false;

          this.$notify({
            message: "Changes saved successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
          this.$emit("closePanel", {});
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectTemplateImage(image) {
      this.selectedInteraction.templateImage = image;
      console.log(this.selectedInteraction.templateImage);
      this.$forceUpdate();
    },
    getEventStartInMillis(sendDate) {
      let eventStartTime = new Date(sendDate).getTime();
      return eventStartTime;
    },
  },
  computed: {},
};
</script>
<style lang="scss" scope>
.md-datepicker {
  .md-icon.md-date-icon {
    display: none;
    & ~ label {
      left: 0;
    }
  }
  input {
    margin-left: 0 !important;
  }
  &.md-field::before,
  &.md-field::after {
    width: 100%;
  }
}

.md-field > .md-icon ~ .md-input {
  margin: 0;
}
</style>
<style lang="scss">
.modal-z-index {
  z-index: 5;
}

.large-z-index {
  z-index: 6;
  position: relative;
}

.move-center {
  margin: 0 auto !important;
}

.move-left {
  margin-left: 0 !important;
  margin-right: auto !important;
}

.move-right {
  margin-right: 0 !important;
  margin-left: auto !important;
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.items-center-v {
  align-items: center;
}

.items-center-g {
  justify-content: center;
}

.justify-beetwen {
  justify-content: space-between;
}

.md-field .md-error {
  text-align: left;
}

.swal2-container {
  z-index: 10000;
}
</style>
