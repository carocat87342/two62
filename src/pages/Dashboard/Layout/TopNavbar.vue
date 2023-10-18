<template>
  <md-toolbar
    md-elevation="0"
    class="md-transparent"
    :class="{
      'md-toolbar-absolute md-white md-fixed-top': $route.meta.navbarAbsolute,
      'navbar-white': $route.meta.opaque,
    }"
  >
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start event-top-bar">
        <h3 v-if="topBarTitle" class="md-title">{{ topBarTitle }}</h3>
        <!--<drop-down direction="down" v-if="topBarTitle" :has-caret="false" :hover="true">
          <md-button slot="title" class="md-button md-simple md-red dropdown-toggle md-tiny" data-toggle="dropdown" style="border-radius: 3px 3px 0 0; text-transform: capitalize; font-size: 18px !important; font-weight: 400 !important;">
            {{topBarTitle}}
          </md-button>
          <div  class="dropdown-menu" style="margin-top: 5px; border-radius: 0 5px 5px 5px !important; padding: 24px;min-width: 480px;max-width: 580px;">
            <div>
              <h4 class="" style="font-weight: 500; padding: 0 0 12px 0; margin: 0; display: inline;">
                {{topBarTitle}}
              </h4>
              <md-button class="md-info md-icon-button md-round md-dense md-xs pull-right" @click="editEventDetails"><md-icon>edit</md-icon></md-button>
            </div>
            <table style="width: 100%; margin-left: 8px;" cellpadding="1" cellspacing="1">
              <tr><th colspan="2">Date</th></tr>
              <tr><td colspan="2">{{topBarEventDate}}</td></tr>
              <tr><th>Participants</th> <th>Geography</th></tr>
              <tr><td>{{topBarEventParticipants}}</td><td>{{topBarEventLocation}}</td></tr>
            </table>
          </div>
          <ul class="dropdown-menu" style="display:none; margin-top: 5px; border-radius: 0 3px 3px 3px !important; ">
            <li>
              <div class="md-layout" style="min-width: 480px; padding: 12px;">
                <div class="md-layout event-info-section">
                  <div class="md-layout-item md-size-100">
                    <h4 class="" style="font-weight: 500; padding: 0; margin: 0;">{{topBarTitle}}</h4>
                  </div>
                  <div class="md-layout-item md-size-100">
                    <div class="md-layout-item  title-text">Date</div>
                    <div class="md-layout-item md-size-100 md-caption ">May 29th 2019 , 9:00 AM (6 hrs) </div>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <div class="md-layout-item  title-text">Participants</div>
                    <div class="md-layout-item md-size-100 md-caption ">30 + spouses </div>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <div class="md-layout-item  title-text">Geography</div>
                    <div class="md-layout-item md-size-100 md-caption "> </div>
                  </div>

                  <div class="md-layout-item md-size-100">
                    <md-button class="md-sm md-simple md-red">
                      <md-icon>cached</md-icon> Recurring weekly
                    </md-button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </drop-down>-->
        <h3 class="md-title cst-style" v-if="isEventDetails">
          <md-icon class="text-rose" v-if="topBarTitle">arrow_right</md-icon>
          {{ $route.meta.title ? $route.meta.title : $route.name }}
        </h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-round md-simple md-toolbar-toggle"
          :class="{ toggled: $sidebar.showSidebar }"
          @click="toggleSidebar"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <!--<div class="md-autocomplete" style="width: 50%;">
            <md-autocomplete class="search" v-model="selectedEmployee" :md-options="employees" :md-open-on-focus="false">
              <label v-if="$route.meta.rtlActive">بحث...</label>
              <label v-else>Search...</label>
            </md-autocomplete>
          </div>-->
          <md-list>
            <!--<md-list-item to="/">
              <i class="material-icons">dashboard</i>
              <p class="hidden-lg hidden-md">Dashboard</p>
            </md-list-item>-->

            <!--<li class="md-list-item">
              <a href="#" class="md-list-item-router md-list-item-container md-button-clean dropdown">
                <div class="md-list-item-content">
                  <drop-down direction="down">
                    <md-button slot="title" class="md-button md-just-icon md-simple" data-toggle="dropdown">
                      <md-icon>email</md-icon>
                      <span class="notification">5</span>
                      <p class="hidden-lg hidden-md">Notifications</p>
                      <md-tooltip>5 unread messages</md-tooltip>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li><a href="#">Mike John responded to your email</a></li>
                      <li><a href="#">You have 5 new tasks</a></li>
                      <li><a href="#">You're now friend with Andrew</a></li>
                      <li><a href="#">Another Notification</a></li>
                      <li><a href="#">Another One</a></li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>-->

            <!--            <li class="md-list-item" v-if="topBarEventId">-->
            <!--              <md-button v-if="topBarEventInvitees" class="md-simple md-md top-nav-bar-upload-vendors-button" style="margin-top: 12px;" @click="uploadVendors">-->
            <!--                <md-icon>cloud_upload</md-icon>-->
            <!--                <span>Upload Vendors</span>-->
            <!--              </md-button>-->
            <!--            </li>-->

            <!--<li class="md-list-item" v-if="topBarEventId">
              <md-button v-if="topBarEventProposals" class="md-simple md-md" style="margin-top: 12px;" @click="manageGroups">
                <md-icon>group</md-icon>
                <span>Manage Groups</span>
              </md-button>
            </li>-->
            <!--<li class="md-list-item" v-if="topBarEventId">
              <md-button v-if="topBarEventProposals" class="md-simple md-md" style="margin-top: 12px;" @click="inviteesManagement">
                <md-icon>email</md-icon>
                <span>Automated Interactions</span>
              </md-button>
            </li>-->

            <!--            <li class="md-list-item" v-if="topBarEventId">-->
            <!--              <md-button v-if="topBarEventProposals" class="md-simple md-md" style="margin-top: 12px;" @click="eventPage">-->
            <!--                <md-icon>web_asset</md-icon>-->
            <!--                <span>Event Page</span>-->
            <!--              </md-button>-->
            <!--            </li>-->
            <!--            <li class="md-list-item" v-if="topBarEventId">-->
            <!--              <md-button v-if="topBarEventProposals" class="md-simple md-md" style="margin-top: 12px;" @click="timeline">-->
            <!--                <md-icon>mail</md-icon>-->
            <!--                <span>Timeline</span>-->
            <!--              </md-button>-->
            <!--            </li>-->
            <!--            <li class="md-list-item" v-if="topBarEventId">-->
            <!--              <md-button v-if="topBarEventInvitees" class="md-button md-info" style="margin-top: 6px;" @click="manageInvitees">-->
            <!--                <span>Manage Invitees</span>-->
            <!--              </md-button>-->
            <!--              <md-button v-if="topBarEventProposals" class="md-button md-info" style="margin-top: 6px;" @click="manageProposals">-->
            <!--                <span>Manage Budget &amp; Proposals</span>-->
            <!--              </md-button>-->
            <!--            </li>-->

            <li class="md-list-item import-vendor" v-if="topBarEventId">
              <a class="import" @click="gotoVendorsPool"> <md-icon>file_upload</md-icon>import your vendors </a>
              <a class="import"> <md-icon>play_arrow</md-icon>learn more </a>
              <!-- <md-button class="md-danger md-xs no-padding btn-learn-more">
                <md-icon>play_arrow</md-icon>
                <span>
                  Learn more
                </span>
              </md-button>-->
            </li>
            <li class="md-list-item">
              <a href="#" class="md-list-item-router md-list-item-container md-button-clean dropdown">
                <div class="md-list-item-content">
                  <drop-down direction="down" :hover="true">
                    <md-button
                      name="user-top-menu"
                      slot="title"
                      class="user-top-menu md-button md-simple no-padding"
                      data-toggle="dropdown"
                    >
                      <!--<md-icon>email</md-icon>
                      <span class="notification">5</span>
                      <p class="hidden-lg hidden-md">Notifications</p>-->
                      <div class="photo">
                        <md-icon>menu</md-icon>
                        <!-- <img :src="avatar" alt="avatar"/> -->
                      </div>
                    </md-button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <!--<li><router-link name="user-top-menu-my-profile" :to="{path: '/settings'}">My Profile</router-link></li>-->
                      <li>
                        <a
                          href="javascript: void(null);"
                          name="user-top-menu-my-profile"
                          class="user-top-menu-my-profile"
                          @click="openMyProfile"
                          >My Profile</a
                        >
                      </li>
                      <li>
                        <a
                          href="javascript: void(null);"
                          name="user-top-menu-account-settings"
                          class="user-top-menu-account-settings"
                          @click="openAccountSettings"
                          >My Company</a
                        >
                      </li>
                      <li>
                        <router-link
                          name="user-top-menu-my-profile"
                          class="user-top-menu-my-profile"
                          :to="{ name: 'Team' }"
                          >Manage Team</router-link
                        >
                      </li>
                      <li class="divider"></li>
                      <li>
                        <router-link
                          name="user-top-menu-sign-out"
                          class="user-top-menu-sign-out"
                          :to="{ path: '/signout' }"
                          >Sign Out</router-link
                        >
                      </li>
                    </ul>
                  </drop-down>
                </div>
              </a>
            </li>

            <!--<md-list-item to="/pages/user">
              <i class="material-icons">person</i>
              <p class="hidden-lg hidden-md">Profile</p>◊
            </md-list-item>-->
          </md-list>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
// import auth from '@/auth';
import ProfileSettings from "@/pages/app/Planner/Profile/ProfileSettings";
import Team from "../../app/Team/Team";

import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import EventInfo from "../../app/Events/components/EventInfo";
import EventSidePanel from "@/pages/app/Events/EventSidePanel";

export default {
  components: {
    EventInfo,
    popper: Popper,
  },
  data() {
    return {
      topBarTitle: null,
      topBarEventId: null,
      topBarEventDate: null,
      topBarEventParticipants: "",
      topBarEventLocation: "",
      topBarEventInvitees: false,
      topBarEventProposals: false,
      topBarEvent: null,
      avatar: "",
      selectedEmployee: "",
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone",
      ],
    };
  },
  mounted() {
    setTimeout(
      function () {
        console.log("avatar: " + this.$auth.user.avatar);
        this.avatar =
          this.$auth.user.avatar != null
            ? this.$auth.user.avatar
            : "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg";
      }.bind(this),
      3000,
    );

    this.$root.$on("set-title", (eventData, invitees, proposals) => {
      if (eventData) {
        this.topBarTitle = eventData.title;
        this.topBarEvent = eventData;
        this.topBarEventId = eventData.id;
        this.topBarEventInvitees = invitees;
        this.topBarEventProposals = proposals;
        this.topBarEventParticipants = eventData.numberOfParticipants;
        this.topBarEventDate = this.$moment(eventData.eventStartMillis).format("YYYY-MM-DD H:mm a");
        this.topBarEventLocation = eventData.location || "Unknown";
      } else {
        this.topBarTitle = null;
      }
    });
  },
  methods: {
    editEventDetails() {
      window.currentPanel = this.$showPanel({
        component: EventSidePanel,
        cssClass: "md-layout-item md-size-40 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          modalSubmitTitle: "Save",
          editMode: true,
          sourceEventData: this.topBarEvent,
          year: this.$route.params.year,
          month: this.$route.params.month,
          openInPlannerOption: false,
        },
      });
    },
    openMyProfile() {
      window.currentPanel = this.$showPanel({
        component: ProfileSettings,
        cssClass: "md-layout-item md-size-75 transition36 bg-grey",
        openOn: "right",
        props: {},
      });
    },
    openTeam() {
      const panelInstance = this.$showPanel({
        component: Team,
        cssClass: "md-layout-item md-size-75 transition36 bg-grey",
        openOn: "right",
        props: {},
      });
      window.currentPanel = panelInstance;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    },
    manageInvitees() {
      this.$router.push({
        name: "EventInvitees",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    manageProposals() {
      this.$router.push({
        name: "EditBuildingBlocks",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    uploadVendors() {
      this.$router.push({ name: "Vendors" });
      document.location.reload();
    },
    manageInviteeGroups() {
      this.$router.push({
        name: "EditBuildingBlocks",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    manageInteractions() {
      this.$router.push({
        name: "EditBuildingBlocks",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    eventPage() {
      this.$router.push({
        name: "EventDetails",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    inviteesManagement() {
      this.$router.push({
        name: "InviteesManagement",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    manageGroups() {
      this.$router.push({
        name: "EventInvitees",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    timeline() {
      this.$router.push({
        name: "EditTimeLine",
        params: { id: this.topBarEventId },
      });
      document.location.reload();
    },
    gotoVendorsPool() {
      let routeData = this.$router.resolve({
        name: "VendorsPool",
        params: { id: this.topBarEventId },
      });
      window.open(routeData.href, "_blank");
    },
  },
  computed: {
    isEventDetails() {
      if (this.$route.name === "EditEvent" || this.$route.title === "Event Details") {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.photo {
  width: 28px;
  height: 28px;
  overflow: hidden;
  float: left;
  z-index: 5;
  border-radius: 50%;
  /*@include shadow-big();
    @extend .animation-transition-general;*/

  img {
    width: 100%;
  }
}

.navbar-white {
  background-color: white !important;
}

.tooltip {
  &.popover {
    $color: #fdfdfd;
    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      border: none;
      box-shadow: 0 10px 50px rgba(black, 0.3);
    }
    .wrapper {
      height: auto;
    }
    .popover-arrow {
      border-color: $color;
    }
  }
}

.tooltip[x-placement^="right"] {
  .tooltip-arrow {
    border-width: 10px 10px 10px 0;
    left: -10px;
  }
}
.tooltip[x-placement^="top"] {
  .tooltip-arrow {
    border-width: 0 10px 10px 10px;
    bottom: -10px;
  }
}
.tooltip[x-placement^="bottom"] {
  .tooltip-arrow {
    border-width: 10px 10px 10px 0;
    top: -10px;
  }
}
.tooltip[x-placement^="left"] {
  .tooltip-arrow {
    border-width: 10px 0 10px 10px;
    right: -10px;
  }
}

.open > .md-button.md-rose.dropdown-toggle {
  color: white !important;
}

.md-button:not(.md-just-icon):not(.md-btn-fab):not(.md-icon-button):not(.md-toolbar-toggle) .md-ripple {
  padding: 6px 12px !important;
}

.import-vendor {
  display: flex;
  align-items: center;
  a {
    color: #ff4470 !important;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    margin-right: 2em !important;
    cursor: pointer;
    i {
      color: #ff4470 !important;
      font-size: 14px !important;
      width: 14px !important;
      min-width: 14px !important;
    }
  }
  .btn-learn-more {
    width: 100px;
    height: 30px !important;
    text-transform: capitalize;
    border-radius: 25px;
    i {
      height: 0;
      font-size: 14px !important;
      width: 12px !important;
      min-width: 12px !important;
    }
    span {
      padding-left: 3px;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.user-top-menu {
  margin: 0 !important;
}
h3.cst-style {
  font-weight: 400;
  padding-top: 14px;
  margin-left: -10px;
}
.title-fixed {
  position: -webkit-sticky;
  position: sticky;
}
</style>
