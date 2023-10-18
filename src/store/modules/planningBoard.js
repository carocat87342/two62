import Vue from "vue";
import Cart from "@/models/Cart";
import CalendarEvent from "@/models/CalendarEvent";
import ProposalRequestRequirement from "@/models/ProposalRequestRequirement";

const getDefaultState = () => {
    return {
        step: 1,
        requirements: {},
        specialRequirements: {},
        cart:{},
        favorite:{},
    }
}
const state = getDefaultState();
const getters = {

}
const actions = {
  resetRequirements({commit}){
    commit('resetRequirements')
  },
  resetCartItems({commit}){
    commit('resetCartItems')
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
  getCartItems({ commit, state }, eventId) {
    return new Promise((resolve, reject) => {
        new Cart()
            .for(new CalendarEvent({ id: eventId }))
            .get()
            .then((res) => {
                if(res && res.length) {
                    res.forEach(item => {
                        commit("setCategoryCartItem", { category: item.category, item })
                    })
                }
                resolve(res)
            })
            .catch(err => {
                reject(err)
            });
    });
  },
  saveTypes({ commit, state }, { event, category, types }) {
    let requirements = state.requirements[category];
    if (!requirements) requirements = { event: { id: event.id }, category };
    requirements.types = { ...requirements.types, ...types };
    return new Promise((resolve, reject) => {
      new ProposalRequestRequirement(requirements)
        .for(new CalendarEvent({ id: event.id }))
        .save()
        .then((res) => {
          commit("setCategoryRequirements", { category, requirements: res })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        });
    });
  },
  saveRequiementSheet({ commit, state }, { event, category, requirements }) {
    let originalRequirements = state.requirements[category];
    if (!originalRequirements) originalRequirements = { event: { id: event.id }, category };
    originalRequirements = { ...originalRequirements, ...requirements }
    return new Promise((resolve, reject) => {
      new ProposalRequestRequirement(originalRequirements)
        .for(new CalendarEvent({ id: event.id }))
        .save()
        .then((res) => {
          commit("setCategoryRequirements", { category, requirements: res })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        });
    });
  },
  saveMainRequirements({ commit, state }, { event, category, requirements }) {
    return new Promise((resolve, reject) => {
      let originalRequirements = state.requirements[category];
      if (!originalRequirements) originalRequirements = { event: { id: event.id }, category };
      originalRequirements = { ...originalRequirements, ...requirements }

      new ProposalRequestRequirement(originalRequirements)
        .for(new CalendarEvent({ id: event.id }))
        .save()
        .then((res) => {
          commit("setCategoryRequirements", { category, requirements: res })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        });
    });
  },
  updateRequirements({ commit, state }, requirements) {
    return new Promise((resolve, reject) => {
      new ProposalRequestRequirement(requirements)
        .for(new CalendarEvent({ id: requirements.event.id }))
        .save()
        .then((res) => {
          commit("setCategoryRequirements", { category: res.category, requirements: res })
          resolve(res)
        })
        .catch(err => {
          reject(err)
        });
    });
  },
  updateCartItem({commit, state}, item) {
    return new Promise((resolve, reject) => {
      new Cart(item)
          .for(new CalendarEvent({ id: item.event.id }))
          .save()
          .then((res) => {
              commit("setCategoryCartItem", { category: res.category, item: res })
              resolve(res)
          })
          .catch(err => {
              reject(err)
      });
    });
  },
  removeCartItem({commit, state}, item) {
    return new Promise((resolve, reject) => {
        new Cart(item)
            .for(new CalendarEvent({id: item.event.id}))
            .delete()
            .then((res) => {
                commit("removeCategoryCartItem", { category: item.category })
                resolve(res)
            })
            .catch(err => {
                reject(err)
            });
    });
  }
}
const mutations = {
  resetRequirements(state){
    Vue.set(state, 'requirements', {})
  },
  resetCartItems(state){
    Vue.set(state, 'cart', {})
  },
  setStep(state, step) {
    state.step = step;
  },
  setData(state, { key, value }) {
    Vue.set(state, key, value)
  },
  setCategoryRequirements(state, { category, requirements }) {
    Vue.set(state.requirements, category, requirements)
  },
  setMainRequirements(state, { category, data }) {
    Vue.set(state.mainRequirements, category, data)
  },
  setCategoryTypes(state, { category, types }) {
    Vue.set(state.types, category, types)
  },
  setTypes(state, { category, type, data }) {
    if (!state.types[category])
      Vue.set(state.types, category, {})
    Vue.set(state.types[category], type, data)
  },
  setSpecialRequirements(state, data) {
    Vue.set(state, 'specialRequirements', data)
  },
  setCategoryCartItem(state, { category, item }) {
    Vue.set(state.cart, category, item)
  },
  removeCategoryCartItem(state, {category}){
    Vue.delete(state.cart, category);
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
