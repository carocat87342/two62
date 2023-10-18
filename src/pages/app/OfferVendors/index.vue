<template>
    <div>
        <loader :active="isLoading" is-full-screen page="vendor"/>
        <template v-if="showOffers">
            <div class="d-flex justify-content-between pt-50 pl-100 pr-80">
                <div>
                    <div class="font-size-30 font-bold text-transform-capitalize">
                        Can we offer you more vendors for your event?
                    </div>
                    <p>Mark the services & specify if needed. Each category has more than one option so use the arrows to navigate</p>
                </div>

                <ProgressRadialBar
                    :value="Object.keys(requirements).length"
                    :total="allRequirements.length"
                    @click="showRequirementCart = true"></ProgressRadialBar>
            </div>
            <div class="md-layout md-gutter mt-60 width-70 mx-auto" v-for="cards in serviceCards">
                <div
                    class="md-layout-item md-size-33 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
                    v-for="(serviceGroup, groupIndex) in cards"
                    :key="`serviceGroup-0-${groupIndex}`"
                >
                    <ServiceCategoryCard
                        v-for="(service, serviceIndex) in serviceGroup"
                        class="mb-40"
                        :serviceCategory="service"
                        :key="service.name"
                        :isLong="(serviceIndex + groupIndex) % 2 === 1"
                        :musicPlayer="service.musicPlayer"
                        :defaultData="getDefaultTypes(service.serviceCategory, service.name)"
                        :has-budget="true"
                        :booked="service.serviceCategory === proposal.vendor.vendorCategory"
                        @showSpecific="getSpecification"
                        @update="setServiceStyles"
                    ></ServiceCategoryCard>
                </div>
            </div>
            <div class="width-66 mx-auto">
                <div class="d-flex flex-column align-center mx-20" style="background-color: #f5f5f5">
                    <h5 class="font-size-20 font-bold-extra mb-0">Already Booked Vendors?</h5>
                    <p class="font-size-14">With Marioko you can easily plan and organize the event </p>
                    <md-button class="md-red my-20 w-max-350">Collaboration board</md-button>
                </div>
            </div>
            <div class="d-flex flex-column align-center mt-30 py-30" style="background-color: #f5f5f5">
                <div class="font-size-12">Powered By </div>
                <p class="d-flex align-center font-size-12">Who are we and why are we great?
                    <md-button class="ml-10 md-icon-button md-raised md-white arrow-right">
                        <md-icon style="color: #f51355">keyboard_arrow_right</md-icon></md-button>
                </p>
            </div>
            <div class="d-flex flex-column align-center bg-white p-20">
                <md-button class="md-red ml-auto mr-40" @click="findVendors">Find me vendors</md-button>
            </div>
        </template>

        <AdditionalRequestModal
            class="lg"
            v-if="isOpenedAdditionalModal"
            :subCategory="subCategory"
            :selectedCategory="selectedCategory"
            :defaultData="getRequirements(selectedCategory.key) || {}"
            :selectedTypes="getSelectedTypes(selectedCategory.key)"
            :proposal="proposal"
            page="customer"
            @save="saveAdditionalRequest"
            @cancel="isOpenedAdditionalModal = false"
            @close="isOpenedAdditionalModal = false"
        ></AdditionalRequestModal>
        <modal v-if="showSignupModal" container-class="modal-container offer-vendors bg-white w-max-450">
            <template slot="body">
                <sign-in-content
                    :page="page"
                    @signIn="signIn"
                    @signUp="signUp"
                    @changePage="changePage"
                    @authenticate="authenticate"
                >
                </sign-in-content>
            </template>
        </modal>
        <transition name="slide-fade">
            <requirements-cart
                v-if="showRequirementCart"
                :requirements="requirements"
                :service-categories="serviceCategories"
                :total="Object.keys(allRequirements).length"
                @close="showRequirementCart = false"></requirements-cart>
        </transition>
    </div>
</template>
<script>

import CalendarEvent from "@/models/CalendarEvent";
import Proposal from "@/models/Proposal";
import { ServiceCards } from "@/constants/event.js";
import { postReq, getReq } from "@/utils/token";
import { camelize } from "@/utils/string.util";
import _ from "underscore";
import moment from "moment";
import {mapMutations} from "vuex";

const components = {
    Loader: () => import("@/components/loader/Loader.vue"),
    Modal: () => import("@/components/Modal.vue"),
    SignInContent: () => import('@/components/SignInContent/index.vue'),
    ServiceCategoryCard: () => import('@/pages/app/Events/PlanningBoard/components/ServiceCategoryCard.vue'),
    ProgressRadialBar: () => import('@/pages/app/Events/PlanningBoard/components/ProgressRadialBar.vue'),
    AdditionalRequestModal: () => import('@/pages/app/Events/PlanningBoard/components/modals/AdditionalRequest.vue'),
    RequirementsCart: () => import('@/pages/app/Events/PlanningBoard/RequirementsCart.vue'),
}

export default {
    components,
    data(){
        return {
            isLoading: true,
            step: 1,
            page: 'signup',
            showSignupModal: false,
            isOpenedAdditionalModal: false,
            showRequirementCart: false,
            showOffers: false,
            serviceCards: ServiceCards,
            allRequirements: [],
            subCategory: null,
            selectedCategory: null,
            vendorEvent : null,
            requirements: {},
            proposal: null,
        }
    },
    methods: {
        ...mapMutations('modal', ['setOpen', 'setProposal']),
        async handleRate(score){
            await this.saveProposal({...this.proposal, score})
        },
        async saveProposal(proposal){
            let query = new Proposal(proposal);
            let res = await query.save();
            this.proposal = res;
        },
        async getAllRequirements(){
          let res = await getReq(`/1/vendor/property`);
          this.allRequirements = res.data;
          localStorage.setItem('all_requirements', JSON.stringify(this.allRequirements));
        },
        async getProposal(){
            let res = await getReq(`/1/proposals/${this.$route.params.proposalId}`);
            this.proposal = res.data;
            localStorage.setItem('proposal', JSON.stringify(this.proposal));
        },
        async createEvent(){

            await this.$store.dispatch("event/saveEventAction", new CalendarEvent({
                eventStartMillis: this.proposal.eventData.startTime * 1000,
                eventEndMillis: this.proposal.eventData.endTime * 1000,
                status: 'draft',
                numberOfParticipants: this.proposal.eventData.numberOfParticipants,
                flexibleWithDates: 0,
                guestType: {
                    name: "Employees",
                    selected: false,
                    value: "employees",
                },
                location: this.proposal.eventData.location,
                eventType: this.proposal.eventData.eventType,
                places: ['OUTDOORS'],
            }));
        },
        getSelectedTypes(category) {
            let typesList = [];
            // this.requirements
            const types = this.requirements[category].types;
            for (const t in types) {
                typesList = [...typesList, ...types[t]];
            }
            return typesList;
        },
        getDefaultTypes(category, name) {
            return _.property([category, "types", camelize(name)])(this.requirements);
        },
        getRequirements(category) {
            if (!this.requirements[category]) return {};
            return this.requirements[category];
        },
        getSpecification({ category, services }){
            this.selectedCategory = this.serviceCategories.find(
                (item) => item.key === category.serviceCategory,
            );
            this.isOpenedAdditionalModal = true;
            console.log(category.serviceCategory);
            let requirements = this.allRequirements[category.serviceCategory].requirements;
            const storedRequirements = this.requirements[category.serviceCategory].mainRequirements;
            console.log(requirements);
            requirements = { ...requirements, ...storedRequirements };
            if (category.script) eval(category.script); //select relevant options using script
            console.log(requirements);
            for (let subCategory of Object.keys(requirements)) {
                requirements[subCategory].forEach((item) => {
                    try {
                        if (item.conditionScript) item.visible = eval(item.conditionScript);
                        else item.visible = true;
                    } catch (e) {}
                });
            }
            this.subCategory = requirements;
        },
        setServiceStyles({category, services, type}){
            let requirement = this.requirements[category.serviceCategory];
            if(!requirement) {
                requirement = {event: {id: this.event.id}, category: category.serviceCategory, types: { [type]: services }}
            } else {
                requirement = {...requirement, types: { [type]: services }};
            }
            this.saveRequirements(requirement)
        },
        saveAdditionalRequest({ category, requirements }) {

            this.isOpenedAdditionalModal = false;
            this.saveRequirements({...this.requirements[category], ...requirements})
        },
        async saveRequirements(requirement){
            console.log('saveRequirements', requirement);
            this.$set(this.requirements, requirement.category, requirement)
            localStorage.setItem('requirements', JSON.stringify(this.requirements));
        },
        async signIn({email, password}){
            console.log('signIn', email, password)
            await this.$store.dispatch("auth/login", {
                    email,
                    password,
                })
            this.showSignupModal =  false;

            this.isLoading = true;
            await this.save();
            this.goToAccountPage();
            this.isLoading = false;
        },
        async signUp({email, password, name, company}){
            console.log('signUp', email, password, name, company)
            await this.$store.dispatch("auth/register", {
                email: email,
                password,
                name,
                company,
                currentUserType: 'guest',
                role: 'administrator',
            });
            await this.$store.dispatch('auth/login', {email, password});

            this.showSignupModal =  false;

            this.isLoading = true;
            await this.save();
            this.goToAccountPage();
            this.isLoading = false;
        },

        async findVendors(){

          if ( this.loggedInUser ) {
            this.loading = true;
            await this.save();
            this.loading = false;
            this.goToAccountPage();
          } else {
              this.showSignupModal = true;
          }

        },
        async save(){
            if(!this.event.id){
                await this.createEvent();
            }

            this.expiredTime = moment(new Date()).add(3, "days").valueOf();
            let res = await postReq(`/1/events/${this.event.id}/offer-vendors/find-vendors`, {
                issuedTime: new Date().getTime(),
                expiredBusinessTime: this.expiredTime,
                requirements: this.requirements,
            });
            await this.$store.dispatch(
                "event/saveEventAction",
                new CalendarEvent({ id: this.event.id, processingStatus: "accept-proposal" }),
            );

            // removed cached data in localstorage
            localStorage.removeItem('requirements');
            localStorage.removeItem('proposal');
        },
        goToAccountPage(){
          this.$router.push(`/user-events/${this.event.id}/booking/choose-vendor`);
        },
        changePage(){
            this.page = this.page === 'signin' ? 'signup' : 'signin';
        },
        authenticate(provider){
            let tenantId = this.$authService.resolveTenantId();
            let redirectURL = `/vendor/offer/${this.proposal.id}`
            let callback = btoa(
                `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/signedIn?redirectURL=${redirectURL}&action=${this.$queryEventActions.guest}&userType=guest&token=`,
            );
            console.log(`${process.env.SERVER_URL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`);
            document.location.href = `${process.env.SERVER_URL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`;
        }
    },
    computed:{
        loggedInUser(){
            return this.$store.state.auth.user;
        },
        event() {
            return this.$store.state.event.eventData;
        },
        serviceCategories(){
            return this.$store.state.common.serviceCategories;
        }
    },
    async created() {
        let redirect = this.$route.query.redirect

        if (this.loggedInUser) {
            await this.$store.dispatch("auth/checkToken", this.loggedInUser.access_token);

            this.allRequirements = JSON.parse(localStorage.getItem('all_requirements'));
            if (!this.allRequirements || !this.allRequirements.length) {
                await this.getAllRequirements()
            }

            this.requirements = JSON.parse(localStorage.getItem('requirements')) || {};

            await this.getProposal();
            if (redirect) {
                await this.save();
                this.goToAccountPage();
            }

            this.isLoading = false;
        } else {
            this.showBookedVendorModal = true;

            if (!this.allRequirements || !this.allRequirements.length) {
                await this.getAllRequirements()
            }
            await this.getProposal();
            this.isLoading = false;
        }
        this.showOffers = true;
        this.setProposal(this.proposal);
        this.setOpen('BOOKED');
    }

}
</script>
<style lang="scss" scoped>
.md-dialog.singin-form {
    border-radius: 10px;
    padding: 2em 40px;
    z-index: 9999999;
    height: auto;
}
.arrow-right{
    border-radius: 100%;
    width: 25px;
    height: 25px;
    min-width: 25px;
}
/deep/ .md-icon{color: #f51355}
</style>
