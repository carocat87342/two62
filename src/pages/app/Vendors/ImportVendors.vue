<template>
  <div class="md-layout-item md-size-50 wizard-pos import-vendors">
    <modal v-if="uploadModalOpen" @close="noticeModalHide" container-class="modal-container-wizard lg">
      <template slot="body">
        <div class="md-layout-item">
          <md-card>
            <md-card-header class="md-card-header-icon md-card-header-blue">
              <div class="card-icon" style="padding: 12px">
                <i class="fa fa-upload"></i>
              </div>
              <h4 class="title profile-title">
                <span>Upload Vendors</span>
                <button class="btn-position" @click="closeModal">
                  <i class="md-icon md-icon-font md-theme-defaul">close</i>
                </button>
              </h4>
            </md-card-header>
            <md-card-content style="min-height: 60px; padding: 48px">
              <div class="md-layout">
                <div class="md-layout-item md-size-20 state-area">
                  <div
                    class="md-lg md-theme-default"
                    style="border-radius: 6px"
                    v-bind:class="{ active: currentStep === 1 }"
                  >
                    <span class="fa fa-upload"></span>
                    <br />Upload File
                  </div>
                  <div
                    class="md-lg md-theme-default"
                    style="border-radius: 6px"
                    v-bind:class="{ active: currentStep === 2 }"
                  >
                    <span class="fa fa-edit"></span>
                    <br />Assign Columns
                  </div>
                  <div
                    class="md-lg md-theme-default"
                    style="border-radius: 6px"
                    v-bind:class="{ active: currentStep === 3 }"
                  >
                    <span class="fa fa-list-alt"></span>
                    <br />View Results
                  </div>
                </div>
                <div class="md-layout-item md-size-80">
                  <div class="step1" v-if="currentStep === 1" style="text-align: center">
                    <vue-element-loading :active="csvUploading" spinner="ring" color="#FF547C" />
                    <h3 class="title">Start by uploading a CSV file containing your list of vendors</h3>
                    <h5>
                      Don't worry about format and columns
                      <br />in the next step you will have the chance to easily assign column names.
                    </h5>
                    <div class="main-upload-box">
                      <drop @drop="handleDrop">
                        <draggable>
                          <div class="upload-option">
                            <div>Drag File Here</div>
                            <span>or</span>
                          </div>
                          <div class="upload-box">
                            <div class="upload-box_btn form-group">
                              <label for="csv_file" class="control-label col-sm-3 text-right">Browse</label>
                              <div class="col-sm-9">
                                <input
                                  type="file"
                                  id="csv_file"
                                  @change="(e) => sendCSVFile(e.target.files[0])"
                                  name="csv_file"
                                  class="csv_file form-control"
                                />
                              </div>
                            </div>
                          </div>
                        </draggable>
                      </drop>
                    </div>
                  </div>
                  <div class="step2" v-if="currentStep === 2" style="text-align: center">
                    <vue-element-loading :active="csvUploading" spinner="ring" color="#FF547C" />
                    <div class="table-section">
                      <h3 class="title">Great, now you can assign columns names to the columns from your file</h3>
                      <h5>
                        Each column header has a dropdown list of possible columns to assign, choose the one that
                        reflects your data as much as possible.
                      </h5>
                      <md-table class="border-table" v-if="parseCSV" style="max-width: 800px; overflow: auto">
                        <md-table-row style="border-top: none; padding-bottom: 0">
                          <md-table-cell
                            style="padding-top: 0; border: 0; padding-bottom: 0"
                            v-if="column !== ''"
                            v-for="(column, index) in parseCSV.columns"
                            :key="index"
                            @click="sortBy(index)"
                            :class="{ active: sortKey === index }"
                          >
                            <md-field>
                              <md-select
                                id="remove-border"
                                class="no-underline"
                                v-model="mappedColumns[index].value"
                                @md-selected="preventDuplication($event)"
                                placeholder="Select Column Name"
                                name="select"
                              >
                                <md-option
                                  v-if="item !== ''"
                                  v-for="(item, index) in databaseVendorColumnsClone"
                                  :value="item.name"
                                  :key="item.name"
                                  >{{ item.displayName }}</md-option
                                >
                              </md-select>
                            </md-field>
                          </md-table-cell>
                        </md-table-row>
                        <md-table-row
                          v-bind:class="{ 'no-border': rowIndex === 0 }"
                          v-for="(row, rowIndex) in parseCSV.rows"
                          :key="rowIndex"
                        >
                          <md-table-cell
                            v-bind:class="{ 'no-border': rowIndex === 0 }"
                            v-for="(column, columnIndex) in parseCSV.columns"
                            :key="columnIndex"
                            >{{ row[column] }}</md-table-cell
                          >
                        </md-table-row>
                      </md-table>
                    </div>
                  </div>
                  <div class="step3" v-if="currentStep === 3">
                    <h3>Awesome, your vendors list is uploaded</h3>
                    <h5>You can review the results of the process here.</h5>
                    <p>Rows processed: {{ finalResult.processed }}</p>
                    <p>Total: {{ finalResult.total }}</p>
                    <p>Duplicates: {{ finalResult.duplicates }}</p>
                  </div>
                </div>
              </div>
            </md-card-content>
            <md-card-actions v-if="currentStep > 1">
              <div class="md-layout">
                <div class="md-layout-item md-medium-size-100 md-xsmall-size-100">
                  <button class="md-button next-btn" v-if="currentStep === 2" v-on:click="goToStep(currentStep + 1)">
                    NEXT
                  </button>
                  <button class="md-button next-btn" v-if="currentStep === 3" v-on:click="closeModal">FINISH</button>
                </div>
              </div>
            </md-card-actions>
          </md-card>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import Vendors from "@/models/Vendors";
import VendorsFile from "@/models/VendorsFile";
import vendorsModule from "./vendors.vuex";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { GlobalSalesTable, Modal } from "@/components";
import Swal from "sweetalert2";
import _ from "underscore";
import * as lodash from "lodash";
import VueElementLoading from "vue-element-loading";
import Button from "../../../components/Button/ControlPanel";
import draggable from "vuedraggable";
import { Drop, Drag } from "vue-drag-drop";

export default {
  components: {
    Button,
    Modal,
    GlobalSalesTable,
    VueElementLoading,
    draggable,
    Drag,
    Drop,
  },
  data() {
    return {
      uploadModalOpen: false,
      openWizard: true,
      channel_name: "",
      type: "",
      models: [],
      finalResult: {
        processed: 0,
        total: 0,
        duplicates: 0,
      },
      csvUploading: false,
      databaseVendorColumns: [],
      channel_fields: [],
      channel_entries: [],
      parse_header: [],
      parseCSV: [],
      sortOrders: {},
      sortKey: "",
      rawCSVFile: null,
      currentStep: 1,
      mappedColumns: [],
      // step1:true,
      // step2:false,
      // step3:false,
    };
  },
  created() {
    this.$store.registerModule("vendorsVuex", vendorsModule);
    this.csvUploading = false;
    this.databaseVendorColumns = [
      {
        displayName: "Vendor Display Name",
        name: "vendorDisplayName",
        value: "vendorDisplayName",
        mandatory: true,
      },
      {
        displayName: "Contact Person Name",
        name: "contactPersonName",
        value: "contactPersonName",
        mandatory: true,
      },
      {
        displayName: "Contact Person Email",
        name: "contactPersonEmail",
        value: "contactPersonEmail",
        mandatory: false,
      },
      {
        displayName: "Contact Person Phone Number",
        name: "contactPersonPhone",
        value: "contactPersonPhone",
        mandatory: false,
      },
      {
        displayName: "Vendor Main Email",
        name: "vendorMainEmail",
        value: "vendorMainEmail",
        mandatory: true,
      },
      {
        displayName: "Vendor Main Phone Number",
        name: "vendorMainPhoneNumber",
        value: "vendorMainPhoneNumber",
        mandatory: true,
      },
      {
        displayName: "Vendor Website",
        name: "vendorWebsite",
        value: "vendorWebsite",
        mandatory: false,
      },
      {
        displayName: "Vendor Category",
        name: "vendorCategory",
        value: "vendorCategory",
        mandatory: false,
      },
      /* {
                  displayName: 'Product Category',
                  name: 'productsCategory',
                  value: 'productsCategory',
                    mandatory: false

                }, */

      {
        displayName: "Vendor Address Line 1",
        name: "vendorAddressLine1",
        value: "vendorAddressLine1",
        mandatory: false,
      },
      {
        displayName: "Vendor Country",
        name: "vendorCountry",
        value: "vendorCountry",
        mandatory: false,
      },
    ];

    this.databaseVendorColumnsClone = { ...this.databaseVendorColumns };
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
  methods: {
    ...mapMutations("vendorsVuex", ["setFileToState"]),
    closeModal() {
      this.goToStep(1);
      this.uploadModalOpen = false;
    },
    noticeModalHide: function () {
      this.uploadModalOpen = false;
    },
    toggleModal: function (show) {
      this.uploadModalOpen = show;
    },
    updateVendorsFile: async function () {
      if (!this.parseCSV.id) {
        return true;
      }
      let vendorFile = await VendorsFile.find(this.parseCSV.id);
      let columnsMapping = [];
      let mapping = {};
      this.parseCSV.columns.map((item, index) => {
        if (item !== "") {
          mapping[item] = this.mappedColumns[index].value;
        }
      });
      vendorFile.columnsMapping = mapping;
      // validate column mapping
      if (!this.validateColumnsMapping(mapping)) {
        return false;
      }
      this.csvUploading = true;
      let finalResponse = await vendorFile.save();
      this.finalResult = finalResponse;
      return true;
    },
    preventDuplication(event) {
      if (event) {
        this.databaseVendorColumnsClone = lodash.differenceWith(
          this.databaseVendorColumns,
          this.mappedColumns,
          ({ name }, { value }) => name === value,
        );
        this.$forceUpdate();
      }
    },
    validateColumnsMapping(mapping) {
      let _this = this;
      let vendorColumns = this.databaseVendorColumns;
      let isValid = true;
      for (let i = 0; i < vendorColumns.length; i++) {
        if (vendorColumns[i].mandatory) {
          if (Object.values(mapping).indexOf(vendorColumns[i].name) === -1) {
            this.$notify({
              message: "Field " + vendorColumns[i].displayName + " is mandatory.",
              horizontalAlign: "center",
              verticalAlign: "top",
              icon: "warning",
            });
            isValid = false;
            break;
          }
        }
      }
      return isValid;
    },
    sortBy: function (key) {
      let vm = this;
      vm.sortKey = key;
      vm.sortOrders[key] = vm.sortOrders[key] * -1;
    },
    setCSV(event, id) {},
    async sendCSVFile(file) {
      this.csvUploading = true;
      let reader = new FileReader();
      let _this = this;

      reader.onload = (e) => {
        let vendorsFile = new VendorsFile({ vendorsFile: e.target.result });
        vendorsFile
          .save()
          .then((result) => {
            _this.parseCSV = result;
            _this.parseCSV.newColumns = [];
            _this.parseCSV.columns.map((item, index) => {
              /* if (item !== '' && !item.toString().toLowerCase().startsWith("unknown")) {
                              let mapping = {};
                              _this.databaseVendorColumns[index].value = item;

                              _this.parseCSV.newColumns.push(mapping);

                            } */
              if (item !== "") {
                let mapping = {};
                _this.databaseVendorColumns[index].value = item;
                _this.parseCSV.newColumns.push(mapping);
              }
              _this.mappedColumns.push({});
            });
            _this.csvUploading = false;
            this.$notify({
              message: "Vendor file is uploaded successfully",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "success",
            });
            _this.goToStep(2);
          })
          .catch((error) => {
            _this.csvUploading = false;
            this.$notify({
              message: "Vendor file is not uploaded, please try again",
              horizontalAlign: "center",
              verticalAlign: "top",
              icon: "warning",
            });

            console.log(error);
          });
      };
      reader.readAsDataURL(file);
    },
    backToVendor() {
      this.$notify({
        message: "Vendor imported successfully",
        horizontalAlign: "center",
        verticalAlign: "top",
        type: "success",
      });
      this.uploadModalOpen = false;
      //          this.$router.push('/vendors');
    },
    goToStep(step) {
      if (step === 3) {
        this.csvUploading = true;
        this.$nextTick(() => {
          this.updateVendorsFile().then((isUpdated) => {
            this.csvUploading = false;
            if (isUpdated) {
              this.$set(this, "currentStep", step);
              this.$emit("vendorImported");
            }
          });
        });
      } else {
        this.$set(this, "currentStep", step);
      }
    },
    handleDrop(data, event) {
      this.sendCSVFile(event.dataTransfer.files[0]);
    },
  },
};
</script>
<style lang="scss">
.import-vendors {
  .step1 {
    p {
      text-align: center;
    }
  }
  .step3 {
    text-align: center;
    span {
      display: block;
    }
  }
  .main-upload-box {
    padding: 10px;
    text-align: center;
    border: 2px dashed #f2f2f2 !important;
    .upload-option {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .upload-box {
      & span {
        display: inline-block;
      }
      &_btn {
        padding: 5px 20px;
        background: linear-gradient(60deg, #ffa726, #fb8c00);
        width: 88px;
        cursor: pointer;
        height: 35px;
        border-radius: 2px;
        color: #fff;
        display: inline-block;
      }
    }
  }
  .border-table {
    border-collapse: collapse;
  }

  .border-table tr {
    border-top: 1px solid #a9afbb;
  }
  .border-table tr td {
    padding: 15px;
    white-space: nowrap;
  }
  .table-section {
    width: 100%;
    max-height: 370px;
    // overflow: auto;
  }
  .wizard-pos {
    position: relative;
  }
  .finish-btn {
    position: absolute;
    background-color: #ff547c !important;
    bottom: -61px;
    right: 15px;
    z-index: 9999999;

    &:hover {
      background-color: #ff547c !important;
    }
  }
  #\32 > section > table > thead > tr > th > div > div {
    z-index: 9999;
    border: 1px solid white !important;
    padding: 0px 15px;
  }
  .btn-position {
    position: absolute;
    right: 15px;
    font-weight: bold;
    top: 20px;
    font-size: 17px;
    background-color: transparent !important;
    box-shadow: none !important;
    color: gray !important;
    border-color: transparent;
    cursor: pointer;

    &:hover,
    &:visited,
    &:focus,
    &:active {
      background-color: transparent !important;
      box-shadow: none !important;
      color: gray !important;
    }
  }
  .header-position {
    position: relative;
  }
  .no-border {
    border: 0 !important;
  }
  .state-area {
    .md-theme-default {
      &.active {
        background: #00bcd4;
        color: #fff;
      }
      cursor: default;
      text-align: center;
      box-shadow: none;
      background: transparent;
      padding: 20px;
      width: 75%;
      color: #959595;
      span {
        padding: 0 0 15px 0;
      }
    }
  }
  .next-btn {
    background: #0caf50 !important;
    font-size: 10px;
    float: right;
    padding: 10px;
    right: 15px;
  }
}
</style>
