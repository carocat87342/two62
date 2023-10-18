import { postReq, getReq } from "@/utils/token";
import Customer from "@/models/Customer";
import Vendor from "@/models/Vendors";

const state = {
    customers: [],
};
const mutations = {
    setCustomers: (state, customers) => {
        state.customers = customers;
    },
    setCampanies: (state, companies) => {
    },
    setEventTypes: (state, types) => {
    },
    setTaxes: (state, taxes) => {
    }
};
const actions = {
    getCustomers: ({ commit, state }, payload) => {
        return new Promise(async (resolve, reject) => {
           try {

               let query = new Customer();

               if (payload.vendorId) {
                   const vendor = new Vendor({id: payload.vendorId});
                   query.for(vendor)
               }

               if (payload.pagination) {
                   query.page(payload.pagination.page)
                       .limit(payload.pagination.limit)
               }

               if (payload.params) {
                   query.params(payload.params)
               }

               const res = await query.get();
               console.log('res', res);

               commit('setCustomers', res[0].customers)
               resolve(res[0].customers);
           } catch (e) {
               reject(e.message);
           }

        });
    },
    getAllCompanies: ({ commit, state }) => {
        return new Promise((resolve, reject) => {
        })
    },
    getEventTypes({ commit, state }) {
        return new Promise((resolve, reject) => {

        });
    },
    getTaxes({commit, state}) {
        return new Promise((resolve, reject) => {

        });
    }
};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
