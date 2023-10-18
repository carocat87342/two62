<template>
  <div class="youtube-player">
    <div class="video-content">
      <youtube :video-id="videoId" ref="youtube" class="video-content" width="800" height="450"></youtube>
      <md-button class="md-icon-button md-simple color-white" @click="closePlayer"
        ><md-icon class="color-white">close</md-icon></md-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "videoPlayer",
  props: {
    videoId: {
      type: String,
      default: "",
    },
  },
  methods: {
    closePlayer() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss" scoped>
.youtube-player {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
  .video-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  /deep/ iframe {
    width: 800px;
    height: 450px;
  }
}
</style>