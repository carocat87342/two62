<template>
  <modal class="timeline-gap-modal">
    <template slot="header">
      <div class="font-size-30 font-bold line-height-1">Thank you for your payment</div>
    </template>
    <template slot="body">
      <div class="timeline-gap-modal-body">
        Your payment has been received and will be held in escrow until the event is completed successfully. Assuming
        there are no disputes, we will pay the vendor 7 days after the event.
      </div>
    </template>
    <template slot="footer"> </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import moment from "moment";

export default {
  components: {
    Modal,
  },

  methods: {},
  computed: {},
};
</script>
<style lang="scss" scoped>
</style>