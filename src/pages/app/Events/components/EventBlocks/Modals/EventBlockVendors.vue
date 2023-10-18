<template>
  <div class="adding-building-blocks-panel">
    <div class="md-layout">
      <div class="md-layout-item md-size-100">
        <h4 class="md-title" style="margin-bottom: 0; line-height: 51px">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
            <md-icon>arrow_back</md-icon>
          </md-button>
          {{ categoryTitle }}'s Vendors List
          <div class="header-actions pull-right">
            <md-button
              v-if="blockVendors.length && !isLoading"
              class="md-primary md-sm"
              @click="manageVendors()"
              :disabled="isLoading"
              >Manage Vendors</md-button
            >
          </div>
        </h4>

        <div class="md-layout">
          <div class="md-layout-item md-size-100" style="padding-left: 42px; min-height: 240px">
            <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
            <div style="padding-left: 6px">Send vendors of your choice a request for proposal</div>
            <md-card v-show="blockVendors.length && !isLoading" class="md-card-plain clear-margins">
              <md-card-content>
                <md-table v-model="filteredBlockVendors" table-header-color="orange" class="vendors-table">
                  <md-table-toolbar>
                    <div class="md-toolbar-section-start">
                      <md-field>
                        <md-input
                          type="search"
                          class="mb-3"
                          clearable
                          placeholder="Search vendors"
                          v-model="searchQuery"
                        ></md-input>
                      </md-field>
                    </div>
                    <div class="md-toolbar-section-end" v-if="false">
                      <md-button class="md-icon-button">
                        <md-icon>delete</md-icon>
                      </md-button>
                    </div>
                  </md-table-toolbar>

                  <md-table-row
                    :class="[{ 'table-warning': item.rfpStatus === 'Sent' }]"
                    slot="md-table-row"
                    slot-scope="{ item }"
                    :key="blockVendors.indexOf(item)"
                  >
                    <md-table-cell md-label="Vendor Name">
                      <a href="javascript: void(null);" @click="vendorDetails(item.vendor)">{{
                        item.vendor ? item.vendor.vendorDisplayName : item.vendor.vendorMainEmail
                      }}</a>
                    </md-table-cell>
                    <md-table-cell md-label="Rank">
                      <vue-stars
                        :name="item.id"
                        active-color="#ffdd00"
                        inactive-color="#999999"
                        shadow-color="#ffff00"
                        hover-color="#dddd00"
                        :max="5"
                        :value="item.vendor ? item.vendor.rank : 0"
                        :readonly="false"
                        char="★"
                        inactive-char
                        class="disabled"
                      />
                    </md-table-cell>
                    <md-table-cell md-label="Inquiry Status">
                      <template v-if="item.rfpStatus === 'Ready to send' || item.rfpStatus === null">{{
                        `Ready`
                      }}</template>
                      <template v-else-if="item.rfpStatus === 'Sent'"
                        >{{ `Request sent ` }} {{ getVendorDate(item.rfpSentMillis) }}</template
                      >
                      <template v-else-if="item.rfpStatus === ''">Ready</template>
                    </md-table-cell>
                    <md-table-cell class="vendors-table_item-actions">
                      <vue-element-loading :active="sendingRfp" spinner="ring" color="#FF547C"></vue-element-loading>
                      <md-button
                        v-if="!sendingRfp && (item.rfpStatus === 'Ready to send' || item.rfpStatus === null)"
                        class="md-primary md-just-icon md-round"
                        style="font-size: 20px"
                        @click="sendVendor(item)"
                      >
                        <md-icon>near_me</md-icon>
                        <md-tooltip class="md-primary">Send RFP</md-tooltip>
                      </md-button>
                    </md-table-cell>
                  </md-table-row>
                </md-table>
              </md-card-content>
            </md-card>

            <!--<template v-if="!blockVendors.length && !isLoading">
                            <md-card >
                                <md-card-content>
                                    <h5 >Your vendors list is empty</h5>
                                    <p >import your vendors and refresh this page after you're done</p>
                                </md-card-content>
                            </md-card>

            </template>-->

            <md-card class="md-card-plain" v-if="!blockVendors.length && !isLoading">
              <md-card-content>
                <div class="text-center">
                  <img src="https://static-maryoku.s3.amazonaws.com/storage/img/paperandpen.png" style="width: 120px" />
                  <h4>No vendors found that match '{{ categoryTitle }}'</h4>
                  <md-button class="md-purple md-sm" @click="manageVendors">Manage Vendors Pool</md-button>
                </div>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
    </div>

    <upload-vendors-modal ref="uploadModal"></upload-vendors-modal>
  </div>
</template>
<script>
import Swal from "sweetalert2";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import Vendors from "@/models/Vendors";
import EventComponentVendor from "@/models/EventComponentVendor";
import VueElementLoading from "vue-element-loading";
import { Pagination } from "@/components";
import _ from "underscore";
import moment from "moment";

// import auth from '@/auth';

import UploadVendorsModal from "../../../../Vendors/ImportVendors";
import ManageBlockVendors from "./ManageBlockVendors.vue";
import ViewProposals from "./ViewProposals.vue";
import MdCardContent from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardContent/MdCardContent.vue";
import MdCardHeader from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardHeader/MdCardHeader.vue";
import VendorsTable from "@/pages/app/Vendors/Table/vendorsList";
import VendorsPoolPanel from "@/pages/app/Vendors/VendorsPoolPanel";
import companyForm from "@/pages/app/Vendors/Form/companyForm";

export default {
  name: "event-blocks-vendors",
  components: {
    MdCardHeader,
    MdCardContent,
    VueElementLoading,
    UploadVendorsModal,
    ManageBlockVendors,
    ViewProposals,
    VendorsTable,
    Pagination,
  },
  props: {
    selectedBlock: Object,
    event: Object,
    caseStatus: {
      type: String,
      default: null,
    },
    categoryTitle: String,
  },
  data: () => ({
    // auth: auth,
    isLoading: true,
    loadingData: false,
    blockVendors: [],
    filteredBlockVendors: [],
    selectedVendors: null,
    selectedVendor: null,
    addingVendors: false,
    vendorsList: null,
    pagination: {
      limit: 10,
      total: 0,
      page: 1,
    },
    tooltipModels: [],
    searchQuery: "",
    sendingRfp: false,
  }),
  methods: {
    openUploadModal() {
      this.$refs.uploadModal.toggleModal(true);
    },
    closePanel() {
      this.$emit("closePanel");
      this.$root.$emit("refreshBuildingBlock");
    },
    manageBlockVendors() {
      this.addingVendors = true;
      this.selectedVendor = null;
    },
    getBlockVendors() {
      this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentVendor()
        .for(calendar, event, selected_block)
        .get()
        .then((resp) => {
          this.isLoading = false;
          this.blockVendors = resp;
          this.filteredBlockVendors = this.blockVendors;
        })
        .catch((error) => {
          this.isLoading = false;
          console.log("EventComponentVendor error =>", error);
        });
    },
    viewProposals(item) {
      this.selectedVendor = item;
      this.addingVendors = false;
    },
    onSelectVendor(data) {
      this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      let vendor = {};
      vendor.vendorId = data.id;

      new EventComponentVendor(vendor)
        .for(calendar, event, selected_block)
        .save()
        .then((resp) => {
          this.isLoading = false;
          this.$root.$emit("VendorAdded");
          this.fetchData(0);

          this.$notify({
            message: "Vendor added successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });

          this.$forceUpdate();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log("EventComponentVendor error =>", error);

          this.$notify({
            message: "Error while trying to add vendor, try again!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
    onRemoveVendor(data) {
      this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      let vendor = new EventComponentVendor({ id: data.id });
      vendor
        .for(calendar, event, selected_block)
        .delete()
        .then((resp) => {
          this.isLoading = false;
          this.$root.$emit("VendorAdded");
          this.fetchData(0);
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    getVendorDate(eventStartMillis) {
      let x = new Date(eventStartMillis);

      return moment(x).fromNow();
    },
    sendVendor(item) {
      // this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      let vendor = new EventComponentVendor(item);

      vendor.id = item.id;
      vendor.cost = item.cost;
      vendor.vendor = item.vendor;
      vendor.vendorId = item.vendorId;
      vendor.rfpStatus = "Sent";

      vendor
        .for(calendar, event, selected_block)
        .save()
        .then((resp) => {
          this.getBlockVendors();

          this.$forceUpdate();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log("EventComponentVendor error =>", error);

          this.$notify({
            message: "Error while trying to add vendor, try again!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
    manageVendors() {
      // this.$router.push({ path: `/vendors-pool`});
      window.currentPanel = this.$showPanel({
        component: VendorsPoolPanel,
        cssClass: "md-layout-item md-size-85 transition36 bg-grey",
        openOn: "right",
        props: {},
      });

      let slideoutPanelBg = document.getElementsByClassName("slideout-panel-bg");
      if (slideoutPanelBg && slideoutPanelBg.length > 0) {
        slideoutPanelBg[0].style = "z-index: 101";
      }
      window.currentPanel.promise.then((res) => {
        if (slideoutPanelBg && slideoutPanelBg.length > 0) {
          slideoutPanelBg[0].style = "z-index: 100";
        }
      });
    },
    filterVendors() {
      this.filteredBlockVendors = _.filter(this.blockVendors, (v) => {
        return v.vendor.vendorDisplayName.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      });
    },
    vendorDetails(vendor) {
      window.currentPanel = this.$showPanel({
        component: companyForm,
        cssClass: "md-layout-item md-size-40 transition36 ",
        openOn: "right",
        disableBgClick: false,
        props: {
          categories: this.buildingBlocksList,
          selected_vendor: vendor,
          creation_mode: false,
        },
      });

      let slideoutPanelBg = document.getElementsByClassName("slideout-panel-bg");
      if (slideoutPanelBg && slideoutPanelBg.length > 0) {
        slideoutPanelBg[0].style = "z-index: 101";
      }

      window.currentPanel.promise.then((res) => {
        if (slideoutPanelBg && slideoutPanelBg.length > 0) {
          slideoutPanelBg[0].style = "z-index: 100";
        }
      });
    },
    onSelect(item) {
      // console.log(item);
    },
  },
  created() {
    if (this.caseStatus === "get-offers") {
      this.addingVendors = true;
    }
  },
  mounted() {
    this.isLoading = false;
    this.getBlockVendors();
    this.$root.$on("VendorAdded", () => {
      this.getBlockVendors();
    });
  },
  computed: {},
  watch: {
    searchQuery(newVal, oldVal) {
      this.filterVendors();
    },
    selectedVendors(newVal, oldVal) {
      console.log(newVal);
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
