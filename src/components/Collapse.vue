<template>
  <div>
    <div
      :class="[
          'md-collapse',
          activeCollapse(index + 1),
          {[getColorCollapse(colorCollapse)]: true}]"
      v-for="(item, index) in collapse"
      :key="index"
    >
      <div class="md-collapse-label" @click="toggle(index + 1)">
        <div class="md-layout" v-if="icon && item.eventStartMillis">
          <h5 class="md-collapse-title md-layout-item" :title="item.title">
            <!--md-size-40"-->

            {{getTitle(item.title)}}
          </h5>
          <!--
          <div class="md-layout-item">

          </div>-->
          <div class="md-layout-item" style=" padding-right: 0px;">
            <div class="md-layout">
              <div
                class="md-layout-item md-size-100"
                style="text-align:left;padding-right: 0px;padding-left: 0px; text-align: right"
              >
                <md-icon style="margin-right: 0px; font-size: 15px !important;">{{icon}}</md-icon>
                <span
                  class="date-content"
                >{{new Date(item.eventStartMillis).toLocaleDateString("en-US", { day: 'numeric',year: 'numeric', month: 'long'})}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="md-layout" v-else-if="item.eventStartMillis">
          <h5 class="md-collapse-title md-layout-item">
            <!--md-size-40"-->

            {{item.title}}
          </h5>
          <!-- <div class="md-layout-item">

          </div>-->
          <div class="md-layout-item" style=" padding-right: 0px;">
            <div class="md-layout">
              <div
                class="md-layout-item"
                style="text-align:right;padding-right: 0px;padding-left: 0px;"
              >
                <span
                  class="date-content"
                >{{new Date(item.eventStartMillis).toLocaleDateString("en-US", { day: 'numeric',year: 'numeric', month: 'long'})}}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="md-layout" v-else>
          <h5 class="md-collapse-title md-layout-item">
            <!--md-size-40"-->

            {{item.title}}
          </h5>
          <div class="md-layout-item">
            <div class="md-layout">
              <div class="md-layout-item">
                <md-icon>{{icon}}</md-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <collapse-transition>
        <div
          class="md-collapse-content"
          style="padding-left: 0px;"
          v-show="getActiveCollapse(index + 1)"
        >
          <slot :name="getCollapseContent(index + 1)"></slot>
        </div>
      </collapse-transition>
    </div>
  </div>
</template>

<script>
import { CollapseTransition } from 'vue2-transitions'

export default {
  name: 'collapse',
  components: {
    CollapseTransition
  },
  props: {
    collapse: Array,
    icon: String,
    colorCollapse: String
  },
  data () {
    return {
      isActive: 0,
      activeList: [],
      showedList: []
    }
  },
  mounted () {},
  methods: {
    getActiveCollapse (index) {
      // return this.isActive===index;
      return this.activeList.includes(index)
    },
    activeCollapse (index) {
      return {
        'is-active': this.isActive === index
      }
    },
    toggle (index) {
      if (this.activeList.includes(index)) {
        this.activeList = this.activeList.filter(x => x != index)
        // debugger
      } else {
        this.activeList.push(index)
      }
      if (index === this.isActive) {
        this.isActive = 0
      } else {
        this.isActive = index
      }
    },
    getCollapseContent: function (index) {
      return 'md-collapse-pane-' + index + ''
    },
    getColorCollapse: function (colorCollapse) {
      return 'md-' + colorCollapse + ''
    },

    getTitle (title) {
      if (title.length < 10) {
        return title
      } else {
        return title.substring(0, 8) + ' ...'
      }
    }
  },
  watch: {
    activeList (newVal, oldVal) {
      this.showedList = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  display: flex;
}

.date-content {
  width: 94px;
  height: 12px;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #999999;
}
</style>
