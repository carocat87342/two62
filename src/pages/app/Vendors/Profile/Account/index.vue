<template>
  <div class="profile-container">
    <tabs :tab-name="['Account Details', 'Notifications',]" color-button="info" theme="purple">
      <template slot="tab-pane-1">
        <vendor-account-detail></vendor-account-detail>
      </template>
      <template slot="tab-pane-2"> <notifications></notifications> </template>
      <template slot="tab-pane-3"> <permissions></permissions> </template>
    </tabs>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import { LabelEdit, Tabs } from "@/components";
import VendorAccountDetail from "./VendorAccountDetail";
import Permissions from "./Permissions";
// import auth from '@/auth';
import { mapGetters } from "vuex";
import Notifications from "./Notifications.vue";

export default {
  components: {
    VueElementLoading,
    LabelEdit,
    Tabs,
    VendorAccountDetail,
    Notifications,
    Permissions,
  },
  data() {
    return {
      // auth: auth,
      userInfo: { role: "guest" },
      isLoading: false,
    };
  },

  computed: {},
  mounted() {
    this.isLoading = true;
  },
  methods: {
    closePanel() {
      this.$emit("closePanel");
    },
  },
};
</script>
<style lang="scss" scoped>
.profile-container {
  height: 100%;
  /deep/ .md-card {
    .md-list {
      .md-list-item {
        margin: 0 50px;
        .md-list-item-content {
          padding: 30px 0px 20px;
        }
        &-button {
          border-bottom: 2px solid rgba(0, 0, 0, 0);
          text-transform: capitalize;
          font-size: 20px;
          height: 100%;
          padding-left: 0px;
          padding-right: 0px;
          // margin-left: 50px;
          // margin-right: 50px;
          font-weight: normal;
        }
        &.active {
          .md-list-item-button {
            background: none !important;
            border-bottom-color: #f51355;
            box-shadow: none;
            border-radius: 0;
            color: #000 !important;
            font-weight: bold;
            height: 100%;
          }
        }
      }
      img {
        height: 18px;
        width: auto;
        margin-right: 0.5em;
      }
    }
  }

  /deep/ .nav-tabs.md-card {
    margin-left: auto;
    padding-left: 0;
    justify-content: start !important;
    border-radius: 3px;
    height: 100px;
    background-color: white !important;
    border-bottom: 1px solid #e1e1e1;
    box-shadow: none;
  }

  /deep/ .md-card-tabs .tab-content {
    margin: 0 !important;
    padding: 0 50px;
    background-color: white;
    > div {
      width: 100% !important;
    }
  }
}
</style>
