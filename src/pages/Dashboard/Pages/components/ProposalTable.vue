<template>
   <div class="position-relative">
       <md-button
           class="md-simple md-icon-button position-absolute"
           style="top: -20px;right:0px"
           @click="$emit('close')"
       >
           <md-icon>close</md-icon>
       </md-button>
       <md-table v-model="proposals" class="mt-10">
           <md-table-row slot="md-table-row" slot-scope="{ item }">
               <md-table-cell md-label="Id">{{getIndex(item) + 1}}</md-table-cell>
               <md-table-cell md-label="Event Name">
                   <div class="font-bold font-size-16" v-if="item.nonMaryoku && item.eventData && item.eventData.customer">
                       {{ item.eventData.customer.companyName }}
                   </div>
                   <div class="font-bold font-size-16" v-else-if="item.proposalRequest && item.proposalRequest.eventData.title">
                       {{ item.proposalRequest.eventData.title }}
                   </div>
                   <div class="font-bold font-size-16" v-else>New Event</div>
               </md-table-cell>
               <md-table-cell md-label="Created">{{ item.dateCreated | date("DD/MM/YYYY") }}</md-table-cell>
               <md-table-cell md-label="Cost">${{ item.cost | withComma }}</md-table-cell>
               <md-table-cell md-label="Status"><img :src="getStatusIcon(item.status)" /></md-table-cell>
               <md-table-cell md-label="Owner">
                    <span v-if="item.proposalRequest && item.proposalRequest.eventData && item.proposalRequest.eventData.owner">
                      {{ item.proposalRequest.eventData.owner.name }}
                    </span>
                   <span v-else-if="item.eventData">
                      {{ item.eventData.customer ? item.eventData.customer.name : "" }}
                    </span>
               </md-table-cell>
               <md-table-cell md-label="Score"><span v-if="item.score">{{item.score}}</span></md-table-cell>
           </md-table-row>
       </md-table>
   </div>

</template>
<script>
import { PROPOSAL_STATUS } from "@/constants/status";

export default {
    props:{
      proposals: {
          type: Array,
      }
    },
    created() {
        console.log('proposals', this.proposals);
    },

    methods:{
        getIndex (item){
            return this.proposals.findIndex(v => v.id === item.id);
        },
        getStatusIcon(status) {
            let path = "/static/icons/vendor/proposalBoard/";
            if ( status === PROPOSAL_STATUS.DRAFT ) {
                return `${path}filter-draft.svg`;
            } else if ( status === PROPOSAL_STATUS.PENDING ) {
                return `${path}filter-pending.svg`;
            } else if ( status === PROPOSAL_STATUS.TOP3) {
                return `${path}filter-top3.svg`;
            } else if ( status === PROPOSAL_STATUS.LOST ) {
                return `${path}filter-reject.svg`;
            } else if ( status === PROPOSAL_STATUS.WON ) {
                return `${path}filter-won.svg`;
            } else if ( status === PROPOSAL_STATUS.INACTIVE ) {
                return `${path}filter-inactive.svg`;
            } else {
                return `${path}filter-${status}.svg`;
            }
        },
    }
}
</script>
<style>
</style>
