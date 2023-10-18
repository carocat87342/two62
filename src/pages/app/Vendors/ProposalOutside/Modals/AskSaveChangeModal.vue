<template>
  <modal container-class="modal-container w-max-600 bg-white">
    <template slot="body">
      <div class="text-left font-size-28 font-bold-extra pl-20">
        <img :src="`${$iconURL}common/email-dark.svg`" class="page-icon mr-10" />
        Pricing Change
      </div>
      <div class="my-40 pl-20 text-left">
        <p class="mb-5">You are trying to change a fixed price.</p>
        <p class="mt-0">Do you want to change the price set in profile?</p>
      </div>
      <div class="d-flex align-center">
        <md-button class="md-button md-black md-simple" @click="$emit('cancel')">Cancel</md-button>
        <md-button class="ml-auto md-simple md-vendor md-outlined " @click="$emit('save', 'profile')">Change in profile</md-button>
        <md-button class="ml-10 md-vendor" @click="$emit('save', 'once')">Only this once</md-button>
      </div>
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
  methods: {},
};
</script>
<style lang="scss" scoped>

</style>
