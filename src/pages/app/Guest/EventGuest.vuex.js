import moment from 'moment'
import Proposal from '@/models/Proposal'
import CalendarEvent from "@/models/CalendarEvent";
import ProposalRequestRequirement from "@/models/ProposalRequestRequirement";
import { postReq, getReq } from "@/utils/token";
import Vue from "vue";

export default {
  namespaced: true,
  state () {
    return {
      eventData: {},
      vendorRequirements: null,
      requirements: {},
      proposals:{},
      favorite:{},
      bookingRequirements:{},
    }
  },

  mutations: {
    setEventProperty (state, {key, actualValue}) {
      state.eventData[key] = actualValue
    },
    setEventData (state, data) {
      state.eventData = data;
    },
      setBookingRequirements(state, requirements) {
          state.bookingRequirements = requirements;
      },
      resetRequirements(state){
          Vue.set(state, 'requirements', {})
      },
      setStep(state, step) {
          state.step = step;
      },
      setData(state, { key, value }) {
          Vue.set(state, key, value)
      },
      setProposalsByCategory(state, {category, proposals}){
          Vue.set(state.proposals, category, proposals);
      },
      setVendorRequirements(state, data) {
          state.vendorRequirements = data
      },
      setCategoryRequirements(state, { category, requirements }) {
          Vue.set(state.requirements, category, requirements)
      },
  },
  actions: {
    resetRequirements({commit}){
      commit('resetRequirements')
    },
    resetCartItems({commit}){
      commit('resetCartItems')
    },
    getUserEvent ({dispatch, commit}, payload) {
      return new Promise(async (resolve) => {
        CalendarEvent.find(payload.id)
            .then(res => {
                console.log('res', res);
                commit("setEventData", res);
                resolve(res)
        });
      })

    },
    getVendorRequirements({ commit, state }) {
          const eventId = state.eventData.id
          return new Promise((resolve, reject) => {
              if (state.vendorRequirements) {
                  resolve(state.vendorRequirements)
              } else {
                  getReq(`/1/vendor/property?eventId=${eventId}`).then((res) => {
                      commit("setVendorRequirements", res.data)
                      resolve(res.data)
                  }).catch(e => {
                      reject(e)
                  });
              }
          })
    },
    getRequirements({ commit, state }, eventId) {
      return new Promise((resolve, reject) => {
          new ProposalRequestRequirement()
              .for(new CalendarEvent({ id: eventId }))
              .get()
              .then((res) => {
                  if(res && res.length) {
                      res.forEach(requirements => {
                          commit("setCategoryRequirements", { category: requirements.category, requirements })
                      })
                  }
                  resolve(res)
              })
              .catch(err => {
                  reject(err)
              });
      });
    },
    getProposals({commit, state}, payload) {
      return new Promise((resolve, reject) => {
          new Proposal()
              .params(payload)
              .get()
              .then((result) => {
                  console.log('getProposals.result', result);
                  if (result.length) {
                      Object.keys(state.requirements).map(r => {
                          let proposals = result.filter(it => it.requirementId == state.requirements[r].id) || [];
                          commit("setProposalsByCategory", {category: r, proposals});
                      })
                  }
                  resolve(result)
          })
      })
    },
    saveRequirement({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
          new ProposalRequestRequirement(payload.requirement)
              .for(new CalendarEvent({ id: payload.eventId }))
              .save()
              .then((res) => {
                  console.log('res', res);
                  commit('setCategoryRequirements', res.category, res)
                  resolve(res)
              })
              .catch(err => {
                  reject(err)
              });
      });
    },
  },
}
