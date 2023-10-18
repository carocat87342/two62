<template>
    <div class="position-relative">
        <md-button
            class="md-simple position-absolute"
            style="top: 20px;right:20px"
            @click="$emit('close')"
        >
            <md-icon>close</md-icon>
        </md-button>
        <div class="pt-40" style="background-color: #f3f7fd">
            <div class="d-flex flex-column align-center w-max-600 mx-auto pb-30">
                <img :src="`${$iconURL}popups/Group 22262.svg`">
                <h2 class="font-size-30 font-bold-extra color-black">The offer was rejected</h2>
                <h5 class="font-size-20 font-bold-extra color-red my-0">Vendor have been notified!</h5>

                <p class="font-size-14">We have let the vendor know that you have decided to explore other options. Click here to tell us why this vendor was not a good fit, so we can match you with better options.</p>
                <md-button class="md-red maryoku-btn my-10 px-40" @click="$emit('comment')">Tell Us Why</md-button>
            </div>
        </div>
        <div class="d-flex flex-column align-center">
            <h5 class="font-size-20 font-bold-extra color-red">Find Another Vendor</h5>
            <p class="font-size-14 my-0">There are plenty more vendors on Maryoku, offering you great services at attractive rates.</p>
            <md-button class="md-red maryoku-btn my-20" @click="$emit('show')">Click here to view other vendor options</md-button>

            <h5 class="font-size-20 font-bold-extra">Please rate your experience?</h5>
            <div class="d-flex align-center mt-10 mb-40">
                <img v-for="rate in rates" :src="`${$iconURL}popups/${rate.url}${score == rate.score ? '_red' : ''}.svg`" class="ml-20" @click="selectRate(rate.score)">
            </div>
        </div>
    </div>
</template>
<script>
const components = {
    Loader: () => import("@/components/loader/Loader.vue"),
    Modal: () => import("@/components/Modal.vue"),
}

export default {
    components,
    props:{
      value: {
          type: Number,
          default: 5,
      }
    },
    data(){
        return {
            showBookedVendorModal: true,
            score: this.value,
            rates: [
                {score: 1, url: 'smile_1'},
                {score: 2, url: 'smile_2'},
                {score: 3, url: 'smile_3'},
                {score: 4, url: 'smile_4'},
                {score: 5, url: 'smile_5'},
            ]
        }
    },
    methods: {
        selectRate(score){
            this.score = score;
            this.$emit('rate', score);
        }
    }
}
</script>
<style>
</style>
