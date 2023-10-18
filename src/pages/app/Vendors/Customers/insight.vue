<template>
  <div class="bg-purple w-max-600 mx-auto">
    <div class="pl-40 pr-40 pt-40 pb-20">
      <div class="font-size-20 font-bold-extra color-white text-transform-capitalize">
        Total Incomes{{ customer ? ` - ${customer.companyName}` : "" }}
      </div>
      <div class="d-flex align-center mt-20">
        <div>
          <h2 class="font-size-50 color-white m-0" v-if="customer">
            ${{ Math.floor(totalPrice) | withComma(Number) }}
          </h2>
          <h2 class="font-size-50 color-white m-0" v-else>
            ${{ Math.floor(aggregate.totalPrice) | withComma(Number) }}
          </h2>
          <div v-if="customer" class="font-size-16 color-white py-20">
            {{ `${wonProposals.length}/${customer.proposals.length}` }} Successful proposals
          </div>
          <div v-else class="font-size-16 color-white py-20">
            {{ `${aggregate.wonProposals}/${aggregate.totalProposals}` }} Successful proposals
          </div>
          <!-- <div v-else>
            <md-button class="md-white mt-10 font-size-16 text-transform-capitalize md-simple md-outlined"
              >Create New Proposal</md-button
            >
          </div> -->
        </div>
        <ServiceBarChart class="ml-auto" :chart-data="serviceChartData"> </ServiceBarChart>
        <div>
          <div
            v-for="(it, idx) in serviceChartData"
            :key="idx"
            class="d-flex align-center"
            :class="idx > 0 ? 'mt-20' : ''"
          >
            <img :src="`${$iconURL}${it.icon}`" width="23px" />
            <template v-if="customer || serviceReportData">
              <span class="ml-10 font-size-13" :style="{ color: it.color }">{{ it.value }}%</span>
              <span class="ml-10 font-size-13" :style="{ color: it.color }">${{ it.price | withComma(Number) }}</span>
            </template>
            <template v-else>
              <span class="icon" :style="{ backgroundColor: it.color }"></span>
              <span class="ml-10 font-size-14 color-white">{{ it.label }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <div class="px-30 position-relative">
      <div v-if="customer" class="position-absolute" style="left: 0; top: 0; z-index: 100">
        <img :src="`${$iconURL}Group 19406.svg`" class="cursor-pointer" width="90px" @click="prev" />
      </div>
      <div v-if="customer" class="position-absolute" style="right: 0; top: 0; z-index: 100">
        <img :src="`${$iconURL}Group 19405.svg`" class="cursor-pointer" width="90px" @click="next" />
      </div>
      <template v-if="customer">
        <carousel :items="1" :margin="0" :nav="false" :loop="true" class="d-flex">
          <template slot="prev">
            <span class="prev handle-btn" ref="prevButton"></span>
          </template>
          <div v-for="(p, index) in incomeList" :key="p.id" class="carousel-item">
            <template v-if="index == 1">
              <div class="color-white font-size-20 font-bold-extra text-center mt-30">
                How to increase Success And Profit
              </div>
              <div class="d-flex align-center w-max-400 mx-auto mt-20">
                <img class="mr-20" :src="`${$iconURL}VendorsProposalPage/group-5280.svg`" style="width: 24px" />
                <p class="color-white font-size-14">
                  {{
                    `You have won ${wonProposals.length} out of ${
                      customer.proposals.length
                    } opportunities with this customer
                              (${Math.floor((wonProposals.length / customer.proposals.length) * 100)}% win rate)`
                  }}
                </p>
              </div>
              <div class="d-flex align-center w-max-400 mx-auto mt-20">
                <img class="mr-20" :src="`${$iconURL}VendorsProposalPage/group-5280.svg`" style="width: 24px" />
                <p v-if="wonProposals.length" class="color-white font-size-14">
                  You most recent transaction with his customer was on
                  {{ wonProposals[0].transactions[0].dateCreated | date("MMM DD YYYY") }}
                </p>
                <p class="color-white font-size-14" v-else>This will be your first transaction with this customer</p>
              </div>
              <div class="d-flex align-center w-max-400 mx-auto mt-20">
                <img class="mr-20" :src="`${$iconURL}VendorsProposalPage/group-5280.svg`" style="width: 24px" />
                <p class="color-white font-size-14">
                  Overall average deal size for this customer is ${{ averageOfProposal | withComma(Number) }}
                  <span v-if="averageOfProposal !== aggregate.averagePrice"
                    >( {{ compareWithTotal }} than your average)</span
                  >
                </p>
              </div>
              <div class="d-flex my-40">
                <md-button class="md-simple ml-auto md-outlined md-white maryoku-btn mx-auto"
                  >Update Your Prices</md-button
                >
              </div>
            </template>
            <template v-if="index == 0">
              <h5 class="color-white font-size-20 font-bold-extra text-center">Income From Past And Future Events</h5>
              <income-bar-chart :chartData="incomeChartData"></income-bar-chart>
              <div class="md-layout my-40">
                <div class="md-layout-item font-size-16 color-white md-size-33 text-center">
                  2021
                  <md-icon style="color: white">keyboard_arrow_down</md-icon>
                </div>
                <div class="md-layout-item md-size-33 d-flex align-center font-size-16 color-white text-center">
                  <span :style="`background-color: #ffffff;`" class="icon mr-10"></span>
                  Past events
                </div>
                <div
                  class="md-layout-item md-size-33 d-flex align-center font-size-16 color-white text-center"
                  style="white-space: nowrap"
                >
                  <span :style="`background-color: #9b6a92;`" class="icon mr-10"></span>
                  Future events
                </div>
              </div>
            </template>
            <hr :class="incomeList.length < 2 ? 'mb-40' : ''" />
          </div>
          <template slot="next">
            <span class="next handle-btn d-none" ref="nextButton"> </span>
          </template>
        </carousel>
      </template>
      <analytics v-else :incomeChartData="incomeChartData" />
    </div>
  </div>
</template>
<script>
import { PieChart } from "@/components";
import IncomeBarChart from "./IncomeBarChart.vue";
import ServiceBarChart from "./ServiceBarChart";
import Analytics from "./Analytics";
import carousel from "vue-owl-carousel";

export default {
  components: {
    PieChart,
    IncomeBarChart,
    ServiceBarChart,
    Analytics,
    carousel,
  },
  props: {
    customer: {
      type: Object,
      default: null,
    },
    aggregate: {
      type: Object,
      required: true,
    },
    vendor: {
      type: Object,
      required: true,
    },
    customerStatus: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // serviceChartData: [],
      incomeChartData: [
        { label: "Jan", value: 0, future: true },
        { label: "Feb", value: 0, future: true },
        { label: "Mar", value: 0, future: true },
        { label: "Apr", value: 0, future: true },
        { label: "May", value: 0, future: true },
        { label: "Jun", value: 0, future: true },
        { label: "Jul", value: 0, future: true },
        { label: "Aug", value: 0, future: true },
        { label: "Sep", value: 0, future: true },
        { label: "Oct", value: 0, future: true },
        { label: "Nov", value: 0, future: true },
        { label: "Dec", value: 0, future: true },
      ],
      incomeList: ["", ""],
      renderCustomer: false,
      serviceReportData: null,
      activeCategoryColors: ["#ffffff", "#21cfe0", "#ffc001", "#2cde6b"],
    };
  },
  mounted() {
    console.log(this.customerStatus);
    this.init();
  },
  methods: {
    getServiceReport() {
      this.$http.get(`${process.env.SERVER_URL}/1/transaction/report/service/${this.vendor.id}`).then((res) => {
        if (res.data.length) {
          this.serviceReportData = res.data;
        }
      });
    },
    getIncomingData() {
      let customerQuery = "";
      if (this.customer) {
        customerQuery = `&customerId=${this.customer.id}`;
      }
      if (this.customerStatus) {
        customerQuery += `&customerStatus=${this.customerStatus}`;
      }
      for (let i in this.incomeChartData) {
        this.incomeChartData[i].value = 0;
      }
      this.$http
        .get(
          `${process.env.SERVER_URL}/1/userEvent/monthlyIncome/${this.vendor.id}?start=${new Date(
            new Date().getFullYear() + "-01-01",
          ).toISOString()}&end=${new Date(new Date().getFullYear() + "-12-31").toISOString()}${customerQuery}`,
        )
        .then((res) => {
          if (res.data.length) {
            res.data.forEach((item) => {
              this.incomeChartData[Number(item._id) - 1].value = item.amount;
              this.incomeChartData[Number(item._id) - 1].future = false;
            });
            this.incomeChartData = [...this.incomeChartData];
          } else {
            this.incomeChartData.forEach((item, index) => {
              this.incomeChartData[index].value = 1000 * Math.random() + 200;
              this.incomeChartData[index].future = true;
            });
            this.incomeChartData = [...this.incomeChartData];
          }
        });
    },
    init() {
      this.getServiceReport();
      this.getIncomingData();
    },
    next() {
      this.$refs.nextButton.click();
    },
    prev() {
      console.log("prev");
      this.$refs.prevButton.click();
    },
  },
  computed: {
    sumPricesByCategory() {
      const data = {};
      this.wonProposals.forEach((p) => {
        for (let category in p.pricesByCategory) {
          if (!data[category]) data[category] = 0;
          data[category] += p.pricesByCategory[category];
        }
      });
      return data;
    },
    serviceChartData() {
      let chartData = [];
      if (this.customer) {
        let colorIndex = 0;
        for (let category in this.sumPricesByCategory) {
          chartData.push({
            label: "",
            value: Math.round((this.sumPricesByCategory[category] / this.totalPrice) * 100),
            color: this.activeCategoryColors[colorIndex++], //this.$store.state.common.serviceCategoriesMap[category].color,
            icon: `Budget+Elements/${category}-white.svg`,
            price: Math.round(this.sumPricesByCategory[category]),
          });
        }
      } else if (this.serviceReportData) {
        let colorIndex = 0;
        for (let i = 0; i < this.serviceReportData.length; i++) {
          const categoryData = this.serviceReportData[i];
          console.log("categoryData", categoryData);
          chartData.push({
            label: "",
            value: Math.round((categoryData.amount / 100 / this.aggregate.totalPrice) * 100),
            // color: this.$store.state.common.serviceCategoriesMap[categoryData._id].color,
            color: this.activeCategoryColors[colorIndex++],
            icon: `Budget+Elements/${categoryData._id}-white.svg`,
            price: Math.round(categoryData.amount / 100),
          });
        }
      } else {
        chartData = [
          { label: "Venue", value: 44, color: "#a3809d", icon: "Budget+Elements/venuerental-white.svg", price: 0 },
          {
            label: "Catering",
            value: 35,
            color: "#915a87",
            icon: "Budget+Elements/foodandbeverage-white.svg",
            price: 0,
          },
          {
            label: "Signage & Printing",
            value: 20,
            color: "#4e0841",
            icon: "Budget+Elements/entertainment-white.svg",
            price: 0,
          },
        ];
      }
      console.log("chartData", chartData);
      return chartData;
    },
    wonProposals() {
      if (!this.customer || !this.customer.proposals.length) return [];
      return this.customer.proposals.filter((p) => {
        return p.accepted;
      });
    },
    averageOfProposal() {
      if (!this.wonProposals.length) return 0;
      return this.totalPrice / this.wonProposals.length;
    },
    totalPrice() {
      return this.wonProposals.reduce((sum, p) => {
        let proposalPrice = 0;
        for (var category in p.pricesByCategory) {
          proposalPrice += p.pricesByCategory[category];
        }
        return sum + proposalPrice;
      }, 0);
    },
    compareWithTotal() {
      if (this.aggregate.averagePrice <= 0 || this.averageOfProposal <= 0) return 0;
      let percent;
      if (this.aggregate.averagePrice > 0 && this.averageOfProposal > this.aggregate.averagePrice) {
        percent = Math.floor(
          ((this.averageOfProposal - this.aggregate.averagePrice) / this.aggregate.averagePrice) * 100,
        );
      } else if (this.averageOfProposal > 0 && this.averageOfProposal < this.aggregate.averagePrice) {
        percent = Math.floor(((this.aggregate.averagePrice - this.averageOfProposal) / this.averageOfProposal) * 100);
      }
      return this.averageOfProposal > this.aggregate.averagePrice ? `${percent}% higher` : `${percent}% lower`;
    },
  },
  watch: {
    customer(newVal) {
      this.init();
    },
    customerStatus(newVal) {
      this.init();
    },
  },
};
</script>
<style type="scss">
.carousel-item {
}
.icon {
  min-width: 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  margin: 4px 5px;
}
</style>
