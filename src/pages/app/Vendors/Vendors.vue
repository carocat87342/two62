<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-50">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-warning">
          <div class="card-text">
            <h4 class="title" style="color: white">Vendors Pool</h4>
            <div class="ct-label">See all vendors uploaded below</div>
          </div>
          <div class="table table-stats vendors-actions-list">
            <md-button name="vendors-add-vendor" class="vendors-add-vendor md-info" @click="openInviteModal">
              Add Vendor
            </md-button>
            <md-button name="vendors-upload-vendors" @click="openUploadModal" class="vendors-upload-vendors md-info">
              Upload Excel File
            </md-button>
          </div>
        </md-card-header>
        <md-switch
          class="md-switch-info pull-right text-right"
          style="padding: 0; margin: 12px"
          @change="fetchData(1)"
          v-model="myVendors"
        >
          My vendors
        </md-switch>
        <md-card-content style="min-height: 60px">
          <Loader :active="loadingData" page="vendor"/>
          <vendors-table
            v-if="vendorsList"
            :tooltipModels="tooltipModels"
            @select-vendor="onSelectVendor"
            @close-vendor="onCloseVendorForm"
            :vendorsList="vendorsList"
            :fetchVendors="fetchData"
            mode="listing"
            ref="VendorsTable"
            :buildingBlocksList="buildingBlocksList"
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
    <div class="md-layout-item md-size-50" v-if="vendor_selected || add_vendor">
      <company-form
        :categories.sync="buildingBlocksList"
        :selected_vendor="selected_vendor"
        :creation_mode="add_vendor"
        @vendorCreated="fetchData(1)"
        @selectVendor="onSelectVendor"
      ></company-form>
    </div>
    <create-modal @vendorCreated="fetchData(1)" ref="inviteModal"></create-modal>
    <upload-modal @vendorImported="fetchData(1)" ref="uploadModal"></upload-modal>
  </div>
</template>

<script>
import CreateModal from "./CreateModal";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import VendorsTable from "./Table/vendorsList";
import companyForm from "./Form/companyForm.vue";
import UploadModal from "./ImportVendors";
import { Loader, Pagination } from "@/components";
import Vendors from "@/models/Vendors";
import EventComponent from "@/models/EventComponent";
import VendorCategories from "@/models/VendorCategories";
// import auth from '@/auth';
import { paginationMixins } from "@/mixins";

export default {
  components: {
    CreateModal,
    "vendors-table": VendorsTable,
    Loader,
    UploadModal,
    Pagination,
    companyForm,
  },
  mixins: [paginationMixins],
  data() {
    return {
      // auth: auth,
      vendorsList: [],
      tooltipModels: [],
      loadingData: true,
      importClicked: false,
      tableHidden: true,
      selected_vendor: {},
      add_vendor: false,
      vendor_selected: false,
      buildingBlocksList: [],
      myVendors: false,
    };
  },
  created() {
    this.$auth.currentUser(
      this,
      true,
      function () {
        this.fetchData(0);
      }.bind(this),
    );
  },
  methods: {
    ...mapMutations("vendors", ["resetForm"]),

    fetchData(page, catId = "") {
      this.loadingData = true;

      new EventComponent().get().then((res) => {
        let list = [];
        res.forEach((parentBuildingBlock) => {
          /* parentBuildingBlock.childComponents.forEach((bb)=>{
              list.push({id: bb.id, value: bb.title});
          }); */
          list.push({
            id: parentBuildingBlock.id,
            value: parentBuildingBlock.value,
          });
        });
        this.buildingBlocksList = list;
      });

      Vendors.page(page)
        .limit(this.pagination.limit)
        .params({
          vendorCategory: catId,
          shared: !this.myVendors,
        })
        .get()
        .then(
          (vendors) => {
            this.vendorsList = vendors[0].results;

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
    openInviteModal() {
      //        this.$refs.inviteModal.toggleModal(true);
      //        this.resetForm();
      this.$set(this, "vendor_selected", false);
      this.$set(this, "selected_vendor", {});
      this.$set(this, "add_vendor", true);
      this.$refs.VendorsTable.resetSelectedVendor({});
    },
    openUploadModal() {
      this.$refs.uploadModal.toggleModal(true);
    },
    onSelectVendor(data) {
      this.$set(this, "vendor_selected", true);
      this.$set(this, "selected_vendor", data);
      this.$set(this, "add_vendor", false);
    },
    onCloseVendorForm(data) {
      this.$set(this, "vendor_selected", false);
      this.$set(this, "selected_vendor", {});
      this.$set(this, "add_vendor", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.md-table-head-label {
  font-weight: 500;
}
</style>
