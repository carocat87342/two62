<template>
  <modal class="sharing-model">
    <template slot="header">
      <div class="maryoku-modal-header">
        <h2 v-if="page === 'event'">Share 'Venue Proposals' With Your Colleague</h2>
        <h2 v-if="page === 'proposal'">Share 'Proposal' With Your Colleague</h2>
      </div>
        <md-button
            class="md-simple md-icon-button position-absolute md-small-hide"
            style="top: 20px;right:20px"
            @click="$emit('cancel')"
        >
            <md-icon>close</md-icon>
        </md-button>
    </template>
    <template slot="body">
      <div class="md-layout maryoku-modal-body">
        <div class="md-layout-item md-size-100 form-group maryoku-field mb-30">
          <label class="font-size-16 font-bold-extra color-black mt-40">Link sharing on</label>
          <div class="d-flex align-center mt-10 mb-10">
            <span style="padding-bottom: 5px">Anyone with this link </span>
            <div v-if="page === 'event'" class="sharing-role">
              <md-button class="md-simple md-red edit-btn" @click="showLinkRoleEditor = !showLinkRoleEditor">
                Can {{ role }}
                <md-icon v-if="showLinkRoleEditor">keyboard_arrow_down</md-icon>
                <md-icon v-else>keyboard_arrow_right</md-icon>
              </md-button>
              <sharing-role-options v-if="showLinkRoleEditor" @change="setRole" :value="role"></sharing-role-options>
            </div>
          </div>
          <maryoku-input inputStyle="sharing" v-model="shareLink" readonly class="sharelink"></maryoku-input>
        </div>
        <div class="spacer"></div>
        <div class="md-layout-item md-size-100 form-group maryoku-field mb-30">
          <label class="font-size-16 font-bold-extra color-black">Invite People</label>
          <div class="mt-10 mb-10">Email Address</div>
          <div class="d-flex">
            <!-- <maryoku-input class="flex-1" inputStyle="email" type="email" v-model="editingVendor.vendorMainEmail"></maryoku-input> -->
            <input-tag v-model="emails" class="flex-1"></input-tag>
            <div v-if="page === 'event'" class="email-role-button">
              <md-button
                class="md-simple md-red role-editor"
                @click="showEmailRoleEditor = !showEmailRoleEditor"
                :disabled="emails.length == 0"
              >
                <img data-v-a76b6a56="" :src="`${this.$iconURL}Share/edit-red.svg`" width="20" />
                <md-icon v-if="showEmailRoleEditor">keyboard_arrow_down</md-icon>
                <md-icon v-else>keyboard_arrow_right</md-icon>
              </md-button>
              <sharing-role-options v-if="showEmailRoleEditor" align="right"></sharing-role-options>
            </div>
          </div>
          <div v-if="emails.length > 0">
            <div class="form-group mt-4">
              <textarea rows="8" class="form-control" placeholder="Add message" v-model="message"></textarea>
            </div>
            <div class="d-flex align-center justify-content-between">
              <div>
                <strong>Shared with: </strong> <span v-for="(email, idx) in emails" :key="email">{{ email }} {{idx < emails.length - 1 ? ',' : ''}} </span>
              </div>
              <div class="checkbox-wrapper"><md-checkbox v-model="isSendingMessage">Send message</md-checkbox></div>
            </div>
          </div>
          <div>
            {{ statusMessage }}
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <template v-if="emails.length > 0">
        <md-button class="md-button md-black md-simple add-category-btn" @click="onCancel()">Cancel</md-button>
        <md-button class="md-red md-bold add-category-btn" @click="sendEmail">Send</md-button>
      </template>
      <template v-else>
        <md-button class="md-black" @click="onCancel()">Done</md-button>
      </template>
    </template>
  </modal>
</template>

<script>
import { Modal, MaryokuInput } from "@/components";
import SharingRoleOptions from "@/components/SharingRoleOptions";
import InputTag from "vue-input-tag";

export default {
  name: "sharing-modal",
  components: {
    Modal,
    MaryokuInput,
    SharingRoleOptions,
    InputTag,
  },
  props: {
    page: {
      type: String,
      default: 'event',
    },
    show: [Boolean],
    value: [Number],
  },
  data: () => {
    return {
      selectedOption: "keep",
      location: "",
      currentAttachments: [],
      emails: [],
      message: "",
      isLoading: false,
      showLinkRoleEditor: false,
      showEmailRoleEditor: false,
      isSendingMessage: false,
      shareLink: "",
      role: "view",
      editingVendor: {
        vendorDisplayName: "",
        cost: "",
        vendorAddressLine1: "",
        vendorMainPhoneNumber: "",
        vendorMainEmail: "",
        attachedProposal: "",
        attachment: null,
      },
      statusMessage: "",
    };
  },
  created() {
    console.log('sharing.modal.created', this.page);
    this.generateShareLink();
  },
  methods: {
    generateShareLink() {
      const tenantId = this.$authService.resolveTenantId();
      if (this.page === 'event') {
          this.shareLink = `${this.$authService.getAppUrl(tenantId)}/#/signup?invite=true&role=${this.role}&event=${
              this.$route.params.id
          }`;
      } else if(this.page === 'proposal') {
          this.shareLink = `${location.protocol}//${location.host}/#/unregistered/proposals/${this.$route.params.proposalId}`
      }
      return this.shareLink;
    },
    selectOption() {
      this.$emit("select", this.selectedOption, this.value);
    },
    remindLater() {
      this.$emit("remindLater");
    },
    removeSelectedAttachment(index) {},
    sendEmail() {

      if (!this.isSendingMessage) return

      let params = {page: this.page};
      if (this.page === 'event') {

          params.emails = this.emails;
          params.message = this.message;
          params.link = this.generateShareLink();
          params.eventId = this.$route.params.id;

      } else if(this.page === 'proposal') {
          params.emails = this.emails;
          params.proposalId = this.$route.params.proposalId;
      }

      this.$emit('share', params);
    },

    onCancel: function (e) {
      this.$emit("cancel");
    },
    setRole(role) {
      this.role = role;
      this.showLinkRoleEditor = false;
      this.generateShareLink();
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
}
</style>
