<template>
  <div class="event-blocks-comparison-panel">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" background-color="#eee" />
    <!-- Selected Proposals list -->
    <div class="selected-proposals-list">
      <table ref="content" class="w-100 h-100" cellspacing="0" colpadding="0">
        <tr>
          <td class="comparison-cell category-outer-cell no-padding va-top"></td>
          <td class="comparison-cell outer-cell">
            <md-field>
              <label></label>
              <md-select id="0" v-model="selectedBlock.proposalComparison1" placeholder="Select Proposal">
                <md-option v-for="(item, index) in selectableProposals" :key="index" v-bind:value="item">{{
                  getProposalName(item)
                }}</md-option>
              </md-select>
            </md-field>
            <!-- <multiselect id="0"
              v-model="selectedBlock.proposalComparison1"
              @select="addToCompare"
              @remove="removeFromCompare"
              style="height: 0;"
              placeholder="Select proposal"
              :searchable="false"
              :allow-empty="true"
              :options="selectableProposals"
              selectLabel=""
              deselectLabel="">
              <template slot="singleLabel" slot-scope="props">
                <span class="option__title">{{ getProposalName(props.option) }}</span>
              </template>
              <template slot="option" slot-scope="props">
                <div class="option__desc"><i class="fa fa-check" v-if="props.option === selectedBlock.proposalComparison1"></i> <span class="option__title">{{ getProposalName(props.option) }}</span></div>
              </template>
            </multiselect>-->
            <md-button
              class="md-success w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison1 && isAccepted(selectedBlock.proposalComparison1)"
              @click="viewProposal(selectedBlock.proposalComparison1)"
              >View - ${{ getProposalPrice(selectedBlock.proposalComparison1) | withComma }}</md-button
            >
            <md-button
              class="md-danger w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison1 && !isAccepted(selectedBlock.proposalComparison1)"
              @click="manageProposalsAccept(selectedBlock.proposalComparison1)"
              >Accept - ${{ getProposalPrice(selectedBlock.proposalComparison1) | withComma }}</md-button
            >
          </td>
          <td class="comparison-cell outer-cell">
            <md-field>
              <label></label>
              <md-select id="1" v-model="selectedBlock.proposalComparison2" placeholder="Select Proposal">
                <md-option v-for="(item, index) in selectableProposals" :key="index" v-bind:value="item">{{
                  getProposalName(item)
                }}</md-option>
              </md-select>
            </md-field>
            <md-button
              class="md-success w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison2 && isAccepted(selectedBlock.proposalComparison2)"
              @click="viewProposal(selectedBlock.proposalComparison2)"
              >View - ${{ getProposalPrice(selectedBlock.proposalComparison2) | withComma }}</md-button
            >
            <md-button
              class="md-danger w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison2 && !isAccepted(selectedBlock.proposalComparison2)"
              @click="manageProposalsAccept(selectedBlock.proposalComparison2)"
              >Accept - ${{ getProposalPrice(selectedBlock.proposalComparison2) | withComma }}</md-button
            >
          </td>
          <td class="comparison-cell outer-cell">
            <md-field>
              <label></label>
              <md-select id="2" v-model="selectedBlock.proposalComparison3" placeholder="Select Proposal">
                <md-option v-for="(item, index) in selectableProposals" :key="index" v-bind:value="item">{{
                  getProposalName(item)
                }}</md-option>
              </md-select>
            </md-field>
            <md-button
              class="md-success w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison3 && isAccepted(selectedBlock.proposalComparison3)"
              @click="viewProposal(selectedBlock.proposalComparison3)"
              >View - ${{ getProposalPrice(selectedBlock.proposalComparison3) | withComma }}</md-button
            >
            <md-button
              class="md-danger w-100 text-capitalize fs-14"
              v-if="selectedBlock.proposalComparison3 && !isAccepted(selectedBlock.proposalComparison3)"
              @click="manageProposalsAccept(selectedBlock.proposalComparison3)"
              >Accept - ${{ getProposalPrice(selectedBlock.proposalComparison3) | withComma }}</md-button
            >
          </td>
        </tr>
        <tr>
          <td colspan="4" class="padding-2-ex-bottom">
            <md-card class="clear-margins no-shadow catering-wrapper">
              <md-card-header class="md-card-header-text text-left">
                <h5 class="title">{{ this.selectedBlock.category }}</h5>
              </md-card-header>
              <md-card-content class="table-padding">
                <table class="w-100 h-100">
                  <tr>
                    <td class="text-left" colspan="4">
                      <h5 class="title">Catering</h5>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left border-bottom">
                      <span class="subtitle">ITEMS</span>
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- {{getProposalRequirementsFulfilled(selectedBlock.proposalComparison1)}} -->
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- {{getProposalRequirementsFulfilled(selectedBlock.proposalComparison2)}} -->
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- {{getProposalRequirementsFulfilled(selectedBlock.proposalComparison3)}} -->
                    </td>
                  </tr>
                  <tr v-for="(requirement, index) in selectedBlock.values" :value="requirement" :key="index">
                    <td class="comparison-cell category border-bottom">
                      <h6 class="title small" v-tooltip="requirement.comment">{{ requirement.title }}</h6>
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- <md-icon v-if="getProposalRequirementFulfillment(selectedBlock.proposalComparison1,requirement.id).included">check</md-icon> -->
                      <span
                        class="fc-green fs-14"
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison1, requirement.id).included
                        "
                        >Included</span
                      >
                      <md-icon
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison1, requirement.id).missing
                        "
                        >close</md-icon
                      >
                      <md-button
                        class="md-danger w-90 h-30 text-capitalize fs-14"
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison1, requirement.id).extra
                        "
                        >Add (${{
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison1, requirement.id).price
                            | numeral(0, 0)
                        }})</md-button
                      >
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- <md-icon v-if="getProposalRequirementFulfillment(selectedBlock.proposalComparison2,requirement.id).included">check</md-icon> -->
                      <span
                        class="fc-green fs-14"
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison2, requirement.id).included
                        "
                        >Included</span
                      >
                      <md-icon
                        v-else-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison2, requirement.id).missing
                        "
                        >close</md-icon
                      >
                      <md-button
                        class="md-danger w-90 h-30 text-capitalize fs-14"
                        v-else-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison2, requirement.id).extra
                        "
                        >Add (${{
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison2, requirement.id).price
                            | numeral(0, 0)
                        }})</md-button
                      >
                      <!-- <span v-else-if="getProposalRequirementFulfillment(selectedBlock.proposalComparison2,requirement.id).extra">${{getProposalRequirementFulfillment(selectedBlock.proposalComparison2,requirement.id).price}}</span> -->
                    </td>
                    <td class="comparison-cell proposal border-bottom">
                      <!-- <md-icon v-if="getProposalRequirementFulfillment(selectedBlock.proposalComparison3,requirement.id).included">check</md-icon> -->
                      <span
                        class="fc-green fs-14"
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison3, requirement.id).included
                        "
                        >Included</span
                      >
                      <md-icon
                        v-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison3, requirement.id).missing
                        "
                        >close</md-icon
                      >
                      <md-button
                        class="md-danger w-90 h-30 text-capitalize fs-14"
                        v-else-if="
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison3, requirement.id).extra
                        "
                        >Add (${{
                          getProposalRequirementFulfillment(selectedBlock.proposalComparison3, requirement.id).price
                            | numeral(0, 0)
                        }})</md-button
                      >
                      <!-- <span v-if="getProposalRequirementFulfillment(selectedBlock.proposalComparison3,requirement.id).extra">${{getProposalRequirementFulfillment(selectedBlock.proposalComparison3,requirement.id).price}}</span> -->
                    </td>
                  </tr>
                  <tr>
                    <td class="comparison-cell category">
                      <h6 class="title">Subtotal</h6>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPrice(selectedBlock.proposalComparison1) | withComma }}
                      </h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPrice(selectedBlock.proposalComparison2) | withComma }}
                      </h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPrice(selectedBlock.proposalComparison3) | withComma }}
                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td class="comparison-cell category">
                      <h6 class="title">Per guest</h6>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPricePerGuest(selectedBlock.proposalComparison1) | withComma }}
                      </h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPricePerGuest(selectedBlock.proposalComparison2) | withComma }}
                      </h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <h5 class="title fw-400 fz-14">
                        ${{ getProposalPricePerGuest(selectedBlock.proposalComparison3) | withComma }}
                      </h5>
                    </td>
                  </tr>
                </table>
              </md-card-content>
            </md-card>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="spacer"></td>
        </tr>
        <tr>
          <td colspan="4" class="padding-x-2">
            <md-card class="clear-margins no-shadow">
              <md-card-content>
                <table class="w-100 h-100">
                  <tr>
                    <td class="comparison-cell category">
                      <h5 class="title">Rating</h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <div class="star-rating" v-if="selectedBlock.proposalComparison1">
                        <label
                          class="star-rating__star fs-14"
                          v-for="(rating, index) in ratings"
                          :value="rating"
                          :key="index"
                          :class="{
                            'is-selected':
                              getProposalRating(selectedBlock.proposalComparison1) >= rating &&
                              getProposalRating(selectedBlock.proposalComparison1) != null,
                          }"
                          >★</label
                        >
                        <span class="small">{{ getProposalRating(selectedBlock.proposalComparison1) }}</span>
                      </div>
                    </td>
                    <td class="comparison-cell proposal">
                      <div class="star-rating" v-if="selectedBlock.proposalComparison2">
                        <label
                          class="star-rating__star fs-14"
                          v-for="(rating, index) in ratings"
                          :value="rating"
                          :key="index"
                          :class="{
                            'is-selected':
                              getProposalRating(selectedBlock.proposalComparison2) >= rating &&
                              getProposalRating(selectedBlock.proposalComparison2) != null,
                          }"
                          >★</label
                        >
                        <span class="small">{{ getProposalRating(selectedBlock.proposalComparison2) }}</span>
                      </div>
                    </td>
                    <td class="comparison-cell proposal">
                      <div class="star-rating" v-if="selectedBlock.proposalComparison3">
                        <label
                          class="star-rating__star fs-14"
                          v-for="(rating, index) in ratings"
                          :value="rating"
                          :key="index"
                          :class="{
                            'is-selected':
                              getProposalRating(selectedBlock.proposalComparison3) >= rating &&
                              getProposalRating(selectedBlock.proposalComparison3) != null,
                          }"
                          >★</label
                        >
                        <span class="small">{{ getProposalRating(selectedBlock.proposalComparison3) }}</span>
                      </div>
                    </td>
                  </tr>
                </table>
              </md-card-content>
            </md-card>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="spacer"></td>
        </tr>
        <tr>
          <td colspan="4" class="padding-x-2">
            <md-card class="clear-margins no-shadow">
              <md-card-content>
                <table class="w-100 h-100">
                  <tr>
                    <td class="comparison-cell category">
                      <h5 class="title">Cancellation</h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <p class="fs-14 fc-grey">
                        {{ getProposalCancellationPolicy(selectedBlock.proposalComparison1) }}
                      </p>
                    </td>
                    <td class="comparison-cell proposal">
                      <p class="fs-14 fc-grey">
                        {{ getProposalCancellationPolicy(selectedBlock.proposalComparison2) }}
                      </p>
                    </td>
                    <td class="comparison-cell proposal">
                      <p class="fs-14 fc-grey">
                        {{ getProposalCancellationPolicy(selectedBlock.proposalComparison3) }}
                      </p>
                    </td>
                  </tr>
                </table>
              </md-card-content>
            </md-card>
          </td>
        </tr>
        <tr>
          <td colspan="4" class="spacer"></td>
        </tr>
        <tr>
          <td colspan="4" class="padding-x-2">
            <md-card class="clear-margins no-shadow">
              <md-card-content>
                <table class="w-100 h-100">
                  <tr>
                    <td class="comparison-cell category">
                      <h5 class="title">Legal Docs</h5>
                    </td>
                    <td class="comparison-cell proposal">
                      <ul class="list-files" v-if="getLegalDocsOfComparison1.length > 0">
                        <li v-for="(legalDoc, index) in getLegalDocsOfComparison1" :key="index">
                          <a class="fc-danger" target="_blank" v-bind:href="legalDoc.path">
                            <md-icon class="fs-14 fc-danger">picture_as_pdf</md-icon>
                            {{ legalDoc.fileName }}
                          </a>
                        </li>
                      </ul>
                      <p class="fc-danger fs-14" v-else>No Files</p>
                    </td>
                    <td class="comparison-cell proposal">
                      <ul class="list-files" v-if="getLegalDocsOfComparison2.length > 0">
                        <li v-for="(legalDoc, index) in getLegalDocsOfComparison2" :key="index">
                          <a class="fc-danger" target="_blank" v-bind:href="legalDoc.path">
                            <md-icon class="fs-14 fc-danger">picture_as_pdf</md-icon>
                            {{ legalDoc.fileName }}
                          </a>
                        </li>
                      </ul>
                      <p class="fc-danger fs-14" v-else>No Files</p>
                    </td>
                    <td class="comparison-cell proposal">
                      <ul class="list-files" v-if="getLegalDocsOfComparison3.length > 0">
                        <li v-for="(legalDoc, index) in getLegalDocsOfComparison3" :key="index">
                          <a class="fc-danger" target="_blank" v-bind:href="legalDoc.path">
                            <md-icon class="fs-14 fc-danger">picture_as_pdf</md-icon>
                            {{ legalDoc.fileName }}
                          </a>
                        </li>
                      </ul>
                      <p class="fc-danger fs-14" v-else>No Files</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="comparison-cell category"></td>
                    <td class="comparison-cell proposal">
                      <a
                        class="text-transform-uppercase fs-12 fc-danger fw-500"
                        v-if="selectedBlock.proposalComparison1"
                        @click="viewProposal(selectedBlock.proposalComparison1)"
                        >View Proposal</a
                      >
                    </td>
                    <td class="comparison-cell proposal">
                      <a
                        class="text-transform-uppercase fs-12 fc-danger fw-500"
                        v-if="selectedBlock.proposalComparison2"
                        @click="viewProposal(selectedBlock.proposalComparison2)"
                        >View Proposal</a
                      >
                    </td>
                    <td class="comparison-cell proposal">
                      <a
                        class="text-transform-uppercase fs-12 fc-danger fw-500"
                        v-if="selectedBlock.proposalComparison3"
                        @click="viewProposal(selectedBlock.proposalComparison3)"
                        >View Proposal</a
                      >
                    </td>
                  </tr>
                </table>
              </md-card-content>
            </md-card>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";

import ViewProposal from "./ViewProposal.vue";
import ManageProposalsAccept from "../Modals/ManageProposalsAccept.vue";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";
import numeral from "numeral";

const jsPDF = () => import("jspdf");
const html2canvas = () => import("html2canvas");
export default {
  name: "event-block-comparison",
  components: {
    VueElementLoading,
    ManageProposalsAccept,
    ViewProposal,
  },
  props: {
    selectedBlock: Object,
    event: Object,
    blockVendors: Array,
  },
  data: () => ({
    isLoading: false,
    ratings: [1, 2, 3, 4, 5],
    selectableProposals: [],
    proposalsById: {},
    requirementsById: {},
    serverUrl: process.env.SERVER_URL,
    legalDocs: [],
  }),
  methods: {
    manageProposalsAccept(proposal) {
      window.currentPanel = this.$showPanel({
        component: ManageProposalsAccept,
        cssClass: "md-layout-item md-size-65 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          proposal: this.proposalsById[proposal],
          selectedBlock: this.selectedBlock,
        },
      });
    },
    isAccepted(proposal) {
      if (this.proposalsById[proposal]) {
        return this.proposalsById[proposal].accepted;
      } else {
        return false;
      }
    },
    getProposalPrice(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById) {
          return `$${proposalById.cost | numeral("0,0.0")}`;
        }
      }
      return "";
    },
    getProposalPricePerGuest(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById && proposalById.cost) {
          return `$${(proposalById.cost / this.event.numberOfParticipants) | numeral("0,0.0")}`;
        }
      }
      return "";
    },
    getProposalRequirementsFulfilled(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById && proposalById.cost) {
          let fulfilled = proposalById.included.length + proposalById.extras.length;
          let total = fulfilled + proposalById.missing.length;
          return `${fulfilled} / ${total}`;
        }
      }
      return "";
    },
    getProposalRequirementFulfillment(proposalId, requirementId) {
      if (proposalId && requirementId) {
        let requirementById = this.requirementsById[`${proposalId}__${requirementId}`];
        if (requirementById) {
          return requirementById;
        }
      }
      return {
        id: null,
        included: false,
        missing: false,
        extra: false,
        price: null,
      };
    },
    getProposalRating(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById) {
          return `${JSON.stringify(proposalById.vendor.rank)}`;
        }
      }
      return 0;
    },
    getLegalDocs() {
      this.legalDocs = [];

      if (this.selectedBlock.proposals) {
        this.selectedBlock.proposals.forEach((proposal) => {
          proposal.attachements.forEach((item) => {
            const fullPath = `${this.serverUrl}/1/proposal-requests/${proposal.id}/files/${item.id}`;

            this.$http.get(fullPath, { headers: this.$auth.getAuthHeader() }).then((response) => {
              if (response && response.headers) {
                if (response.headers["content-type"].indexOf("pdf") > -1) {
                  if (this.legalDocs.filter((ld) => ld.path === fullPath).length === 0) {
                    this.legalDocs.push({
                      fileName: "LegalDoc" + (this.legalDocs.length + 1),
                      path: fullPath,
                    });
                  }
                }
              }
            });
          });
        });
      }
      return [];
    },
    getProposalCancellationPolicy(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById) {
          return proposalById.candellationPolicy;
        }
      }
      return "";
    },
    getProposalValidUntil(proposalId) {
      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById) {
          return proposalById.validUntil;
        }
      }
      return "";
    },
    getProposalName(proposalId) {
      if (proposalId === "0") return "None";

      if (proposalId) {
        let proposalById = this.proposalsById[proposalId];
        if (proposalById) {
          return proposalById.vendor.vendorDisplayName;
        }
      }
      return "Unknown";
    },
    populateProposals() {
      _.each(this.selectedBlock.proposals, (item) => {
        this.proposalsById[item.id] = item;
        this.selectableProposals.push(item.id);

        _.each(item.included, (included) => {
          this.requirementsById[`${item.id}__${included.requirementId}`] = {
            id: included.requirementId,
            included: true,
            missing: false,
            extra: false,
            price: null,
          };
        });

        _.each(item.extras, (extra) => {
          this.requirementsById[`${item.id}__${extra.requirementId}`] = {
            id: extra.requirementId,
            included: false,
            missing: false,
            extra: true,
            price: extra.price,
          };
        });

        _.each(item.missing, (missing) => {
          this.requirementsById[`${item.id}__${missing.requirementId}`] = {
            id: missing.requirementId,
            included: false,
            missing: true,
            extra: false,
            price: null,
          };
        });
      });

      // console.log(this.proposalsById)
      // console.log(this.requirementsById)
      // console.log(this.selectedBlock.values)

      this.$forceUpdate();
    },
    viewProposal(proposal) {
      if (proposal) {
        window.currentPanel = this.$showPanel({
          component: ViewProposal,
          cssClass: "md-layout-item md-size-65 transition36 bg-white",
          openOn: "right",
          props: {
            event: this.event,
            proposal: this.proposalsById[proposal],
            selectedBlock: this.selectedBlock,
          },
        });
      }
    },
    addToCompare(proposalItem, idx) {
      /* if (proposalItem === '0'){
          this.selectedBlock.proposalComparison[Number(idx)] = null
        } else {
          this.selectedBlock.proposalComparison[Number(idx)] = proposalItem
          this.selectableProposals = ['0']
          _.each(this.selectedBlock.proposals,(item)=> {
            if (_.indexOf(this.selectedBlock.proposalComparison, item.id) === -1) {
              this.selectableProposals.push(item.id)
            }
          })
        } */
      switch (idx) {
        case 0:
          this.selectedBlock.proposalComparison1 = proposalItem;
          break;
        case 1:
          this.selectedBlock.proposalComparison2 = proposalItem;
          break;
        case 2:
          this.selectedBlock.proposalComparison3 = proposalItem;
          break;
      }
      this.updateEventComponent();
    },
    removeFromCompare(proposalItem, idx) {
      /* this.selectedBlock.proposalComparison[Number(idx)] = null
        this.selectableProposals = ['0']
        _.each(this.selectedBlock.proposals,(item)=> {
          if (_.indexOf(this.selectedBlock.proposalComparison, item.id) === -1) {
            this.selectableProposals.push(item.id)
          }
        }) */

      switch (idx) {
        case 0:
          this.selectedBlock.proposalComparison1 = null;
          break;
        case 1:
          this.selectedBlock.proposalComparison2 = null;
          break;
        case 2:
          this.selectedBlock.proposalComparison3 = null;
          break;
      }

      this.updateEventComponent();

      let count = 0;
      if (this.selectedBlock.proposalComparison1) {
        count++;
      }
      if (this.selectedBlock.proposalComparison2) {
        count++;
      }
      if (this.selectedBlock.proposalComparison3) {
        count++;
      }
      this.$emit("update-comparison", count);
    },
    updateEventComponent() {
      let calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId,
      });
      let event = new CalendarEvent({
        id: this.event.id,
      });
      let selected_block = new EventComponent({
        id: this.selectedBlock.id,
      });
      selected_block.proposalComparison1 = this.selectedBlock.proposalComparison1;
      selected_block.proposalComparison2 = this.selectedBlock.proposalComparison2;
      selected_block.proposalComparison3 = this.selectedBlock.proposalComparison3;
      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {
          console.log(resp);
          this.$forceUpdate();
        })
        .catch((error) => {
          console.log("EventComponentVendor error =>", error);
          this.$forceUpdate();
        });
    },
    exportToPDF() {
      const doc = new jsPDF("p", "mm", "a3");
      /** WITH CSS */
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, {
        canvas: canvasElement,
        scale: 1,
      }).then(function (canvas) {
        const img = canvas.toDataURL("image/png");

        doc.addImage(img, "PNG", 20, -10);
        doc.save("sample.pdf");
      });
    },
  },
  created(title, proposal) {},
  mounted() {
    this.populateProposals();
    this.getLegalDocs();
    // this.getBlockVendors()
  },
  computed: {
    getLegalDocsOfComparison1() {
      return this.legalDocs.filter((ld) => ld.path.includes(this.selectedBlock.proposalComparison1));
    },
    getLegalDocsOfComparison2() {
      return this.legalDocs.filter((ld) => ld.path.includes(this.selectedBlock.proposalComparison2));
    },
    getLegalDocsOfComparison3() {
      return this.legalDocs.filter((ld) => ld.path.includes(this.selectedBlock.proposalComparison3));
    },
  },
  filters: {
    withComma(amount) {
      return amount ? amount.toLocaleString() : 0;
    },
  },
  watch: {
    selectedBlock(newVal, oldVal) {
      this.populateProposals();
    },
  },
};
</script>
<style lang="scss" scoped>
.comparison-cell {
  border: 1px solid transparent;
  margin: 0;
  vertical-align: middle;
  text-align: left;
  &.category {
    width: 25%;
    max-width: 25%;
    min-width: 25%;
    text-align: left;
    .title {
      text-transform: none !important;
      font-size: 14px;
    }
  }
  &.category-outer-cell {
    width: 25%;
    max-width: 25%;
    min-width: 25%;
    text-align: left;
    vertical-align: top;
    padding: 1em 2em;
    .title {
      text-transform: none !important;
      font-size: 14px;
    }
  }
  &.proposal,
  &.outer-cell {
    vertical-align: top;
    padding: 1em 2em;
    width: 25%;
    max-width: 25%;
    min-width: 25%;
  }
}
.w-100 {
  width: 100%;
}
.text-capitalize {
  text-transform: capitalize;
}
.no-shadow {
  box-shadow: none;
}
h5 {
  &.title {
    font-size: 16px !important;
    font-weight: 500;
  }
}
span.subtitle {
  font-size: 10px;
  font-weight: 400;
}
.table-padding {
  padding: 1em 2em !important;
}
.border-bottom {
  border-bottom: 1px solid #eeeeee;
}
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
.w-90 {
  max-width: 110px;
}
.h-30 {
  height: 30px;
}
.va-top {
  vertical-align: top;
}
.fw-400 {
  font-weight: 400;
}
.fs-12 {
  font-size: 12px;
}
.fs-14 {
  font-size: 14px;
}
.fw-500 {
  font-weight: 500;
}
.padding-2-ex-bottom {
  padding: 2em 2em 0 2em !important;
}
.padding-x-2 {
  padding: 0 2em !important;
}
.catering-wrapper {
  border: 1px solid #eeeeee;
  border-radius: 2px;
}
.fc-green {
  color: #01be60 !important;
}
.fc-danger {
  color: #ff547c !important;
}
.fc-grey {
  color: #808080 !important;
}
.text-transform-uppercase {
  text-transform: uppercase;
  cursor: pointer;
}
.list-files {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.5em 0;
  }
}
</style>
