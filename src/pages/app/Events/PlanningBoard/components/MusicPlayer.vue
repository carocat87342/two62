<template>
  <div class="music-player">
    <label>{{ title }}</label>
    <div class="player-controller d-flex align-center justify-content-center">
      <button class="skip-button player-controls__item -xl js-play md-white" @click="prev">
        <md-icon class="">skip_previous</md-icon>
      </button>
      <button class="color-blackplayer-controls__item -xl js-play md-white" @click="play">
        <md-icon class="color-black" v-if="isTimerPlaying">pause</md-icon>
        <md-icon class="color-black" v-else>play_arrow</md-icon>
      </button>
      <button class="skip-button player-controls__item -xl js-play md-white" @click="next">
        <md-icon class="color-black">skip_next</md-icon>
      </button>
    </div>
    <div class="progress" ref="progress">
      <!-- <div class="progress__top">
        <div class="progress__duration">{{ duration }}</div>
      </div> -->
      <div class="progress__bar" @click="clickProgress">
        <div class="progress__current" :style="{ width: barWidth }"></div>
      </div>
      <!-- <div class="progress__time">{{ currentTime }}</div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    prev() {
      this.resetPlayer();
      this.$emit("prev");
    },
    next() {
      this.resetPlayer();
      this.$emit("next");
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.src;
      setTimeout(() => {
        this.isTimerPlaying = false;
        this.audio.pause();
      }, 300);
    },
  },
  created() {
    let vm = this;
    this.audio = new Audio();
    this.audio.src = this.src;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };
  },
};
</script>
<style lang="scss" scoped>
.music-player {
  .player-controller {
    button {
      border-radius: 50%;
      margin: 10px;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 54px;
      height: 54px;
      cursor: pointer;

      &.skip-button {
        width: 32px;
        height: 32px;
        i {
          font-size: 24px !important;
        }
      }
      i {
        color: black !important;
        font-size: 32px !important;
      }
    }
  }
}
.progress {
  width: 100%;
  margin-top: -15px;
  user-select: none;
  &__top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__duration {
    color: #71829e;
    font-weight: 700;
    font-size: 20px;
    opacity: 0.5;
  }
  &__time {
    margin-top: 2px;
    color: #71829e;
    font-weight: 700;
    font-size: 16px;
    opacity: 0.7;
  }
}
.progress__bar {
  height: 3px;
  width: 100%;
  cursor: pointer;
  background-color: #d0d8e6;
  display: inline-block;
  border-radius: 10px;
}
.progress__current {
  height: 9px;
  margin-top: -3px;
  width: 0%;
  background-color: #f51355;
  border-radius: 10px;
  position: relative;
  &::after {
    content: "";
    height: 200%;
    position: absolute;
    right: 0;
    background-color: #f51355;
    width: 10px;
    height: 20px;
    border-radius: 3px;
    top: -5px;
  }
}
</style>
