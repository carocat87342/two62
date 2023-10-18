<template>
  <div class="my-service white-card" v-if="vendorData">
    <div class="services-header">
      <div class="service-tab-item" :class="{ active: selectedIndex === 0 }" @click="selectService(0)">
        <img
          v-if="vendorData.vendorCategories"
          :src="`${$iconURL}Budget Elements/${getServiceCategory(vendorData.vendorCategories[0]).icon}`"
          class="page-icon mr-10"
        />
        {{ getServiceCategory(vendorData.vendorCategories[0]).title }}
      </div>
      <div
        class="service-tab-item"
        v-for="(service, index) in vendorData.secondaryServices"
        :class="{ active: selectedIndex === index + 1 }"
        @click="selectService(index + 1)"
      >
        <img
          :src="`${$iconURL}Budget Elements/${getServiceCategory(service.vendorCategory).icon}`"
          class="page-icon mr-10"
        />
        {{ getServiceCategory(service.vendorCategory).title }}
      </div>
      <div class="service-tab-item font-size-16">
        <md-button class="maryoku-btn md-simple md-vendor" @click="startAddNewService">
          <md-icon class="color-purple font-size-30 mr-5">add</md-icon>
          Sign new service</md-button
        >
      </div>
    </div>
    <service-content
      :serviceCategory="getSelectedServiceCategory()"
      :key="getSelectedServiceCategory().key"
    ></service-content>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import { LabelEdit, Tabs } from "@/components";
import ServiceContent from "./ServiceContent";
export default {
  components: {
    VueElementLoading,
    LabelEdit,
    Tabs,
    ServiceContent,
    // ProfileDetails,
    // Permissions,
  },
  data() {
    return {
      // auth: auth,
      userInfo: { role: "guest" },
      isLoading: false,
      selectedIndex: 0,
    };
  },
  mounted() {
    this.isLoading = true;
  },
  methods: {
    closePanel() {
      this.$emit("closePanel");
    },
    getServiceCategory(category) {
      return this.serviceCategories.find((item) => item.key === category) || {};
    },
    startAddNewService() {
      return this.$router.push(`/vendor/${this.vendorData.id}/service/add`);
    },
    selectService(index) {
      this.selectedIndex = index;
    },
    getSelectedServiceCategory(index) {
      if (!this.vendorData.vendorCategories || !this.vendorData.vendorCategories.length) return {};
      if (this.selectedIndex === 0) {
        return this.getServiceCategory(this.vendorData.vendorCategories[0]);
      } else {
        return this.getServiceCategory(this.vendorData.secondaryServices[this.selectedIndex - 1].vendorCategory);
      }
    },
  },
  computed: {
    vendorData() {
      return this.$store.state.vendor.profile;
    },
    serviceCategories() {
      return this.$store.state.common.serviceCategories;
    },
  },
};
</script>
<style lang="scss" scoped>
.my-service {
  .services-header {
    height: 90px;
    display: flex;
    .service-tab-item {
      min-width: 300px;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      cursor: pointer;
      &:not(:last-child) {
        border-right: 1px solid #050505;
      }
      &.active {
        border-bottom: solid 5px #641856;
        font-weight: bold;
        padding: 10px 20px;
      }
    }
  }
}
</style>
