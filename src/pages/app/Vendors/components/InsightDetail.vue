<template>
    <div class="insight-modal px-30 py-20">
        <div class="d-flex align-center justify-content-between mb-20">
            <md-button class="md-simple md-icon-button" @click="prev"><md-icon class="font-size-30">chevron_left</md-icon></md-button>
            <h2 class="font-size-30 font-bold-extra m-0">Winning Rate</h2>
            <md-button class="md-simple md-icon-button" @click="next"><md-icon class="font-size-30">chevron_right</md-icon></md-button>
        </div>

        <div class="d-flex mt-20 font-size-20 font-bold-extra">
            Proposals Distribution:
            <div class="ml-auto d-flex align-center won font-size-14">
                <span class="mark bg-green mr-10"></span>
                I won (Total 40)
            </div>
            <div class="ml-40 d-flex align-center all font-size-14">
                <span class="mark bg-purple mr-10"></span>
                All proposals (Total 120)
            </div>
        </div>
        <div class="graph py-20">
            <chart :chartData="data" :options="options" :width="500" :height="200"></chart>
        </div>
        <div class="d-flex justify-content-start width-100">
            <div class="font-size-16 text-left">
                <div class="font-size-18 font-bold-extra mb-20">Our Best-Selling
                <br>Extras:</div>
                <p class="color-vendor">Your price</p>
                <p class="color-yellow-dark">Competitors price</p>
            </div>
            <div class="font-size-16 text-left ml-50">
                <div class="num">01</div>
                Serve To Table Service
                <p class="color-vendor mt-5">${{1543 | withComma(Number)}} </p>
                <p class="color-yellow-dark">${{1543 | withComma(Number)}}</p>
            </div>
            <div class="font-size-16 text-left ml-50">
                <div class="num">02</div>
                Ceramics Plates:
                <p class="color-vendor mt-5">${{1543 | withComma(Number)}}</p>
                <p class="color-yellow-dark">${{1543 | withComma(Number)}}</p>
            </div>
            <div class="font-size-16 text-left ml-50">
                <div class="num">03</div>
                Kosher Menu
                <p class="color-vendor mt-5">${{1543 | withComma(Number)}}</p>
                <p class="color-yellow-dark">${{1543 | withComma(Number)}}</p>
            </div>
        </div>
        <div class="d-flex align-center text-left py-20">
            <img :src="`${$iconURL}Campaign/Group 9087.svg`" class="mr-10" width="20px">
            Your's competitors earn 23% more than you on extras
        </div>
    </div>
</template>
<script>

    import Chart from '../components/Chart';
    import VendorBidTimeCounter from "@/components/VendorBidTimeCounter/VendorBidTimeCounter";

    export default {
        components: {
          VendorBidTimeCounter,
          Chart,
        },
        props: {

        },
        data() {
          return {
              data: {
                  labels: ['Jan', '', '', '', '', 'Jun', '', '', '', '', '', 'Dec' ],
                  datasets: [
                      {
                          label: '',
                          data : [0, 10, 30, 60, 45, 30, 40, 40, 30, 15, 30, 20],
                          fill: true,
                          borderColor: '#2cde6b',
                          backgroundColor: '#2cde6b',
                          // tension: 0.4,
                      },
                      {
                          label: '',
                          data : [0, 15, 40, 80, 60, 40, 50, 45, 40, 25, 35, 30],
                          fill: true,
                          borderColor: '#641856',
                          backgroundColor: '#641856',
                          // tension: 0.4,
                      },
                  ]
              },
              options: {
                  legend: {
                      display: false,
                  },
                  elements: {
                      point: {
                          radius: 0,
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
                      y: {
                          suggestedMin: 0,
                          suggestedMax: 100,
                      },
                      yAxes: [
                          {
                              ticks: {
                                  beginAtZero: false,
                                  fontColor: "black",
                                  padding: 5,
                                  fontSize: 10,
                                  min: 0,
                                  max: 100,
                                  callback: function (label, idx, labels) {
                                    return `${label}%`
                                  }
                              },
                          },
                      ],
                      xAxes: [
                          {
                              barThickness: 10,
                              ticks: {
                                  beginAtZero: false,
                                  fontColor: "black",
                                  padding: 5,
                                  fontSize: 12,
                              },
                          },
                      ],
                  },
              }
          }
        },
        mounted() {
          this.init()
        },
        methods: {
           init(){
           },
           next(){
             console.log('next');
           },
           prev(){
             console.log('prev');
           },
           getRadius(ctx){
               console.log(ctx.dataIndex);
           }
        },
        computed: {

        },
        watch:{
        }
    }
</script>
<style lang="scss" scoped>
.num {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: #641856;
    font-weight: 800;
    font-size: 20px;
    background-color: #b8a9c9;
    border-color: #641856;
    border-radius: 50%;
}
div.won{
    &:before{
        content: '';
    }
}
div.all{
    &:before{
        content: '';
    }
}
span.mark{
    min-width: 14px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: inline-block;
}
</style>
