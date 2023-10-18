<template>
  <div
    class="sidebar"
    :data-color="activeColor"
    :data-image="backgroundImage"
    :data-background-color="backgroundColor"
    :style="sidebarStyle"
  >
    <div class="logo">
      <a href="/" class="simple-text logo-mini visible-on-sidebar-mini">
        <div class="logo-img">
          <img :src="logo" />
          <!--<md-icon>calendar_today</md-icon>-->
        </div>
      </a>
      <a href="/" class="simple-text logo-normal">
        <template v-if="$route.meta.rtlActive">{{rtlTitle}}</template>
        <template v-else>
          <img style="width: 100px;" width="100px" :src="fullLogo" />
        </template>
      </a>
      <div class="navbar-minimize">
        <md-button
          id="minimizeSidebar"
          class="md-round md-just-icon md-transparent"
          @click="minimizeSidebar"
        >
          <i class="material-icons text_align-center visible-on-sidebar-regular">more_vert</i>
          <i class="material-icons design_bullet-list-67 visible-on-sidebar-mini">view_list</i>
        </md-button>
      </div>
    </div>
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <slot></slot>
      <md-list class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in sidebarLinks" :key="link.name + index" :link="link">
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            ></sidebar-item>
          </sidebar-item>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    title: {
      type: String,
      default: "maryoku",
    },
    rtlTitle: {
      type: String,
      default: "maryoku",
    },
    activeColor: {
      type: String,
      default: "rose",
      validator: (value) => {
        let acceptedValues = [
          "",
          "primary",
          "azure",
          "green",
          "orange",
          "danger",
          "rose",
        ];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    backgroundImage: {
      type: String,
      default:
        "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-2.jpg",
    },
    backgroundColor: {
      type: String,
      default: "white",
      validator: (value) => {
        let acceptedValues = ["", "black", "white", "red"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    logo: {
      type: String,
      default:
        "https://static-maryoku.s3.amazonaws.com/storage/maryoku+-+logo+square+dark%402x.png",
    },
    fullLogo: {
      type: String,
      default:
        "https://static-maryoku.s3.amazonaws.com/storage/maryoku+-+logo+dark%402x.png",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  provide() {
    return {
      autoClose: this.autoClose,
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
      };
    },
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
};
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
</style>
