<template>
  <div class="event-proposal-comparison-panel booking-section">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" background-color="#eee" />
      <comment-editor-panel
          v-if="showCommentEditorPanel"
          :commentComponents="commentComponents"
          @saveComment="saveComment"
          @updateComment="updateComment"
          @deleteComment="deleteComment"
          @updateCommentComponent="updateCommentComponent"
      >
      </comment-editor-panel>
    <div class="event-page-header md-layout-item md-size-100">
      <div class="header-title">
        <h3>
          <img
            :src="`${$iconURL}Budget+Elements/${selectedBlock.componentId}.svg`"
            style="width: 30px; margin-right: 0.5em"
          />
          {{ selectedBlock.bookTitle }}
        </h3>
      </div>
      <header-actions @toggleCommentMode="toggleCommentMode" @share="share" hideDownload></header-actions>
    </div>
    <div class="booking-header md-layout-item md-size-100">
      <div class="header-title w-100">
        <div class="font-size-22 mb-20">Hey {{ $store.state.auth.user.name }}</div>
      </div>
      <div class="d-flex justify-content-between">
        <div>
          We found the top proposals for your event, <br />
          Book now before it’s too late
        </div>
        <div class="header-actions">
          <span class="seperator"></span>
          <md-button class="md-simple normal-btn md-red">
            <md-icon>edit</md-icon>
            Change Requirements
          </md-button>
        </div>
      </div>
    </div>
    <div class="compare-content white-card">
      <div class="grid-row">
        <div class="grid-cell comparing-name font-bold-extra">
          <img
            :src="`${$iconURL}Budget+Elements/${selectedBlock.componentId}.svg`"
            style="width: 30px; margin-right: 0.5em"
          />
          A comparision of the the three venus
        </div>
        <div class="grid-cell proposal-card" v-for="proposal in proposals" :key="`name-${proposal.id}`">
          <div>
            <img
              class="proposal-card-image"
              :src="proposal.inspirationalPhotos[0] ? proposal.inspirationalPhotos[0].url : proposal.vendor.images[0]"
            />
          </div>
          <div class="font-size-20 font-bold mt-20 mb-20">{{ proposal.vendor.companyName }}</div>
          <md-button class="md-red maryoku-btn width-100">Details & Booking</md-button>
        </div>
      </div>
      <div class="grid-row">
        <div class="grid-cell comparing-name font-bold-extra">Price</div>
        <div class="grid-cell text-center" v-for="proposal in proposals" :key="`name-${proposal.id}`">
          <div>${{ proposal.cost | withComma }}</div>
          <div v-if="selectedBlock.allocatedBudget - proposal.cost > 0">
            ${{ (selectedBlock.allocatedBudget - proposal.cost) | withComma }} Less than original budget
          </div>
          <div v-if="selectedBlock.allocatedBudget - proposal.cost < 0">
            ${{ (proposal.cost - selectedBlock.allocatedBudget) | withComma }} More than original budget
          </div>
        </div>
      </div>
      <div class="grid-row">
        <div class="grid-cell comparing-name font-bold-extra">Match</div>
        <div
          class="grid-cell color-red text-center font-size-30 font-bold"
          v-for="proposal in proposals"
          :key="`name-${proposal.id}`"
        >
          80%
        </div>
      </div>
      <div class="section-header comparing-name font-bold-extra">All 3 Proposals Include:</div>
      <div class="grid-row" v-for="service in commonIncludedServices" :key="`common-service-${service.name}`">
        <div class="grid-cell comparing-name">{{ service.name }}</div>
        <div
          class="grid-cell color-red text-center font-size-30 font-bold"
          v-for="proposal in proposals"
          :key="`check-${proposal.id}`"
        >
          <div class="grid-cell"><img src="/static/icons/vendor/proposalBoard/filter-won.svg" /></div>
        </div>
      </div>
      <template v-for="section in comparedServices">
        <div class="section-header comparing-name font-bold-extra text-transform-capitalize">{{ section.name }}</div>
        <div class="grid-row" v-for="item in section.items" :key="`common-item-${item.name}`">
          <div class="grid-cell comparing-name text-transform-capitalize">{{ item.name }}</div>
          <div
            class="grid-cell color-red text-center font-size-30 font-bold"
            v-for="(proposal, index) in item.proposalServices"
            :key="`check-${item.name}-${index}`"
          >
            <!-- {{ proposal }} -->
            <div class="grid-cell" v-if="!proposal">
              <img class="check-icon" :src="`${$iconURL}Vendor Signup/Group 5489 (3).svg`" />
            </div>
            <div class="grid-cell" v-else-if="proposal.included">
              <img class="check-icon" src="/static/icons/vendor/proposalBoard/filter-won.svg" />
            </div>
            <div class="grid-cell font-bold color-black font-size-16" v-else>+${{ proposal.price | withComma }}</div>
          </div>
        </div>
      </template>
      <div class="section-header comparing-name font-bold-extra">Policy</div>
      <div class="grid-row" v-for="comparedPolicy in comparedPolicies" :key="`comparedPolicy-${comparedPolicy.name}`">
        <div class="grid-cell comparing-name">{{ comparedPolicy.name }}</div>
        <div
          class="grid-cell color-red text-center font-size-30 font-bold"
          v-for="(proposal, index) in proposals"
          :key="`comparedPolicy-${proposal.id}`"
        >
          <div
            class="grid-cell"
            v-if="comparedPolicy.proposalPolicies[index] && comparedPolicy.proposalPolicies[index].value"
          >
            <img src="/static/icons/vendor/proposalBoard/filter-won.svg" />
          </div>
          <div class="grid-cell" v-else>
            <img class="check-icon" :src="`${$iconURL}Vendor Signup/Group 5489 (3).svg`" />
          </div>
        </div>
      </div>
    </div>
    <div class="proposal-footer white-card d-flex justify-content-between">
      <div>
        <md-button @click="back" class="md-simple maryoku-btn md-black">
          <md-icon>arrow_back</md-icon>
          Back
        </md-button>
        <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
          <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
        </md-button>
      </div>
    </div>
  </div>
</template>
<script>
import EventComponent from "@/models/EventComponent";
import Proposal from "@/models/Proposal";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";
import HeaderActions from "@/components/HeaderActions";
import CommentEditorPanel from "../components/CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";
import { businessCategories, VendorPolicy } from "@/constants/vendor";
import { camelize } from "@/utils/string.util";
export default {
  name: "event-block-comparison",
  components: {
    VueElementLoading,
    CommentEditorPanel,
    HeaderActions,
  },
  mixins: [CommentMixins, ShareMixins],
  data() {
    return {
      isLoading: false,
      showCommentEditorPanel: false,
      proposals: [],
      selectedBlock: null,
      commonIncludedServices: [],
      comparedPolicies: [],
    };
  },
  created() {
    this.selectedBlock = _.findWhere(this.categoryList, {
      id: this.$route.params.blockId,
    });
    new Proposal()
      .for(new EventComponent({ id: this.$route.params.blockId }))
      .get()
      .then((result) => {
        this.proposals = result.slice(0, 3);
        this.commonIncludedServices = [];
        const currentServiceCategory = businessCategories.find((item) => item.name === this.selectedBlock.componentId);
        console.log("currentServiceCategory", currentServiceCategory);

        // compare proposals
        const comparedServices = [];
        currentServiceCategory.categories.forEach((section) => {
          const comparedSection = { name: section.name, items: [] };
          section.subCategories.forEach((subCategory) => {
            subCategory.items.forEach((item) => {
              if (
                this.proposals.every((proposal) => {
                  return (
                    proposal.includedServices[this.selectedBlock.componentId].findIndex(
                      (service) => item.name == service.requirementTitle,
                    ) >= 0
                  );
                })
              ) {
                /// getting services included in all 3 proposals
                this.commonIncludedServices.push(item);
              } else {
                // if this item is not common for 3 proposals

                //getting items for getting
                const comparedItems = { name: item.name, proposalServices: [] };
                this.proposals.forEach((proposal) => {
                  if (
                    proposal.includedServices[this.selectedBlock.componentId].findIndex(
                      (service) => item.name == service.requirementTitle,
                    ) >= 0
                  ) {
                    // checkgin included service?
                    // if proposal have
                    comparedItems.proposalServices.push({ ...item, included: true });
                  } else if (proposal.vendor.services[camelize(item.name)]) {
                    // checking extra servcie
                    console.log("object", proposal.vendor.services[camelize(item.name)]);
                    const service = proposal.vendor.services[camelize(item.name)];
                    comparedItems.proposalServices.push({
                      ...item,
                      price: service.value,
                      qty: service.qty,
                      included: false,
                    });
                  } else {
                    comparedItems.proposalServices.push(null);
                  }
                });
                comparedSection.items.push(comparedItems); ///
              }
            });
          });

          comparedServices.push(comparedSection);
        });
        this.comparedServices = comparedServices;

        // checking policy
        this.comparedPolicies = [];
        const categoryPolicy = VendorPolicy.find((item) => item.category === this.selectedBlock.componentId);
        console.log(categoryPolicy);
        if (categoryPolicy) {
          categoryPolicy.items.forEach((policyItem) => {
            const proposalPolicies = [];
            this.proposals.forEach((proposal) => {
              const vendorPolicy = proposal.vendor.policies.find((policy) => policy.name === policyItem.name);
              console.log(vendorPolicy);
              if (vendorPolicy) {
                proposalPolicies.push(vendorPolicy);
              } else {
                proposalPolicies.push(null);
              }
            });
            this.comparedPolicies.push({ name: policyItem.name, proposalPolicies });
          });
        }
        console.log("comparedServices", this.comparedPolicies);
      });
  },
  methods: {
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    back() {
      this.$router.go(-1);
    },
  },
  computed: {
    categoryList() {
      return this.$store.state.event.eventData.components;
    },
    // expiredTime() {
    //   return this.currentRequirement.expiredBusinessTime;
    // },
  },
};
</script>
<style lang="scss" scoped>
.event-proposal-comparison-panel {
  .compare-content {
    margin: 0 3rem;
    .proposal-card {
      .proposal-card-image {
        width: 100%;
        height: 250px;
        object-fit: cover;
      }
    }
    .grid-row {
      display: grid;
      grid-template-columns: auto repeat(3, 27%);
      border-bottom: solid 1px #cfcfcf;
      .grid-cell {
        padding: 15px 20px;
        &:not(:last-child) {
          border-right: solid 1px #cfcfcf;
        }
        &.comparing-name {
          font-size: 20px;
          padding: 30px 40px;
        }
        .check-icon {
          width: 25px;
        }
      }
    }
    .section-header {
      background: #f8f8f8;
      border-bottom: solid 1px #cfcfcf;
      padding: 30px 50px;
      font-size: 20px;
    }
  }
  .proposal-footer {
    margin-top: 20px;
    padding: 20px;
  }
}
</style>
