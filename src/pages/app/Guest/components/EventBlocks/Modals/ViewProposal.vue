<template>
  <div class="manage-proposals-panel">
    <div class="md-layout maxh-50vh" v-if="vendorProposal && vendorInfo">
      <!-- <div class="md-layout-item md-size-5" style="padding: 0; margin: 0;">
        <h4 class="md-title">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </h4>
      </div>-->
      <div class="md-layout-item md-size-100 maxh-50vh">
        <div class="title-section">
          <h4 class="md-title">
            <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
              <md-icon>navigate_before</md-icon>
            </md-button>
            {{ vendorInfo.vendorCategory }}
          </h4>
          <div class="actions-list">
            <md-button class="md-rose md-sm md-simple"> <md-icon>compare</md-icon>Add to compare </md-button>
            <md-button class="md-rose no-uppercase" @click="manageProposalsAccept(proposal)">
              Accept Proposal
              <md-icon>check</md-icon>
            </md-button>
          </div>
        </div>
      </div>
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <md-card class="proposal-message">
            <md-card-content>
              <div class="vendor-info">
                <div class="vendor-image">
                  <md-avatar class="md-avatar-icon">
                    <md-icon>people</md-icon>
                  </md-avatar>
                </div>
                <div class="vendor-name">
                  <h4 class="md-title">{{ vendorInfo.vendorDisplayName }}</h4>
                  <div class="star-rating">
                    <!-- <label class="star-rating__star"
                      v-for="rating in ratings"
                      :class="{'is-selected' : ((vendorInfo.rank >= rating) && vendorInfo.rank != null)}"
                      >
                    <input class="star-rating star-rating__checkbox" type="radio">★</label>-->
                  </div>
                </div>
                <div class="vendor-location">
                  <md-icon>room</md-icon>
                  <span
                    >{{ vendorInfo.vendorAddressLine1 }}
                    {{ vendorInfo.vendorAddressLine2 ? " - " + vendorInfo.vendorAddressLine2 : "" }}</span
                  >
                  <ul class="vendor-tags">
                    <li v-for="(tag, index) in vendorInfo.vendorTagging" :key="index">{{ tag }}</li>
                  </ul>
                </div>
                <div class="last-update">Last Update on {{ getDate(vendorInfo.lastUpdated) }} (3 updates)</div>
              </div>
              <h3>Dear {{ vendorInfo.vendorDisplayName }}</h3>
              <p v-html="vendorProposal.personalMessage">
                <!-- Personal Message -->
              </p>
              <div class="signature md-hide">
                Thanks,
                <br />
                {{ vendorInfo.vendorDisplayName }}
              </div>
              <template v-if="attachedFiles.length">
                <div class="attachments-list">
                  <h6>Attachments</h6>
                  <ul class="attachments-list_items">
                    <li v-for="(item, index) in attachedFiles" :key="index">
                      <a target="_blank" :href="`${item.fullPath}`">
                        <md-icon>attach_file</md-icon>
                        {{ item.tag ? item.tag.replace(/_/g, " ") : `Attachment${index + 1}` }}
                      </a>
                    </li>
                  </ul>
                </div>
              </template>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-size-50">
          <md-card class="cost-pros-cons-section">
            <md-card-content>
              <div class="cost-info">
                <div class="cost-info_desc">
                  <div class="cost-label">Subtotal</div>
                  <br />
                  <div class="cost-value">${{ vendorProposal.cost | numeral(0, 0) }}</div>
                  <br />
                  <div class="down-payment">Down Payment : ${{ (vendorProposal.cost * 0.1) | numeral(0, 0) }}</div>
                </div>
                <div class="cost-info_desc">
                  <div class="cost-label">Cost Per Guest</div>
                  <br />
                  <div class="cost-value">${{ vendorProposal.costPerGuest | numeral(0, 0) }}</div>
                </div>
              </div>
              <div class="cost-info_breakdown">
                <div class="cost-label">Cost Breakdown</div>
                <br />
                <ul class="cost-breakdown__items">
                  <li v-for="(item, index) in proposal.costBreakdown" :key="index">
                    <span v-if="item.service">{{ item.service }}: ${{ item.cost | numeral(0, 0) }}</span>
                  </li>
                </ul>
              </div>
              <div class="proposal-pros-cons">
                <div class="section-content pros-section">
                  <md-icon class="thumb-up">thumb_up_alt</md-icon>
                  <ul class="list-items">
                    <li>
                      <br />
                    </li>
                    <li v-for="(item, index) in vendorProposal.pros" :key="index">
                      {{ getStringWithRoundedNumber(item) }}
                    </li>
                  </ul>
                </div>
                <div class="section-content cons-section">
                  <md-icon class="thumb-down">thumb_down_alt</md-icon>
                  <ul class="list-items">
                    <li>
                      <br />
                    </li>
                    <li v-for="(item, index) in vendorProposal.cons" :key="index">{{ item }}</li>
                  </ul>
                </div>
              </div>
              <div class="need-help-section">
                <h6>Need help or Modification?</h6>
                <br />
                <a @click="tooltipActive = !tooltipActive"
                  >Contact {{ vendorInfo.contactPerson ? vendorInfo.contactPerson : vendorInfo.vendorDisplayName }}</a
                >
                <br />
                <div class="arrow_box" v-if="tooltipActive">
                  <strong>Contact Information:</strong>
                  <br />
                  <span>Phone: {{ vendorInfo.vendorMainPhoneNumber }}</span>
                  <br />
                  <span>Email: {{ vendorInfo.vendorMainEmail }}</span>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-size-100">
          <div class="section-title with-border">
            <h3>Included in {{ vendorInfo.vendorCategory }}:</h3>
            <div class="total-budget text-right pull-right">
              <span class="total"
                >Total {{ vendorInfo.vendorCategory }}: ${{ vendorProposal.cost | numeral(0, 0) }}</span
              >
              <br />
              <span class="per-guest">Per Guest: ${{ vendorProposal.costPerGuest | numeral(0, 0) }}</span>
            </div>
          </div>
          <ul class="included-list">
            <li v-for="(item, index) in vendorProposal.included" :key="index">
              <template v-if="item.requirementTitle">
                <md-icon>check</md-icon>
                <div class="included-item">
                  <h5>{{ item.requirementTitle }}</h5>
                  <p>{{ item.comment }}</p>
                </div>
              </template>
            </li>
            <template v-if="extraMissingRequirements.length">
              <li
                v-for="(item, index) in extraMissingRequirements"
                :key="index + vendorProposal.included.length"
                class="proposals-waiting-approval"
              >
                <div class="proposal-info">
                  <div class="proposal-title">
                    {{ item.requirementValue }}x {{ item.requirementTitle }}
                    <small class="md-hide">(Suggested by vendor)</small>
                  </div>
                  <div class="proposal-desc" v-for="(comment, index) in item.comments" :key="index">
                    {{ comment.commentText }}
                    <md-button
                      v-if="comment.commentText.length > 300"
                      class="md-primary md-simple md-sm read-more no-uppercase"
                      >Read more</md-button
                    >
                  </div>
                </div>
                <div class="proposal-actions">
                  <md-button v-if="!item.itemNotAvailable" class="md-rose"
                    >Add (${{ item.price | numeral(0, 0) }})</md-button
                  >
                  <md-button v-else class="md-success">Got it</md-button>
                </div>
              </li>
            </template>
          </ul>
        </div>
        <div class="md-layout-item md-size-5 md-hide"></div>
        <div class="md-layout-item md-size-95 cost-breakdown-notes md-hide">
          <div class="section-title">
            <h3>Cost Breakdown</h3>
          </div>
          <div class="cost-breakdown-notes-sections">
            <div class="section-content cost-breakdown-section">
              <div class="section-content">
                <md-table v-model="vendorProposal.costBreakdown" class="table-plaint">
                  <md-table-row
                    slot="md-table-row"
                    slot-scope="{ item }"
                    :class="{ disabled: item.perGuest === 'N/A' }"
                  >
                    <md-table-cell md-label="Service tf-capitalize">{{ item.service }}</md-table-cell>
                    <md-table-cell md-label="Per guest">
                      <template v-if="item.perGuest === 'N/A'">{{ item.perGuest.toFixed(2) }}</template>
                      <template v-else>${{ item.perGuest }}</template>
                    </md-table-cell>
                    <md-table-cell class="cost-cell" md-label="Cost" :class="getAlignClasses(item)"
                      >${{ item.cost.toFixed(2) }}</md-table-cell
                    >
                  </md-table-row>
                </md-table>
                <div class="table table-stats table-striped">
                  <div class="td-price">
                    <div class="td-total">Subtotal</div>
                    <span class="td-value">${{ vendorProposal.cost.toFixed(2) | numeral(0, 0) }}</span>
                  </div>
                  <div class="td-price">
                    <div class="td-total">Tax (3%)</div>
                    <span class="td-value">${{ (vendorProposal.cost * 0.03).toFixed(2) | numeral(0, 0) }}</span>
                  </div>
                  <div class="td-price bold">
                    <div class="td-total">Total</div>
                    <span class="td-value">${{ vendorProposal.cost + vendorProposal.cost * 0.03 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="section-content notes-section">
              <div>
                <h4>Notes</h4>
                <p v-for="(note, index) in vendorProposal.notes" :key="index">{{ note }}</p>
              </div>
              <p class="danger-label">This offer is valid till {{ getDate(vendorProposal.validUntil) }}.</p>
            </div>
          </div>
        </div>
        <template v-if="images.length">
          <div class="md-layout-item md-size-100 gallery-section">
            <div class="section-title">
              <h3>Vendor's Images</h3>
            </div>
            <md-button v-if="images.length" class="md-default view-images no-uppercase" @click="view()"
              >View Images</md-button
            >
            <ul class="images-list">
              <li class="image-item" v-for="(item, index) in images" :key="index">
                <div
                  :style="`
                  background: url(${item.src}) center center no-repeat;
                  background-size: cover;`"
                ></div>
              </li>
              <!--              <li class="image-item" v-if="vendorProposal.attachements.length - images.length - attachedFiles.length">-->
              <!--                <div>-->
              <!--                  <vue-element-loading :active="true" spinner="ring" color="#FF547C">-->
              <!--                  </vue-element-loading>-->
              <!--                </div>-->
              <!--              </li>-->
              <!--              <li class="image-item" v-for="(af,index) in attachedFiles" :key="index">-->
              <!--                <vue-element-loading-->
              <!--                  :active="attachmentsLoadingCount > 0"-->
              <!--                  spinner="ring" color="#FF547C">-->
              <!--                </vue-element-loading>-->
              <!--                <iframe-->
              <!--                  seamless-->
              <!--                  frameborder="0"-->
              <!--                  @load="attachmentsLoadingCount&#45;&#45;"-->
              <!--                  :src="`${af}`"-->
              <!--                  style="width: 100%; min-height: 320px; padding: 0; margin: 0;">-->
              <!--                </iframe>-->
              <!--              </li>-->
            </ul>
            <LightBox v-if="images.length" :images="images" ref="lightbox" :show-light-box="false"></LightBox>
          </div>
        </template>
        <div class="md-layout-item md-size-5 md-hide"></div>
        <div class="md-layout-item md-size-95 feedback-section md-hide">
          <div class="section-title">
            <h5>Feedback</h5>
            <div class="review-count">(2)</div>
          </div>
          <ul class="feedback-list-items">
            <li class="feedback-item">
              <div class="item-thumbnail">J</div>
              <div class="item-info">
                <div class="item-name">
                  <h5>Jane Bloom, Facebook</h5>
                  <div class="star-rating">
                    <label
                      class="star-rating__star"
                      v-for="(rating, index) in ratings"
                      :key="index"
                      :class="{ 'is-selected': feedbackRating >= rating && feedbackRating != null }"
                    >
                      <input class="star-rating star-rating__checkbox" type="radio" v-model="feedbackRating" />★
                    </label>
                  </div>
                </div>
                <div class="item-body">
                  <p>
                    A 50% deposit will be due on or before 18/1/20. The remaining balance will be collected a week prior
                    to the event. We accept all major credit cards and checks.
                  </p>
                  <p>
                    The estimated amount above is not a fixed amount and is subject to change based on actual charges
                    and final guest counts and any additional charges approved by the Client.
                  </p>
                </div>
                <div class="date">Dec 29, 2017</div>
              </div>
            </li>
            <li class="feedback-item">
              <div class="item-thumbnail">J</div>
              <div class="item-info">
                <div class="item-name">
                  <h5>Jane Bloom, Facebook</h5>
                  <div class="star-rating">
                    <label
                      class="star-rating__star"
                      v-for="(rating, index) in ratings"
                      :key="index"
                      :class="{ 'is-selected': feedbackRating >= rating && feedbackRating != null }"
                    >
                      <input class="star-rating star-rating__checkbox" type="radio" v-model="feedbackRating" />★
                    </label>
                  </div>
                </div>
                <div class="item-body">
                  <p>
                    A 50% deposit will be due on or before 18/1/20. The remaining balance will be collected a week prior
                    to the event. We accept all major credit cards and checks.
                  </p>
                  <p>
                    The estimated amount above is not a fixed amount and is subject to change based on actual charges
                    and final guest counts and any additional charges approved by the Client.
                  </p>
                </div>
                <div class="date">Dec 29, 2017</div>
              </div>
            </li>
          </ul>
          <md-button class="md-rose md-sm md-simple">
            show more
            <md-icon>add</md-icon>
          </md-button>
        </div>
        <div class="md-layout-item md-size-100">
          <ul class="proposal-summary">
            <li class="md-hide">
              <div class="proposal-info">
                <div class="proposal-title">
                  Payment & cost
                  <span> <md-icon>attach_money</md-icon>Net +30 </span>
                </div>
                <div class="proposal-desc">
                  A 50% deposit will be due on or before 18/1/20. The remaining balance will be collected a week prior
                  to the..
                  <md-button class="md-primary md-simple md-sm read-more no-uppercase">Read more</md-button>
                </div>
              </div>
            </li>
            <li class="md-hide">
              <div class="proposal-info">
                <div class="proposal-title">
                  Payment & cost
                  <span> <md-icon>attach_money</md-icon>Net +30 </span>
                </div>
                <div class="proposal-desc">
                  A 50% deposit will be due on or before 18/1/20. The remaining balance will be collected a week prior
                  to the..
                  <md-button class="md-primary md-simple md-sm read-more no-uppercase">Read more</md-button>
                </div>
              </div>
            </li>
            <li>
              <div class="proposal-info about-us">
                <div class="proposal-title">About Us</div>
                <div class="proposal-desc">{{ vendorProposal.aboutUsMessage }}</div>
              </div>
              <div class="attachments-list md-hide">
                <ul class="attachments-list_items">
                  <li>
                    <a href> <md-icon>attach_file</md-icon>Insurance certificate </a>
                  </li>
                  <li>
                    <a href> <md-icon>attach_file</md-icon>Other business indication </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";

import LightBox from "vue-image-lightbox";
import ManageProposalsAccept from "../Modals/ManageProposalsAccept.vue";
import ProposalRequest from "@/models/ProposalRequest";
import EventComponentProposal from "@/models/EventComponentProposal";

export default {
  components: {
    VueElementLoading,
    LightBox,
    ManageProposalsAccept,
  },
  props: {
    event: Object,
    proposal: Object,
    selectedBlock: Object,
  },
  data: () => ({
    // auth: auth,
    ratings: [1, 2, 3, 4, 5],
    images: [],
    feedbackRating: 3,
    vendorProposal: null,
    vendorInfo: null,
    serverUrl: process.env.SERVER_URL,
    tooltipActive: false,
    attachedFiles: [],
    attachmentsLoadingCount: 0,
  }),
  created() {
    console.log(this.proposal);
    this.$set(this, "vendorProposal", this.proposal);
    this.$set(this, "vendorInfo", this.proposal.vendor);
  },
  mounted() {
    this.getImages();
  },
  methods: {
    closePanel() {
      this.$emit("closePanel");
    },
    getProposalDate(eventStartMillis) {
      let x = new Date(eventStartMillis);
      return x.getFullYear() + "+" + x.getMonth() + "+" + x.getDate();
    },
    getAlignClasses: ({ id }) => ({
      "text-right": id,
    }),
    view() {
      this.$refs.lightbox.showImage(0);
    },
    manageProposalsAccept(proposal) {
      window.currentPanel = this.$showPanel({
        component: ManageProposalsAccept,
        cssClass: "md-layout-item md-size-70 transition36 bg-grey",
        openOn: "right",
        props: {
          event: this.event,
          proposal: this.proposal,
          selectedBlock: this.selectedBlock,
        },
      });
    },
    getDate(eventStartMillis) {
      let x = new Date(eventStartMillis);
      return moment(x).format("MMMM D, YYYY");
    },
    getStringWithRoundedNumber(rawString) {
      let numbers = rawString.replace(/[^\d\.]*/g, "");
      if (numbers) {
        const subString = rawString.split(numbers);
        numbers = parseFloat(numbers).toFixed(2);
        return subString[0] + numbers.toString() + subString[1];
      } else {
        return rawString;
      }
    },
    getImages() {
      this.images = [];
      this.attachedFiles = [];
      this.attachmentsLoadingCount = 0;

      this.vendorProposal.attachements.forEach((item) => {
        const fullPath = `${this.serverUrl}/1/proposal-requests/${this.proposal.id}/files/${item.id}`;

        this.$http.get(fullPath, { headers: this.$auth.getAuthHeader() }).then((response) => {
          if (response && response.headers) {
            if (response.headers["content-type"].indexOf("image") > -1) {
              this.images.push({
                thumb: fullPath,
                src: fullPath,
                caption: "",
                srcset: "",
              });
            } else {
              this.attachedFiles.push({
                fullPath: fullPath,
                tag: item.tag,
                name: item.name,
              });
              this.attachmentsLoadingCount++;
            }
          }
        });
      });
    },
  },
  computed: {
    extraMissingRequirements() {
      return _.union(this.vendorProposal.extras, this.vendorProposal.missing);
    },
  },
};
</script>
<style lang="scss" scoped>
.text-right /deep/ .md-table-cell-container {
  display: flex;
  justify-content: flex-end;
}

.md-table /deep/ .md-table-head:last-child {
  text-align: right;
}

.table-stats {
  display: flex;
  align-items: center;
  text-align: right;
  flex-flow: row wrap;
  .td-price {
    .td-total {
      display: inline-flex;
      margin-right: 20px;
    }
    .td-value {
      width: 91px;
      display: inline-block;
      text-align: left;
    }
  }
  &.table-striped .td-price {
    border-bottom: 0;
    color: #000;
  }
  .td-price {
    font-size: 14px;
    font-weight: 400;
    &.bold {
      font-weight: bold;
    }
  }
  .td-price,
  > div {
    flex: 0 0 100%;
    padding: 4px 8px;
  }
}

.table-shopping /deep/ .md-table-head:nth-child(5),
.table-shopping /deep/ .md-table-head:nth-child(7),
.table-shopping /deep/ .md-table-head:nth-child(6) {
  text-align: right;
}

.arrow_box {
  background: white;
  position: absolute;
  padding: 1em;
  border-radius: 3px;
  border: 1px solid #c6c6c6;
  margin-top: 1em;
  margin-left: -2em;

  strong {
    font-size: 13px;
    font-weight: 400;
  }
  span {
    font-size: 12px;
    color: #666666;
  }
}
.arrow_box:after,
.arrow_box:before {
  bottom: 100%;
  left: 20%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow_box:after {
  border-color: rgba(0, 0, 0, 0);
  border-bottom-color: #ffffff;
  border-width: 8px;
  margin-left: -8px;
}
.arrow_box:before {
  border-color: rgba(198, 198, 198, 0);
  border-bottom-color: #c6c6c6;
  border-width: 9px;
  margin-left: -9px;
}

.maxh-50vh {
  max-height: 50vh;
}
.title-section {
  .md-title {
    margin-bottom: 0;
    line-height: 51px;
    text-transform: capitalize;
  }
}
.md-hide {
  display: none !important;
}
.tf-capitalize {
  text-transform: capitalize;
}
</style>
