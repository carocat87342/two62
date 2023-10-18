<template>
  <div class="md-layout p-20 planner-profile">
    <div class="md-layout-item md-size-25">
      <div class="left-sidebar white-card">
        <div class="profile">
          <div class="avatar" style="">
            <user-avatar :user="userData" @set="setAvatar"></user-avatar>
            <company-logo :user="userData" @set="setLogo"></company-logo>
          </div>
          <h3 class="name font-bold">{{ userData.profile.displayName }}</h3>
        </div>
        <md-list>
          <md-list-item @click="goTo('settings')" :class="{ 'font-bold-extra': pageName === 'settings' }">
            <label>
              <img
                :src="
                  pageName === 'settings'
                    ? `${$iconURL}Profile/settings-dark.svg`
                    : `${$iconURL}Profile/settings-gray.svg`
                "
                class="page-icon"
              />
              <span class="pl-20 font-size-20">Profile Settings</span>
            </label>
          </md-list-item>
          <md-list-item @click="goTo('events')" :class="{ 'font-bold-extra': pageName === 'events' }">
            <label>
              <img
                :src="
                  pageName === 'events' ? `${$iconURL}Profile/events-dark.svg` : `${$iconURL}Profile/events-gray.svg`
                "
                class="page-icon"
              />
              <span class="pl-20 font-size-20">My Events</span>
            </label>
          </md-list-item>
          <md-list-item @click="goTo('points')" :class="{ 'font-bold-extra': pageName === 'points' }">
            <label
              ><img
                :src="
                  pageName === 'points' ? `${$iconURL}Profile/points-dark.svg` : `${$iconURL}Profile/points-gray.svg`
                "
                class="page-icon"
              /><span class="pl-20 font-size-20">My Points</span></label
            >
          </md-list-item>
          <md-list-item
            class="mb-30"
            @click="goTo('inspirations')"
            :class="{ 'font-bold-extra': pageName === 'inspirations' }"
          >
            <label
              ><img
                :src="
                  pageName === 'inspirations'
                    ? `${$iconURL}Profile/inspirations-dark.svg`
                    : `${$iconURL}Profile/inspirations-gray.svg`
                "
                class="page-icon"
              /><span class="pl-20 font-size-20">Saved inspirations</span></label
            >
          </md-list-item>
          <md-divider></md-divider>
          <md-list-item @click="logout">
            <label
              ><img :src="`${$iconURL}menu _ checklist/SVG/Asset 118.svg`" class="page-icon" /><span
                class="pl-20 font-size-20"
                >Log Out</span
              ></label
            >
          </md-list-item>
        </md-list>
      </div>
    </div>
    <div class="md-layout-item md-size-70">
      <profile-settings v-if="pageName === 'settings'"></profile-settings>
      <my-events v-if="pageName === 'events'"></my-events>
      <inspirations v-if="pageName === 'inspirations'"></inspirations>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import PersonalInformation from "./PersonalInformation.vue";
import DietaryConstraints from "./DietaryConstraints.vue";
import MySpecialDates from "./MySpecialDates.vue";
import HolidaysCelebrate from "./HolidaysCelebrate.vue";
import { LabelEdit, Tabs } from "@/components";
import ProfileSettings from "./ProfileSettings";
import MyEvents from "./MyEvents.vue";
// import auth from '@/auth';
import { mapGetters, mapActions, mapState } from "vuex";
import Inspirations from "./Inspirations.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";

export default {
  components: {
    VueElementLoading,
    PersonalInformation,
    DietaryConstraints,
    MySpecialDates,
    HolidaysCelebrate,
    Tabs,
    LabelEdit,
    ProfileSettings,
    MyEvents,
    Inspirations,
    UserAvatar,
    CompanyLogo,
  },
  data() {
    return {
      // auth: auth,
      chips: [],
      user: null,
      pageName: "",
    };
  },

  computed: {
    ...mapGetters({
      upComingEvents: "user/getUpcomingEvents",
      // user:'user/getUser'
    }),
    ...mapState("event", ["eventData"]),
    userData() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    // TODO : user state should be reviewed
    console.log("profile", this.$auth.user);
    this.getPageName();
    this.$store
      .dispatch("auth/checkToken")
      .then(() => {
        this.user = this.$auth.user;
      })
      .catch(() => {
        this.$router.push({ path: `/signin` });
      });
  },
  methods: {
    ...mapActions("event", ["getEventAction"]),
    setAvatar(avatar) {
      this.$store.dispatch("auth/updateProfile", { avatar, id: this.userData.id });
    },
    setLogo(companyLogo) {
      this.$store.dispatch("auth/updateProfile", { companyLogo, id: this.userData.id });
    },
    getPageName() {
      this.pageName = this.$route.params.pageName ? this.$route.params.pageName : "timeline";
      console.log("pageName", this.pageName);
    },
    onUserAvatarChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file, type) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        this.loaded = false;
        return new CustomerFile({ customerFile: e.target.result })
          .save()
          .then((result) => {
            let customer = this.$auth.user.customer;
            customer.logoFileId = result.id;
            new Customer({ id: customer.id, logoFileId: result.id }).save();
            this.companyProfile.companyLogo = customer.logoFileId
              ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
              : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";
            this.companyProfile.logoFileId = customer.logoFileId;
            this.loaded = true;
          })
          .catch((error) => {
            console.log(error);
            this.loaded = true;
          });
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (type) {
      this.loaded = false;
      let customer = this.$auth.user.customer;
      new CustomerFile({ id: customer.logoFileId })
        .delete()
        .then((res) => {
          this.loaded = true;
          customer.logoFileId = null;
          this.companyProfile.logoFileId = undefined;
          this.companyProfile.companyLogo = customer.logoFileId
            ? `${process.env.SERVER_URL}/1/customerFiles/${customer.logoFileId}`
            : "https://static-maryoku.s3.amazonaws.com/storage/img/image_placeholder.jpg";
        })
        .catch((error) => {
          this.loaded = true;
        });
    },
    goTo(pageName) {
      this.$router.push(`/profile/${pageName}`);
    },
    logout() {
      this.$router.push("/signout");
    },
  },
  watch: {
    $route: "getPageName",
  },
};
</script>
<style lang="scss" scoped>
.planner-profile {
  align-items: stretch;
}
.left-sidebar {
  /deep/ .md-list-item-button {
    &:hover {
      background-color: transparent !important;
    }
  }
  .profile {
    position: relative;
    padding: 50px;
    .avatar {
      position: relative;
      width: 245px;
      height: 245px;
      .company-logo {
        position: absolute;
        top: 50%;
        left: 100%;
        width: 120px;
        height: 120px;
        text-align: center;
        border-radius: 50%;
        border: dashed 1px #f51355;
        background-color: #ffffff;
        z-index: 1;
        transform: translate(-40px, -50%);
        color: #f51355;
        font-weight: bold;
      }
    }
  }

  .md-list-item {
    margin: 20px 0;
    /deep/ .md-list-item-content {
      padding: 10px 50px;
    }
  }
  .logout {
    padding: 10px 25px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
