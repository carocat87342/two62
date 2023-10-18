<template>
  <modal class="resent-proposal-result">
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
        <img :src="`${$iconURL}VendorsProposalPage/group-17103.svg`" />
          <div class="font-size-30 font-bold mt-30 color-purple">Proposal sent successfully!</div>
        <div class="font-size-18 my-30 mt-10">To: {{to}}</div>

        <div class="mt-50 font-size-18 font-bold-extra"> You will receive a copy to your email</div>
        <!--<md-button class="md-vendor mt-20">Cool, go to dashboard</md-button>-->
      </div>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";

export default {
  components: {
    Modal,
  },
  props: {
    to: {
      type: String,
      default: "",
    },
  },
  created() {
    console.log('created');
  },
  data() {
    return {
      sharelink: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitProposal() {
      this.$emit("submit");
    },
  },
};
</script>
<style lang="scss" scoped>
.send-proposal {
    .modal-container{
        max-width: 600px;
    }


  .header-text {
    line-height: 1.5em;
  }
  .tips {
    max-width: 500px;
  }
  .type-button {
    background-color: #f3f7fd;
    cursor: pointer;
  }
}
</style>
