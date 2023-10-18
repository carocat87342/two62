import Vue from "vue";
import { postReq, getReq } from "@/utils/token";
import Vendors from "@/models/Vendors";
import { VendorPolicy, VendorPricingPolicy } from "@/constants/vendor";

import S3Service from "@/services/s3.service";
import { makeid } from "@/utils/helperFunction";
import { getBase64 } from "@/utils/file.util";
const defaultState = {
    isLoading: false,
    isEditing: false,
    step: 0,
    status: null,
    vendor: {
        about: {
            company: null,
            service: null,
        },
        capacity: {},
        images: [],
        social: {},
        services: {},
        yesRules: [],
        noRules: [],
        notAllowed: [],
        exDonts: [],
        yesPolicies: [],
        noPolicies: [],
        selectedWeekdays: [],
        recommendations: [],
        notAllowedThirdParty: 0,
        guaranteed:[],
    },
    vendor_categories: [],
    allProperties: [],
    properties: {},
    images: {},
};

const getters = {
    getAllProperties: state => {
        return state.allProperties;
    },
    getPropertiesByCategory: state => category => { },
    getStatus: state => state.status,
    getVendor: state => state.vendor,
    getStep: state => state.step,
    validateBasicFields: state => {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
        const isValid =
            state.vendor.vendorMainEmail &&
            reg.test(state.vendor.vendorMainEmail) &&
            state.vendor.companyName &&
            state.vendor.vendorCategories &&
            state.vendor.vendorCategories.length > 0 &&
            state.vendor.vendorAddresses &&
            state.vendor.vendorAddresses.length > 0;

        if (!state.vendor.vendorCategories || state.vendor.vendorCategories.some(category => !category)) return false;
        if (!state.vendor.vendorAddresses || state.vendor.vendorAddresses.some(address => !address)) return false;
        return isValid;
    },
};
const actions = {
    getVendor: ({ commit, state }, vendorId) => {
        Vendors.find(vendorId).then((vendor) => {
            if (!vendor.services) Vue.set(vendor, "services", {});
            if (!vendor.about) Vue.set(vendor, "about", {});
            if (!vendor.capacity) Vue.set(vendor, "capacity", {});
            if (!vendor.social) Vue.set(vendor, "social", {});
            if (!vendor.images) Vue.set(vendor, "images", new Array(15));
            if (!vendor.hasOwnProperty("yesRules")) Vue.set(vendor, "yesRules", []);
            if (!vendor.hasOwnProperty("noRules")) Vue.set(vendor, "noRules", []);
            if (!vendor.hasOwnProperty("notAllowed")) Vue.set(vendor, "notAllowed", []);
            if (!vendor.hasOwnProperty("exDonts")) Vue.set(vendor, "exDonts", []);
            if (!vendor.pricingPolicies) Vue.set(vendor, "pricingPolicies", []);
            if (!vendor.guaranteed) Vue.set(vendor, "guaranteed", []);
            else {
                // check default policies and saved data on profile
                const vendorPricingPolicies = vendor.pricingPolicies;
                const defultPricingPolicies = VendorPricingPolicy.find(item => item.category === vendor.vendorCategory)
                const newPricingPolicies = []
                defultPricingPolicies.items.forEach((policyItem, index) => {
                    const appliedItem = vendorPricingPolicies.find(it => it.name === policyItem.name)
                    if (appliedItem) {
                        if (appliedItem.value)
                            policyItem.value = appliedItem.value
                        if (appliedItem.attendees)
                            policyItem.attendees = appliedItem.attendees
                        if (appliedItem.defaultQty)
                            policyItem.defaultQty = appliedItem.defaultQty
                        // appliedItem.hideOnProposal = policyItem.hideOnProposal
                        // appliedItem.labelForValue = policyItem.labelForValue
                        // appliedItem.isPercentage = policyItem.isPercentage
                        newPricingPolicies.push({ ...appliedItem, ...policyItem })
                    } else {
                        newPricingPolicies.push(policyItem)
                    }
                })
                console.log(newPricingPolicies)
                Vue.set(vendor, "pricingPolicies", newPricingPolicies);
            }
            if (!vendor.hasOwnProperty("policies")) Vue.set(vendor, "policies", []);
            if (!vendor.hasOwnProperty("yesPolicies")) Vue.set(vendor, "yesPolicies", []);
            if (!vendor.hasOwnProperty("noPolicies")) Vue.set(vendor, "noPolicies", []);
            if (!vendor.hasOwnProperty("selectedWeekdays")) Vue.set(vendor, "selectedWeekdays", []);
            if (!vendor.hasOwnProperty("dontWorkDays")) Vue.set(vendor, "dontWorkDays", []);
            if (!vendor.hasOwnProperty("dontWorkTime")) Vue.set(vendor, "dontWorkTime", null);
            if (!vendor.hasOwnProperty("services")) Vue.set(vendor, "services", {});
            commit("setVendor", vendor)
            commit("setEditing", true)
            // check if image is uploaded to S3
        });
    },
    fetchAllProperties: ({ commit, state }, categoryName) => {
        return new Promise((resolve, reject) => {
            // getting from store
            if (state.allProperties.length > 0) {
                if (!categoryName) {
                    resolve(state.allProperties);
                    return;
                }
                const vendersByCategory = state.allProperties.filter(item => {
                    return item.vendorCategories.indexOf(categoryName) >= 0;
                });
                resolve(vendersByCategory);
                return;
            }
            // getting from API
            getReq(`/1/vendorProperties`).then(res => {
                commit("setAllProperties", res.data);
                if (!categoryName) {
                    resolve(res.data);
                    return;
                }
                const vendersByCategory = res.data.filter(item => {
                    return item.vendorCategories.indexOf(categoryName) >= 0;
                });
                resolve(vendersByCategory ? vendersByCategory : []);
                return;
            });
        });
    },
    getProperties: ({ commit, state }, categoryName) => {
        if (!state[categoryName]) {
        }
    },
    getProfile: ({ commit, state }) => {
        Vendors.find("me").then(res => {
            commit("setProfile", res);
        });
    },
    saveVendor: ({ commit, state }, vendor) => {
        return new Promise((resolve, reject) => {
            new Vendors(vendor)
                .save()
                .then(res => {
                    commit("setVendor", { ...state.vendor, ...res.item });

                    resolve(res.item);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    uploadImage: async ({ commit, state, dispatch }, { index, file }) => {
        const fileId = `${new Date().getTime()}_${makeid()}`;
        const isAllImageUploaded = () => {
            return !state.vendor.images.some(img => img.indexOf("base64") >= 0);
        };
        S3Service.fileUpload(file, fileId, "vendor/cover-images").then(uploadedName => {
            console.log('uploadName', uploadedName);
            commit("replaceImage", {
                index,
                image: `${uploadedName}`,
            });
            if (isAllImageUploaded()) {
                new Vendors({ id: state.vendor.id, images: state.vendor.images }).save();
            }
        });

        const imageData = await getBase64(file);
        if (state.vendor.images.length == index) {
            commit("addImage", imageData);
        } else {
            commit("replaceImage", { index, image: imageData });
        }
    },
    checkImages({ commit, state, dispatch }) {
        const fileId = `${new Date().getTime()}_${makeid()}`;
        if (!state.vendor.images) return;
        state.vendor.images.forEach((imageData, index) => {
            if (imageData && imageData.indexOf("base64") >= 0) {
                const file = S3Service.dataURLtoFile(imageData, fileId);
                dispatch("uploadImage", { index, file });
            }
        });
    },
    searchVendor: ({ commit, state }, payload) => {
        return new Promise(async(resolve, reject) => {
            const query = new Vendors();
            const res = await query.params(payload).get();
            console.log('searchVendor',res);
            resolve(res[0].results);
        })
    },
};

const mutations = {
    setInitialState(state, data) {
        state.step = 0;
        state.vendor = {
            about: {},
            capacity: {},
            images: [],
            social: {},
            services: {},
            yesRules: [],
            noRules: [],
            notAllowed: [],
            exDonts: [],
            yesPolicies: [],
            noPolicies: [],
            selectedWeekdays: [],
            recommendations: [],
            guaranteed:[],
            notAllowedThirdParty: 0
        }
    },
    setAllProperties(state, data) {
        state.allProperties = data;
    },
    setStep(state, step) {
        state.step = step;
    },
    setEditing(state, editing) {
        state.isEditing = editing;
    },
    setLoading(state, value) {
        state.isLoading = value
    },
    setVendor(state, vendor) {
        state.vendor = vendor;
    },
    RESET(state) {
        state.status = null;
    },
    setField(state, { field, value }) {
        Vue.set(state.vendor, field, value);
    },
    addImage(state, image) {
        if (!state.vendor.images) {
            Vue.set(state.vendor, "images", []);
        }
        state.vendor.images.push(image);
    },
    removeImage(state, index) {
        state.vendor.images.splice(index, 1);
    },
    replaceImage(state, { index, image }) {
        const oldImages = [...state.vendor.images];
        oldImages[index] = image;
        Vue.set(state.vendor, "images", oldImages);
    },
};

export default {
    namespaced: true,
    state: { ...defaultState },
    getters,
    actions,
    mutations,
};
