<template>
  <div class="customer-list-item mb-20">
    <div class="customer-group-item white-card cursor-pointer" @click="select">
      <div class="avatar bg-white color-blue mr-40">
        {{ customer.name ? customer.name.charAt(0).toUpperCase() : '' }}{{ customer.companyName ? customer.companyName.charAt(0).toUpperCase() : '' }}
      </div>

      <div>
        <div class="font-bold font-size-16 text-capitalize">{{ customer.companyName }}</div>
      </div>
      <div class="font-size-14 color-black-middle">{{ customer.ein }}</div>
      <div class="font-size-14 color-black-middle">${{ getIncome(customer) | withComma }}</div>
      <div class="font-size-14 color-black-middle text-capitalize">{{ customer.name }}</div>
      <div class="font-size-14 color-black-middle">{{ customer.proposals.length }}</div>
      <div>
        <img :src="`${$iconURL}Group 19780.svg`" />
      </div>

      <div class="d-flex align-center">
        <img :src="`${$iconURL}Group 19190.svg`" class="mr-20" />
        <md-menu md-size="medium" class="action-menu" :md-offset-x="-300" :md-offset-y="-36" @md-opened="isOpened">
          <md-button md-menu-trigger class="edit-btn md-simple" style="height: 30px; width: 40px; z-index: 200">
            <img :src="`${$iconURL}Group 19186.svg`" />
          </md-button>
          <md-menu-content>
            <md-menu-item @click="edit(customerStatus.edit)" class="md-purple" :disabled="customer.name == 'Maryoku'">
              <span>
                <img :src="`${$iconURL}Group 19254.svg`" class="mr-10" width="25px" />
                Customer Details</span
              >
            </md-menu-item>
            <md-menu-item
              @click="edit(customerStatus.proposal)"
              class="md-purple"
              :disabled="customer.name == 'Maryoku'"
            >
              <span>
                <img :src="`${$iconURL}CustomerList/group-18971.svg`" class="mr-10" />
                Make New Proposal
              </span>
            </md-menu-item>
            <md-menu-item @click="edit(customerStatus.delete)" class="md-purple" :disabled="customer.name == 'Maryoku'">
              <span>
                <img :src="`${$iconURL}VendorsProposalPage/group-11314.svg`" class="label-icon mr-10" /> Delete Customer
              </span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </div>

    <fade-transition v-if="isToggle">
      <div>
        <div class="sort-bar px-20 mt-30 ml-40" v-if="customer.proposals.length">
          <span
            v-for="it in proposalHeaders"
            class="sort-item"
            :class="{ selected: it.key && sortFields['sort'] == it.key }"
            @click="selectSort(it.key)"
          >
            {{ it.title }}
            <md-icon v-if="it.key && it.key != 'update' && sortFields['sort'] == it.key" class="color-black">
              {{ sortFields["order"] == "asc" ? "keyboard_arrow_up" : "keyboard_arrow_down" }}</md-icon
            >
            <md-icon v-if="it.key && it.key != 'update' && sortFields['sort'] != it.key" class="color-black-middle">
              keyboard_arrow_down
            </md-icon>
          </span>
        </div>
        <proposal-list-item
          v-for="proposal in customer.proposals"
          :key="proposal.id"
          :proposal="proposal"
          @action="handleProposal"
          page="custom"
        ></proposal-list-item>
      </div>
    </fade-transition>
  </div>
</template>
<script>
import Button from "../../../../components/Button/ButtonDiv";
import ProposalListItem from "./ProposalListItem";
import { VsaItem, VsaHeading, VsaContent, VsaIcon } from "vue-simple-accordion";
import { FadeTransition } from "vue2-transitions";
import {PROPOSAL_STATUS} from "@/constants/status";

export default {
  components: {
    FadeTransition,
    Button,
    ProposalListItem,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon,
  },
  props: {
    customer: {
      type: Object,
      required: true,
    },
    sortFields: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      iconUrl: `${this.$iconURL}VendorsProposalPage/`,
      proposalHeaders: [
        { key: "number", title: "Number" },
        { key: "date", title: "Date" },
        { key: "event", title: "Event" },
        { key: "status", title: "Status" },
        { key: "cost", title: "Value" },
        { key: "owner", title: "Owner" },
        { key: "", title: "" },
      ],
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
        negotiation: 4,
        duplicate: 5,
        sort: 6,
      },
      isToggle: false,
    };
  },
  methods: {
    edit(action) {
      this.$emit("customerAction", action);
    },
    leave(item) {
      console.log("leave", item);
    },
    isOpened() {
      setTimeout((_) => {
        $("li.md-list-item").hover(
          function (el) {
            $(this).find("img").attr("style", "filter:brightness(0) invert(1)");
          },
          function () {
            $(this).find("img").attr("style", "filter:brightness(0) invert(0)");
          },
        );
      }, 0);
    },
    async selectSort(sortField) {
      if (!sortField) return;

      if (this.sortFields.sort !== sortField) {
        this.$set(this.sortFields, "sort", sortField);
        this.$set(this.sortFields, "order", "asc");
      } else {
        this.sortFields["order"] = this.sortFields["order"] === "desc" ? "asc" : "desc";
      }
      this.$emit("proposalAction", {
        action: this.proposalStatus.sort,
        sortFields: this.sortFields,
      });
    },
    handleCustomer(data) {},
    handleProposal(action, proposalId) {
      this.$emit("proposalAction", {
        action,
        proposalId,
      });
    },
    select() {
      this.$emit("click");
      this.isToggle = !this.isToggle;
    },
    getIncome(customer) {
      return customer.proposals.reduce((s, p) => {
        if (p.status === PROPOSAL_STATUS.WON) return s + p.cost;
        else return s;
      }, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.customer-list-item {
}
.customer-group-item {
  padding: 25px 40px;
  display: grid;
  align-items: center;
  text-align: left;
  grid-template-columns: 7% 15% 15% 15% 15% 15% 10% 8%;
}
.avatar {
  width: 50px;
  min-width: 50px;
  height: 50px;
  margin: auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  border-radius: 40px;
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: color, background-color;
  will-change: color, background-color;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: normal;
  vertical-align: middle;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
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
.sort-bar {
  height: 50px;
  display: grid;
  align-items: center;
  grid-template-columns: 20% 10% 20% 10% 15% 15% 10%;
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
/deep/ .md-menu-content .md-list {
  padding: 0 !important;
}
</style>
