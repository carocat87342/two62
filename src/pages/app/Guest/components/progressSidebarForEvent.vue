<template>
  <div class="progress-sidebar guest" style="left: 0;">
    <div class="position-relative">
        <div class="py-50 mx-60  d-flex align-center border-bottom">
            <div class="guest-profile bg-white">
                <img class="mb-5" :src="`${$iconURL}customer icons/woman (2).svg`" alt="" width="45px">
            </div>
            <div class="ml-10">
                <div class="font-size-20 font-bold-extra">{{user.name}}</div>
                <p class="mb-0">{{user.email}}</p>
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
                                class="mr-10"
                                v-if="item.status === 'completed' || item.progress === 100"
                                :src="item.icon"
                                width="25"
                            />
                            <img
                                class="mr-10"
                                :src="item.icon"
                                v-if="item.icon"
                                width="25"
                                style="max-width: 25px; max-height: 25px"
                            />
                            {{ item.title }}
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
    </div>
    <div class="position-absolute d-flex flex-column align-center justify-content-center" style="bottom: 20px;width: 100%">
        <img src="static/img/maryoku-logo-dark.png" width="120px">
        <a class="color-red text-decoration-none" target="_blank" href="https://maryoku.com">Who are we and why are we great?</a>
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

export default {
  name: "progress-sidebar",
  components: {
    VueElementLoading,
    draggable,
    Drag,
    Drop,
    SlideYDownTransition,
    InputMask,
    SideBar,
    SidebarItem,
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
  }),
  created() {
    this.fetchUrl();
  },
  computed: {
    user(){
      return this.$store.state.auth.user;
    },
    event(){
      return this.$store.state.EventGuestVuex.eventData;
    },
    warming() {
      let value = this.elements.filter((it) => it.progress == 100);
      return value ? value.length : 0;
    },
  },
  methods: {
    goToRoute(item, index) {
      console.log('goTo', this.event);
      this.$router.push(`/user-events/${this.event.id}/${item.route}`);
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
.border-bottom{
    border-bottom: 1px solid #d5d5d5;
}
</style>
