<template>
  <div class="card vendor-list-all">
    <loader :active="loading" is-full-screen/>
    <h1>All Vendors</h1>
    <md-table v-model="vendors" :md-sort.sync="sortFields.sort" :md-sort-order.sync="sortFields.order" :md-sort-fn="sort">
        <md-table-toolbar>
            <div class="md-toolbar-section-start">
                <md-button @click="exportXls" class="md-simple md-red maryoku-btn">Export XLSX</md-button>
            </div>

            <md-field md-clearable class="md-toolbar-section-end">
                <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
            </md-field>
        </md-table-toolbar>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ pagination.limit * (pagination.page - 1) + getIndex(item) + 1 }}</md-table-cell>
          <md-table-cell md-label="Company" md-sort-by="companyName">{{ item.companyName }} </md-table-cell>
          <md-table-cell md-label="URL" md-sort-by="id">
            <div class="d-flex align-center">
                <a :href="`${currentPath}/#/vendor/edit/${item.id}`" target="_blank" class="mr-10">{{ item.id }}</a>
                <md-button
                class="md-simple md-red edit-btn md-just-icon"
                @click="copyUrl(`${currentPath}/#/vendor/edit/${item.id}`)"
                v-clipboard:copy="`${currentPath}/#/vendor/edit/${item.id}`"
                v-clipboard:success="onCopy"
                v-clipboard:error="onCopyError"
            ><md-icon>content_copy</md-icon></md-button>
            </div>
            </md-table-cell>
          <md-table-cell md-label="Name" md-sort-by="vendorDisplayName">{{
            item.tenantUser ? item.tenantUser.username : ""
            }}</md-table-cell>
          <md-table-cell md-label="Category" md-sort-by="eventCategory.title">{{
            item.eventCategory ? item.eventCategory.title : ""
            }}</md-table-cell>
          <md-table-cell md-label="Email" md-sort-by="vendorMainEmail">{{ item.vendorMainEmail }}</md-table-cell>

          <md-table-cell md-label="Address" md-sort-by="vendorAddresses">{{
            item.vendorAddresses && item.vendorAddresses.length ? item.vendorAddresses[0] : ""
            }}</md-table-cell>
          <md-table-cell md-label="Count" md-sort-by="proposals">{{
                item.proposals
            }}</md-table-cell>
          <md-table-cell>
            <md-button class="md-icon-button md-simple collapse-button" @click="handleSelect(item)">
              <md-icon>{{`${selectedIdx !== item.id ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}`}} </md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
    </md-table>
      <div class="d-flex align-center">
          <div class="ml-auto font-size-14">Vendors per page</div>
          <md-field class="w-max-80 ml-10">
              <md-select v-model="pagination.limit" name="vendorPerPage" id="vendorPerPage" @md-selected="updatePagination">
                  <md-option :value="10">10</md-option>
                  <md-option :value="25">25</md-option>
                  <md-option :value="50">50</md-option>
                  <md-option :value="100">100</md-option>
              </md-select>
          </md-field>
          <div>{{`${pagination.limit * (pagination.page - 1) + 1} - ${pagination.limit * pagination.page < pagination.total ?
              pagination.limit * pagination.page : pagination.total} of ${pagination.total}`}}</div>
          <md-button class="md-icon-button md-simple collapse-button ml-10" @click="preview">
              <md-icon>keyboard_arrow_left</md-icon>
          </md-button>
          <md-button class="md-icon-button md-simple collapse-button" @click="next">
              <md-icon>keyboard_arrow_right</md-icon>
          </md-button>
      </div>
    <md-dialog-alert :md-active.sync="showAlert" md-content="Copied vendor link!" md-confirm-text="Cool!" />
    <Modal containerClass="modal-container no-header no-footer" v-if="showProposalTable">
      <template slot="body">
        <ProposalTable :proposals="vendorProposals" @close="closeModal()"></ProposalTable>
      </template>
    </Modal>
  </div>
</template>
<script>
import Vendor from "@/models/Vendors";
import Proposal from "@/models/Proposal";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { VENDOR_PAGE_PAGINATION } from "@/constants/pagination";
const ProposalTable = () => import('./components/ProposalTable')
import { PROPOSAL_STATUS } from "@/constants/status";

const components = {
    Loader: () => import('@/components/loader/Loader.vue'),
    Modal: () => import('@/components/Modal.vue'),
    FadeTransition: () => import('vue2-transitions'),
    ProposalListItem: () => import('@/pages/app/Vendors/components/ProposalListItem'),
}


export default {
  components : {...components, ProposalTable},
  data() {
    return {
      vendors: [],
      showAlert: false,
      currentPath: location.origin,
      loading: true,
      search: '',
      selectedIdx: null,
      pagination: VENDOR_PAGE_PAGINATION,
      sortFields: { sort: "url", order: "asc" },
      vendorProposals: [],
      showProposalTable: false,
    };
  },
  async created() {
      this.vendors = await this.getVendors();
  },
  methods: {
    async getVendors() {
      this.loading = true;

      let query = new Vendor();
      query.page(this.pagination.page).limit(this.pagination.limit)
      query.params({...this.sortFields, q: this.search.toLowerCase()});
      let res = await query.get();

      Object.keys(this.pagination).forEach(key => {
          this.pagination[key] = parseInt(res[0].model[key]);
      })
      this.loading = false;

      return res[0].results
    },
    copyUrl(url) {},
    onCopy() {
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 2000);
    },
    onCopyError() {},
    exportXls() {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const exportVendors = [];
      this.vendors.forEach((item, index) => {
        exportVendors.push({
          number: index + 1,
          companyName: item.companyName,
          editUrl: `${this.currentPath}/#/vendor-signup/edit/${item.id}`,
          userName: item.vendorDisplayName,
          category: item.eventCategory ? item.eventCategory.title : "",
          email: item.vendorMainEmail,
          address: item.vendorAddresses[0],
          contactPerson: item.contactPerson,
        });
      });
      const ws = XLSX.utils.json_to_sheet(exportVendors);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "vendors.xlsx");
    },
    async handleSelect(item){
      if ( this.selectedIdx !== item.id) {
        this.loading = true;
        this.selectedIdx = item.id;

        let query = new Proposal().for(new Vendor({ id: item.id }));
        this.vendorProposals = await query.get();

        this.showProposalTable = true;
        this.loading = false;
      } else {
        this.selectedIdx = null;
      }

    },
    async searchOnTable() {
        console.log('searchOnTable', this.search);
        this.pagination.page = 1;
        this.vendors = await this.getVendors();
    },
    async updatePagination(){
        console.log('updatePage', this.pagination.limit)
        this.vendors = await this.getVendors();
    },
    async next(){
        if (this.pagination.total < (this.pagination.page) * this.pagination.limit) return
        this.pagination.page += 1;
        this.vendors = await this.getVendors();
    },
    async preview() {
        if (this.pagination.page === 1) return
        this.pagination.page -= 1;
        this.vendors = await this.getVendors();
    },
    async sort(value) {
        console.log('sort', this.sortFields);
        this.pagination.page = 1;
        this.vendors = await this.getVendors()
    },
    getIndex (item){
        return this.vendors.findIndex(v => v.id === item.id);
    },
    closeModal () {
        this.showProposalTable = false;
        this.selectedIdx = null;
    }
  },
};
</script>
<style lang="scss" scoped>
.vendor-list-all {
  h1 {
    text-align: center;
  }
  table {
    padding: 30px;
    width: 100%;
    min-width: 1200px;
  }
  .proposal-bg{

    .md-table-content{
      background-color: rgba(255, 255, 255, 0.64) !important;
    }
  }
}
</style>
