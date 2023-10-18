<template>
  <div class="vendor-customer-board p-40">
    <loader :active="loading" is-full-screen page="vendor"/>
    <div class="font-size-22 font-bold d-flex align-center">
      <img :src="`${$iconURL}CustomerList/group-19735.svg`" class="mr-10" /> CUSTOMERS
      <!--<md-button class="ml-auto md-simple md-black md-maryoku mr-15">Import Customers List</md-button>-->
      <md-button class="md-vendor md-maryoku mr-15 ml-auto" @click="createNewCustomer">Add New Customers</md-button>
    </div>
    <div class="customer-table pl-50">
      <div class="md-layout mt-10">
        <div class="md-layout-item md-size-65 pr-30 d-flex flex-column">
          <div class="filter-bar mt-30 mb-20">
            <md-button
              v-for="tab in customerTabs"
              :key="tab.key"
              class="md-round md-white-shadow md-white maryoku-btn mr-20"
              @click="selectTab(tab.value)"
            >
              <div class="d-flex align-center px-20 pt-10 pb-10 font-size-16" :class="tab.class">
                <img class="mr-10" :src="`${$iconURL}${tab.icon}`" width="24px" />
                {{ tab.title }}
                <span v-if="tab.key == 'all'" class="ml-5" :class="tab.class">({{ pagination.total }})</span>
                <span v-else class="ml-5" :class="tab.class">({{ pagination[tab.key] }})</span>
              </div>
            </md-button>
          </div>
          <div class="sort-bar px-40">
            <span v-for="it in customerHeaders" class="sort-item font-size-18">
              {{ it.title }}
            </span>
          </div>

          <div v-if="!loading">
            <div class="md-20 customer-list">
              <template v-for="(object, key) in customerObject">
                <div class="customer-mark font-size-24 font-bold-extra mb-1">{{ object.group.toUpperCase() }}</div>

                <CustomerListItem
                  v-for="customer in object.children"
                  :customer="customer"
                  :sort-fields="sortFields"
                  :key="customer.id"
                  class="row"
                  @customerAction="handleCustomer(customer, $event)"
                  @proposalAction="handleProposal"
                  @click="selectCustomer(customer)"
                ></CustomerListItem>
              </template>
            </div>
          </div>
          <div v-if="customers.length < 2" class="my-auto d-flex flex-column align-center">
            <img class="mb-0" :src="`${iconUrl}CustomerList/group-19735.svg`" width="30px" />
            <p class="text-transform-uppercase font-size-14">No More CUSTOMERS To Show</p>
            <md-button class="md-vendor" @click="createNewCustomer">Add New CUSTOMERS</md-button>
          </div>
        </div>
        <div class="md-layout-item md-size-35 mt-30">
          <Insight
            v-if="renderInsight"
            :customer="selectedCustomer"
            :aggregate="aggregate"
            :vendor="vendorData"
            :customerStatus="this.tab"
          ></Insight>
        </div>
      </div>
    </div>
    <modal v-if="showProposalDetail" container-class="modal-container-wizard lg">
      <template slot="body">
        <ProposalContent :vendorProposal="selectedProposal" @close="showProposalDetail = false" />
      </template>
    </modal>
    <modal v-if="showNewCustomerModal" container-class="modal-container customer-form bg-white">
      <template slot="body">
        <CustomerForm
          :customer="selectedCustomer"
          :action="customerAction"
          @save="saveCustomer"
          @close="showNewCustomerModal = false"
        />
      </template>
    </modal>
  </div>
</template>
<script>
import Customer from "@/models/Customer";
import { CUSTOMER_PAGE_TABS, CUSTOMER_TABLE_HEADERS } from "@/constants/list";
import { CUSTOMER_PAGE_PAGINATION } from "@/constants/pagination";

const components = {
    Modal: () => import("@/components/Modal.vue"),
    Insight : () => import("./insight.vue"),
    VsaList: () => import("vue-simple-accordion"),
    Loader: () => import('@/components/loader/Loader.vue'),
    CustomerForm: () => import('../Form/CustomerForm.vue'),
    CustomerListItem: () => import("../components/CustomerListItem.vue"),
    ProposalContent: () => import("../components/ProposalDetail.vue"),
    TablePagination: () => import("@/components/TablePagination.vue"),
}

export default {
  components,
  data() {
    return {
      loading: true,
      iconUrl: `${this.$iconURL}`,
      customerTabs: CUSTOMER_PAGE_TABS,
      customerHeaders: CUSTOMER_TABLE_HEADERS,
      tab: 0,
      showProposalDetail: false,
      selectedProposal: null,
      selectedCustomer: null,
      showNewCustomerModal: null,
      customerStatus: {
        show: 0,
        detail: 1,
        proposal: 2,
        delete: 3,
        negotiation: 4,
      },
      proposalStatus: {
        show: 0,
        edit: 1,
        download: 2,
        delete: 3,
        share: 4,
        negotiation: 5,
        duplicate: 6,
        sort: 7,
      },
      pagination: CUSTOMER_PAGE_PAGINATION,
      customerAction: "create",
      sortFields: { sort: "", order: "" },
      renderInsight: false,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async getCustomer() {
      const { pagination } = this;
      const params = { status: this.tab, ...this.sortFields, customerType: 0 };
      const data = await this.$store.dispatch("vendorDashboard/getCustomers", {
        vendorId: this.vendorData.id,
        params,
      });

      this.pagination.total = data.total;
      this.customerTabs.map((t) => {
        if (data.hasOwnProperty(t.key)) this.pagination[t.key] = data[t.key];
      });
      this.pagination.pageCount = Math.ceil(data.total / this.pagination.limit);
    },
    gotoPage(selectedPage) {
      console.log(selectedPage);
      this.pagination.page = selectedPage;
      this.getCustomer();
    },
    async selectTab(tab) {
      this.loading = true;
      this.tab = tab;
      if (tab === 0) this.selectedCustomer = null;
      await this.getCustomer();
      this.loading = false;
    },

    selectCustomer(customer) {
      console.log("selectCustomer", customer);
      this.selectedCustomer = customer;
    },

    async handleCustomer(customer, action) {
      if (action === this.customerStatus.edit) {
        this.customerAction = "edit";
        this.showNewCustomerModal = true;
      } else if (action === this.customerStatus.proposal) {
        let routeData = this.$router.resolve({
          name: "outsideProposalCreate",
          params: {
            vendorId: this.vendorData.id,
          },
          query: {
            customerId: customer.id,
          },
        });
        this.openNewTab(routeData.href);
      } else if (action === this.customerStatus.delete) {
        this.loading = true;
        this.$store.commit(
          "vendorDashboard/setCustomers",
          this.customers.filter((it) => it.id !== customer.id),
        );
        let query = new Customer({ id: customer.id });
        let res = await query.delete();
        this.loading = false;
      }
    },

    async handleProposal(data) {
      console.log("handleProposal", data);

      if (data.action === this.proposalStatus.show) {
        for (let i = 0; i < this.customers.length; i++) {
          this.selectedProposal = this.customers[i].proposals.find((p) => p.id === data.proposalId);

          if (this.selectedProposal) {
            this.selectedProposal.proposalRequest = this.proposalRequests.find(
              (it) => it.id === this.selectedProposal.proposalRequestId,
            );
            this.showProposalDetail = true;
            break;
          }
        }
      } else if (data.action === this.proposalStatus.download) {
        this.openNewTab(`${process.env.SERVER_URL}/1/proposal/${data.proposalId}/download`);
      } else if (data.action === this.proposalStatus.duplicate) {
      } else if (data.action === this.proposalStatus.sort) {
        this.loading = true;
        this.sortField = data.sortField;
        await this.getCustomer();
        this.loading = false;
      }
    },
    createNewCustomer() {
      this.customerAction = "create";
      this.showNewCustomerModal = true;
    },
    async saveCustomer(customer) {

      this.showNewCustomerModal = false;
      if (customer.email) {
        this.loading = true;
        let customerInstance = new Customer({ ...customer, vendorId: this.vendorData.id, type: 1 });
        await customerInstance.save();


        await this.getCustomer();
        this.loading = false;
      }
    },
    openNewTab(link) {
      window.open(link, "_blank");
    },
    eventDate() {},
    isSocial() {},
    headerBackgroundImage() {},
    async init() {
      await this.getCustomer();
      this.loading = false;

      this.$nextTick((_) => {
        this.renderInsight = true;
      });
    },
  },
  computed: {
    vendorData() {
      return this.$store.state.vendor.profile;
    },
    customers() {
      return this.$store.state.vendorDashboard.customers;
    },
    proposalRequests() {
      return this.$store.state.vendorDashboard.proposalRequests;
    },
    customerObject() {
      if (!this.customers) return {};
      let object = this.customers.reduce((r, e) => {
        let group = e.companyName[0].toLowerCase();
        if (!r[group]) r[group] = { group, children: [e] };
        else r[group].children.push(e);
        return r;
      }, {});

      // sort customer object with alphabetical order
      return Object.keys(object)
        .sort()
        .reduce((res, key) => ((res[key] = object[key]), res), {});
    },
    aggregate() {
      let totalPrice = 0;
      let totalProposals = 0;
      let wonProposals = 0;
      let averagePrice = 0;

      if (!this.customers.length) return { totalPrice, totalProposals, wonProposals, averagePrice };

      this.customers.map((c) => {
        let wonProposalsOfCustomer = c.proposals.filter((p) => p.accepted);

        wonProposals += wonProposalsOfCustomer.length;
        totalProposals += c.proposals.length;

        if (wonProposalsOfCustomer.length) {
          let costOfCustomer = wonProposalsOfCustomer.reduce((cost, p) => {
            return cost + p.cost;
          }, 0);
          totalPrice += costOfCustomer;
          averagePrice += costOfCustomer / wonProposals;
        }
      });
      averagePrice /= this.customers.length;

      return { totalPrice, totalProposals, wonProposals, averagePrice };
    },
  },
  watch: {},
  updated() {
    // remove empty item in proposal-request carousel
  },
};
</script>
<style lang="scss" scoped>
.vendor-customer-board {
  .sort-bar {
    height: 50px;
    display: grid;
    align-items: center;
    grid-template-columns: 7% 15% 15% 15% 15% 15% 10% 8%;
    .sort-item {
      cursor: pointer;
      color: #707070;
      font-size: 14px;
      &.selected {
        color: #050505;
        font-weight: bold;
      }
    }
  }
  .customer-mark:after {
    content: "";
    display: inline-block;
    height: 0.5em;
    vertical-align: bottom;
    width: 97%;
    margin-right: -95%;
    margin-left: 10px;
    border-top: 1px solid #707070;
  }
  .tips {
    img {
      height: 20px;
    }
  }
  .border-right {
    border-right: 1px solid #050505;
  }
}
.vsa-list {
  --vsa-heading-padding: 1rem 2.5rem;
  --vsa-content-padding: 1rem 2.5rem;
  border: none;
  .vsa-item {
    border: none;
    box-shadow: none;
  }
  /deep/ .vsa-item__heading {
    border: none;
    cursor: pointer;
    .vsa-item__trigger {
      background-color: white;
      border: none;
      color: black;
      box-shadow: none;
      padding: 0;
      width: 100%;
    }
  }
}
</style>
