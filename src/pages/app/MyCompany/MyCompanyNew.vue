<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <div class="md-layout-item md-small-size-30 md-medium-size-30 md-large-size-20">
      <md-card class="md-card-profile">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-100 company-view-common-logo_block hover-block">
              <div class="company-main-logo-block">
                <img class="company-logo" :src="getAvatar" />
                <div class="onhover-block">
                  <div class="company-logo-button-block">
                    <div @click="UploadAvatar">
                      <md-icon class="company-logo-button">
                        edit
                        <input
                          type="file"
                          id="company-avatar-upload"
                          @change="onFileChange($event)"
                          style="display: none"
                        />
                      </md-icon>
                    </div>
                    <div @click="deleteAvatar(customer.files[0])">
                      <md-icon class="company-logo-button">clear</md-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div class="company-name-block">
                <h4 class="title text-gray" style="font-weight: 500">{{ customer.name }}</h4>
              </div>
            </div>
            <div class="md-layout-item md-size-100">
              <div class="fc-divider" style="margin: 15px"></div>
            </div>
            <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
              <div style="display: flex; align-items: center; justify-content: space-between">
                <p style="width: 100%; display: flex; align-items: center; justify-content: space-between">
                  <span>Number of Guests</span>
                  <span class="value">{{ customer.numberOfEmployees }}</span>
                </p>
                <v-popover offset="16" :disabled="!isEnabled" :auto-hide="false" placement="right" open-group="group1">
                  <md-button
                    class="tooltip-target b3 onhover-block md-button md-icon-button md-simple md-theme-default"
                    @click="inputFocus = true"
                  >
                    <md-icon>edit</md-icon>
                  </md-button>

                  <template slot="popover">
                    <input-text
                      labelStyle="company_label_input"
                      label="Number of guests"
                      name="numberOfEmployees"
                      :value="String(customer.numberOfEmployees)"
                      :onChange="onChange"
                      editebleMode
                      :focus="inputFocus"
                      :isEditable="isEnabled"
                      :actionFunc="saveInfoFromForm"
                      :ctx="customer"
                      fieldStyle="without-border"
                      @update-focus-value="onUpdateFocus"
                    />
                  </template>
                </v-popover>
              </div>
            </div>

            <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
              <div style="display: flex; align-items: center; justify-content: space-between">
                <p style="width: 100%; display: flex; align-items: center; justify-content: space-between">
                  <span>Industry</span>
                  <span class="value" :title="customer.industry">{{ customer.industry }}</span>
                </p>
                <v-popover offset="16" :disabled="!isEnabled" :auto-hide="false" placement="right" open-group="group2">
                  <md-button
                    class="tooltip-target onhover-block b3 md-button md-icon-button md-simple md-theme-default"
                  >
                    <md-icon>edit</md-icon>
                  </md-button>

                  <template slot="popover">
                    <select-common
                      label="Industry"
                      labelStyle="om_label_input"
                      :list="industryList"
                      name="industry"
                      :onChange="onChange"
                      :valueName="['title', 'title']"
                      editebleMode
                      :isEditable="isEnabled"
                      :actionFunc="saveInfoFromForm"
                      :ctx="customer"
                      :value="customer.industry"
                      fieldStyle="without-border"
                    />
                  </template>
                </v-popover>
              </div>
            </div>

            <div class="md-layout-item md-size-100">
              <div class="fc-divider" style="margin: 15px"></div>
            </div>
            <div>
              <div class="header text-bold text-gray">Contact Information</div>
              <div v-if="customer.mainAddress" class="md-layout">
                <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <p>
                      <span class="icon-container">
                        <i class="fa fa-map-marker-alt"></i>
                      </span>
                      <span>{{ customer.mainAddress.onelineAddress }}</span>
                    </p>
                    <v-popover
                      offset="16"
                      :disabled="!isEnabled"
                      :auto-hide="false"
                      placement="right"
                      open-group="group3"
                    >
                      <md-button
                        class="tooltip-target b3 onhover-block md-button md-icon-button md-simple md-theme-default"
                        @click="inputFocus = true"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>

                      <template slot="popover">
                        <input-text
                          labelStyle="company_label_input"
                          label="Company address"
                          name="mainAddress"
                          id="main_address_customer"
                          :value="customer.mainAddress.onelineAddress"
                          :onChange="onChange"
                          editebleMode
                          :focus="inputFocus"
                          :isEditable="isEnabled"
                          :actionFunc="saveInfoFromForm"
                          :ctx="customer"
                          fieldStyle="without-border"
                          @update-focus-value="onUpdateFocus"
                        />
                      </template>
                    </v-popover>
                  </div>
                </div>
                <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <p>
                      <span class="icon-container">
                        <i class="fa fa-phone-volume"></i>
                      </span>
                      <span>{{ String(user.phoneNumber) || "" }}</span>
                    </p>
                    <v-popover
                      offset="16"
                      :disabled="!isEnabled"
                      :auto-hide="false"
                      placement="right"
                      open-group="group4"
                    >
                      <md-button
                        class="tooltip-target b3 onhover-block md-button md-icon-button md-simple md-theme-default"
                        @click="inputFocus = true"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>

                      <template slot="popover">
                        <input-text
                          labelStyle="company_label_input"
                          label="Phone"
                          name="phoneNumber"
                          :value="String(user.phoneNumber) || ''"
                          :onChange="onChange"
                          editebleMode
                          :focus="inputFocus"
                          :isEditable="isEnabled"
                          :actionFunc="saveInfoFromForm"
                          :ctx="user"
                          fieldStyle="without-border"
                          @update-focus-value="onUpdateFocus"
                        />
                      </template>
                    </v-popover>
                  </div>
                </div>
                <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <p>
                      <span class="icon-container">
                        <i class="fa fa-envelope"></i>
                      </span>
                      <span>{{ customer.workspaceDomain }}</span>
                    </p>
                    <v-popover
                      offset="16"
                      :disabled="!isEnabled"
                      :auto-hide="false"
                      placement="right"
                      open-group="group5"
                    >
                      <md-button
                        class="tooltip-target b3 onhover-block md-button md-icon-button md-simple md-theme-default"
                        @click="inputFocus = true"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>

                      <template slot="popover">
                        <input-text
                          labelStyle="company_label_input"
                          label="Company Email"
                          name="workspaceDomain"
                          :value="customer.workspaceDomain"
                          :onChange="onChange"
                          editebleMode
                          :focus="inputFocus"
                          :isEditable="isEnabled"
                          :actionFunc="saveInfoFromForm"
                          :ctx="customer"
                          fieldStyle="without-border"
                          @update-focus-value="onUpdateFocus"
                        />
                      </template>
                    </v-popover>
                  </div>
                </div>
                <div class="md-layout-item md-size-100 hover-block" style="text-align: left">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <p>
                      <span class="icon-container">
                        <i class="fa fa-globe"></i>
                      </span>
                      <span>{{ customer.website }}</span>
                    </p>
                    <v-popover
                      offset="16"
                      :disabled="!isEnabled"
                      :auto-hide="false"
                      placement="right"
                      open-group="group6"
                    >
                      <md-button
                        class="tooltip-target b3 onhover-block md-button md-icon-button md-simple md-theme-default"
                        @click="inputFocus = true"
                      >
                        <md-icon>edit</md-icon>
                      </md-button>

                      <template slot="popover">
                        <input-text
                          labelStyle="company_label_input"
                          label="Company Domain"
                          name="website"
                          :value="customer.website"
                          :onChange="onChange"
                          editebleMode
                          :focus="inputFocus"
                          :isEditable="isEnabled"
                          :actionFunc="saveInfoFromForm"
                          :ctx="customer"
                          fieldStyle="without-border"
                          @update-focus-value="onUpdateFocus"
                        />
                      </template>
                    </v-popover>
                  </div>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-100">
              <div class="fc-divider" style="margin: 15px"></div>
            </div>
            <div class="md-layout-item md-size-100" style="padding: 0">
              <div class="company-branch_block">
                <div class="md-layout-item md-size-100" style="text-align: left">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <div class="header text-bold text-gray" style="margin: 0">Branches</div>
                    <v-popover
                      offset="16"
                      :disabled="!isEnabled"
                      :auto-hide="false"
                      placement="right"
                      open-group="group7"
                    >
                      <md-button
                        class="tooltip-target b3 md-button md-icon-button md-simple md-theme-default"
                        @click="inputFocus = true"
                      >
                        <md-icon>add</md-icon>
                      </md-button>

                      <template slot="popover">
                        <form @submit.prevent="addIndustry" action="#">
                          <input-text
                            labelStyle="company_label_input"
                            label="Branches address"
                            name="branch_address"
                            :onChange="onChange"
                            editebleMode
                            :focus="inputFocus"
                            :isEditable="isEnabled"
                            :value="branch_address"
                            id="branch_address_search"
                            :actionFunc="saveInfoFromForm"
                            :ctx="customer"
                            fieldStyle="without-border"
                            @update-focus-value="onUpdateFocus"
                          />
                        </form>
                      </template>
                    </v-popover>
                  </div>
                </div>
              </div>

              <div class="md-layout">
                <div v-if="customer.branches" class="md-layout-item md-size-100">
                  <div v-for="(branch, index) of customer.branches || []" :key="index">
                    <div
                      style="
                        text-align: left;
                        display: flex;
                        align-items: center;
                        align-items: center;
                        justify-content: space-between;
                      "
                    >
                      <p>{{ branch.onelineAddress }}</p>
                      <v-popover offset="16" :disabled="!isEnabled" hideOnTargetClick placement="right">
                        <md-button
                          class="tooltip-target b3 md-button md-icon-button md-simple md-theme-default"
                          @click="branchFocus(index)"
                        >
                          <md-icon>edit</md-icon>
                        </md-button>

                        <template slot="popover">
                          <input-text
                            labelStyle="company_label_input"
                            label="Branches address"
                            name="branch_address_update"
                            :onChange="onChange"
                            editebleMode
                            :focus="inputFocus"
                            :isEditable="isEnabled"
                            :value="branch_address"
                            id="branch_address_update"
                            :actionFunc="saveInfoFromForm"
                            :ctx="customer"
                            fieldStyle="without-border"
                            @update-focus-value="onUpdateFocus"
                          />
                        </template>
                      </v-popover>
                      <md-button
                        class="md-button md-icon-button md-simple md-theme-default"
                        @click.prevent="deleteBranch(index)"
                      >
                        <md-icon class="event-add_icon">delete</md-icon>
                      </md-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md-layout-item md-size-100">
              <div class="fc-divider" style="margin: 15px"></div>
            </div>
            <div>
              <div class="header text-bold text-gray">Customer Infromation</div>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item md-size-33" style="position: relative">
      <div class="chart-box">
        <div class="logo-block">
          <LineChart
            v-if="!isMonthly && getChartNumberOfEventsPerYear"
            key="username-input"
            classStyle="max-height: 150px;  border-radius: 5px; box-shadow: 0px 2px 9px 0 rgba(0, 0, 0, 0.31); background-image: linear-gradient(322deg, #4d9b51, #62b766);"
            id="number_of_events_chart"
            width="350"
            height="150"
            :dataChart="getChartNumberOfEventsPerYear"
            type="line"
            :optionChart="dataChart.options"
          />
          <LineChart
            v-else
            key="email-input"
            classStyle="max-height: 150px;  border-radius: 5px;box-shadow: 0px 2px 9px 0 rgba(0, 0, 0, 0.31);background-image: linear-gradient(322deg, #4d9b51, #62b766);"
            id="number_of_events_chart_monthly"
            width="350"
            height="150"
            :dataChart="getDataFromDuration"
            type="line"
            :optionChart="dataChart.options"
          />
        </div>
        <md-card-content style="max-height: 200px">
          <div class="filter-block" v-if="showFilter">
            <div class="filter-datepicker">
              <div class="filter-datepicker-block">
                <select-common
                  label="Start year"
                  labelStyle="om_label_input"
                  :list="getDurationForChart"
                  name="startPeriod"
                  :onChange="onChange"
                />
              </div>
              <div class="filter-datepicker-block">
                <select-common
                  label="From"
                  labelStyle="om_label_input"
                  :list="listMonth"
                  name="from"
                  :onChange="onChange"
                />
              </div>
            </div>
            <div class="filter-datepicker">
              <div class="filter-datepicker-block">
                <select-common
                  label="Finish year"
                  labelStyle="om_label_input"
                  :list="getDurationForChart"
                  name="finishPeriod"
                  :onChange="onChange"
                />
              </div>
              <div class="filter-datepicker-block">
                <select-common
                  label="To"
                  labelStyle="om_label_input"
                  :list="listMonth"
                  name="to"
                  :onChange="onChange"
                />
              </div>
            </div>
          </div>
          <div class="chart-title">
            <div class="title text-bold">Number of events</div>
            <div class="company-button-filter-block">
              <ButtonDiv
                text="Yearly"
                class="button-filter"
                secondClass="chenge-filter"
                :classChenger="!showFilter"
                :onClick="onChangeFilterToEarly"
              />
              <ButtonDiv
                text="Monthly"
                class="button-filter"
                secondClass="chenge-filter"
                :classChenger="showFilter"
                :onClick="onChangeFilter"
              />
            </div>
          </div>
          <div>
            <span class="info-chat-value">{{ numberOfEvents }}</span>
            <span class="info-chart">{{ `This year of ${currentYear}` }}</span>
          </div>
        </md-card-content>
      </div>
      <md-card class="margin-block-for-card">
        <div class="logo-block">
          <div class="event-planer-logo partisipation-logo">
            <md-icon class="company-logo">how_to_reg</md-icon>
          </div>
        </div>
        <md-card-content>
          <div class="title text-bold">Average number of participants per event</div>
          <div>
            <ControlPanel :onClick="getMonthControlRate" controlBlockStyle="control-panel-block-participants" />
          </div>
          <div>
            <LineIndicator
              v-if="participantsList"
              v-for="item in participantsList"
              :key="item.total + item.typeEvent"
              leftIndicatorStyle="left-side-indicator-participants"
              rightIndicatorStyle="right-side-indicator"
              :total="item.total"
              :typeEvent="item.typeEvent"
              :currentValue="item.currentValue"
            />
          </div>
        </md-card-content>
      </md-card>
      <md-card class="margin-block-for-card">
        <div class="logo-block">
          <LineChart
            v-if="getChartEventPerEmployee"
            classStyle="max-height: 150px; border-radius: 5px;  box-shadow: 0px 2px 9px 0 rgba(0, 0, 0, 0.31);  background-image: linear-gradient(322deg, #c3255b, #ea3c77);"
            id="number_of_participants_chart"
            width="350"
            height="150"
            :dataChart="getChartEventPerEmployee"
            type="line"
            :optionChart="dataChart.options"
          />
        </div>
        <md-card-content style="max-height: 200px">
          <div class="title text-bold">Average event cost per employee</div>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item md-size-33">
      <md-card>
        <div class="logo-block">
          <div class="event-planer-logo rate-logo">
            <md-icon class="company-logo">thumbs_up_down</md-icon>
          </div>
        </div>
        <md-card-content>
          <div class="title text-bold">Attendants satisfaction rate</div>
          <div>
            <ControlPanel :onClick="getMonthFromControl" controlBlockStyle="control-panel-block-rate" />
            <div class="rate-mean-block">
              <span class="indicator-event-info-mean-value">{{ `${Math.floor(getMeanValue)}%` }}</span>
              <span class="indicator-event-type-title-rate">{{
                `Average attendants satisfaction in ${new Date().getFullYear()}`
              }}</span>
            </div>
          </div>
          <div>
            <LineIndicator
              v-if="ratesList"
              v-for="item in ratesList"
              :key="item.total + item.typeEvent"
              leftIndicatorStyle="left-side-indicator-rate"
              rightIndicatorStyle="right-side-indicator"
              :total="item.total"
              :categoryEvent="item.category"
              :currentValue="item.currentValue"
              isRate
            />
          </div>
        </md-card-content>
      </md-card>
      <md-card class="margin-block-for-card">
        <div class="logo-block">
          <LineChart
            v-if="getChartEventsPerCategory"
            classStyle="max-height: 150px; border-radius: 5px;  box-shadow: 0px 2px 9px 0 rgba(0, 0, 0, 0.31);  background-image: linear-gradient(322deg, #4d9b51, #62b766);"
            id="event_vs_category"
            width="350"
            height="150"
            :dataChart="getChartEventsPerCategory"
            type="bar"
            :optionChart="dataChart.options"
          />
        </div>
        <md-card-content>
          <div class="title text-bold">Event categories comparison</div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
// MAIN MODULES
import { mapGetters, mapMutations, mapState } from "vuex";

// import auth from '@/auth';
import Swal from "sweetalert2";

// COMPONENTS
import { Tabs, NavTabsCard } from "@/components";
import VueElementLoading from "vue-element-loading";
import Select from "@/components/Select/Select.vue";
import MyCompanyDashboard from "src/pages/app/MyCompany/MyCompanyDashboard.vue";
import MyCompanyApprovals from "src/pages/app/MyCompany/MyCompanyApprovals.vue";
import MyCompanyProfile from "src/pages/app/MyCompany/MyCompanyProfile.vue";
import MyCompanyBilling from "src/pages/app/MyCompany/MyCompanyBilling.vue";
import MyCompanySettings from "src/pages/app/MyCompany/MyCompanySettings.vue";
import InputText from "@/components/Inputs/InputText.vue";
import ButtonDiv from "@/components/Button/ButtonDiv.vue";
import Button from "@/components/Button/Button.vue";
import ControlPanel from "@/components/Button/ControlPanel.vue";
import LineIndicator from "@/components/Chart/LineIndicator.vue";
import LineChart from "@/components/Chart/LineChart.vue";

import Customer from "@/models/Customer";
import CustomerFile from "@/models/CustomerFile";
import Datepicker from "@/components/Datepicker/Datepicker.vue";

// CONSTANST
import listMonth, { months_short } from "@/constants/month";

// helper function
import { isWrong } from "@/utils/helperFunction";

const currentYear = new Date().getFullYear();

export default {
  components: {
    Tabs,
    NavTabsCard,
    MyCompanyDashboard,
    MyCompanyApprovals,
    MyCompanyProfile,
    MyCompanyBilling,
    MyCompanySettings,
    "input-text": InputText,
    ButtonDiv,
    Button,
    ControlPanel,
    LineIndicator,
    Datepicker,
    "select-common": Select,
    LineChart,
    VueElementLoading,
  },
  mounted() {
    const options = {
      types: ["geocode"],
    };
    let input = document.getElementById("branch_address_search");
    // let autocomplete = new google.maps.places.Autocomplete(input, options)

    if (this.industryList === 0) {
      this.$store.dispatch("user/getIndustry");
    }

    this.$auth.currentUser(
      this,
      true,
      function () {
        this.$store.dispatch("user/getUserFromApi");
        this.customerLogoUrl = this.$auth.user.me.customer.logoFileId
          ? `${process.env.SERVER_URL}/1/customerFiles/${this.$auth.user.me.customer.logoFileId}`
          : "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg";
      }.bind(this),
    );
  },
  data() {
    return {
      // auth: auth,
      inputFocus: false,
      editing: {
        numberOfEmployees: false,
      },

      dataChart: {
        options: {
          legend: {
            display: false,
          },
          elements: {
            line: {
              borderColor: "white",
            },
          },
          layout: {
            padding: {
              left: 20,
              right: 10,
              top: 25,
              bottom: 10,
            },
          },
          scales: {
            yAxes: [
              {
                position: "right",
                ticks: {
                  beginAtZero: true,
                  fontColor: "white",
                  padding: 5,
                  fontSize: 15,
                },
                gridLines: {
                  color: "white",
                  zeroLineColor: "white",
                },
              },
            ],
            xAxes: [
              {
                barThickness: 20,
                ticks: {
                  beginAtZero: true,
                  fontColor: "white",
                  padding: 5,
                  fontSize: 12,
                },
                gridLines: {
                  color: "white",
                  zeroLineColor: "white",
                  fontColor: "white",
                },
                gridLines: {
                  display: false,
                },
              },
            ],
          },
        },
      },
      branch_address: "",
      branchIndex: 0,
      tmpObject: null,
      showSearch: false,
      showFilter: false,
      from: "",
      to: "",
      startPeriod: "",
      finishPeriod: "",
      month: "",
      monthRate: "",
      listMonth: listMonth,
      shortNameM: months_short,
      isShowForm: false,
      formSwitcher: "",
      duration: [],
      isEnabled: true,
      currentYear: currentYear,
      ratesList: [],
      participantsList: [],
      isLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      customer: "user/getCustomer",
      user: "user/getUser",
      industryList: "user/getIndustryList",
      charts: "user/getChartStatistics",
      getChartNumberOfEventsPerYear: "user/getChartNumberOfEventsPerYear",
      getChartEventPerEmployee: "user/getChartEventPerEmployee",
      getChartEventsPerCategory: "user/getChartEventsPerCategory",
      participants: "user/getChartParticipantsPerEvent",
      rate: "user/getChartSatisfactionRate",
    }),
    branches() {
      return this.customer.branches;
    },
    numberOfEvents() {
      if (this.charts.numberOfEventsPerYear) {
        const charts = this.charts.numberOfEventsPerYear;
        const year = new Date().getFullYear();
        for (let key in charts) {
          if (key === year) return charts[key];
        }
      } else {
        return 0;
      }
    },
    getAvatar() {
      return this.customer.logoFileId
        ? `${process.env.SERVER_URL}/1/customerFiles/${this.customer.logoFileId}`
        : "https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg";
    },
    getMonth() {
      return this.monthValue.map((item) => item.month);
    },
    getEvents() {
      return this.monthValue.map((item) => item.events);
    },
    getMeanValue() {
      const count = this.listMonth.indexOf(this.month);
      if (count === -1) {
        return 0;
      } else {
        let meanValue = 0;
        this.rate[count].forEach((item) => {
          if (item.currentValue && item.total) {
            meanValue = meanValue + (item.currentValue * 100) / item.total;
          }
        });
        this.rate[count].length;
        if (meanValue) {
          return meanValue / this.rate[count].length;
        } else {
          return 0;
        }
      }
    },
    isMonthly() {
      return Boolean(this.from && this.to && this.startPeriod && this.finishPeriod);
    },
    getDuration() {
      if (this.from && this.to && this.startPerion && this.finishPerion) {
        const from = this.listMonth.indexOf(this.from);
        const to = this.listMonth.indexOf(this.to);
        const duration = this.listMonth.splice(from, to);
        return duration;
      } else {
        return this.listMonth;
      }
    },
    getDurationForChart() {
      const chart = this.charts.eventCostPerEmployeePerYearMonth;
      const duration = [];
      for (let year in chart) {
        const y = year.split("__");
        if (!duration.includes(y[0])) duration.push(y[0]);
      }
      this.duration = duration;
      return duration;
    },
    getDataFromDuration() {
      const duration = this.duration;
      function filter(start, from, finish, to, period) {
        const startY = period.indexOf(start);
        const finishY = period.indexOf(finish);
        const yearPeriod = period.splice(startY, finishY);
        var allPeriod = [];
        yearPeriod.forEach((item) => {
          var month = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          if (item === start) {
            var startMonth = month.indexOf(from);
            var firstY = month.splice(startMonth);

            allPeriod = allPeriod.concat(firstY);
          } else if (item === finish) {
            var finishMonth = month.indexOf(to);
            var lastY = month.splice(0, finishMonth);
            allPeriod = allPeriod.concat(lastY);
          } else {
            allPeriod = allPeriod.concat(month);
          }
        });
        return allPeriod;
      }

      if (this.from && this.to && this.startPeriod && this.finishPeriod) {
        const period = filter(this.startPeriod, this.from, this.finishPeriod, this.to, duration);
        const dataArray = period.map((item) => Math.ceil(Math.random() * 100));
        return {
          labels: period,
          datasets: [
            {
              data: dataArray,
              backgroundColor: ["rgba(255, 255, 255, 0.2)"],
              borderColor: ["#26cfa0"],
              borderWidth: 1,
            },
          ],
        };
      }
    },
  },
  watch: {
    rate(newVal, oldVal) {
      this.checkMonth();
    },
    participants(newVal, oldVal) {
      this.chechParticipant();
    },
    month(newVal, oldVal) {
      this.checkMonth();
    },
    monthRate(newVal, oldVal) {
      this.chechParticipant();
    },
  },
  methods: {
    checkMonth() {
      const currentMonth = this.listMonth[new Date().getMonth()];
      const currentCount = new Date().getMonth();

      if (!this.rate) {
        return [];
      }

      if (!this.month) {
        this.ratesList = this.rate[currentCount];
      } else {
        const count = this.listMonth.indexOf(this.month);
        this.ratesList = this.rate[count];
      }

      this.isLoading = false;
    },
    chechParticipant() {
      const currentCount = new Date().getMonth();
      const currentMonth = this.listMonth[currentCount];

      if (!this.participants) {
        return [];
      }
      if (!this.monthRate) {
        this.participantsList = this.participants[currentCount];
      } else {
        const count = this.listMonth.indexOf(this.monthRate);
        this.participantsList = this.participants[count];
      }

      this.isLoading = false;
    },
    onUpdateFocus(newValue) {
      this.inputFocus = newValue;
    },
    isShow(obj, value) {
      let ifChange = false;
      for (let key in obj) {
        if (key === value) this.formSwitcher = value;
      }
    },
    isClose() {
      this.formSwitcher = "";
    },
    onSelect: function (items) {
      this.selected = items;
    },
    onChange: function (value, name) {
      this[name] = value;
    },
    onShowInput: function (value, name) {
      this.showSearch = !this.showSearch;
    },
    addIndustry: function (value, name) {
      this.showSearch = !this.showSearch;
      this.$store.dispatch("user/sendIndustry", this.branch_address);
    },
    editBranchAddress(payload) {
      this.$store.dispatch("user/editBranchAddress", payload);
    },
    branchFocus(index) {
      this.inputFocus = true;
      this.branchIndex = index;
    },
    onChangeFilter: function () {
      this.showFilter = !this.showFilter;
    },
    deleteBranch(branchIndex) {
      Swal.fire({
        title: "Are you sure want to delete this branch?",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      })
        .then((result) => {
          if (result.value === true) {
            console.log(result);
            this.$store.dispatch("user/deleteBranchToCompany", branchIndex);
            this.tmpObject.branches = this.branches;
            this.$store.dispatch("user/putUserFromApi", this.tmpObject);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMonthFromControl(month) {
      this.month = month;
    },
    getMonthControlRate(month) {
      this.monthRate = month;
    },
    onChangeFilterToEarly() {
      this.from = "";
      this.to = "";
      this.startPerion = "";
      this.finishPerion = "";
      this.showFilter = false;
    },
    isEditable() {
      this.isShowForm = !this.isShowForm;
    },
    saveInfoFromForm(obj, objName) {
      if (this[objName] !== obj[objName]) {
        let a = {};

        a["id"] = obj.id;

        if (objName === "branch_address") {
          a.branches = [];
          this.branches.push({
            onelineAddress: this[objName],
          });
          a.branches = this.branches;
        } else if (objName === "mainAddress") {
          a[objName] = {
            onelineAddress: this[objName],
          };
        } else {
          if (objName === "branch_address_update") {
            this.editBranchAddress({
              newAddress: this[objName],
              index: this.branchIndex,
            });
            a.branches = this.branches;

            console.log(a.branches);
            return;
          } else {
            a[objName] = this[objName];
          }
        }

        this.tmpObject = a;
        this.$store.dispatch("user/putUserFromApi", this.tmpObject);
        this.formSwitcher = "";
      }
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;

      if (!files.length) return;
      this.createImage(files[0]);
    },
    createImage(file) {
      let reader = new FileReader();
      let _this = this;

      reader.onload = (e) => {
        return new CustomerFile({ customerFile: e.target.result })
          .save()
          .then((result) => {
            this.$store.dispatch("user/getUserFromApi");
            _this.customerLogoUrl = `${process.env.SERVER_URL}/1/customerFiles/${result.id}`;
          })
          .catch((error) => {
            console.log(error);
          });
      };
      reader.readAsDataURL(file);
    },
    UploadAvatar() {
      document.getElementById("company-avatar-upload").click();
    },
    deleteAvatar(id) {
      Swal.fire({
        title: "Are you sure want to delete company logo?",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      })
        .then((result) => {
          new CustomerFile({ id: id })
            .delete()
            .then((result) => {
              this.$store.dispatch("user/getUserFromApi");
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang='scss'>
.hover-block {
  .onhover-block {
    visibility: hidden;
  }
  :hover {
    .onhover-block {
      visibility: visible;
    }
  }
}
.md-card-profile {
  .header {
    text-align: left;
    margin: 0 0 8px 15px;
    font-size: 11px;
    font-weight: 400;
    text-align: left;
    color: #292929 !important;
  }
  .icon-container {
    display: inline-block;
    width: 16px;
    text-align: center;
    margin-right: 8px;
    i {
      vertical-align: middle;
      font-size: 16px !important;
      color: #999999 !important;
      opacity: 0.5;
    }
  }
  .value {
    width: 30%;
    color: #292929 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    font-family: Roboto;
    font-size: 11px;
    font-weight: 400;
    color: #999999;
    margin: 5px 0;
  }
}
.tooltip {
  &.popover {
    $color: #fdfdfd;
    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 5px;
      border: none;
      box-shadow: 0 10px 50px rgba(black, 0.3);
    }
    .wrapper {
      height: auto;
    }
    .popover-arrow {
      border-color: $color;
    }
  }
}
.tooltip[x-placement^="right"] {
  .tooltip-arrow {
    border-width: 10px 10px 10px 0;
    left: -10px;
  }
}
.tooltip[x-placement^="top"] {
  .tooltip-arrow {
    border-width: 0 10px 10px 10px;
    bottom: -10px;
  }
}
.tooltip[x-placement^="bottom"] {
  .tooltip-arrow {
    border-width: 10px 10px 10px 0;
    top: -10px;
  }
}
.tooltip[x-placement^="left"] {
  .tooltip-arrow {
    border-width: 10px 0 10px 10px;
    right: -10px;
  }
}
.md-card-profile {
  font-size: 14px;
  font-weight: 400;
  color: #292929 !important;
  min-height: calc(100vh - 183px);
}
.info-chat-value {
  color: black;
  font-weight: 500;
  font-size: 1.2rem;
  margin-left: 10px;
}
.info-chart {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c6c6c6;
  margin-left: 5px;
}
.text-bold {
  font-family: "Roboto";
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: normal;
  text-align: left;
  color: #292929;
}
.info-text-size {
  font-size: 14px;
  margin-top: 12px;
}
.company-view-common-logo_block {
  display: flex;
  // justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
}
.company-logo {
  max-width: 80px !important;
  max-height: 80px !important;
  border-radius: 10px;
}
.company-branch_block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.branch-add_icon {
  margin: 0;
  cursor: pointer;
}
.company-name-block {
}
.button-filter {
  text-align: center;
  padding: 0px 6px;
  background: #62b766;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  width: 90px;
}
.chenge-filter {
  background: #f0f0f0;
  text-align: center;
  padding: 0px 6px;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  width: 90px;
}
.company-button-filter-block {
  display: flex;
  justify-content: flex-end;
}
.company-wrap-block {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.control-panel-block-participants {
  display: flex;
  justify-content: space-between;
  background: #21c4d7;
  border-radius: 5px;
  padding: 2px;
  color: white;
  font-size: 1rem;
}
.control-panel-block-rate {
  display: flex;
  justify-content: space-between;
  background: #ffa322;
  border-radius: 5px;
  padding: 2px;
  color: white;
  font-size: 1rem;
}
.chart-title {
  display: flex;
  justify-content: space-between;
}
.chart-box {
  background: white;
  border-radius: 5px;
  margin-top: 30px;
  box-shadow: 0 0 10px rgba(80, 80, 80, 0.1);
  padding-top: 1px;
}
.filter-datepicker {
  width: 25%;
  display: flex;
}
.filter-datepicker-block {
  width: 50%;
}
.filter-block {
  display: flex;
  position: absolute;
  top: -40px;
  left: 20px;
  z-index: 2;
}
.indicator-event-type-title-rate {
  font-size: 0.85rem;
  font-weight: 500;
  color: #c6c6c6;
}
.indicator-event-info-mean-value {
  color: black;
  font-weight: 500;
  font-size: 26px;
}
.rate-mean-block {
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
}
.delete-edit-block {
  display: flex;
}
.company-logo-button {
  font-size: 0.85rem !important;
  cursor: pointer;
}
.company-logo-button-block {
  display: flex;
  height: 100%;
  justify-content: center;
  flex-direction: column-reverse;
}
.company-main-logo-block {
  display: flex;
}
.md-layout-item > .fc-divider {
  color: #ececec;
  margin: 15px -8px !important;
}
.chart-line-number-of-events {
  border-radius: 5px;
  box-shadow: 0px 2px 9px 0 rgba(0, 0, 0, 0.31);
  background-image: linear-gradient(322deg, #4d9b51, #62b766);
}
.partisipation-logo {
  background-image: linear-gradient(322deg, #13a5b6, #21c4d7) !important;
  box-shadow: 0px 5px 5.8px 1.2px rgba(0, 0, 0, 0.08);
}
.rate-logo {
  box-shadow: 0px 5px 5.8px 1.2px rgba(0, 0, 0, 0.08);
  background-image: linear-gradient(to right, #ffa625, #fb8d02) !important;
}
.logo-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0px 15px;
  margin: -20px 0px 0px 0px;
  .event-planer-logo {
    background: #eb3e79;
    width: 64px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    .company-logo {
      color: white !important;
    }
  }
  .event-title {
    font-family: "Roboto";
    font-size: 18px;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
  }
}
.margin-block-for-card {
  margin: 40px 0 !important;
}
</style>
