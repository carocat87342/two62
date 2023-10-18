<template>
  <div class="company-details-container">
    <tabs :tab-name="['Company Details', 'Payment Setting', 'Invoices']" color-button="info" theme="purple">
      <template slot="tab-pane-1">
        <vendor-company-detail></vendor-company-detail>
      </template>
      <template slot="tab-pane-2"> <div class="p-40"></div> </template>
      <template slot="tab-pane-3"> <invoices></invoices> </template>
    </tabs>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import { LabelEdit, Tabs } from "@/components";
import VendorCompanyDetail from "./VendorCompanyDetail";
import Invoices from "./Invoices";
// import auth from '@/auth';
import { mapGetters } from "vuex";

export default {
  components: {
    VueElementLoading,
    LabelEdit,
    Tabs,
    VendorCompanyDetail,
    Invoices,
    // ProfileDetails,
    // Permissions,
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
.company-details-container {
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
