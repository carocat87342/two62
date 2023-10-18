import Vue from "vue";
import Vendors from "@/models/Vendors";
import ProposalRequest from "@/models/ProposalRequest";
import Proposal from "@/models/Proposal";
import Vendor from "@/models/Vendors";
import { reject, resolve } from "promise-polyfill";
import EventTimelineDate from "@/models/EventTimelineDate";
import CalendarEvent from "@/models/CalendarEvent";
import moment from "moment";
import UserEvent from "@/models/UserEvent";
import ProposalVersion from "@/models/ProposalVersion";

const setStateFromData = (state, data) => {
  Object.keys(data).map(key => {
    Vue.set(state, key, JSON.parse(JSON.stringify(data[key])));
  })
}
const setStateByVersion = (state, { key, value }) => {
  if (state.id) {
    if (state.currentVersion === -1) {
      Vue.set(state.original, key, value);
    } else {
      Vue.set(state.versions[state.currentVersion].data, key, value);
    }
  }
}

const state = {
  id: null,
  includedServices: {},
  costServices: {},
  extraServices: {},
  custom: {},
  eventData: {},
  vision: "",
  images: [],
  vendor: null,
  wizardStep: 0,
  additionalServices: [],
  bundleDiscount: {},
  negotiationDiscount: {},
  discounts: {},
  taxes: {},
  coverImage: [],
  proposalServices: {},
  inspirationalPhotos: new Array(15),
  versions: [],
  original: null,
  seatingData: null,
  currentVersion: -1,
};
const getters = {
  originalPriceOfMainCategory(state) {
    const mainService = state.vendor.eventCategory.key;
    if (!state.costServices[mainService]) return 0;

    return state.costServices[mainService].reduce((s, item) => {
      if (item.isComplimentary) return s;
      return s + item.requirementValue * item.price;
    }, 0);
  },
  totalPriceByCategory(state, getters) {
    const prices = {};
    state.additionalServices.forEach(service => {
      if (!state.costServices[service]) {
        prices[service] = 0;
      }
      if (state.costServices[service]) {
        const sumPrice = state.costServices[service].reduce((s, item) => {
          if (item.isComplimentary) return s;
          return s + item.requirementValue * item.price;
        }, 0);
        prices[service] = sumPrice;
      }
    });
    prices[state.vendor.eventCategory.key] = getters.originalPriceOfMainCategory;
    return prices;
  },

  finalPriceOfMainCategory(state, getters) {
    const mainService = state.vendor.eventCategory.key;
    if (!state.costServices[mainService]) return 0;
    const sumPrice = getters.originalPriceOfMainCategory;
    let tax = state.taxes[mainService] || { price: 0, percentage: 0 };
    let discount = state.discounts[mainService] || { price: 0, percentage: 0 };

    if (!discount.price && discount.percentage > 0) {
      discount.price = Math.round((sumPrice * discount.percentage) / 100);
    }
    let total = sumPrice - discount.price;
    const taxPrice = Math.round((total * tax.percentage) / 100);

    return  total + taxPrice;
  },
  pricesByCategory(state, getters) {
    const prices = {};
    state.additionalServices.forEach(service => {
      if (!state.costServices[service]) {
        prices[service] = 0;
      }
      if (state.costServices[service]) {
        const sumPrice = state.costServices[service].reduce((s, item) => {
          if (item.isComplimentary) return s;
          return s + item.requirementValue * item.price;
        }, 0);
        let taxRate = state.taxes[service];
        if (!taxRate) taxRate = 0;
        let discount = state.discounts[service] || { price: 0, percentage: 0 };
        let total = sumPrice - discount.price;
        const tax = Math.round((total * taxRate) / 100);
        prices[service] = total + tax;
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
    sum = sum + sum * tax.percentage / 100;
    return sum.toFixed(2);
  },
  totalBeforeBundle(state, getter) {
    let sum = 0;
    Object.keys(getter.totalPriceByCategory).forEach(category => {
      sum += Number(getter.totalPriceByCategory[category])
    })

    // check default discount
    const discount = state.discounts['total'] || { price: 0, percentage: 0 };
    sum = sum - sum * discount.percentage / 100;

    const negotiation = state.negotiationDiscount || {price: 0, percentage: 0}
    sum = sum - sum * negotiation.percentage / 100;

    // check tax
    let tax = state.taxes['total'] || { price: 0, percentage: 0 };
    sum = sum + sum * tax.percentage / 100;

    return sum.toFixed(2)

  },
  totalPriceOfProposal(state, getter) {
    let sum = 0;
    Object.keys(getter.totalPriceByCategory).forEach(category => {
      sum += Number(getter.totalPriceByCategory[category])
    })

    // check discount
    const discount = state.discounts['total'] || { price: 0, percentage: 0 };
    sum = sum - sum * discount.percentage / 100;

    // check negotiation
    const negotiation = state.negotiationDiscount || { price: 0, percentage: 0}
    sum = sum - sum * negotiation.percentage / 100;


    // check tax
    const tax = state.taxes['total'] || { price: 0, percentage: 0 };
    sum = sum + sum * tax.percentage / 100;
    // check bundle discount

    if (state.negotiationDiscount && state.negotiationDiscount.isApplied) {
      sum -= state.negotiationDiscount.price
    }

    if (state.bundleDiscount && state.bundleDiscount.isApplied) {
      sum -= state.bundleDiscount.price
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

    if (index > -1) {
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
    state.costServices = proposal.costServices;
    state.includedServices = proposal.includedServices;
    state.extraServices = proposal.extraServices;
    state.images = proposal.images;
    state.personalMessage = proposal.personalMessage;
    state.taxs = proposal.taxs;
    state.discounts = proposal.discounts;
    state.negotiationDiscount = proposal.negotiationDiscount,
    state.suggestedNewSeatings = proposal.suggestedNewSeatings;
    state.eventData = proposal.eventData;
    state.coverImage = proposal.coverImage || [];
    state.inspirationalPhotos = proposal.inspirationalPhotos;
    state.seatingData = proposal.seatingData;
    state.initialized = true;

    state.versions = proposal.versions || []
    state.currentVersion = proposal.selectedVersion || -1,
    // state.wizardStep = proposal.step

    delete proposal.versions;
    Vue.set(state, 'original', proposal);
  },
  setWizardStep: (state, step) => {
    state.wizardStep = step;
  },
  setInitStep: (state, step) => {
    state.initStep = step;
  },
  setVendorServices: (state, { category, services }) => {
    Vue.set(state.vendor.services, category, services);
  },
  setCostServices: (state, { category, services }) => {
    // Add this category for the secondary servicesList
    if (category !== state.vendor.eventCategory.key && !state.additionalServices.includes(category)) {
      Vue.set(state, "additionalServices", [...state.additionalServices, category]);
    }
    Vue.set(state.costServices, category, services);

    setStateByVersion(state, { key: 'costServices', value: JSON.parse(JSON.stringify(state.costServices)) })
  },
  setIncludedServices: (state, { category, services }) => {
    Vue.set(state.includedServices, category, services);

    setStateByVersion(state, { key: 'includedServices', value: JSON.parse(JSON.stringify(state.includedServices)) })
  },
  setExtraServices: (state, { category, services }) => {
    Vue.set(state.extraServices, category, services);
    setStateByVersion(state, { key: 'extraServices', value: JSON.parse(JSON.stringify(state.extraServices)) })
  },
  setLegalDocs: (state, { category, files }) => {
    Vue.set(state.legalDocs, category, files);
  },
  addLegalDoc: (state, { category, docTag, obj }) => {
    Vue.set(state.legalDocs[category], docTag, obj);
  },
  setDiscount: (state, { category, discount }) => {
    Vue.set(state.discounts, category, discount);
    setStateByVersion(state, { key: 'discounts', value: JSON.parse(JSON.stringify(state.discounts)) })
  },
  setNegotiationDiscount: (state, discount) => {
    state.negotiationDiscount = discount;
    setStateByVersion(state, { key: 'negotiationDiscount', value: JSON.parse(JSON.stringify(state.negotiationDiscount)) })
  },
  setBundleDiscount: (state, bundleDiscount) => {
    state.bundleDiscount = bundleDiscount;
    setStateByVersion(state, { key: 'bundleDiscount', value: JSON.parse(JSON.stringify(state.bundleDiscount)) })
  },
  setTax: (state, { category, tax }) => {
    Vue.set(state.taxes, category, tax);
    setStateByVersion(state, { key: 'taxes', value: state.taxes })
  },
  setAdditionalServices: (state, services) => {
    Vue.set(state.additionalServices, services);
    setStateByVersion(state, { key: 'additionalServices', value: state.additionalServices })
  },
  removeCategoryFromAdditional: (state, category) => {
    const index = state.additionalServices.findIndex(item => item == category);
    state.additionalServices.splice(index, 1);
  },
  setValue: (state, { key, value }) => {
    Vue.set(state, key, value);

    setStateByVersion(state, { key, value: JSON.parse(JSON.stringify(value)) });
  },
  setEventProperty: (state, { key, value }) => {
    Vue.set(state.eventData, key, value)
  },
  setInspirationalPhoto: (state, { index, photo }) => {
    Vue.set(state.inspirationalPhotos, index, photo);
    setStateByVersion(state, { key: 'inspirationalPhotos', value: JSON.parse(JSON.stringify(state.inspirationalPhotos)) })
  },
  setSeatingData: (state, data) => {

    Vue.set(state, 'seatingData', JSON.parse(JSON.stringify(data)));
    setStateByVersion(state, { key: 'seatingData', value: JSON.parse(JSON.stringify(data)) })
  },
  initState(state) {
    Vue.set(state, "costServices", {});
    Vue.set(state, "includedServices", {});
    Vue.set(state, "extraServices", {});
    Vue.set(state, "discounts", {});
    Vue.set(state, "taxes", {});
    Vue.set(state, "totalTax", { percentage: 0, price: 0 });
    Vue.set(state, "legalDocs", {});
    Vue.set(state, "wizardStep", 0);
    Vue.set(state, "initStep", 0);
    Vue.set(state, "initialized", false);
    Vue.set(state, "attachments", {});
    Vue.set(state, "eventData", {});
    Vue.set(state, "negotiationDiscounts", {
      isApplied: false,
      percent: 0,
      price: 0,
    });
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
  getProposal: ({ commit, state }, proposalId) => {
    return new Promise((resolve, reject) => {
      Proposal.find(proposalId)
        .then(resp => {
          commit("setProposal", resp);
          if (resp.selectedVersion && resp.selectedVersion > -1) commit("selectVersion", resp.selectedVersion)
          resolve(resp);
        })
        .catch(e => {
          reject(e);
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
  saveProposal: ({ commit, state, getters }, status) => {
    if (state.eventData.id) {
      new UserEvent({ id: state.eventData.id, totalBudget: getters.totalPriceOfProposal }).save();
    }
    return new Promise((resolve, reject) => {
      const additionalServices = state.additionalServices || [];
      const availableAdditionalSerivces = additionalServices.filter(category => getters.pricesByCategory[category] > 0);
      console.log('saveProposal', state.id);
      const proposal = new Proposal({
        id: status == 'duplicate' ? undefined : state.id ? state.id : undefined,
        eventData: state.eventData,
        personalMessage: state.original ? state.original.personalMessage : state.personalMessage,
        additionalServices: availableAdditionalSerivces,
        images: state.images,
        coverImage: state.original ? state.original.coverImage : state.coverImage,
        eventVision: state.original ? state.original.eventVision : state.eventVision,
        vendorId: state.vendor.id,
        costServices: state.original ? state.original.costServices : state.costServices,
        includedServices: state.original ? state.original.includedServices : state.includedServices,
        inspirationalPhotos: state.original ? state.original.inspirationalPhotos : state.inspirationalPhotos,
        extraServices: state.original ? state.original.extraServices : state.extraServices,
        discounts: state.original ? state.original.discounts : state.discounts,
        negotiationDiscount: state.original ? state.original.negotiationDiscount : state.negotiationDiscount,
        bundleDiscount: state.original ? state.original.bundleDiscount : state.bundleDiscount,
        taxes: state.original ? state.original.taxes : state.taxes,
        cost: getters.totalPriceOfProposal,
        pricesByCategory: getters.pricesByCategory,
        attachments: state.original ? state.original.attachments : state.attachments,
        status,
        step: state.wizardStep,
        tenantId: state.tenantId,
        customerId: state.eventData.customer.id,
        suggestionDate: state.suggestionDate,
        expiredDate: moment(new Date(), "YYYY-MM-DD").add(7, 'days').toDate(),
        nonMaryoku: true,
        bookedServices: Object.keys(state.costServices), // Set all secondary services as booked services
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
          console.error(e)
          reject(e);
        });
    });
  },

  saveEvent({ commit, state, getters }, userEvent) {

    return new Promise((resolve, reject) => {
      try {
        return new UserEvent(userEvent).save().then(savedEvent => {
          commit('setEventProperty', { key: 'id', value: savedEvent.id })
          resolve(savedEvent)
        });
      }
      catch (e) {
        reject(e)
      }
    });
  },
  saveVersion({ commit, state }, data) {
    return new Promise(async (resolve, reject) => {
      const query = new ProposalVersion({ ...data, proposal: new Proposal({ id: state.id }) })
        .for(new Proposal({ id: state.id }));
      let res = await query.save();
      console.log('res', res);
      let idx = state.versions.findIndex(v => v.id === res.id);
      if (idx === -1) {
        commit("setVersions", [...state.versions, res]);
      } else {
        Vue.set(state.versions, idx, res);
        commit("setVersions", state.versions)
      }
    })
  },
  removeVersion: ({ commit, state }, idx) => {
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
      console.log('res', res);
      commit('setVendor', res);
      resolve(res)
    })
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
