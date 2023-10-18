<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
    <div class="md-layout vendor-proposals" v-if="proposalRequest">
      <vendor-proposals-form
        v-if="page==='details'"
        :proposal-request-requirements="proposalRequestRequirements"
        :proposal-request="proposalRequest"
        @goToLanding="goToLanding"
      />
      <vendor-proposals-landing
        v-if="page==='landing'"
        :proposal-request="proposalRequest"
        :first-time="firstTime"
        :proposals="proposals"
        @goToDetails="goToDetails"
        @requestAnotherProposal="getProposal"
      />
    </div>
  </div>
</template>

<script>
import ProposalRequest from '@/models/ProposalRequest'
import Vendors from '@/models/Vendors'
import VendorProposalsForm from './VendorProposalsForm'
import VendorProposalsLanding from './VendorProposalsLanding'

export default {
  components: {
    VendorProposalsForm,
    VendorProposalsLanding
  },

  data () {
    return {
      page: 'landing', // landing, details
      proposalRequestRequirements: [],
      proposals: [],
      proposalRequest: null,
      firstTime: false,
      gotProposals: false,
      isLoading: false
    }
  },
  created () {},
  mounted () {
    this.getProposal(this.$route.params.id)
  },
  methods: {
    goToDetails () {
      this.page = 'details'
    },
    goToLanding () {
      this.page = 'landing'
    },
    getProposals (id) {
      this.isLoading = true
      new Vendors({ id })
        .proposalRequests()
        .first()
        .then(proposals => {
          this.proposals = proposals.vendorProposals
          this.firstTime = proposals.firstTime

          this.isLoading = false
        })
    },
    getProposal (id) {
      this.isLoading = true

      ProposalRequest.find(id)
        .then(resp => {
          console.log('resp', resp)
          console.log('pro', this.proposals)
          this.$set(this, 'proposalRequest', resp)

          if (!this.gotProposals) {
            this.getProposals(resp.vendorId)
            this.gotProposals = true
          } else {
            this.isLoading = false
          }

          this.proposalRequestRequirements = _.chain(resp.requirements)
            .groupBy('requirementPriority')
            .map(function (value, key) {
              return {
                title: key,
                requirements: value
              }
            })
            .value()
        })
        .catch(error => {
          console.log(' error here   -->>>  ', error)
        })
    }
  },
  computed: {}
}
</script>
