<template>
  <div class="vendor-signup-step2-wrapper">
    <div class="inside-container">
      <div class="left-side">
        <img :src="`${iconUrl}step-2.svg`" />
        <h2>
          SERVICES &
          <br />AMENTITIES
        </h2>
        <p>Don't leave anything out! All information will appear on your future proposals</p>
        <h2>1/4</h2>
      </div>
      <div class="right-side">
        <div class="description">
          <h5>
            <img :src="getCategoryIconByValue(currentService.vendorCategory)" width="40" />
            {{ getCategoryNameByValue(currentService.vendorCategory) }} Amenities
          </h5>
          <p>
            Mark all the services you can support and will be included in your proposal. If needed please add a
            description or amount.
          </p>
        </div>
        <vendor-service-item
          v-for="(c, cIndex) in categories.find((category) => category.name == currentService.vendorCategory)
            .categories"
          :key="cIndex"
          :serviceItem="c"
          :vendor="vendor"
          :service="currentService"
          theme="purple"
        />
      </div>
    </div>
  </div>
</template>

<script>

import VendorServiceItem from "../components/VendorServiceItem.vue";
import { VendorCategories } from "@/constants/vendor";

export default {
  name: "vendor-signup-step2",
  props: {
    categories: Array,
    icon: String,
  },
  components: {
    VendorServiceItem,
  },
  data() {
    return {
      filteredCategories: [],
      vendorCategories: VendorCategories,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    };
  },
  created() {},
  mounted() {
    console.log("vendor.signup.step2.mounted", this.vendor);
  },
  methods: {
    getCategoryNameByValue(value) {
      return this.vendorCategories.filter((c) => c.value == value)[0].name;
    },
    getCategoryIconByValue(value) {
      return this.vendorCategories.filter((c) => c.value == value)[0].icon;
    },
  },
  computed: {
    vendor() {
      return this.$store.state.vendorService.vendor;
    },
    currentService() {
      return this.$store.state.vendorService.service;
    },
  },
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-signup-step2-wrapper {
  font-family: Manrope-Regular, sans-serif;

  .inside-container {
    display: flex;
    color: #050505;

    .left-side {
      flex: 1;
      margin-right: 122px;

      img {
        width: 92.5px;
      }
      h4 {
        margin: 36px 0 11px 0;
        font: 800 20px Manrope-Regular, sans-serif;
      }
      p {
        margin: 0;
        padding: 0;
        font: normal 16px Manrope-Regular, sans-serif;
      }
      h2 {
        margin: 30px 0;
        font: 800 40px Manrope-Regular, sans-serif;
      }
      h3 {
        margin: 0;
        color: #f51355;
        font: bold 20px Manrope-Regular, sans-serif;
      }
    }
    .right-side {
      flex: 3;

      h2 {
        margin: 0;
        margin-bottom: 40px;
        font: 800 40px Manrope-Regular, sans-serif;
      }
      .card {
        padding: 30px 60px 60px 60px;
        background-color: #ffffff;
        box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      }
      .description {
        color: #050505;
        h5 {
          margin: 0;
          font: 800 16px Manrope-Regular, sans-serif;
          text-transform: capitalize;

          img {
            margin-right: 12px;
          }
        }
        p {
          margin: 14px 0 30px 0;
          font: normal 16px Manrope-Regular, sans-serif;
        }
      }
    }
  }
}
</style>
