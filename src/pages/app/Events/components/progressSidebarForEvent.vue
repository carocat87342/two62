<template>
  <div class="progress-sidebar">
    <div class="summer-party">
      <md-button class="md-default md-sm md-simple expand-sidebar">
        <img :src="`${$iconURL}Timeline-New/expand.svg`" />
      </md-button>
      <div class="title-label" v-if="page === 'plan'">
        summer party
        <small>checklist</small>
      </div>
      <div class="subTitle-label" v-if="page === 'event'">Let's Begin</div>
      <div class="completion-progress">
        <div class="progress-done"></div>
      </div>
      <div class="percentage">
        <ul>
          <li class="green-label">{{ (((warming / elements.length).toFixed(2) * 10000) / 100) | withComma }}%</li>
          <li class>{{ warming }} of {{ elements.length }}</li>
        </ul>
      </div>
      <div class="small-label" v-if="page === 'plan'">Things are warming up!</div>
      <div class="small-label" v-if="page === 'event'">Only 4 more vendors to close!</div>
      <transition name="slide">
        <event-note-panel v-if="isOpenNote"></event-note-panel>
      </transition>

      <div class="my-notes">
        <md-button v-if="!isOpenNote" class="md-red" @click="isOpenNote = true">
          <img :src="`${$iconURL}Event Page/note-light.svg`" width="20" style="margin: 0 3px" />
          On my plate
          <md-icon style="font-size: 30px !important; margin-left: 5px">keyboard_arrow_down</md-icon>
        </md-button>
        <md-button v-if="isOpenNote" class="md-red" @click="isOpenNote = false">
          <img :src="`${$iconURL}Event Page/note-light.svg`" width="20" style="margin: 0 3px" />
          Close
          <md-icon style="font-size: 30px !important; margin-left: 5px">keyboard_arrow_up</md-icon>
        </md-button>
      </div>
    </div>
    <div class="progress-sidebar-content">
      <!-- Sidebar Elements -->
      <div class="event-elements">
        <draggable :list="elements" @change="changeItem">
          <div
            class="event-elements__item"
            @click="goToRoute(item, index)"
            :class="{
              current: isActiveRoute(item),
            }"
            v-for="(item, index) in elements"
            :key="index"
            :id="item.id"
          >
            <div class="item-title">
              <img
                v-if="item.status === 'completed' || item.progress === 100"
                :src="`${$iconURL}budget+screen/SVG/Asset%2032.svg`"
                width="25"
              />
              <img
                :src="item.icon"
                v-if="isActiveRoute(item) && item.icon"
                width="25"
                style="max-width: 25px; max-height: 25px"
              />
              {{ item.title }}
            </div>
          </div>
        </draggable>
        <md-button
          class="md-simple refresh"
          :style="{
            bottom: `${56 * (elements.length % 2 == 0 ? elements.length / 2 : (elements.length - 1) / 2 + 1)}px`,
          }"
          @click="changeItem('refresh')"
        >
          <img :src="`${$iconURL}Budget Requirements/group-9602@3x.png`" width="80"
        /></md-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import { SlideYDownTransition } from "vue2-transitions";
import InputMask from "vue-input-mask";
import VueElementLoading from "vue-element-loading";
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";
import { SideBar, SidebarItem } from "@/components";
import EventBlocks from "../components/NewEventBlocks";
import EventNotePanel from "../components/EventNotePanel";

export default {
  name: "progress-sidebar",
  components: {
    VueElementLoading,
    EventBlocks,
    draggable,
    Drag,
    Drop,
    SlideYDownTransition,
    InputMask,
    SideBar,
    SidebarItem,
    EventNotePanel,
  },
  props: {
    elements: {
      type: Array,
      required: true,
    },
    page: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isLoading: true,
    isOpenNote: false,
    currentUrl: "",
    event: {},
  }),
  created() {
    this.fetchUrl();
    this.event = this.$store.state.event.eventData;

    setTimeout(_ => {
      this.renderProgress();
    }, 50)
  },
  computed: {
    // ...mapState("event", {
    //   eventData: (state) => state.eventData,
    // }),
    warming() {
      let value = this.elements.filter((it) => it.progress == 100);
      return value ? value.length : 0;
    },
  },
  methods: {
    ...mapActions("event", ["getEventAction"]),
    goToRoute(item, index) {
      let vm = this;
      this.$router.push(`/events/${this.event.id}/${item.route}`);
    },
    fetchUrl() {
      this.currentUrl = this.$router.history.current.path;
    },
    isActiveRoute(item) {
      if (this.currentUrl.indexOf(item.route) > -1) {
          return "current";
      }
      return "";
    },
    changeItem(option = null) {
      let params = option == "refresh" ? null : this.elements;
      this.$emit("change", params);
    },
    renderProgress(){
      let self = this;
      $('.event-elements__item').each(function (idx, el) {
        let progress = self.elements.find(it => it.id === $(el).attr('id')).progress
        $(el).css("--width", `${progress}%`)
      })
    }
  },
  updated(){
    this.renderProgress();
  },
  mounted() {
    console.log('progressbar.mounted', this.elements);
  },
  watch: {
    $route: "fetchUrl",
    currentUrl(newVal){},
    elements(newValue) {},
  },
};
</script>
<style lang="scss">
</style>
