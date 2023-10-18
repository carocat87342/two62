<template>
  <div
    @click="close"
    data-notify="container"
    class="alert open event-state-message alert-plain"
    role="alert"
    :class="[verticalAlign, horizontalAlign]"
    :style="customPosition"
    data-notify-position="top-center">
      <div class="event-state-message-image">
          <img :src="icon" />
      </div>
      <div class="event-state-message-content position-relative">
          <div class="message-title">{{message.title}}</div>
          <div class="message-content">{{message.content}}</div>

          <md-button class="position-absolute font-bold-extra md-black md-simple"
                     style="right: 0;top: 0"
                     @click="message.close">
              <md-icon>close</md-icon>
          </md-button>

      </div>

  </div>
</template>
<script>
export default {
  name: 'notification',
  props: {
    title: {
        type: String,
        require: true,
    },
    action: {
        type: String,
        require: true,
    },
    message: Object,
    icon: String,
    verticalAlign: {
      type: String,
      default: 'top'
    },
    horizontalAlign: {
      type: String,
      default: 'center'
    },
    type: {
      type: String,
    },
    timeout: {
      type: Number,
      default: 5000,
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    }
  },
  data () {
    return {
      elmHeight: 0
    }
  },
  computed: {
    hasIcon () {
      return this.icon && this.icon.length > 0
    },
    alertType () {
      return `alert-${this.type}`
    },
    customPosition () {
      let initialMargin = 0
      let alertHeight = this.elmHeight + 10
      let sameAlertsCount = this.$notifications.state.filter(alert => {
        return (
          alert.horizontalAlign === this.horizontalAlign &&
          alert.verticalAlign === this.verticalAlign &&
          alert.timestamp <= this.timestamp
        )
      }).length
      let pixels = (sameAlertsCount - 1) * alertHeight + initialMargin
      let styles = {}
      if (this.verticalAlign === 'top') {
        styles.top = `${pixels}px`
      } else {
        styles.bottom = `${pixels}px`
      }
      return styles
    }
  },
  methods: {
    close () {
      this.$emit('on-close', this.timestamp)
    },
    send(){
      this.$emit('on-send', this.message.title);
    }
  },
  mounted () {
    this.elmHeight = this.$el.clientHeight
  }
}
</script>
<style lang="scss" scoped>
    .event-state-message {
        height: 200px;
        min-width: 94%;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
        background-color: #ffffff;
        padding:20px 60px;
        display: flex;
        align-items: center;

        &-image {
            width: 62px;
            margin-right: 40px;
        }
        &-content {
            flex-grow: 1;
        }
        .message-title {
            font-family: "Manrope-ExtraBold";
            font-size: 20px;
            color: #0fac4c;
            margin-bottom: 15px;
            &.benchmark {
                color: #e0ae17;
            }
            &.alert-message {
                color: #9f0000;
            }
        }
        .message-content {
            margin-bottom: 15px;
            color: #333333;
            &.benchmark {
                font-family: "Manrope-ExtraBold";
            }
        }
        .message-action {
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-content {
                font-family: 'Manrope-Bold';
                color: #0d0d0d;
                font-size: 16px;
                &.benchmark {
                    font-family: "Manrope-Regular";
                }
                &.alert-message {
                    font-family: "Manrope-Regular";
                }
            }
            &-button {
                white-space: nowrap;
            }
        }
        .close-button {
            position: absolute;
            right: 60px;
            top: 30px;
            i {
                font-size: 30px !important;
                color: #050505;
            }
        }
    }
@media screen and (max-width: 991px) {
  .alert {
    width: auto !important;
    margin: 0 10px;

    &.left {
      left: 0 !important;
    }
    &.right {
      right: 0 !important;
    }
    &.center {
      margin: 0 10px !important;
    }
  }
}

.alert {
  z-index: 100;
  cursor: pointer;
  position: fixed;
  width: 41%;

  &.center {
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    margin: 0 auto;
  }

  &.left,
  &.right,
  &.center {
    margin-top: 10px;
  }

  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
}
</style>
