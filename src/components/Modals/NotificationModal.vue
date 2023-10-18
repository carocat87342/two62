<template>
    <transition name="modal">
        <div
            class="modal-mask"
            @click="modalMaskClick"
            @dragstart="modalMaskClick"
            @dragenter="modalMaskClick"
            @dragover="modalMaskClick"
            @dragleave="modalMaskClick"
        >
            <div class="modal-wrapper">
                <div class="modal-container no-header no-footer w-min-800" v-click-outside="closeModal">
                    <loader :active="loading" page="vendor"></loader>
                    <div class="modal-header position-relative">
                        <md-button
                            class="md-simple position-absolute"
                            style="top: 20px;right:20px"
                            @click="closeModal"
                        >
                            <md-icon>close</md-icon>
                        </md-button>

                        <div class="py-40 d-flex justify-content-center width-100 header-bg">
                            <div class="w-max-600 text-center">
                                <img :src="`${$iconURL}${notification[name].icon}`">
                                <h3 class="font-size-30 font-bold-extra color-won">{{ notification[name].title }}</h3>

                                <p class="font-size-14 m-0"> {{notification[name].description}}</p>

                                <md-button v-if="notification[name].action" class="md-red maryoku-btn mb-20 ml-60" >
                                    {{ notification[name].action }}</md-button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-body text-center" v-if="notification[name].content">
                        <div class="d-flex flex-column align-center">
                            <h5 v-if="notification[name].content.title" class="font-size-20 font-bold-extra color-red">
                                {{ 'Can we offer you more vendors for your event ?' }}</h5>
                            <p class="font-size-14 p-0">Let us help you find more vendors that are just right for your event</p>
                            <md-button class="md-red maryoku-btn my-20" @click="closeModal">Show me more vendors</md-button>

                            <Rate v-if="notification[name].content.rate" @rate="selectRate"></Rate>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>

import { NOTIFICATION } from "@/constants/modal";
import {mapMutations} from "vuex";

const components = {
    Rate: () => import('./Rate'),
    loader: () => import('@/components/loader/Loader.vue'),
}

export default {
    components,
    props: {
        containerClass: {
            type: String,
            default: "modal-container",
        },
        allowClickOutside: {
            type: Boolean,
            default: true,
        },
        name: {
            type: String,
        }
    },
    data(){
        return {
            notification: NOTIFICATION,
            loading: false,
        }
    },
    methods:{
        ...mapMutations('modal', ['setOpen']),
        closeModal: function () {
            this.setOpen(null);
        },
        modalMaskClick: function (event) {
            event.stopPropagation();
            return;
        },
        async selectRate(score){
            if (!this.proposal) return;
            this.loading = true;
            this.score = score;
            this.proposal = {...this.proposal, score};

            await this.$store.dispatch('modal/saveProposal', this.proposal);
            this.loading = false;
        }
    },
    computed:{
        proposal() {
            return this.$store.state.modal.proposal;
        }
    }
}
</script>
<style lang="scss">
.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container-wizard,
.modal-leave-active .modal-container-wizard .modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
.header-bg{
    background-color: #f3f7fd;
}
</style>
