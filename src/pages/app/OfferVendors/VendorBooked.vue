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
                <img :src="`${$iconURL}messages/group-21013.svg`">
                <h3 class="font-size-30 font-bold-extra color-won">Vendor is booked!</h3>

                <p class="font-size-14">Your payment has been received and will be held in escrow until the event is completed successfully. Assuming there are no disputes, we will pay the vendor 7 days after the event.</p>
            </div>
        </div>
        <div class="d-flex flex-column align-center">
            <h5 class="font-size-20 font-bold-extra color-red">Can we offer you more vendors for your event?</h5>
            <p class="font-size-14 p-0">Let us help you find more vendors that are just right for your event</p>
            <md-button class="md-red maryoku-btn my-20" @click="$emit('show')">Show me more vendors</md-button>

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
    data(){
        return {
            score: 0,
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
