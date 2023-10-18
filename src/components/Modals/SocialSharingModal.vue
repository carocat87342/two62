<template>
  <modal class="sharing-model">
    <template slot="header">
      <div class="maryoku-modal-header text-center" style="width: 100%">
        <img :src="`${$iconURL}Share/Group+7309.svg`" class="mb-20" />
        <div class="font-size-30 font-bold text-center">Share It!</div>
        <div>Invite people to this event!</div>
      </div>
    </template>
    <template slot="body">
      <div class="md-layout maryoku-modal-body">
        <div class="md-layout-item md-size-100 form-group maryoku-field mb-30">
          <sharing-button-group
            class="sharing-button-group-wrapper"
            :copyLink="false"
            :sharingData="sharingData"
          ></sharing-button-group>
          <maryoku-input inputStyle="sharing" v-model="shareLink" readonly class="sharelink"></maryoku-input>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-red md-bold add-category-btn" @click="onCancel()">Done</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal, MaryokuInput } from "@/components";
import SharingRoleOptions from "@/components/SharingRoleOptions";
import InputTag from "vue-input-tag";
import SharingButtonGroup from "@/pages/app/Campaign/components/SharingButtonGroup.vue";

export default {
  name: "sharing-modal",
  components: {
    Modal,
    MaryokuInput,
    SharingRoleOptions,
    InputTag,
    SharingButtonGroup,
  },
  props: {
    show: [Boolean],
    value: [Number],
    defaultSharingData: Object,
  },
  data: () => {
    return {
      statusMessage: "",
      sharingData: {},
    };
  },
  created() {
    this.generateShareLink();
    this.sharingData = { ...this.defaultSharingData, pageUrl: this.generateShareLink() };
  },
  methods: {
    generateShareLink() {
      this.shareLink = window.location.href;
      return this.shareLink;
    },
    sendEmail() {
      this.$emit("sendEmail", this.editingVendor);
      this.$http
        .post(
          `${process.env.SERVER_URL}/1/eventShare`,
          {
            emails: this.emails,
            message: this.message,
            link: this.generateShareLink(),
            eventId: this.$route.params.id,
          },
          { headers: this.$auth.getAuthHeader() },
        )
        .then((res) => {
          if (res.data.status) {
            this.statusMessage = "We have sent an email to the invited users.";
          } else {
            this.statusMessage = "Something is wrong. Please try again later.";
          }
        });
    },

    onCancel: function (e) {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.maryoku-modal-body {
  padding: 0 5px;
}
.add-category-btn {
  margin-right: 20px;
}
.sharing-role {
  margin-left: 10px;
  align-items: center;
}
.email-role-button {
  border: solid 1px #ffa4bc;
  margin-left: 15px;
  border-radius: 3px;
  max-height: 56px;
}
.spacer {
  border-bottom: solid 1px #dddddd;
  width: 100%;
  margin: 30px 15px;
}
.vue-input-tag-wrapper {
  .new-tag {
    box-shadow: none !important;
  }
}
textarea {
  padding: 20px 20px !important;
  min-height: 100px !important;
}
.checkbox-wrapper {
  min-width: 165px;
  margin-left: 10px;
}
.sharing-model {
  .sharelink {
    input.sharing {
      padding-right: 60px !important;
      height: 60px;
    }
  }
  .sharing-button-group-wrapper {
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }
}
@media only screen and (max-width: 959px) {
  .sharing-model {
    .sharelink {
      input.sharing {
        padding-right: 60px !important;
        height: 60px;
      }
    }
    .sharing-button-group-wrapper {
      width: 100%;
      .sharing-button-group {
        flex-flow: wrap;
        li {
          border: none;
          width: 30%;
        }
      }
    }
  }
}
</style>