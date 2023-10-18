<template>
    <div>
        <h5 class="font-size-20 font-bold-extra">Please rate your experience?</h5>
        <div class="d-flex align-center mt-10 mb-40">
            <img v-for="rate in rates"
                 class="ml-20 cursor-pointer"
                 :src="`${$iconURL}popups/${rate.url}${score == rate.score ? '_red' : ''}.svg`"
                 @click="selectRate(rate.score)">
        </div>
    </div>
</template>
<script>
export default {
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
    methods:{
        selectRate(score){
            this.score = score;
            this.$emit('rate', score);
        }
    }
}
</script>
<style lang="scss">

</style>
