<template>
    <div class="position-relative">
        <p class="text-left my-20">These vendors has given you 2 more days to decide</p>
        <div v-for="(subProposals, category) in proposals" class="mb-30" :key="category">
            <div class="d-flex color-black-middle align-center mt-20 mb-10 pb-5 border-bottom">
                <img class="mr-10" :src="`${$iconURL}Budget+Elements/${serviceCategory(category).icon}`" width="30px"/>
                {{serviceCategory(category).fullTitle}}
            </div>
            <div class="d-flex align-center">
                <div v-for="p in subProposals" class="d-flex align-start mb-10 pr-20" :key="p.id">
                    <img v-if="image(p)" :src="image(p)" class="mr-10" width="80px">
                    <div class="text-left">
                        <div class="font-bold-extra">{{p.vendor.companyName}}</div>
                        <div class="font-size-20 font-bold-extra mt-10">${{p.cost | withComma(Number)}}</div>
                    </div>
                </div>
            </div>
        </div>
        <VendorBidTimeCounter
            customClass="vendor bg-red py-10"
            :days="days"
            :hours="hours"
            :minutes="mins"
            :seconds="seconds"
        />
    </div>
</template>
<script>
import VendorBidTimeCounter from "@/components/VendorBidTimeCounter/VendorBidTimeCounter";
export default {
  components:{
      VendorBidTimeCounter,
  },
  props: {
    proposals: {
      type: Object,
      required: true,
    },
    serviceCategories:{
      type: Array,
      required: true,
    }
  },
  data() {
      return {
          days: 0,
          hours: 0,
          mins: 0,
          seconds: 0,
      }
  },
    mounted() {
      this.init()
    },
    methods: {
      init(){
         let proposal;
         Object.keys(this.proposals).map(key => {
             proposal = this.proposals[key][0];
         })
         let diff = (new Date(proposal.expiredDate).getTime() - new Date().getTime()) / 1000;
         if (diff < 0) return;
         let days = Math.floor(diff / (24 * 3600));
         diff = diff - days * 24 * 3600;
         let hours = Math.floor(diff / 3600);
         diff = diff - hours * 3600;
         let mins = Math.floor(diff / 60);
         diff -= mins * 60;
         let seconds = Math.floor(diff);
         return {days, hours, mins, seconds}
      },
      image(proposal){
        let proposalPhotos = proposal.inspirationalPhotos.filter(p => p !== null)
        let vendorPhotos = proposal.vendor.images.filter(p => p !== null)
        if(proposalPhotos && proposalPhotos.length) {
            return proposalPhotos[0].url
        } else if(vendorPhotos && vendorPhotos.length) {
            return vendorPhotos[0]
        }
        return null;
      },
      serviceCategory(category){
        return this.serviceCategories.find(it => it.key === category);
      }
    },
  computed:{
  }
};
</script>
<style>
.loading-budget-image {
}
.border-bottom{
  border-bottom: 1px solid #707070;
}
</style>
