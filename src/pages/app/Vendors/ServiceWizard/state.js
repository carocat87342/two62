import Vue from "vue";
import { postReq, getReq } from "@/utils/token";
import Vendors from "@/models/Vendors";
import S3Service from "@/services/s3.service";
import { makeid } from "@/utils/helperFunction";
import { getBase64 } from "@/utils/file.util";
const state = {
    isEditing: false,
    step: 1,
    status: null,
    vendor: {},
    service: {
        services: {},
        images: []
    }
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
            return !state.service.images.some(img => img.indexOf("base64") >= 0);
        };
        S3Service.fileUpload(file, fileId, "vendor/cover-images").then(uploadedName => {
            commit("replaceImage", {
                index,
                image: `${uploadedName}`,
            });
            if (isAllImageUploaded()) {
                new Vendors({ id: state.vendor.id, images: state.vendor.images }).save();
            }
        });

        const imageData = await getBase64(file);
        if (state.service.images.length == index) {
            commit("addImage", imageData);
        } else {
            commit("replaceImage", { index, image: imageData });
        }
    },
    checkImages({ commit, state, dispatch }) {
        const fileId = `${new Date().getTime()}_${makeid()}`;
        if (!state.service.images) return;
        state.service.images.forEach((imageData, index) => {
            if (imageData && imageData.indexOf("base64") >= 0) {
                const file = S3Service.dataURLtoFile(imageData, fileId);
                dispatch("uploadImage", { index, file });
            }
        });
    },
};

const mutations = {
    initState(state) {
        state.isEditing = false;
        state.step = 1;
        state.service = {
            services: {},
            images: []
        }
        state.vendor = {}
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
    setVendor(state, vendor) {
        state.vendor = vendor;
    },
    setService(state, service) {
        state.service = service;
    },

    setField(state, { field, value }) {
        Vue.set(state.service, field, value);
    },
    addImage(state, image) {
        if (!state.service.images) {
            Vue.set(state.service, "images", []);
        }
        state.service.images.push(image);
    },
    removeImage(state, index) {
        state.service.images.splice(index, 1);
    },
    replaceImage(state, { index, image }) {
        const oldImages = [...state.service.images];
        oldImages[index] = image;
        Vue.set(state.service, "images", oldImages);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
