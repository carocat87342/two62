<template>
  <div class="md-layout vendors-pool-page">
    <div class="event-page-header md-layout-item md-size-100">
      <div class="header-title">
        <h3>Our Vendors List</h3>
        <p>
          Millions of companies turn to Maryoku as their trusted event resource, with the largest directory of local
          event
          <br />vendors. Easily find the best event services in your area with detailed vendor reviews for your event.
        </p>
      </div>
      <div class="header-actions">
        <div class="form-group search-field d-flex justify-content-start align-center">
          <md-icon>search</md-icon>
          <input class="form-control" placeholder="Search" @change="searchByQuery" />
        </div>
      </div>
    </div>

    <div class="filters-section d-flex justify-content-start font-size-16">
      <div class="filters-section__label">Filter By</div>
      <div
        class="filters-section__item"
        :class="{ selected: filter.expand }"
        v-for="(filter, index) in filtersItems"
        :key="index"
      >
        <div class="item-title" @click="expandFilter(index)">
          <span v-if="!searchModel[filter.searchKey] || !searchModel[filter.searchKey].length">{{ filter.title }}</span>
          <span v-else class="font-bold">{{ searchModelLabels[filter.searchKey] }}</span>

          <md-icon>keyboard_arrow_down</md-icon>
        </div>
        <div class="expanded-section" v-if="filter.expand">
          <div class="categories-filters-section d-flex" v-if="filter.title.toLowerCase() == 'category'">
            <div class="main-categories-filters">
              <div
                class="main-filters-item text-center"
                :class="[
                  `item-${mainFilterIndex}`,
                  { 'first-row': mainFilterIndex < 4 },
                  { 'second-row': mainFilterIndex >= 4 },
                ]"
                v-for="(item, mainFilterIndex) in filter.mainCategories"
                :key="mainFilterIndex"
              >
                <img :src="`${$iconURL}Budget Elements/${item.icon}`" width="20" />
                <div class="filter-title" @click="searchByCategory(item)">{{ item.title }}</div>
              </div>
            </div>
            <div class="more-categories-filters">
              <div class="section-title">More</div>
              <ul class="columns-2">
                <li v-for="(moreItem, moreItemIndex) in filter.moreCategories" :key="moreItemIndex">
                  <a @click="searchByCategory(moreItem)">{{ moreItem.title }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="location-filters-section d-flex" v-if="filter.title.toLowerCase() == 'location'">
            <div class="search-field-section">
              <div class="form-group">
                <!-- <input placeholder="Search by City, State, Country…" /> -->
                <vue-google-autocomplete
                  id="input_location"
                  ref="address"
                  :placeholder="'Search by City, State, Country…'"
                  v-on:placechanged="getAddressData"
                  types="geocode"
                />
                <md-button class="md-just-icon md-simple md-small" @click="searchByLocation">
                  <img :src="`${menuIconsURL}Asset 115.svg`" />
                </md-button>
              </div>
            </div>
            <div class="more-categories-filters">
              <div class="section-title">Nearby Locations</div>
              <ul>
                <li v-for="(locationItem, locationItemIndex) in filter.locations" :key="locationItemIndex">
                  <a href>{{ locationItem }}</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="capacity-filters-section d-flex" v-if="filter.title.toLowerCase() == 'capacity'">
            <md-radio
              v-model="searchModel.capacity"
              @change="searchByCapacity"
              :value="capacityItem"
              v-for="(capacityItem, capacityItemIndex) in filter.options"
              :key="capacityItemIndex"
              >{{ capacityItem.fullLabel }}</md-radio
            >
          </div>

          <div class="rank-filters-section d-flex justify-content-end" v-if="filter.title.toLowerCase() == 'rank'">
            <div class="rank-item" v-for="(rank, index) in [5, 4, 3, 2, 1, 0]" :key="`rank-${index}`">
              <md-checkbox v-model="searchModel.rank" :value="rank">
                <div class="label-title" v-if="rank">{{ rank }} Stars<span class="rank-counter">(59)</span></div>
                <div class="label-title" v-else>Unrated<span class="rank-counter">(59)</span></div>
                <tempate v-if="rank">
                  <label
                    class="star-rating__star"
                    v-for="(rating, ratingIndex) in [1, 2, 3, 4, 5]"
                    :key="ratingIndex"
                    :class="{ 'is-selected': ratingIndex < rank }"
                    >★</label
                  >
                </tempate>
              </md-checkbox>
            </div>
            <md-button class="md-simple md-black edit-btn md-icon" @click="searchByRank"
              ><md-icon>search</md-icon></md-button
            >
          </div>
        </div>
      </div>
      <div class="filters-section__reset" @click="resetFilters"><md-icon>refresh</md-icon>Reset Filters</div>
    </div>
    <div class="md-layout-item md-size-100 clear-margins" style="padding: 0 1em 0 3em !important">
      <loader :active="working" :isFullScreen="true" page="vendor"/>
      <vendors-grid
        v-if="view === 'grid'"
        :buildingBlocksList="buildingBlocksList"
        :vendorsList="vendorsList"
        :ratings="ratings"
        :pagingData="pagingData"
        @editVendorDetails="editVendorDetails"
      />
      <vendors-list
        v-if="view === 'list'"
        :buildingBlocksList="buildingBlocksList"
        :vendorsList="vendorsList"
        @editVendorDetails="editVendorDetails"
        @delete="showDeleteAlert"
        @add-new-vendor="addNewVendor"
        @open-upload-modal="openUploadModal"
      />
    </div>
    <div class="text-center width-100 mb-60 mt-50">
      <div style="width: 400px; margin: auto" v-if="pagingData.total > 0">
        <div>You've viewed {{ viewedCount }} of {{ pagingData.total }}</div>
        <md-progress-bar class="md-accent" md-mode="determinate" :md-value="pagingProgress"></md-progress-bar>
      </div>
      <br />
      <md-button class="md-simple md-black maryoku-btn md-outlined" @click="loadMoreVendor" v-if="canLoadMore"
        ><span style="padding: 5px 40px" class="font-size-20">Load More</span></md-button
      >
    </div>
    <upload-modal ref="uploadModal"></upload-modal>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";
import Swal from "sweetalert2";
import companyForm from "./Form/companyForm.vue";
import UploadModal from "./ImportVendors";
import VendorsGrid from "./VendorsGridNew";
import VendorsList from "./VendorsList";

import SideBar from "../../../components/SidebarPlugin/NewSideBar";
import { Modal, Loader } from "@/components";
import Vendors from "@/models/Vendors";
import _ from "underscore";
import VueGoogleAutocomplete from "vue-google-autocomplete";

export default {
  name: "vendors-pool",
  components: {
    VueElementLoading,
    companyForm,
    UploadModal,
    VendorsGrid,
    VendorsList,
    SideBar,
    Loader,
    VueGoogleAutocomplete,
  },
  props: {
    inPanel: Boolean,
  },
  data() {
    return {
      working: true,
      view: "grid", // {grid, list}
      vendorsList: [],
      pagingData: {},
      page: 1,
      buildingBlocksList: [],
      ratings: [1, 2, 3, 4, 5],
      searchTerm: "",
      event: {},
      categoriesIconURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      menuIconsURL: "https://static-maryoku.s3.amazonaws.com/storage/icons/menu%20_%20checklist/SVG/",
      filtersItems: [
        {
          title: "Category",
          searchKey: "vendorCategory",
          expand: false,
          mainCategories: [],
          moreCategories: [],
        },
        {
          title: "Location",
          searchKey: "location",
          expand: false,
          locations: ["Manhattan", "New Jersey", "Brooklyn", "Long Island", "Queens"],
        },
        {
          title: "Capacity",
          expand: false,
          searchKey: "capacity",
          options: [
            {
              fullLabel: "Intimate event",
              value: "Intimate event",
              max: 100,
              min: 0,
            },
            {
              fullLabel: "Small event (100- 300 guests)",
              value: "Small event",
              max: 300,
              min: 100,
            },
            {
              fullLabel: "Medium event (300-700 guests)",
              value: "Medium event",
              max: 700,
              min: 300,
            },
            {
              fullLabel: "Large event (more than 700 guests)",
              value: "Large event",
              max: 0,
              min: 700,
            },
          ],
        },
        {
          title: "Rank",
          searchKey: "rank",
          expand: false,
        },
      ],
      filters: {
        rank: [],
      },
      searchModelLabels: {
        vendorCategory: "",
        location: "",
        capacity: null,
        rank: "Rank",
      },
      searchModel: {
        vendorCategory: "",
        location: "",
        capacity: "",
        rank: [],
      },
      searchLocation: {
        city: "",
        state: "",
        fullString: "",
      },
    };
  },
  mounted() {
    this.working = true;
    // this.$auth.currentUser(this, true, () => {
    this.$store.dispatch("common/fetchAllCategories").then((categories) => {
      const filterCategories = [];

      categories.forEach((category) => {
        if (category.type == "service") {
          filterCategories.push({
            title: category.fullTitle,
            value: category.key,
            icon: category.icon,
          });
        }
      });
      this.$set(this.filtersItems[0], "mainCategories", filterCategories.slice(0, 8));
      this.$set(this.filtersItems[0], "moreCategories", filterCategories.slice(8));
    });
    Vendors.find("categories").then((res) => {
      let list = [];
      _.each(res, (parentBuildingBlock) => {
        /* parentBuildingBlock.childComponents.forEach((bb)=>{
                            list.push({id: bb.id, value: bb.title});
                        }); */
        list.push({
          id: parentBuildingBlock.id,
          value: parentBuildingBlock.value,
        });
      });
      this.loadVendors();
      this.buildingBlocksList = list;
      console.log("vendor-pool.categories", list);
    });
    // })
  },
  methods: {
    loadVendors() {
      const params = {};
      Object.keys(this.searchModel).forEach((key) => {
        if (this.searchModel[key]) {
          if (key === "capacity") {
            params["minGuests"] = this.searchModel[key].min;
            params["maxGuests"] = this.searchModel[key].max;
          } else if (key === "rank") {
            params["rank"] = this.searchModel[key].join(",");
          } else {
            params[key] = this.searchModel[key];
          }
        }
      });
      new Vendors()
        .params(params)
        .limit(8)
        .page(this.page)
        .get()
        .then((vendors) => {
          console.log(vendors);
          this.pagingData = vendors[0].model;
          this.vendorsList = [...this.vendorsList, ...vendors[0].results];
          this.working = false;
        });
    },
    loadMoreVendor() {
      this.page = this.page + 1;
      this.loadVendors();
    },
    changeView(view) {
      this.view = view;
    },
    showDeleteAlert(vendor) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success confirm-btn-bg ",
        cancelButtonClass: "md-button md-danger cancel-btn-bg",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.working = true;

          vendor
            .delete()
            .then((result) => {
              let indx = _.findIndex(this.vendorsList, { id: vendor.id });
              this.vendorsList.splice(indx, 1);
              this.working = false;
            })
            .catch(() => {
              this.working = false;
            });
        }
      });
    },
    editVendorDetails(vendor) {
      this.$router.push({
        name: "EditVendor",
        params: { id: vendor.id, creation_mode: false },
      });
    },
    addNewVendor() {
      this.$router.push({
        name: "CreateVendor",
        props: { default: true, creation_mode: true },
      });
    },
    openUploadModal() {
      this.$refs.uploadModal.toggleModal(true);
    },
    expandFilter(index) {
      let indexOfExpandedItem = _.findIndex(this.filtersItems, {
        expand: true,
      });
      if (indexOfExpandedItem !== -1) this.filtersItems[indexOfExpandedItem].expand = false;
      this.filtersItems[index].expand = indexOfExpandedItem !== index ? true : false;
    },
    closeFileterPanel() {
      this.filtersItems.forEach((item, index) => {
        this.filtersItems[index].expand = false;
      });
    },
    searchByCategory(category) {
      this.searchModelLabels.vendorCategory = category.title;
      this.searchModel.vendorCategory = category.value;
      this.searchVendors();
    },
    searchByLocation() {
      this.searchModel.location = this.searchLocation.city;
      this.searchModelLabels.location = this.searchLocation.city;
      this.searchVendors();
    },
    searchByCapacity(selectedOption) {
      // console.log("selected Capacity", value);
      this.searchModel.capacity = selectedOption;
      this.searchModel.minGuests = selectedOption.min;
      this.searchModel.maxGuests = selectedOption.max;
      this.searchModelLabels.capacity = selectedOption.value;
      this.searchVendors();
    },
    searchByRank(rank) {
      console.log(rank);
      // this.searchModelLabels.rank = "";
      this.searchVendors();
    },
    searchByQuery(event) {
      this.searchModel.q = event.target.value;
      this.searchVendors();
    },
    searchVendors() {
      this.page = 1;
      this.vendorsList = [];
      this.closeFileterPanel();
      this.loadVendors();
    },
    getAddressData: function (addressData, placeResultData, id) {
      console.log(addressData);
      console.log(placeResultData);
      console.log(id);
      this.searchLocation.fullString = placeResultData.formatted_address;
      this.searchLocation.city = addressData.locality;
      this.value = `${addressData.route}  ${addressData.administrative_area_level_1}  ${addressData.country}`;
      this.$emit("change", this.value);
    },
    resetFilters() {
      this.searchModel = {
        location: "",
        vendorCategory: "",
        capacity: null,
        rank: "",
        minGuests: null,
        maxGuests: null,
      };
      this.searchVendors();
    },
  },
  computed: {
    pagingProgress() {
      return ((this.pagingData.limit * this.pagingData.page) / this.pagingData.total) * 100;
    },
    canLoadMore() {
      return this.pagingData.limit * this.pagingData.page < this.pagingData.total;
    },
    viewedCount() {
      if (this.pagingData.limit * this.pagingData.page > this.pagingData.total) {
        return this.pagingData.total;
      }
      return this.pagingData.limit * this.pagingData.page;
    },
  },
  watch: {},
  created() {},
};
</script>
<style lang="scss" scoped>
.vendors-pool-page {
  .filters-section__reset {
    cursor: pointer;
  }
}
%visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
}

/deep/ .star-rating {
  &__star {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
    font-size: 0.9em;
    color: #ababab;
    transition: color 0.2s ease-out;
    &.is-selected {
      color: #ffd700;
    }
  }
  &__checkbox {
    @extend %visually-hidden;
  }
}
</style>
