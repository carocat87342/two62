<template>
  <md-card class="md-card-signup">
    <slot name="title"></slot>

    <md-card-content class="signup-card">
      <div class="md-layout">
        <slot name="content-left"></slot>
        <slot name="content-middle"></slot>
        <slot name="content-right"></slot>
      </div>
    </md-card-content>

    <md-card-actions v-if="$slots.footer" md-alignment="space-between">
      <slot name="footer" v-if="$slots.footer"></slot>
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
  name: 'signup-card'
}
</script>

<style lang="css">
  .signup-card {
    padding: 0px !important;
    overflow: hidden;
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.13);
  }
</style>
