<template>
  <div class="md-layout p-20 planner-profile">
    <loader :active="loading" page="vendor"/>
    <div class="md-layout-item md-size-100 font-size-22 font-bold mb-30 mt-30">
      <img :src="`${$iconURL}Profile/settings-dark.svg`" class="mr-20" />
      PROFILE & SETTINGS
    </div>
    <div class="md-layout-item md-size-25">
      <div class="left-sidebar white-card">
        <div class="profile" v-if="vendorData">
          <div class="avatar" style="">
            <!-- <user-avatar :user="userData" @set="setAvatar"></user-avatar> -->
            <CompanyLogo :defaultImage="vendorData.vendorLogoImage" :user="vendorData" @set="setLogo"></CompanyLogo>
          </div>
          <h3 class="name font-bold text-center">{{ vendorData.companyName }}</h3>
          <div class="text-center">
            <!-- <span class="font-size-20"><md-icon style="color: #ffc001">start</md-icon>4.6</span> -->
            <span class="color-gray">(No Review)</span>
            <star-rating
              class="justify-content-center"
              :border-width="0"
              :star-size="25"
              :show-rating="false"
              :disabled="true"
            ></star-rating>
          </div>
        </div>
        <md-list>
          <md-list-item
            :md-ripple="false"
            @click="goTo('services')"
            :class="{ 'font-bold-extra': pageName === 'services' }"
          >
            <label class="menu-label">
              <img
                :src="
                  pageName === 'services' ? `${$iconURL}common/company-dark.svg` : `${$iconURL}common/company-gray.svg`
                "
                class="page-icon"
              />
              <span class="pl-20 font-size-20">My Services</span>
            </label>
          </md-list-item>

          <md-list-item
            :md-ripple="false"
            class="mb-30"
            @click="goTo('details')"
            :class="{ 'font-bold-extra': pageName === 'details' }"
          >
            <label class="menu-label"
              ><img
                :src="
                  pageName === 'details' ? `${$iconURL}common/setting-dark.svg` : `${$iconURL}common/setting-gray.svg`
                "
                class="page-icon"
              />
              <span class="pl-20 font-size-20">Company Details</span>
            </label>
          </md-list-item>
          <md-list-item
            :md-ripple="false"
            @click="goTo('settings')"
            :class="{ 'font-bold-extra': pageName === 'settings' }"
          >
            <label class="menu-label">
              <img
                :src="pageName === 'settings' ? `${$iconURL}common/user-dark.svg` : `${$iconURL}common/user-gray.svg`"
                class="page-icon"
              />
              <span class="pl-20 font-size-20">Account</span>
            </label>
          </md-list-item>
          <md-divider></md-divider>
          <!--<md-list-item :md-ripple="false">-->
            <!--<md-button class="maryoku-btn md-vendor width-100" :disabled="true">Create Your Landing Page</md-button>-->
          <!--</md-list-item>-->
          <md-list-item :md-ripple="false" @click="logout">
            <label class="menu-label">
              <img :src="`${$iconURL}menu _ checklist/SVG/Asset 118.svg`" class="page-icon" />
              <span class="pl-20 font-size-20"> Log Out </span>
            </label>
          </md-list-item>
        </md-list>
      </div>
    </div>
    <div class="md-layout-item md-size-70">
      <VendorAccountSettings v-if="pageName === 'settings'"></VendorAccountSettings>
      <CompanyDetails v-if="pageName === 'details'"></CompanyDetails>
      <MyServices v-if="pageName === 'services'"></MyServices>
    </div>
  </div>
</template>

<script>
import VueElementLoading from "vue-element-loading";
import StarRating from "vue-star-rating";
import { LabelEdit, Tabs, Loader } from "@/components";

// import auth from '@/auth';
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import UserAvatar from "@/components/UserAvatar.vue";
import CompanyLogo from "@/components/CompanyLogo.vue";

import VendorAccountSettings from "./Account";
import CompanyDetails from "./CompanyDetails";
import MyServices from "./MyServices";

const components = {
    Loader: () => import('@/components/loader/Loader.vue'),
    Tabs: () => import('@/components/Tabs.vue'),
    LabelEdit: () => import('@/components/LabelEdit.vue'),
    StarRating: () => import('vue-star-rating'),
    UserAvatar: () => import('@/components/UserAvatar.vue'),
    CompanyLogo: () => import('@/components/CompanyLogo.vue'),
    VendorAccountSettings: () => import('./CompanyDetails'),
    MyServices: () => import('./MyServices'),
}

export default {
  components: {
    VueElementLoading,
    Tabs,
    LabelEdit,
    VendorAccountSettings,
    UserAvatar,
    CompanyLogo,
    CompanyDetails,
    MyServices,
    StarRating,
    Loader,
  },
  data() {
    return {
      // auth: auth,
      loading: false,
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
    vendorData() {
      return this.$store.state.vendor.profile;
    },
  },
  mounted() {
    // TODO : user state should be reviewed
    this.loading = true;
    this.getPageName();
    this.$store.dispatch("common/fetchAllCategories");
    this.$store
      .dispatch("auth/checkToken")
      .then(() => {
        this.user = this.$auth.user;
        this.loading = false;
      })
      .catch(() => {
        this.$router.push({ path: `/signin` });
      });
  },
  methods: {
    setAvatar(avatar) {
      this.$store.dispatch("auth/updateProfile", { avatar, id: this.userData.id });
    },
    setLogo(companyLogo) {
      this.$store.dispatch("vendor/updateProfile", { vendorLogoImage: companyLogo, id: this.vendorData.id });
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
      this.$router.push(`/vendor/profile/${pageName}`);
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
  .page-icon {
    max-height: 30px;
  }
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
      .company-logo {
        width: 140px;
        height: 140px;
        text-align: center;
        border-radius: 50%;
        border: dashed 1px #6b6164;
        background-color: #ffffff;
        z-index: 1;
        color: #641856;
        margin: auto;
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
  .menu-label {
    cursor: pointer;
  }
}
</style>
