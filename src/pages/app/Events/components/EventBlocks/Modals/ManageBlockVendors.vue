<template>
  <div class="adding-building-blocks-panel">
    <vue-element-loading :active="isLoading" spinner="ring" is-full-screen color="#FF547C" isFullScreen />
    <div class="md-layout" style="max-height: 50vh">
      <div class="md-layout-item md-size-5" style="padding: 0; margin: 0">
        <h4 class="md-title">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon"
            ><md-icon>arrow_back</md-icon></md-button
          >
        </h4>
      </div>
      <div class="md-layout-item md-size-95" style="max-height: 50vh">
        <h4 class="md-title" style="margin-bottom: 0; line-height: 51px">
          Manage Block Vendors

          <div class="header-actions pull-right" style="margin-top: 0.5em">
            <md-button class="md-info event-building-blocks-upload-vendors-button" @click="openUploadModal">
              Upload Vendors
            </md-button>
          </div>
        </h4>

        <div class="md-layout" style="overflow: auto; max-height: 80vh">
          <md-card>
            <md-card-content>
              <vendors-table
                v-if="vendorsList"
                :tooltipModels="tooltipModels"
                @add-vendor="onSelectVendor"
                @remove-vendor="onRemoveVendor"
                :vendorsList="vendorsList"
                :selectedBlock="selectedBlock"
                :event="event"
                mode="manageBlock"
                ref="VendorsTable"
              >
              </vendors-table>

              <md-card-actions md-alignment="space-between" v-if="pagination.limit < pagination.total">
                <div class="">
                  <p class="card-category">
                    Showing {{ pagination.from }} to
                    {{ pagination.limit < pagination.total ? pagination.limit : pagination.total }} of
                    {{ pagination.total }} records
                  </p>
                </div>
                <pagination
                  class="pagination-no-border pagination-info"
                  @input="pageChanged($event)"
                  v-model="pagination.page"
                  :per-page="pagination.limit"
                  :total="pagination.total"
                >
                </pagination>
              </md-card-actions>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>

    <upload-vendors-modal ref="uploadModal"></upload-vendors-modal>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import Vendors from "@/models/Vendors";
import EventComponentVendor from "@/models/EventComponentVendor";
import { paginationMixins } from "@/mixins";
import { Pagination } from "@/components";

import VendorsTable from "../../../../Vendors/Table/vendorsList";
import UploadVendorsModal from "../../../../Vendors/ImportVendors";
import MdCardContent from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardContent/MdCardContent.vue";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";

export default {
  components: {
    MdCardContent,
    VueElementLoading,
    Pagination,
    VendorsTable,
    UploadVendorsModal,
  },
  props: {
    event: Object,
    selectedBlock: Object,
  },
  data: () => ({
    // auth: auth,
    isLoading: false,
    vendorsList: null,
    pagination: {
      limit: 10,
      total: 0,
      page: 1,
    },
    tooltipModels: [],
  }),
  mixins: [paginationMixins],

  created() {
    this.$auth.currentUser(
      this,
      true,
      function () {
        this.fetchData(0);
      }.bind(this),
    );
  },
  mounted() {},
  methods: {
    closePanel() {
      this.$emit("closePanel");
      this.$root.$emit("VendorAdded");
      this.$root.$emit("refreshBuildingBlock");
    },
    fetchData(page) {
      this.loadingData = true;
      this.isLoading = true;

      Vendors.page(page)
        .limit(this.pagination.limit)
        .get()
        .then(
          (vendors) => {
            this.isLoading = false;

            this.vendorsList = vendors[0].results;
            this.pagination.total = this.vendorsList.length;

            this.updatePagination(vendors[0].model);
            this.loadingData = false;
            this.vendorsList.map((item, index) => {
              this.tooltipModels.push({
                value: false,
                textarea: "",
                rankingParameters: [
                  {
                    name: "Overal Experience",
                    parameterName: "overal_experience",
                    value: "",
                  },
                  {
                    name: "Cleanliness and Maintenance",
                    parameterName: "cleanliness_and_maintenance",
                    value: "",
                  },
                  {
                    name: "Accuracy",
                    parameterName: "accuracy",
                    value: "",
                  },
                  {
                    name: "Value for money",
                    parameterName: "value_for_money",
                    value: "",
                  },
                  {
                    name: "Service",
                    parameterName: "service",
                    value: "",
                  },
                  {
                    name: "Location & Parking",
                    parameterName: "location_parking",
                    value: "",
                  },
                ],
              });
            });
          },
          (error) => {
            console.log(error);
          },
        );
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
          this.$notify({
            message: "Vendor added successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
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
    openUploadModal() {
      this.$refs.uploadModal.toggleModal(true);
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
          this.$notify({
            message: "Vendor deleted successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
        })
        .catch((error) => {
          this.isLoading = false;

          console.log("EventComponentVendor error =>", error);

          this.$notify({
            message: "Error while trying to delete vendor, try again!",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
  },
  computed: {},
};
</script>
