<template>
  <collapse-panel class="white-card proposal-requirements-panel" :spacing="20" v-if="!isLoading">
    <template slot="header">
      <div class="d-flex align-center p-30">
        <img :src="`${$storageURL}Additional%20Requests.svg`" />
        <div class="font-size-22 font-bold-extra color-black ml-10">Requirements <br />from the planner</div>
      </div>
    </template>
    <template slot="content">
      <div class="requirements-content pt-0-i" v-if="step < 2" style="padding: 30px 30px 0">
<!--        <div>-->
<!--          <template v-for="types in requirementsData.types">-->
<!--            <span class="type-tag" v-for="type in types" :key="type">{{ type }}</span>-->
<!--          </template>-->
<!--        </div>-->
        <div class="category-section" v-for="(types, key) in requirementsData.types">
            <div class="color-dark-gray text-transform-capitalize">{{ key }}</div>
            <div class="requirement-grid">
                <div v-for="type in types" class="requirement-item">
                  <div class="checkmark"></div>
                  <div class="d-inline-block">{{type}}</div>
                </div>
            </div>
        </div>

        <template v-if="requirementsData.mainRequirements">
          <div
            v-for="(requirementCategory, index) in Object.keys(requirementsData.mainRequirements)"
            :key="`requirement-category-${index}`"
          >
            <template v-if="requirementCategory.toLowerCase() === 'special'">
              <div
                class="category-section"
                v-for="subCategory in selectedOptions(requirementsData.mainRequirements[requirementCategory])"
                :key="subCategory.subCategory"
              >
                <div class="color-dark-gray text-transform-capitalize">{{ subCategory.subCategory }}</div>
                <div class="requirement-grid">
                  <div
                    class="requirement-item"
                    v-for="requirementItem in subCategory.options.filter((item) => item.selected)"
                    :key="requirementItem.name"
                  >
                    <div class="checkmark"></div>
                    <div class="d-inline-block">{{ requirementItem.name }}</div>
                  </div>
                </div>
              </div>
            </template>
            <div
              v-else-if="
                requirementsData.mainRequirements[requirementCategory].filter((item) => item.selected).length > 0
              "
              class="category-section"
            >
              <div class="color-dark-gray text-transform-capitalize">{{ requirementCategory }}</div>
              <div class="requirement-grid">
                <div
                  class="requirement-item"
                  v-for="requirementItem in requirementsData.mainRequirements[requirementCategory].filter(
                    (item) => item.selected,
                  )"
                  :key="requirementItem.item"
                >
                  <div class="checkmark"></div>
                  <!-- {{ requirementItem }} -->
                  <div class="d-inline-block">
                    {{ requirementItem.item || requirementItem.subCategory }}
                    <span v-if="requirementItem.defaultQty">(X{{ requirementItem.defaultQty }})</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-else></div> -->
          </div>
        </template>

        <div class="addtional-requests">
          <div class="font-bold">Additional Requests</div>
          <div>
            {{ additionalNote }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="requirements-content pt-0-i" style="padding: 30px 30px 0">
          <div class="font-size-20 font-bold mb-20">
            {{ getCategoryFromId(secondaryRequirement.category).fullTitle }}
          </div>
          <div class="category-section" v-for="(types, key) in secondaryRequirement.types">
            <div class="color-dark-gray text-transform-capitalize">{{ key }}</div>
            <div class="requirement-grid">
                <div v-for="type in types" class="requirement-item">
                    <div class="checkmark"></div>
                    <div class="d-inline-block">{{type}}</div>
                </div>
            </div>
          </div>
          <template v-if="secondaryRequirement.mainRequirements">
              <div
                  v-for="(requirementCategory, index) in Object.keys(secondaryRequirement.mainRequirements)"
                  :key="`requirement-category-${index}`"
              >
                  <template v-if="requirementCategory === 'multi-selection'"> </template>
                  <template v-else-if="requirementCategory.toLowerCase() === 'special'">
                      <div
                          class="category-section"
                          v-for="subCategory in selectedOptions(secondaryRequirement.mainRequirements[requirementCategory])"
                          :key="subCategory.subCategory"
                      >
                          <div class="color-dark-gray text-transform-capitalize">{{ subCategory.subCategory }}</div>
                          <div class="requirement-grid">
                              <div
                                  class="requirement-item"
                                  v-for="requirementItem in subCategory.options.filter((item) => item.selected)"
                                  :key="requirementItem.name"
                              >
                                  <div class="checkmark"></div>
                                  <div class="d-inline-block">{{ requirementItem.name }}</div>
                              </div>
                          </div>
                      </div>
                  </template>
                  <div
                      v-else-if="
                secondaryRequirement.mainRequirements[requirementCategory].filter((item) => item.selected).length > 0
              "
                      class="category-section"
                  >
                      <div class="color-dark-gray text-transform-capitalize">{{ requirementCategory }}</div>
                      <div class="requirement-grid">
                          <div
                              class="requirement-item"
                              v-for="requirementItem in secondaryRequirement.mainRequirements[requirementCategory].filter(
                    (item) => item.selected,
                  )"
                              :key="requirementItem.item"
                          >
                              <div class="checkmark"></div>
                              <!-- {{ requirementItem }} -->
                              <div class="d-inline-block">
                                  {{ requirementItem.item || requirementItem.subCategory }}
                                  <span v-if="requirementItem.defaultQty">(X{{ requirementItem.defaultQty }})</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </template>
          <div v-if="step < 2" class="addtional-requests">
            <div class="font-bold">Addtional Requests</div>
            <div>
                {{ additionalNote }}
            </div>
          </div>
        </div>
      </div>
      <div class="position-relative" style="padding: 15px 30px 30px">
          <fade-transition v-if="statusMessage">
              <md-card class="position-absolute notification-card">
                  <md-card-content class="d-flex align-center position-relative p-30">
                      <div class="message-arrow" style="right: 200px"></div>
                      <div class="">
                          <img :src="`${$iconURL}VendorsProposalPage/group-16292.svg`" style="width: 45px"/>
                      </div>
                      <div class="ml-10">
                          <span class="color-won font-size-16 font-bold-extra">Message was sent!</span>
                          <p class="my-0">We will make sure the planner will get back to you as soon as possible</p>
                      </div>
                      <div class="position-absolute" style="right: 20px; top: 20px">
                          <md-button class="md-icon-button md-simple" @click="statusMessage = ''">
                              <img :src="`${$iconURL}Campaign/Group+3602.svg`">
                          </md-button>
                      </div>
                  </md-card-content>

              </md-card>
        </fade-transition>
        <md-button class="md-outlined md-vendor md-simple maryoku-btn width-100" @click="showQuestionModal = true">
          <img :src="`${$iconURL}Submit Proposal/group-19162.svg`" class="page-icon mr-10" />
          Questions? Send a question to planner
        </md-button>
        <question-modal
            v-if="showQuestionModal"
            @cancel="showQuestionModal = false"
            @send="sendMail"
        ></question-modal>
      </div>
    </template>
  </collapse-panel>
  <div v-else></div>
</template>
<script>
import CollapsePanel from "../../Campaign/CollapsePanel.vue";
import CalendarEvent from "@/models/CalendarEvent";
import ProposalRequestRequirement from "@/models/ProposalRequestRequirement";
import QuestionModal from "./Modals/QuestionModal.vue";
import { FadeTransition } from "vue2-transitions";
export default {
  components: {
      CollapsePanel,
      QuestionModal,
      FadeTransition
  },
  data() {
    return {
      additionalServiceRequirements: [],
      showQuestionModal: false,
      isLoading: true,
      statusMessage: '',
    };
  },
  methods: {
    sendMail(message){
        if(!message) return
        this.showQuestionModal = false

        if(this.vendor.vendorMainEmail && this.proposalRequest.eventData && this.proposalRequest.eventData.owner
            && this.proposalRequest.eventData.owner.emailAddress)
          this.$http
          .post(
            `${process.env.SERVER_URL}/1/sendMail`,
            {
              from: this.vendor.vendorMainEmail,
              to: this.proposalRequest.eventData.owner.emailAddress,
              subject: 'Questions',
              message,
            },
            { headers: this.$auth.getAuthHeader() },
          )
          .then((res) => {
            if (res.data.status) {
              this.statusMessage = "We have sent an email to the invited users.";
            } else {
              this.statusMessage = "Something is wrong. Please try again later.";
            }
          });
    },
    selectedOptions(specialRequirements) {
      if (!specialRequirements) return [];
      return specialRequirements.filter(
        (item) =>
          item.subCategory.toLowerCase() !== "sitting arrangement" && item.options.some((option) => option.selected),
      );
    },
    getCategoryFromId(category) {
      if (!category) return {};
      return this.$store.state.common.serviceCategories.find((item) => item.key === category);
    },
  },
  created() {
    new ProposalRequestRequirement()
      .for(new CalendarEvent({ id: this.proposalRequest.eventData.id }))
      .get()
      .then((res) => {
        console.log(res);
        this.isLoading = false;
        this.additionalServiceRequirements = res;
      });
  },
  computed: {
    vendor() {
      return this.$store.state.vendorProposal.vendor;
    },
    requirementsData() {
      // console.log(this.allRequirements[this.vendor.eventCategory.key]);
      return this.allRequirements[this.vendor.eventCategory.key] || {};
      // return this.allRequirements;
    },
    secondaryRequirement() {
      console.log(this.allRequirements[this.$store.state.vendorProposal.currentSecondaryService])
      return this.allRequirements[this.$store.state.vendorProposal.currentSecondaryService] || {};
    },
    allRequirements() {
      if (this.additionalServiceRequirements.length > 0) {
        const requirementsMap = this.additionalServiceRequirements.reduce((mapData, requirement, index) => {
          mapData[requirement.category] = requirement;
          return mapData;
        }, {});
        return requirementsMap;
      }
      return {};
    },
    proposalRequest() {
      return this.$store.state.vendorProposal.proposalRequest;
    },
    additionalNote() {
      try {
        return this.proposalRequest.plannerRequirement.additionalDescription;
      } catch (e) {
        return "";
      }
    },
    step() {
      try {
        return this.$store.state.vendorProposal.wizardStep;
      } catch (e) {
        return 0;
      }
    },
  },
  watch:{
    step(newVal){
        console.log('step', this.step);
    }
  }
};
</script>
<style lang="scss" scoped>
.proposal-requirements-panel {
  .addtional-requests {
    padding: 25px;
    background-color: #eaeaea;
  }
  .type-tag {
    display: inline-block;
    border: solid 1px #641856;
    color: #641856;
    border-radius: 30px;
    padding: 5px 20px;
    margin: 0px 10px 10px 0;
  }
  .category-section {
    padding: 30px 0;
    border-top: solid 1px #a0a0a0;
    .requirement-grid {
      display: flex;
      flex-wrap: wrap;
      box-sizing: border-box;
      .requirement-item {
        margin-top: 20px;
        text-transform: capitalize;
        padding-right: 15px;
        min-width: 30%;
        display: inline-block;
      }
    }
    .checkmark {
      display: inline-block;
      margin-right: 5px;
      margin-top: 0.4em;
      &:after {
        /*Add another block-level blank space*/
        content: "";
        display: block;

        /*Make it a small rectangle so the border will create an L-shape*/
        width: 6px;
        height: 10px;

        /*Add a white border on the bottom and left, creating that 'L' */
        border: solid #641856;
        border-width: 0 3px 3px 0;
        border-radius: 1px;

        /*Rotate the L 45 degrees to turn it into a checkmark*/
        transform: rotate(45deg);
      }
    }
  }
.message-arrow{
    position: absolute;
    bottom: -30px;
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
    border-top: 30px solid white;
    /*box-shadow: 0 1px 4px 0 rgba(0,0,0,,.3);*/
 }
}
.notification-card{
  top: -170px;
  right:60px;
  width: 600px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.26)
}
</style>
