<template>
  <modal class="share-proposal">
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
        <img :src="`${$iconURL}VendorsProposalPage/group-17103.svg`" />
          <div class="font-size-30 font-bold mt-30 color-purple">Share</div>
        <div class="font-size-14 my-30">{{`Share proposal by copying the link`}}</div>

        <maryoku-input inputStyle="sharing" v-model="link" theme="purple"></maryoku-input>

      </div>
    </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";

export default {
  components: {
    Modal,
    MaryokuInput,
  },
  props: {
    link: {
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
