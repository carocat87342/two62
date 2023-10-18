<template>
  <div class="new-event-side-bar" :data-color="activeColor" :data-background-color="backgroundColor">
    <div class="sidebar-menu">
      <md-button class="md-round md-simple md-just-icon md-transparent menu-button" @click="toggleMenu = !toggleMenu">
        <img v-if="toggleMenu === false" :src="`${menuIconsURL}Group 2763.svg`" />
        <img v-else :src="`${menuIconsURL}Group 2763 (2).svg`" />
      </md-button>
      <div class="sidebar-menu__list" v-if="toggleMenu">
        <!-- <div class="sidebar-menu__item">
          <div class="item-route">
            <img :src="`${menuIconsURL}Asset 115.svg`" /> Search
          </div>
        </div> -->
        <div class="sidebar-menu__item">
          <div class="item-route" @click="goTo('/profile/settings')">
            <img :src="`${menuIconsURL}Asset 117.svg`" /> Profile
          </div>
          <div class="item-action" @click="goTo('/signout')">
            Sign Out
            <img :src="`${menuIconsURL}Asset 118.svg`" />
          </div>
        </div>
        <div class="sidebar-menu__item">
          <div class="item-route" @click="goTo('/events')"><img :src="`${menuIconsURL}Asset 114.svg`" /> My Events</div>
        </div>
        <div class="sidebar-menu__item" @click="goTo(`/events/${event.id}/booking/overview?walkWithMe=true`)">
          <div class="item-route"><img :src="`${menuIconsURL}Asset 116.svg`" /> Product tour</div>
        </div>
        <div class="sidebar-menu__item" @click="goToHelp">
          <div class="item-route"><img :src="`${menuIconsURL}Asset 117.svg`" /> About the product</div>
        </div>
        <div class="sidebar-menu__item">
          <div class="item-route" @click="goTo('/vendors-pool')">
            <img :src="`${menuIconsURL}Asset 117.svg`" /> Vendors Pool
          </div>
        </div>
      </div>
    </div>
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <md-list class="nav">
        <sidebar-item
          name="left-menu-events-list"
          class="left-menu-events-list"
          :link="{
            name: 'Event Details',
            icon: 'outlined_flag',
            path: `/events/${event.id}/overview`,
            startLink: `/events/${event.id}/overview`,
          }"
        ></sidebar-item>
        <sidebar-item
          name="left-menu-events-list"
          class="left-menu-events-list"
          :link="{
            name: 'Events Lists',
            icon: 'check_circle_outline',
            path: taskUrl,
            startLink: `/events/${event.id}/booking`,
          }"
        ></sidebar-item>
        <sidebar-item
          name="left-menu-yearly-plan"
          class="left-menu-yearly-plan"
          :disabled="event.budgetProgress !== 100"
          :link="{
            name: 'Event Budget',
            icon: 'attach_money',
            path: `/events/${event.id}/edit/budget`,
            startLink: `/events/${event.id}/edit/budget`,
          }"
        ></sidebar-item>
        <!-- <sidebar-item
          name="left-menu-yearly-plan"
          class="left-menu-yearly-plan disabled"
          v-else
        ></sidebar-item>-->
      </md-list>
    </div>
    <div class="logo">
      <a href="https://maryoku.com/" target="_blank" class="simple-text logo-mini visible-on-sidebar-mini">
        <div class="logo-img">
          <img :src="logo" />
          <!--<md-icon>calendar_today</md-icon>-->
        </div>
      </a>
    </div>
  </div>
</template>
<script>
import SidebarItem from "./NewSidebarItem";
import eventService from "@/services/event.service";

export default {
  name: "sidebar",
  data: () => {
    return {
      newTimeLineIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Timeline-New/",
      menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu _ checklist/SVG/",
      toggleMenu: false,
      currentUrl: "",
    };
  },
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
        let acceptedValues = ["", "primary", "azure", "green", "orange", "danger", "rose"];
        return acceptedValues.indexOf(value) !== -1;
      },
    },
    backgroundImage: {
      type: String,
      default: "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-2.jpg",
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
      default: "https://static-maryoku.s3.amazonaws.com/storage/maryoku+-+logo+square+dark%402x.png",
    },
    fullLogo: {
      type: String,
      default: "https://static-maryoku.s3.amazonaws.com/storage/maryoku+-+logo+dark%402x.png",
    },
    sidebarLinks: {
      type: Array,
      default: () => [],
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
    event: {
      type: Object,
      default: {},
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
    goTo(router) {
      this.toggleMenu = false;
      this.$router.push(router);
    },
    goToHelp() {
      localStorage.setItem("currentEventId", this.$route.params.id);
      this.goTo("/welcome/event");
    },
    fetchUrl() {
      this.currentUrl = this.$router.history.current.path;
    },
    reloadPage() {
      location.href = `/#/events/${this.event.id}/booking/overview?walkWithMe=true`;
      location.reload();
      this.toggleMenu = false;
    },
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
      };
    },
    isEventPage() {
      return this.currentUrl.indexOf("event") >= 0;
    },
    isEventPage() {
      return this.$router.history.current.path.indexOf("event") >= 0;
    },
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  },
  components: {
    SidebarItem,
  },
  created() {
    this.fetchUrl();
    this.taskUrl = eventService.getFirstTaskLink(this.event);
  },
  watch: {
    $route: "fetchUrl",
    event: {
      handler(newEvent) {
        this.taskUrl = eventService.getFirstTaskLink(newEvent);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.new-event-side-bar {
  display: block;
  font-weight: 200;
  z-index: 9999;
  width: 80px;
  box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12),
    0 8px 10px -5px rgba(0, 0, 0, 0.2);
  background-size: cover;
  background-position: 50%;
  background: #fff;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  .menu-button {
    border-radius: 30px;
    width: calc(100% - 0.5em) !important;
    margin: 30px 0px !important;
    img {
      width: 30px;
    }
  }
  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
      display: none;
    }
  }
  .sidebar-wrapper {
    /deep/ .md-list {
      li {
        border-bottom: 1px solid rgba(0, 0, 0, 0.13);
        border-left: 7px solid rgba(0, 0, 0, 0);

        a {
          display: block;
          text-align: center;
          padding: 1em 0.6em;

          .md-icon.md-theme-default.md-icon-font {
            color: #000 !important;
          }
        }

        &.active {
          border-left: 7px solid #fbc02d;

          a.nav-link {
            background: none;
            box-shadow: none;
            border-radius: 0;

            .md-icon.md-theme-default.md-icon-font {
              color: #fbc02d !important;
            }
          }
        }
      }
    }
  }

  .logo-mini {
    display: block !important;
    position: fixed;
    bottom: 2em;
    left: 0.6em;
  }

  .logo-img {
    text-align: center;
    img {
      width: 40px;
    }
  }
}
</style>
