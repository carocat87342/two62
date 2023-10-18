import { postReq, getReq } from "@/utils/token";
const state = {
    serviceCategories: [],
    serviceCategoriesMap: {},
    companies: [],
    eventTypes: [],
    taxes: [],
};
const mutations = {
    setCategories: (state, categories) => {
        state.serviceCategories = categories;
        const categoriesMap = categories.reduce((m, item) => {
            return { ...m, [item.key]: item }
        }, {})
        console.log("categoriesMap", categoriesMap)
        state.serviceCategoriesMap = categoriesMap;
    },
    setCampanies: (state, companies) => {
        state.companies = companies
    },
    setEventTypes: (state, types) => {
        state.eventTypes = types;
    },
    setTaxes: (state, taxes) => {
        state.taxes = taxes;
    }
};
const actions = {
    fetchAllCategories: ({ commit, state }) => {
        return new Promise((resolve, reject) => {
            // getting from API
            if (localStorage.getItem("serviceCategories")) {
                const categories = JSON.parse(localStorage.getItem("serviceCategories"))
                if (categories.length > 0) {
                    commit("setCategories", categories);
                    resolve(categories)
                    return
                }
            }
            getReq(`/1/components`, true)
                .then(res => {
                    commit("setCategories", res.data);
                    localStorage.setItem("serviceCategories", JSON.stringify(res.data));
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    getAllCompanies: ({ commit, state }) => {
        return new Promise((resolve, reject) => {
            getReq(`/1/companies`, true)
                .then(res => {
                    commit('setCompanies', res.data);
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getEventTypes({ commit, state }) {
        return new Promise((resolve, reject) => {
            if (state.eventTypes && state.eventTypes.length > 0) {
                resolve(state.eventTypes);
            }
            getReq("/1/eventTypes")
                .then(res => {
                    commit("setEventTypes", res.data);
                    resolve(res.data);
                })
                .catch(e => {
                    commit("setEventTypes", []);
                });
        });
    },
    getTaxes({commit, state}) {
        return new Promise(async (resolve, reject) => {
            const taxes = JSON.parse(localStorage.getItem('taxes'));

            if(!taxes || !taxes.length) {
               const res = await getReq(`/1/taxes`);

                localStorage.setItem('taxes', JSON.stringify(res.data))
                commit('setTaxes', res.data)
                resolve(res.data)

            } else {
                commit('setTaxes', taxes)
                resolve(taxes);
            }

        })
    }
};
export default {
    namespaced: true,
    state,
    actions,
    mutations,
};
