<template>
  <div class="white-card p-30">
    <div class="font-size-20">Add more details to generate unique insights</div>
    <div style="margin: 0 -15px">
      <pie-chart
        :chartData="chartData"
        :columns="1"
        :options="{
          width: 130,
          height: 180,
          strokWidth: 30,
          direction: 'row',
        }"
      ></pie-chart>
    </div>
    <div>
      <div v-if="total > 0 && won > 0">
        <div class="color-won d-flex align-center">
          <span class="mr-20 font-size-50">{{ `${Math.round((won / total) * 100)} %` }}</span>
          <span class="font-size-18">Winning rate</span>
        </div>
        <div class="font-size-16 mt-50">
          You won <span class="font-bold">{{ won }} of {{ total }}</span> Proposals you applied to
        </div>
      </div>
      <div v-else class="d-flex align-center">
        <img :src="`${$iconURL}VendorsProposalPage/group-18762.svg`" width="50" />
        <div class="ml-10">
          <div class="color-vendor font-size-14 m-0">There is not yet enough</div>
          <div class="color-vendor font-size-14 mt-10">information to present insights</div>
        </div>
      </div>
      <hr class="mt-50 mb-50" />
      <div class="tips">
        <div class="d-flex mb-30 align-center">
          <div class="flex-1"><img :src="`${$iconURL}common/light.svg`" class="label-icon" /></div>
          <div class="ml-10">Boost your chances of winning by improving your profile</div>
        </div>
        <div class="d-flex align-center">
          <div class="flex-1"><img :src="`${$iconURL}common/light.svg`" class="label-icon" /></div>
          <div class="ml-10">Stay sharp and respond to proposals promptly - you've got to be in it to win it!</div>
        </div>
      </div>
      <md-button class="mt-10 md-simple md-vendor-text md-vendor px-0" @click="$emit('insight')">
        More Insights
        <md-icon class="color-vendor">keyboard_arrow_down</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
import { PieChart } from "@/components";

export default {
  components: {
    PieChart,
  },
  props: {
    total: {
      type: Number,
      required: true,
    },
    won: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      chartData: [
        { title: "Application", value: 6, color: "#b7b5b5" },
        { title: "Winning", value: 1, color: "#9a9898" },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.chartData[0].value = this.total - this.won;
      this.chartData[1].value = this.won;
      if (this.won > 0) this.chartData[1].color = "#2cde6b";
      this.chartData = [...this.chartData];
    },
  },
  watch: {
    total(newVal) {},
    won(newVal) {},
  },
};
</script>
<style type="scss">
</style>
