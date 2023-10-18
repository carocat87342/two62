import Proposal from "@/models/Proposal";
import Reminder from "@/models/Reminder";
import ProposalRequest from "@/models/ProposalRequest";
import ProposalNegotiationRequest from "@/models/ProposalNegotiationRequest";

const state = {
      name: null,
      proposal: null,
      proposalRequest: null,
}

const actions = {
    saveProposal({commit, state}, proposal){
        return new Promise(async (resolve, reject) => {
            let query = new Proposal(proposal);
            let res = await query.save();

            resolve(res);
        })
    },

    saveReminder({commit, state}, reminder){
        return new Promise(async (resolve, reject) => {
            let query = new Reminder(reminder);
            let res = await query.save();

            resolve(res);
        })
    },

    saveProposalRequest({state}, {request, vendor}) {
        return new Promise(async (resolve, reject) => {
            let query = new ProposalRequest(request)
            let res = await query.for(vendor).save();
            console.log('saveProposalRequest', res);
            resolve(res);
        })
    },

    saveProposalNegotiationRequest({state}, {negotiation, proposal}) {
        return new Promise(async (resolve, reject) => {
            let query = new ProposalNegotiationRequest(negotiation);
            let res = await query.for(proposal).save();
            console.log('saveProposalNegotiationRequest', res);
            resolve(res);
        })
    }
}

const mutations = {
    setOpen(state, val){
        state.name = val
    },
    setProposal(state, proposal){
        state.proposal = proposal;
    },
    setProposalRequest(state, proposalRequest){
        state.proposalRequest = proposalRequest;
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
