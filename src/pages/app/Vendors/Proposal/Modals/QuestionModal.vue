<template>
  <modal class="sharing-model">
    <template slot="header">
      <div class="maryoku-modal-header">
        <h2>
          <img :src="`${$iconURL}common/email-dark.svg`" class="page-icon mr-10" />
          Ask the planner any questions you have!
        </h2>
        <div>We will make sure she will get back to you as soon as possible</div>
      </div>
    </template>
    <template slot="body">
      <div class="md-layout maryoku-modal-body">
        <div class="md-layout-item md-size-100 form-group maryoku-field mb-30">
          <textarea v-model="message" placeholder="Type your message here..." rows="10"></textarea>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-button md-black md-simple add-category-btn" @click="onCancel()">Cancel</md-button>
      <md-button class="md-vendor md-bold add-category-btn" @click="sendQuestion">Send</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal, MaryokuInput } from "@/components";

export default {
  name: "question-modal",
  components: {
    Modal,
  },
  props: {
    show: [Boolean],
    value: [Number],
  },
  data: () => {
    return {
      message: "",
    };
  },
  created() {},
  methods: {
    sendQuestion() {
      this.$emit("send", this.message);
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
}
</style>
