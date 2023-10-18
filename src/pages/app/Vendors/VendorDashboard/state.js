import Vue from "vue";
import Vendors from "@/models/Vendors";
import ProposalRequest from "@/models/ProposalRequest";
import Proposal from "@/models/Proposal";
import Customer from "@/models/Customer";
import Vendor from "@/models/Vendors";
import UserEvent from "@/models/UserEvent";
import ProposalVersion from "@/models/ProposalVersion";
import ProposalNegotiationRequest from "@/models/ProposalNegotiationRequest";
import moment from "moment";

const state = {
  calendarEvents: {},
  proposalRequests: [],
  proposals: [],
  customers: [],
};

const getters = {

};

const actions = {
  getCalendarEvents({ commit, state }, month) {
    const monthDate = moment(month)
    const startOfMonth = monthDate.clone().startOf('month').toDate();
    const endOfMonth = monthDate.clone().endOf('month').toDate();
    const calendarEvents = state.calendarEvents;

    return new Promise((resolve, reject) => {

      UserEvent.params({
        startTime: startOfMonth,
        endTime: endOfMonth
      })
        .get()
        .then((events) => {
          commit("setCalendarEvents", { month, events })
          resolve(calendarEvents)
        });
    })

  },
  getProposalRequests({ commit, state }, vendorId) {
      return new Promise((resolve, reject) => {
          new ProposalRequest().for(new Vendors({ id: vendorId })).get().then(proposalRequests => {
              commit("setProposalRequests", proposalRequests)
              resolve(proposalRequests);
          }).catch(err => {
              reject(err);
          })
      })

  },
  getProposals({ commit, state }, payload) {
    return new Promise(async (resolve, reject) => {
        let query = new Proposal().for(new Vendor({ id: payload.vendorId }));
        if (payload.pagination) {
            query.page(payload.pagination.page)
                .limit(payload.pagination.limit)
        }
        if (payload.params) {
            query.params(payload.params)
        }
        let res = await query.get();
        console.log('getProposals', res);
        if (payload.pagination) {
            commit('setProposals', res[0].items);
            resolve(res[0])
        } else {
            commit('setProposals', res);
            resolve(res)
        }

    })
  },
  removeProposal({ commit, state}, id) {
    return new Promise(async (resolve, reject) => {
        const proposal = await Proposal.find(id);
        await proposal.delete();
        resolve();
    })
  },
  updateProposalRequest({ commit, state }, pr) {
    return new Promise((resolve, reject) => {
        new ProposalRequest(pr).save().then(result => {
            commit("setProposalRequest", result)
            resolve(result);
        }).catch(err => {
            reject(err);
        })
    })
  },
  updateProposal({ commit, state }, payload) {
    return new Promise(async (resolve, reject) => {
        let query = new Proposal({...payload.data}).for(new Vendor({ id: payload.vendorId }))
        let res = await query.save();
        commit('setProposal', res);
        resolve(res);
    })
  },
  getCustomers: ({commit, state}, payload) => {
    return new Promise(async (resolve, reject) => {
        new Customer().for(new Vendor({id: payload.vendorId}))
            .params(payload.params)
            .get()
            .then(res => {
            commit("setCustomers", res[0].customers);
            resolve(res[0]);
        });

    });
  },
  saveVersion({ commit, state}, payload) {
    return new Promise(async (resolve, reject) => {
      const query = new ProposalVersion({...payload.version, proposal: new Proposal({ id: payload.proposal.id })})
          .for(new Proposal({ id: payload.proposal.id }));
      let res = await query.save();
      resolve(res);
    })
  },
  saveNegotiation({ commit, state }, payload) {
    return new Promise(async (resolve, reject) => {
        let query = new ProposalNegotiationRequest(payload.data);
        let res = await query.for(new Proposal({ id: payload.proposal.id }))
            .save();
        resolve(res);
    })
  }
};

const mutations = {
  setCalendarEvents(state, { month, events }) {
    Vue.set(state.calendarEvents, month, [...events])
  },
  setProposalRequests(state, proposalRequests) {
    Vue.set(state, "proposalRequests", proposalRequests)
  },
  setProposals(state, proposals) {
    Vue.set(state, "proposals", proposals)
  },
  setProposalRequest(state, proposalRequest) {
    let idx = state.proposalRequests.findIndex(it => it.id === proposalRequest.id);
    Vue.set(state.proposalRequests, idx, proposalRequest)
  },
  setProposal(state, proposal) {
    let idx = state.proposals.findIndex(it => it.id === proposal.id);
    Vue.set(state.proposals, idx, proposal)
  },
  setCustomers(state, customers) {
    Vue.set(state, "customers", customers)
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
