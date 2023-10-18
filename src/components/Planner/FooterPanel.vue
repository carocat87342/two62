<template>
  <div class="planner-footer-panel">
    <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
      <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
    </md-button>
    <div class="planner-footer-panel-content d-flex">
      <slot name="buttons"> </slot>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.planner-footer-panel {
  position: fixed;
  bottom: 0;
  z-index: 10;
  height: 128px;
  background-color: white;
  width: calc(100% - 480px);
  margin-top: 100px;
  padding: 10px 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &-content {
    max-width: 1520px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    button {
      margin: 4px;
    }
  }
  .seperator {
    display: inline-block;
    border-left: solid 1px #050505;
    height: 2rem;
  }
  .schedule-campaign-btn {
    &::after {
      content: "";
      height: 50px;
      width: 54px;
      background: #ff4f7e;
    }
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin: 0;
  }
  .schedule-menu-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: #f74374 !important;
    border-left: solid #f97d9f 1px;
    &-icon {
      height: 49px;
      font-size: 2em;
    }
  }

  .virtual-btn {
    border: solid 1px #f51355;
    margin-left: 30px;
  }
}
</style>