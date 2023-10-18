<template>
    <div class="negotiation-modal px-30 py-20">
        <img v-if="icon" :src="`${$iconURL}${icon}`">
        <h3 class="color-vendor font-bold-extra">{{title}}</h3>
        <p>{{subTitle}}</p>

        <template v-if="type === negotiationTypes.EVENT_CHANGE">
            <div v-if="negotiation.originalDate !== negotiation.date" class="d-flex align-center justify-content-center mt-40">
                <div class="font-size-14 w-min-180 color-black-middle">
                    <div class="font-size-24 text-line-through mb-5">{{negotiation.originalDate}}</div>
                    Original Data
                </div>
                <md-icon class="mx-40">arrow_forward</md-icon>
                <div class="font-size-24 font-bold-extra w-min-180">
                    {{negotiation.date}}
                    <p class="font-size-14 mt-5">New Data</p>
                </div>
            </div>
            <div v-if="negotiation.originalStartTime !== negotiation.startTime || negotiation.originalEndTime !== negotiation.endTime" class="d-flex align-center justify-content-center mt-40">
                <div class="font-size-14 w-min-180 color-black-middle">
                    <div class="font-size-24 text-line-through mb-5">{{`${negotiation.originalStartTime} - ${negotiation.originalEndTime}`}}</div>
                    Original Time
                </div>
                <md-icon class="mx-40">arrow_forward</md-icon>
                <div class="font-size-24 font-bold-extra w-min-180">
                    <div class="font-size-24 mb-5">{{`${negotiation.startTime} - ${negotiation.endTime}`}}</div>
                    <p class="font-size-14 mt-5">New Time</p>
                </div>
            </div>
            <div v-if="negotiation.originalNumberOfParticipants !== negotiation.numberOfParticipants" class="d-flex align-center justify-content-center mt-40">
                <div class="font-size-14 w-min-180 color-black-middle">
                    <div class="font-size-24 text-line-through mb-5">{{negotiation.originalNumberOfParticipants | withComma(Number)}}</div>
                    Original Number of guests
                </div>
                <md-icon class="mx-40">arrow_forward</md-icon>
                <div class="font-size-22 font-bold-extra w-min-180">
                    {{negotiation.numberOfParticipants | withComma(Number)}}
                    <p class="font-size-14 font-bold-extra mt-5">New Number of guests</p>
                </div>
            </div>
            <div v-if="negotiation.originalLocation !== negotiation.location" class="d-flex align-center justify-content-center mt-40">
                <div class="font-size-14 w-min-180 color-black-middle">
                    <div class="font-size-24 text-line-through mb-5">{{negotiation.originalLocation}}</div>
                    Original location
                </div>
                <md-icon class="mx-40">arrow_forward</md-icon>
                <div class="font-size-22 font-bold-extra w-min-180">
                    {{negotiation.location}}
                    <p class="font-size-14 font-bold-extra mt-5">Location</p>
                </div>
            </div>
            <div v-if="negotiation.originalEventType.key !== negotiation.eventType.key" class="d-flex align-center justify-content-center mt-40">
                <div class="font-size-14 w-min-180 color-black-middle">
                    <div class="font-size-24 text-line-through mb-5">{{negotiation.originalEventType.name}}</div>
                    Original event type
                </div>
                <md-icon class="mx-40">arrow_forward</md-icon>
                <div class="font-size-22 font-bold-extra w-min-180">
                    {{negotiation.eventType.name}}
                    <p class="font-size-14 font-bold-extra mt-5">Event type</p>
                </div>
            </div>
        </template>

        <div v-if="type === negotiationTypes.PRICE_NEGOTIATION" class="d-flex align-center justify-content-center mt-40">
            <div class="font-size-14 w-min-180 color-black-middle">
                <div class="font-size-24 text-line-through mb-5">${{negotiation.originalBudget}}</div>
                <span>{{`$${negotiation.originalBudgetPerGuest}`}}</span> per guest
            </div>
            <md-icon class="mx-40">arrow_forward</md-icon>
            <div class="font-size-14 w-min-180 color-black-middle">
                <div class=" font-size-22 font-bold-extra w-min-180">${{negotiation.budget}}</div>
                <span class="font-bold-extra">{{`$${negotiation.budgetPerGuest}`}}</span> per guest
            </div>
        </div>

        <VendorBidTimeCounter
            v-if="type === negotiationTypes.ADD_MORE_TIME"
            :key="`${days}-${hours}-${mins}`"
            customClass="vendor bg-purple w-max-400 mx-auto mb-30 mt-30 px-10"
            :days="days"
            :hours="hours"
            :minutes="mins"
            :seconds="seconds"
            :bottom-content="processed === 0 ? 'Until offer expires' : null"
            :top-content="processed !== 0 ? 'This offer will expire in' : null"
        />
    </div>
</template>
<script>

    import {NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE} from "@/constants/status";
    import VendorBidTimeCounter from "@/components/VendorBidTimeCounter/VendorBidTimeCounter";

    export default {
        components: {
          VendorBidTimeCounter
        },
        props: {
          type: Number,
          negotiation: {
            type: [Object, Number]
          },

          processed: {
            type: Number,
            default: NEGOTIATION_REQUEST_STATUS.NONE,
          },
        },
        data() {
          return {
            negotiationTypes: NEGOTIATION_REQUEST_TYPE,
            days: 0,
            hours: 0,
            mins: 0,
            seconds: 0,
          }
        },
        mounted() {
          console.log('mounted', this.negotiation, this.type);
          this.init()
        },
        methods: {
           init(){
               if (this.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME) {
                   let diff = (this.negotiation - new Date().getTime()) / 1000;

                   if (diff < 0) return;
                   this.days = Math.floor(diff / (24 * 3600));
                   diff = diff - this.days * 24 * 3600;
                   this.hours = Math.floor(diff / 3600);
                   diff = diff - this.hours * 3600;
                   this.mins = Math.floor(diff / 60);
                   diff -= this.mins * 60;
                   this.seconds = Math.floor(diff);
               }
           }
        },
        computed: {
          title(){
            if (this.processed === NEGOTIATION_REQUEST_STATUS.APPROVED) return 'Time added successfully';
            else if(this.processed === NEGOTIATION_REQUEST_STATUS.DECLINE) return 'Time extension Declined';

            if ( this.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME ) {
              return 'Planner needs extra time';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.EVENT_CHANGE ) {
              return 'The planner changed the event details';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) {
              return 'Planner want to negotiate the rate';
            }
          },
          subTitle(){
            if (this.processed === NEGOTIATION_REQUEST_STATUS.APPROVED) return 'You successfully extended the offer expiration by 2 days';
            else if(this.processed === NEGOTIATION_REQUEST_STATUS.DECLINE) return 'We will make sure to inform the planner';

            if ( this.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME ) {
              return 'You can extend the offer expiration by 2 days';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.EVENT_CHANGE ) {
              return 'You can change the rate right from here. If the change entails further changes on your part you can edit the proposal before sending to the planner';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) {
              return 'You can change the rate right from here or see the offer with all details';
            }
          },
          icon(){
            if(this.processed === NEGOTIATION_REQUEST_STATUS.DECLINE) return 'VendorsProposalPage/group-20091.svg';

            if ( this.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME ) {
              return 'VendorsProposalPage/group-18823.svg';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.EVENT_CHANGE ) {
              return 'VendorsProposalPage/group-21671.svg';
            } else if ( this.type === NEGOTIATION_REQUEST_TYPE.PRICE_NEGOTIATION ) {
              return 'Customer/group-8488.svg';
            }
          }
        },
        watch:{
          processed(newVal){
              this.init()
          },
          negotiation(newVal){
             console.log('negotiation.watch', newVal);
             this.init();
          }
        }
    }
</script>
<style lang="scss" scoped>

</style>
