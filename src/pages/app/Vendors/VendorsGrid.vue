<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-100 mt-42 mt-0">
      <md-field>
        <md-input type="search" class="mb-3" clearable placeholder="Search vendors" v-model="searchQuery"></md-input>
      </md-field>
    </div>
    <div
      class="md-layout-item md-medium-size-33 md-small-size-50 md-xsmall-size-100 md-large-size-25 md-size-25"
      v-for="vendor in filteredVendorsList"
      :key="vendor.id"
    >
      <product-card header-animation="true" fixed-header="false" :data-count="9999" :hover-count="9999">
        <img class="img imgHeader" slot="imageHeader" :src="vendorMainImage(vendor)" />
        <div slot="card-buttons">
          <md-button class="md-purple md-xs md-round md-just-icon" @click="routeToVendor(vendor.id, $event)">
            <md-icon>more_horiz</md-icon>
            <md-tooltip md-direction="bottom">View</md-tooltip>
          </md-button>
          <md-button
            v-if="vendor.vendorWebsite && isValidVendorWebsite(vendor)"
            class="md-info md-xs md-round md-just-icon"
            :href="`${vendor.vendorWebsite}`"
            target="_blank"
          >
            <md-icon>open_in_browser</md-icon>
            <md-tooltip md-direction="bottom">Open website</md-tooltip>
          </md-button>
          <md-button class="md-warning md-xs md-round md-just-icon" @click="editVendorDetails(vendor)">
            <md-icon>edit</md-icon>
            <md-tooltip md-direction="bottom">Edit</md-tooltip>
          </md-button>
          <md-button class="md-danger md-xs md-round md-just-icon">
            <md-icon>delete</md-icon>
            <md-tooltip md-direction="bottom">Remove</md-tooltip>
          </md-button>
        </div>
        <h4 slot="title" class="title">
          <a class="fw-bold" href="#pablo">{{ vendor.vendorDisplayName }}</a>
          <div class="small">
            <label
              class="star-rating__star"
              v-for="(rating, ratingIndex) in ratings"
              :key="ratingIndex"
              :class="{
                'is-selected': vendor.rank >= rating && vendor.rank != null,
              }"
              >★</label
            >
            <span class="small text-gray">({{ vendor.voters }})</span>
          </div>
        </h4>
        <div slot="description" class="card-description">
          <div class>
            <p>{{ vendor.vendorTagLine }}</p>
          </div>
          <div class="tags" v-if="vendor.vendorTagging && vendor.vendorTagging.length">
            <div v-for="(tag, index) in vendor.vendorTagging" :key="index">
              <span class="tt-capitalize">{{ tag }}</span>
              <span v-if="index <= vendor.vendorTagging.length">&middot;</span>
            </div>
          </div>
        </div>
        <template slot="footer">
          <div class="price">
            <div
              class="badge badge-primary"
              :class="`badge-${categoryColor(vendor.vendorCategory, buildingBlocksList)}`"
            >
              {{ categoryTitle(vendor.vendorCategory, buildingBlocksList) }}
            </div>
          </div>
          <div class="stats">
            <p class="category"><md-icon>place</md-icon>Geography</p>
          </div>
        </template>
      </product-card>
    </div>
  </div>
</template>
<script>
import { categoryTitle, categoryColor } from "./helpers";
import _ from "underscore";

import { ProductCard, AnimatedNumber } from "@/components";

export default {
  components: {
    ProductCard,
    AnimatedNumber,
  },
  props: ["vendorsList", "ratings", "buildingBlocksList"],
  data() {
    return {
      searchQuery: "",
      filteredVendorsList: [],
      modelValidations: {
        vendorWebsite: {
          url: { require_protocol: true },
          regex: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,=.]+$/gm,
          min: 10, // http://x.x
        },
      },
      bgImages: [
        "https://static-maryoku.s3.amazonaws.com/storage/img/lock.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/login.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/register.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/bg-pricing.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/bg3.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/bg9.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/card-1.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/card-2.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/card-3.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-1.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-2.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-3.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/sidebar-4.jpg",
        "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_289440710.png",
        "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_495639391.png",
        "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_732491308.png",
        "https://static-maryoku.s3.amazonaws.com/storage/img/shutterstock_740167702.png",
      ],
    };
  },
  mounted() {
    this.filteredVendorsList = this.vendorsList;
  },
  methods: {
    categoryTitle,
    categoryColor,
    editVendorDetails(vendor) {
      this.$emit("editVendorDetails", vendor);
    },
    routeToVendor(vendorId) {
      this.$router.push({ name: "VendorDetails", params: { id: vendorId } });
    },
    vendorMainImage(vendor) {
      return "";
      const rndInt = Math.floor(Math.random() * this.bgImages.length);
      return this.bgImages[rndInt];
    },
    filterVendors() {
      this.filteredVendorsList = _.filter(this.vendorsList, (v) => {
        // let byDisplayName = v.vendorDisplayName.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
        let byCategory = v.vendorCategory
          ? v.vendorCategory.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
          : "";
        return byCategory;
      });
    },
    isValidVendorWebsite(vendor) {
      if (vendor.vendorWebsite) {
        return vendor.vendorWebsite.indexOf("http://") > -1 || vendor.vendorWebsite.indexOf("https://") > -1;
      }
      return false;
    },
  },
  watch: {
    searchQuery(newVal, oldVal) {
      if (newVal === "") {
        this.filteredVendorsList = this.vendorsList;
      } else {
        this.filterVendors();
      }
    },
    vendorsList(newVal, oldVal) {
      this.filterVendors();
    },
  },
};
</script>
<style lang="scss" scoped>
.md-card-header-image {
  > img {
    max-height: 25vmin;
  }
}

.ellipsis {
  overflow: hidden;
  height: 80px;
}

.ellipsis:before {
  content: "";
  float: left;
  width: 5px;
  height: 85px;
}

.ellipsis > *:first-child {
  float: right;
  width: 100%;
  margin-left: -5px;
}

.ellipsis:after {
  content: "\02026";
  box-sizing: content-box;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  float: right;
  position: relative;
  top: -25px;
  left: 100%;
  width: 3em;
  margin-left: -3em;
  padding-right: 5px;
  text-align: right;
  font-size: 1.8em;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    from(rgba(255, 255, 255, 0)),
    to(white),
    color-stop(50%, white)
  );
  background: -moz-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
  background: -o-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
  background: -ms-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
  background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
}

.md-tooltip {
  z-index: 9999 !important;
  background: $purple-500 !important;
  color: white !important;
  &[x-placement="top"]:after {
    border-bottom-color: $purple-500 !important;
  }
  &[x-placement="bottom"]:after {
    border-bottom-color: $purple-500 !important;
  }
  &[x-placement="right"]:after {
    border-bottom-color: $purple-500 !important;
  }
  &[x-placement="left"]:after {
    border-bottom-color: $purple-500 !important;
  }
}
.mb-42 {
  margin-bottom: 42px !important;
}
.mt-0 {
  margin-top: 0 !important;
}
.maxh-20 {
  max-height: 20px !important;
}
.fw-bold {
  font-weight: bold !important;
}
.tt-capitalize {
  text-transform: capitalize !important;
}
.imgHeader {
  min-height: 180px !important;
  max-height: 180px !important;
  object-fit: cover;
}
.badge {
  font-size: 10px !important;
  position: relative !important;
  top: 90% !important;
}
.tags {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
