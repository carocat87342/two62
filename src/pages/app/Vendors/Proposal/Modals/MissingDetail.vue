<template>
    <div class="position-relative">
        <md-button
            class="md-simple position-absolute"
            style="top: 0px;right:0px"
            @click="$emit('close')"
        >
            <md-icon>close</md-icon>
        </md-button>
        <div class="text-left ">
            <div class="d-flex flex-column align-center w-max-600 mx-auto pb-30">
                <img :src="`${$iconURL}Submit Proposal/group-8830.svg`">
                <h2 class="font-size-30 font-bold-extra color-black">Some details are missing</h2>

                <p class="font-size-16 m-0">We want to help you create a winning proposal that will leave no room for questions</p>
            </div>
            <div class="p-20" style="background-color: #f3f7fd">
                <p class="font-size-16">The missing requirements</p>
                <div v-for="option in data" class="d-flex font-bold-extra align-center font-size-16 mb-10">
                    <img
                        class="mr-20"
                        :src="`${$iconURL}${option.icon}`"
                        width="12"
                    />
                    {{ option.label }}</div>
            </div>
            <div class="p-20">
                <p v-for="ref in references" class="font-size-16 d-flex align-start">
                    <img :src="`${$iconURL}common/light.svg`" class="label-icon mr-10" />
                    {{ ref }}
                </p>
            </div>
        </div>
        <div class="d-flex align-center">
            <md-button class="md-simple maryoku-btn md-vendor ml-auto" @click="$emit('send')">
                Send Now
            </md-button>
            <md-button class="maryoku-btn md-vendor" @click="$emit('close')"
            >Correct Proposal</md-button
            >
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
        data: {
            type: Array,
        }
    },
    data(){
        return {
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
