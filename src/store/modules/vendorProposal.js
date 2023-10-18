import Vue from "vue";
import { postReq, getReq } from "@/utils/token";
import Vendors from "@/models/Vendors";
import ProposalRequest from "@/models/ProposalRequest";
import Proposal from "@/models/Proposal";
import Vendor from "@/models/Vendors";
import { reject, resolve } from "promise-polyfill";
import EventTimelineDate from "@/models/EventTimelineDate";
import CalendarEvent from "@/models/CalendarEvent";
import authService from "@/services/auth.service";
import moment from "moment";
import Customer from "@/models/Customer";
import ProposalVersion from "@/models/ProposalVersion";
import { costByService, extraCost, discounting, addingTax } from "@/utils/price"

const setStateFromData = (state, data) => {
  Object.keys(data).map(key => {
    Vue.set(state, key, JSON.parse(JSON.stringify(data[key])));
  })
}
const setStateByVersion = (state, {key, value}) => {
  if (state.proposalRequest.hasOwnProperty('proposal')) {
    if(state.currentVersion === -1) {
      Vue.set(state.original, key, value);
    } else {
      Vue.set(state.versions[state.currentVersion].data, key, value);
    }
  }
}

const state = {
  vendor: null,
  initialized: false,
  eventVision: null,
  proposalRequest: {},
  services: {},
  costServices: {},
  includedServices: {},
  extraServices: {},
  discounts: {},
  taxes: {},
  totalTax: {
    percentage: 0,
    price: 0,
  },
  totalDiscount: {
    percentage: 0,
    price: 0,
  },
  legalDocs: {},
  wizardStep: 0,
  progress: 0,
  initStep: 0,
  additionalServices: [],
  attachments: [],
  inspirationalPhotos: new Array(15),
  coverImage: [],
  bundleDiscount: {
    isApplied: false,
    services: [],
    percentage: 0,
    price: 0,
  },
  suggestionDate: null,
  timelineDates: [],
  personalMessage: "",
  suggestedNewSeatings: null,
  bookedServices: [],
  customer: null,
  versions: [],
  requirements: [],
  original: null,
  currentVersion: -1,
  tenantId: authService.resolveTenantId()
};
const getters = {
  originalPriceOfMainCategory(state) {
    const mainService = state.vendor.eventCategory.key;
    if (!state.costServices[mainService] || !state.costServices[mainService].length) return 0;
    return costByService(state.costServices[mainService]);
  },
  totalPriceByCategory(state, getters) {
    const prices = {};
    state.additionalServices.forEach(service => {
      if (!state.costServices[service] || !state.costServices[service].length) {
        prices[service] = 0;
      } else {
        prices[service] = costByService(state.costServices[service]);
      }
    });
    prices[state.vendor.eventCategory.key] = getters.originalPriceOfMainCategory;
    return prices;
  },

  finalPriceOfMainCategory(state, getters) {
    const mainService = state.vendor.eventCategory.key;
    if (!state.costServices[mainService]) return 0;
    const sumPrice = getters.originalPriceOfMainCategory;

    let discount = state.discounts[mainService] || { price: 0, percentage: 0 };
    let tax = state.taxes[mainService] || { price: 0, percentage: 0 };

    let total = discounting(sumPrice, discount);
    total = addingTax(total, tax);

    return total;
  },
  pricesByCategory(state, getters) {
    const prices = {};
    state.additionalServices.forEach(service => {
      if (!state.costServices[service] || !state.costServices[service].length) {
        prices[service] = 0;
      } else {
        let discount = state.discounts[service] || { price: 0, percentage: 0 };
        let tax = state.taxes[service] || { price: 0, percentage: 0 };
        let total = costByService(state.costServices[service]);
        total = discounting(total, discount);
        total = addingTax(total, tax);
        prices[service] = total
      }
    });
    prices[state.vendor.eventCategory.key] = getters.finalPriceOfMainCategory;
    return prices;
  },
  sumOfPrices(state, getters) {
    let s = 0;
    Object.keys(getters.totalPriceByCategory).forEach((category) => {
      s += getters.totalPriceByCategory[category];
    });
    return s;
  },
  totalBeforeDiscount(state, getter) {
    let sum = 0;
    Object.keys(getter.totalPriceByCategory).forEach(category => {
      sum += Number(getter.totalPriceByCategory[category])
    })
    // check tax
    let tax = state.taxes['total'] || { price: 0, percentage: 0 };
    sum = addingTax(sum, tax);
    return sum.toFixed(2);
  },
  totalBeforeBundle(state, getter) {
    let sum = 0;
    Object.keys(getter.totalPriceByCategory).forEach(category => {
      sum += Number(getter.totalPriceByCategory[category])
    })

    // check discount
    let discount = state.discounts['total'] || { price: 0, percentage: 0 };
    sum = discounting(sum, discount);

    // check tax
    let tax = state.taxes['total'] || { price: 0, percentage: 0 };
    sum = addingTax(sum, tax);

    return sum.toFixed(2)

  },
  totalPriceOfProposal(state, getter) {
    let sum = 0;
    Object.keys(getter.totalPriceByCategory).forEach(category => {
      sum += Number(getter.totalPriceByCategory[category])
    })

    // check discount
    let discount = state.discounts['total'] || { price: 0, percentage: 0 };
    sum = discounting(sum, discount);

    // check tax
    let tax = state.taxes['total'] || { price: 0, percentage: 0 };
    sum = addingTax(sum, tax);
    // check bundle discount

    if (state.bundleDiscount && state.bundleDiscount.isApplied) {
      sum -= discounting(sum, state.bundleDiscount)
    }

    return sum
  }
};
const mutations = {
  selectVersion: (state, index) => {
    state.currentVersion = index;

    // update proposal data if vendor click version tab

    if (index === -1) {
      setStateFromData(state, JSON.parse(JSON.stringify(state.original)));
    }

    if(index > -1) {
      setStateFromData(state, JSON.parse(JSON.stringify(state.versions[index].data)));
    }
  },
  setVersions: (state, versions) => {
    state.versions = versions;
  },
  setVendor: (state, vendor) => {
    state.vendor = vendor;
    state.personalMessage = vendor.personalMessage;
  },
  setProposal: (state, proposal) => {
    state.id = proposal.id;
    state.additionalServices = proposal.additionalServices;
    state.eventVision = proposal.eventVision;
    state.services = proposal.vendor.services;
    state.costServices = proposal.costServices;
    state.includedServices = proposal.includedServices;
    state.extraServices = proposal.extraServices;
    state.inspirationalPhotos = proposal.inspirationalPhotos;
    state.personalMessage = proposal.personalMessage;
    state.taxs = proposal.taxs;
    state.discounts = proposal.discounts;
    state.bundleDiscount = proposal.bundleDiscount;
    state.suggestedNewSeatings = proposal.suggestedNewSeatings;
    state.initialized = true;
    state.wizardStep = proposal.step;
    state.coverImage = proposal.coverImage || [];
    state.versions = proposal.versions || [];
    state.bookedServices = proposal.bookedServices;
    state.currentVersion = proposal.selectedVersion || -1;

    delete proposal.versions;
    Vue.set(state, 'original', proposal);

  },
  setPropsalRequest: (state, propsoalRequest) => {
    state.proposalRequest = propsoalRequest;
  },
  setWizardStep: (state, step) => {
    state.wizardStep = step;
  },
  setProgress: (state, progress) => {
    state.progress = progress;
  },
  setInitStep: (state, step) => {
    state.initStep = step;
  },
  setVendorServices: (state, { category, services }) => {
    Vue.set(state.vendor.services, category, services);
  },
  setCostServices: (state, { category, services }) => {
    Vue.set(state.costServices, category, services);

    setStateByVersion(state, {key: 'costServices', value: JSON.parse(JSON.stringify(state.costServices))})

  },
  setIncludedServices: (state, { category, services }) => {
    Vue.set(state.includedServices, category, services);

    setStateByVersion(state, {key: 'includedServices', value: JSON.parse(JSON.stringify(state.includedServices))})
  },
  setExtraServices: (state, { category, services }) => {
    Vue.set(state.extraServices, category, services);

    setStateByVersion(state, {key: 'extraServices', value: JSON.parse(JSON.stringify(state.extraServices))})
  },
  setLegalDocs: (state, { category, files }) => {
    Vue.set(state.legalDocs, category, files);
  },
  addLegalDoc: (state, { category, docTag, obj }) => {
    Vue.set(state.legalDocs[category], docTag, obj);
  },
  setDiscount: (state, { category, discount }) => {
    Vue.set(state.discounts, category, discount);

    setStateByVersion(state, {key: 'discounts', value: JSON.parse(JSON.stringify(state.discounts))})
  },
  setTax: (state, { category, tax }) => {
    Vue.set(state.taxes, category, tax);

    setStateByVersion(state, {key: 'taxes', value: state.taxes})
  },
  setAdditionalServices: (state, services) => {
    Vue.set(state.additionalServices, services);

    setStateByVersion(state, {key: 'additionalServices', value: JSON.parse(JSON.stringify(state.additionalServices)) })
  },
  removeCategoryFromAdditional: (state, category) => {
    const index = state.additionalServices.findIndex(item => item == category);
    state.additionalServices.splice(index, 1);
    setStateByVersion(state, {key: 'additionalServices', value: JSON.parse(JSON.stringify(state.additionalServices))})
  },
  setBundleDiscount: (state, bundleDiscount) => {
    state.bundleDiscount = bundleDiscount;
    setStateByVersion(state, {key: 'bundleDiscount', value: JSON.parse(JSON.stringify(state.bundleDiscount))})
  },
  setValue: (state, { key, value }) => {
    Vue.set(state, key, value);

    setStateByVersion(state, {key, value});
  },
  setCustomer: (state, customer) => {
    state.customer = customer;
  },
  setInspirationalPhoto: (state, { index, photo }) => {
    Vue.set(state.inspirationalPhotos, index, photo);
    setStateByVersion(state, {key: 'inspirationalPhotos', value: JSON.parse(JSON.stringify(state.inspirationalPhotos))})
  },
  initState(state) {
    Vue.set(state, "costServices", {});
    Vue.set(state, "includedServices", {});
    Vue.set(state, "extraServices", {});
    Vue.set(state, "bookedServices", []);
    Vue.set(state, "discounts", {});
    Vue.set(state, "taxes", {});
    Vue.set(state, "totalTax", { percentage: 0, price: 0 });
    Vue.set(state, "legalDocs", {});
    Vue.set(state, "wizardStep", 0);
    Vue.set(state, "initStep", 0);
    Vue.set(state, "initialized", false);
    Vue.set(state, "attachments", {});
    Vue.set(state, "bundleDiscount", {
      isApplied: false,
      services: [],
      discountPercentage: 0,
      discountAmount: 0,
    });
  },
};
const actions = {
  addPrice({ commit, state, dispatch }, { category, selectedItem }) {
    const includedServices = state.includedServices[category];
    const includedIndex = includedServices.findIndex(item => item.requirementTitle == selectedItem.requirementTitle)
    includedServices.splice(includedIndex, 1)
    commit("setIncludedServices", { category, services: [...includedServices] })
    const costServices = state.costServices[category];
    costServices.push(selectedItem);
    commit("setCostServices", { category, services: costServices })
  },
  getProposalByRequestId: ({ commit, state }, proposalRequestId) => {
    return new Promise((resolve, reject) => {
      new Proposal()
          .for(new ProposalRequest({ id: proposalRequestId }))
          .get()
          .then(res => {
            const proposal = res[0];
            commit("setProposal", proposal);
            if (proposal.selectedVersion && proposal.selectedVersion > -1) commit("selectVersion", proposal.selectedVersion)
          })
          .catch(e => {
            reject(e);
          });
    });
  },
  getCustomer: ({commit, state}, email) => {
    return new Promise(async (resolve, reject) => {
      new Customer().params({email}).get().then(customer => {
        console.log('customer', customer);
        if(customer) {
          commit("setCustomer", customer[0]);
          resolve(customer[0]);
        }
      });

    });
  },
  getCustomers: ({commit}, vendorId) => {
    return new Promise(async (resolve, reject) => {
      new Customer().for(new Vendors({id: vendorId}))
          .params({customerType: 1})
          .get().then(customer => {

        if(customer) {
          commit("setCustomer", customer[0]);
          resolve(customer[0]);
        }
      });

    });
  },
  getVendor: ({ commit, state }, vendorId) => {
    return new Promise((resolve, reject) => {
      Vendors.find(vendorId)
          .then(resp => {
            commit("setVendor", resp);
            resolve(resp);
          })
          .catch(e => {
            reject(e);
          });
    });
  },
  getProposalRequest: ({ commit, state, dispatch }, requestId) => {
    return new Promise((resolve, reject) => {
      ProposalRequest.find(requestId).then(resp => {
        commit("setPropsalRequest", resp);
        dispatch("getTimelineDates", resp.eventData.id);
        if (resp.proposal) {
          commit("setProposal", resp.proposal);
          if (resp.proposal.selectedVersion && resp.proposal.selectedVersion > -1) commit("selectVersion", proposal.selectedVersion)
        }
        resolve(resp);
      });
    });
  },
  getTimelineDates({ commit, state }, eventId) {
    return new Promise((resolve, reject) => {
      new EventTimelineDate()
          .for(new CalendarEvent({ id: eventId }))
          .get()
          .then(res => {
            commit("setValue", "timelineDates", res);
          });
    });
  },
  saveCustomer:({commit, state, dispatch}, customer) => {
    return new Promise(async (resolve, reject) => {
      new Customer(customer).save().then(customer => {

        commit('setCustomer', customer);
        resolve(customer);
      });
    });
  },
  saveProposal: ({ commit, state, getters }, status) => {
    return new Promise((resolve, reject) => {

      const proposal = new Proposal({
        id: status == 'duplicate' ? undefined : state.id,
        personalMessage: state.original ? state.original.personalMessage : state.personalMessage,
        additionalServices: state.original ? state.original.additionalServices : state.additionalServices,
        inspirationalPhotos: state.original ? state.original.inspirationalPhotos : state.inspirationalPhotos,
        proposalRequestId: state.proposalRequest.id,
        eventVision: state.original ? state.original.eventVision : state.eventVision,
        eventComponentId: state.proposalRequest.componentInstance ? state.proposalRequest.componentInstance.id : null,
        requirementId: state.proposalRequest.plannerRequirement ? state.proposalRequest.plannerRequirement.id : null,
        vendorId: state.vendor.id,
        costServices: state.original ? state.original.costServices : state.costServices,
        includedServices: state.original ? state.original.includedServices : state.includedServices,
        extraServices: state.original ? state.original.extraServices : state.extraServices,
        discounts: state.original ? state.original.discounts : state.discounts,
        taxes: state.original ? state.original.taxes : state.taxes,
        cost: getters.totalPriceOfProposal,
        pricesByCategory: getters.pricesByCategory,
        bundleDiscount: state.original ? state.original.bundleDiscount : state.bundleDiscount,
        attachments: state.original ? state.original.attachments : state.attachments,
        coverImage: state.original ? state.original.coverImage : state.coverImage,
        status,
        services: state.original ? state.original.services : state.services,
        step: state.wizardStep,
        progress: state.progress,
        tenantId: state.tenantId,
        suggestionDate: state.suggestionDate,
        expiredDate: moment(new Date(), "YYYY-MM-DD").add(7, 'days').toDate(),
        bookedServices: state.bookedServices.length ? state.bookedServices : [state.vendor.eventCategory.key],
        seatingData: state.original ? state.original.seatingData : state.seatingData,
        versions: state.versions,
        selectedVersion: state.currentVersion,
      });
      proposal
          .save()
          .then(res => {
            commit("setProposal", res);
            resolve(res);
          })
          .catch(e => {
            reject(e);
          });
    });
  },
  saveVersion: ({ commit, state}, data) => {
    return new Promise(async (resolve, reject) => {
      const query = new ProposalVersion({...data, proposal: new Proposal({ id: state.id })})
          .for(new Proposal({ id: state.id }));
      let res = await query.save();
      console.log('res', res);
      let idx = state.versions.findIndex(v => v.id === res.id);
      if(idx === -1) {
        commit("setVersions", [...state.versions, res]);
      } else {
        Vue.set(state.versions, idx, res);
        commit("setVersions", state.versions)
      }
    })
  },
  removeVersion: ({ commit, state}, idx) => {
    return new Promise(async (resolve, reject) => {
      let version = await ProposalVersion.find(state.versions[idx].id);
      await version.delete();

      let versions = state.versions.filter((v, index) => index !== idx);

      commit("setVersions", versions)
      resolve();
    })
  },
  saveVendor: ({commit, state} , vendor) => {
    return new Promise(async resolve => {
      let query = new Vendor(vendor);
      let res = await query.save();
      console.log('saveVEndor', res);
      commit('setVendor', res);
      resolve(res)
    })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
