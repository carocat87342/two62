import Vue from "vue";

import { postReq, getReq } from "@/utils/token";
import Vendors from "@/models/Vendors";
import VendorService from "@/models/VendorService";
import S3Service from "@/services/s3.service";
import { makeid } from "@/utils/helperFunction";
import { getBase64 } from "@/utils/file.util";
import ProposalRequest from "@/models/ProposalRequest";
import { reject } from "promise-polyfill";
const state = {
    isEditing: false,
    step: 0,
    status: null,
    vendor: {
        vendorImages: [],
    },
    vendor_categories: [],
    vendors: [],
    allProperties: [],
    properties: {},
    profile: null,
    proposalRequests: [],
};

const getters = {
    getAllProperties: state => {
        return state.allProperties;
    },
    getPropertiesByCategory: state => category => { },
    getStatus: state => state.status,

    getRoading: state => state.loading,

    getVendorCategories: state => state.vendor_categories,

    getVendors: state => state.vendors,

    getVendor: state => state.vendor,

    getStep: state => state.step,
};

const actions = {
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
        return new Promise((resolve, reject) => {
            Vendors.find("me").then(res => {
                commit('setProfile', res);
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    },
    updateProfile: ({ commit, state }, profileData) => {
        new Vendors(profileData).save().then(res => {
            commit('setProfile', res.item);
        })
    },
    addServiceImage: async ({ commit, state, dispatch }, { vendorId, file, images, serviceId }) => {
        return new Promise((resolve, reject) => {
            const fileId = `${new Date().getTime()}_${makeid()}`;
            const index = images.length;
            const isAllImageUploaded = () => {
                return !images.some((img) => img.indexOf("base64") >= 0);
            }
            S3Service.fileUpload(file, fileId, "vendor/cover-images").then((uploadedName) => {
                images[index] = `https://maryoku.s3.amazonaws.com/vendor/cover-images/${uploadedName}`;
                if (isAllImageUploaded()) {
                    if (!serviceId) {
                        new Vendors({ id: vendorId, images: images }).save().then(res => {
                            resolve(res.item.images)
                            dispatch("getProfile")
                        });
                    } else {
                        new VendorService({ id: serviceId, images: images }).for(new Vendors({ id: vendorId })).save().then(res => {
                            resolve(res.item.images)
                            dispatch("getProfile")
                        });
                    }
                }
            });
        })

    },
    updateServiceImage: async ({ commit, state, dispatch }, { vendorId, index, file, images, serviceId }) => {
        return new Promise((resolve, reject) => {
            const fileId = `${new Date().getTime()}_${makeid()}`;
            console.log(file)
            const isAllImageUploaded = () => {
                return !images.some((img) => img.indexOf("base64") >= 0);
            }
            S3Service.fileUpload(file, fileId, "vendor/cover-images").then((uploadedName) => {
                console.log("createImage", uploadedName);
                images[index] = `https://maryoku.s3.amazonaws.com/vendor/cover-images/${uploadedName}`;
                if (isAllImageUploaded()) {
                    if (!serviceId) {
                        new Vendors({ id: vendorId, images }).save().then(res => {
                            resolve(res.item.images)
                            dispatch("getProfile")
                        });
                    } else {
                        new VendorService({ id: serviceId, images: images }).for(new Vendors({ id: vendorId })).save().then(res => {
                            resolve(res.item.images)
                            dispatch("getProfile")
                        });
                    }
                }
            });
        })

    },
    removeServiceImage: async ({ commit, state, dispatch }, { vendorId, index, images, serviceId }) => {
        new Promise((resolve, reject) => {
            images.splice(index, 1)
            if (!serviceId) {
                new Vendors({ id: vendorId, images }).save().then(res => {
                    resolve(res.item.images)
                    dispatch("getProfile")
                });
            } else {
                new VendorService({ id: serviceId, images: images }).for(new Vendors({ id: vendorId })).save().then(res => {
                    resolve(res.item.images)
                    dispatch("getProfile")
                });
            }
        })
    },
    updateCoverImage: async ({ commit, state, dispatch }, { vendorId, serviceId, file }) => {
        const fileId = `${new Date().getTime()}_${makeid()}`;
        new Promise(async (resovle, reject) => {
            let coverImage = await S3Service.fileUpload(file, fileId, "vendor/cover-images");

            if (!serviceId) {
                new Vendors({ id: vendorId, coverImage }).save().then(res => {
                    commit('setProfile', res.item)
                });
            } else {
                new VendorService({ id: serviceId, coverImage }).for(new Vendors({ id: vendorId })).save().then(res => {

                });
            }
        })

    },
    updateService: ({ commit, state }, { vendorId, serviceData }) => {
        new VendorService(serviceData).for(new Vendors({ id: vendorId })).save().then(res => {

        });
    },
    getProposalRequests({ commit, state }) {
        new ProposalRequest().for(new Vendors({ id: state.profile.id })).get().then(proposalRequests => {
            commit("setProposalRequests", proposalRequests)
        })
    }
};

const mutations = {
    setAllProperties(state, data) {
        state.allProperties = data;
    },
    SET_LOADING(state) {
        state.loading = true;
    },
    GET_VENDORS(state, data) {
        state.loading = false;
        state.vendors = data.vendors;
        state.vendor_categories = data.vendor_categories;
    },
    setStep(state, step) {
        state.step = step;
    },
    setEditing(state, editing) {
        state.isEditing = editing;
    },
    setVendor(state, vendor) {
        state.vendor = vendor;
    },
    SET_DATA(state, data) {
        state.vendor = data;
        state.status = { code: 200, title: "Success to save!", message: "Your vendor is saved successfully." };
    },
    FAILED(state, message) {
        state.status = { code: 500, title: "Failed to save!", message: "Sorry, we can't save your vendor." };
    },
    RESET(state) {
        state.status = null;
    },
    setProfile(state, vendorProfile) {
        Vue.set(state, "profile", vendorProfile)
    },
    setProposalRequests(state, proposalRequests) {
        Vue.set(state, "proposalRequests", proposalRequests)
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
