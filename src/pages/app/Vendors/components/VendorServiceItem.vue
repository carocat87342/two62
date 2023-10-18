<template>
  <div class="vendor-service-item-wrapper">
    <div class="title-cont" @click="collapsed = !collapsed">
      <div class="title">{{ serviceItem.name }}</div>
      <div class="help d-flex justify-content-end align-center mr-20" v-if="!collapsed">
        <div v-if="serviceItem.name !== 'Sustainability, Inclusion and Diversity'">
          Check all of the services that are included in your initial offer.
        </div>
        <img
          v-tooltip="{
            html: true,
            content: getTooltip(serviceItem),
            delay: { show: 200, hide: 100 },
            trigger: 'hover',
            placement: 'bottom',
            classes: 'vendor-tooltip-theme',
          }"
          :src="`${iconUrl}Group 5522 (2).svg`"
        />
      </div>
      <div class="arrow" :class="{ expanded: !collapsed }" @click="collapsed = !collapsed">
        <img
          class="mt-5"
          :src="theme === 'red' ? `${iconUrl}Asset 519.svg` : `${$iconURL}common/arrow-right-purple.svg`"
        />
      </div>
    </div>
    <div class="items-cont" v-if="!collapsed">
      <div class="items" v-for="(sub, sIndex) in serviceItem.subCategories" :key="sIndex">
        <div class="sub-category-title">{{ sub.name }}</div>
        <div class="checklist" v-for="(item, index) in sub.items" :key="index">
          <vendor-checkbox
            :category="serviceItem.name"
            :item="item"
            :label="item.name"
            :vendor="vendor"
            :service="service"
            :theme="theme"
            v-model="item.value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VendorCheckbox from "./VendorCheckbox.vue";

export default {
  name: "vendor-service-item",
  props: {
    serviceItem: Object,
    vendorCategory: String,
    vendor: Object,
    service: Object,
    theme: {
      type: String,
      default: "red",
    },
  },
  components: {
    VendorCheckbox,
  },
  data() {
    return {
      collapsed: true,
      conditionTooltip: false,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    };
  },
  created() {},
  mounted() {},
  methods: {
    getTooltip(item) {
      if (item.name === "Sustainability, Inclusion and Diversity") {
        return "<p>Do you comply with global policies to maintain green, inclusive and diversified environment?</p>";
      } else {
        return "<p>if not included in the starting offer, but offered by your team, select “not included” and input the estimated additional cost of the feature, that way we can better match you with planners</p>";
      }
    },
  },
  computed: {},
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-service-item-wrapper {
  font-family: Manrope-Regular, sans-serif;
  color: #050505;
  background: #ffffff;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  .title-cont {
    display: flex;
    justify-content: space-between;
    padding: 60px;
    cursor: pointer;
    .title {
      text-transform: capitalize;
      font: 800 22px Manrope-Regular, sans-serif;
      flex: 1;
    }
    .help {
      font: 800 16px Manrope-Regular, sans-serif;
      flex: 1;
      img {
        width: 27px;
        margin-left: 16px;
      }
      .condition-tooltip {
        position: absolute;
        background-color: #ffedb7;
        padding: 18px 29px;
        color: #050505;
        font-size: 14px;
        margin: 20px 0 0 270px;
        max-width: 280px;
        text-align: center;

        h5 {
          margin: 14px 0 0 0;
          font: 800 16px Manrope-Regular, sans-serif;
        }
        p {
          margin: 14px 0 0 0;
          padding: 0;
          font: normal 16px Manrope-Regular, sans-serif;
        }

        &::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top: 4px;
          /*left: 60px;*/
          box-sizing: border-box;
          z-index: 999;

          border: 12px solid black;
          border-color: transparent transparent #ffedb7 #ffedb7;

          transform-origin: 0 0;
          transform: rotate(135deg);
        }
      }
    }
    .arrow {
      cursor: pointer;
      img {
        width: 12px;
      }
      &.expanded {
        img {
          transform: rotate(90deg);
        }
      }
    }
  }
  .items-cont {
    padding: 0px 60px 60px;
    .items {
      margin-bottom: 30px;
      .sub-category-title {
        padding-bottom: 30px;
        margin: auto -60px;
        padding-left: 60px;
        border-bottom: 2px solid #dddddd;
        font: 800 16px Manrope-Regular, sans-serif;
        text-transform: capitalize;
      }
      .checklist {
        text-transform: capitalize;
      }
    }
  }

  .tooltip-theme {
    .tooltip-inner {
      max-width: 400px;
    }
  }
}
</style>
