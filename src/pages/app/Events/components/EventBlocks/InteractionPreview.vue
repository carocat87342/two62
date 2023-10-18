<template>
  <div class="md-layout interaction-preview">
    <div class="md-layout-item">
      <md-card style="min-height: 50%;">
        <md-card-header class="md-card-header-text md-card-header-warning">
          <div class="card-text">
            <h4 class="title" style="color: white;">
              {{interactionData.title}}
              <small style="display: block;">Preview</small>
            </h4>
          </div>
          <md-button
            class="md-success md-sm pull-right"
            style="margin: 16px 6px;"
            @click="saveInteraction"
            :disabled="working"
          >Save</md-button>
          <md-button
            class="md-info md-sm pull-right"
            style="margin: 16px 6px;"
            @click="saveInteraction"
            :disabled="working"
          >Send Test Mail</md-button>
        </md-card-header>
        <md-card-content>
          <vue-element-loading :active="working" spinner="ring" color="#FF547C" />
          <div class="md-layout" style="margin: 0;">
            <div class="md-layout-item md-size-100" style="margin-bottom: 24px;">
              <div class="title">Select Image for your interaction</div>
              <div class="interaction-options-list">
                <img
                  :src="`https://static-maryoku.s3.amazonaws.com/storage/img/interactions/${image}.png`"
                  class="interaction-option-image"
                  :class="{'selected':selectedTemplateId===image}"
                  v-for="(image,index) in interactionData.options"
                  @click="selectTemplateImage(image)"
                />
              </div>
            </div>

            <div class="md-layout-item text-center md-size-50">
              <iframe
                id="kfrm"
                style="border: 1px solid lightgrey; border-radius: 5px; width: 20vmax; height: 20vmax; margin-left: auto; margin-right: auto;"
              ></iframe>
            </div>
            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Title</label>
                <md-input
                  v-model="interactionData.line1"
                  data-vv-name="line1"
                  v-focus
                  @keyup.native="updatePreview(interactionData)"
                />
              </md-field>
              <md-field>
                <label>Date</label>
                <md-input
                  v-model="interactionData.line2"
                  data-vv-name="line2"
                  @keyup.native="updatePreview(interactionData)"
                />
              </md-field>
              <md-field>
                <label>Your message</label>
                <md-input
                  v-model="interactionData.line3"
                  data-vv-name="line3"
                  @keyup.native="updatePreview(interactionData)"
                />
              </md-field>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>
import EventInteraction from "@/models/EventInteraction";
import Calendar from "@/models/Calendar";

export default {
  name: "interaction-preview",
  props: {
    eventData: {
      type: Object,
      default: () => {
        return { title: "" };
      },
    },
    interactionData: {
      type: Object,
      default: () => {
        return { title: "" };
      },
    },
  },
  data() {
    return {
      selectedTemplateId: "interaction-1",
      working: true,
    };
  },
  mounted() {},
  methods: {
    updatePreview(val) {
      var ifrm = document.getElementById("kfrm");
      if (ifrm && val) {
        ifrm = ifrm.contentWindow
          ? ifrm.contentWindow
          : ifrm.contentDocument.document
          ? ifrm.contentDocument.document
          : ifrm.contentDocument;

        if (ifrm) {
          this.$http
            .get(
              `https://static-maryoku.s3.amazonaws.com/storage/img/interactions/${
                val.templateImage || val.options[0]
              }.html`,
            )
            .then((res) => {
              let content = res.data;
              content = content.replace("{{{line1}}}", val.line1);
              content = content.replace("{{{line2}}}", val.line2);
              content = content.replace("{{{line3}}}", val.line3);
              content = content.replace("{{{button}}}", "");
              ifrm.document.open();
              ifrm.document.write(content);
              ifrm.document.close();

              this.working = false;
            });
        }
      }
    },
    selectTemplateImage(templateId) {
      this.interactionData.templateImage = templateId;
      this.selectedTemplateId = templateId;
      this.updatePreview(this.interactionData);
    },
    saveInteraction() {
      console.log(JSON.stringify(this.interactionData));
      this.working = true;
      new EventInteraction(this.interactionData)
        .for(
          new Calendar({ id: this.$auth.user.defaultCalendarId }),
          this.eventData,
        )
        .save()
        .then((res) => {
          this.working = false;
        })
        .catch((e) => {
          console.error(e);
          this.working = false;
        });
    },
  },
  watch: {
    interactionData(newVal, oldVal) {
      this.working = true;
      setTimeout(() => {
        if (newVal) {
          this.selectedTemplateId = newVal.templateImage || "interaction-1";
          this.updatePreview(newVal);
        }
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
