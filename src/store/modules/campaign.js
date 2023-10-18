import Vue from "vue";
import Campaign from "@/models/Campaign";
import CalendarEvent from "@/models/CalendarEvent";
const defaultSettings = {
    phone: {
        selected: false,
        numberString: "",
        numberArray: [],
        excelFileName: "",
        excelFilePath: "",
        smsOrWhatsapp: "sms",
        sentTime: new Date().getTime(),
    },
    email: {
        selected: false,
        subject: "",
        from: "",
        addressString: "",
        addressArray: [],
        excelFileName: "",
        excelFilePath: "",
        sentTime: new Date().getTime(),
    },
};
const defaultCampaignData = {
    initialized: false,
    SAVING_DATE: {
        title: "Event Name",
        description:
            "Clear your schedule and get ready to mingle! the greatest event of the year is coming up! more details are yet to come, but we can already promise you it's going to be an event to remember. be sure to mark the date on your calendar. you can do it using this link: (google calendar link). see ya soon",
        coverImage: `https://static-maryoku.s3.amazonaws.com/storage/Campaign+Headers/save-the-date${(new Date().getDate() %
            2) +
            1}.png`,
        logoUrl: "",
        campaignStatus: "EDITING",
        visibleSettings: {
            showLogo: true,
        },
    },
    RSVP: {
        title: "Event Name",
        description: "",
        coverImage: "",
        defaultCoverImage: `https://static-maryoku.s3.amazonaws.com/storage/Campaign+Headers/rsvp${(new Date().getDate() %
            2) +
            1}.png`,
        campaignStatus: "EDITING",
        allowOnline: false,
        logoUrl: "",
        visibleSettings: {
            showWearingGuide: true,
            showKnowledge: true,
            showTimeline: true,
        },
        additionalData: {
            greetingWords: "",
            wearingGuide: "",
            wearingGuideTitle: "WHAT SHOULD I WEAR?",
            knowledge: "",
            knowledgeTitle: "WHAT SHOULD I KNOW?",
            zoomlink: "",
            prefixEvent: "YOU ARE INVITED TO",
            carouselTitle: "ADD YOUR TITLE HERE",
        },
        images: [
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+81.jpg`,
                default: true,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/shutterstock_444402799_thumb.jpg`,
                default: true,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+83.jpg`,
                default: true,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+84.jpg`,
                default: true,
            },
        ],
    },
    COMING_SOON: {
        title: "Event Name",
        description: "",
        logoUrl: "",
        coverImage: `https://static-maryoku.s3.amazonaws.com/storage/Campaign+Headers/coming-soon${(new Date().getDate() %
            4) +
            1}.png`,
        campaignStatus: "EDITING",
        visibleSettings: {
            showLogo: true,
            showComing: true,
            showCountdown: true,
        },
    },
    FEEDBACK: {
        name: "Event Name",
        description: "",
        logoUrl: "",
        campaignStatus: "EDITING",
        visibleSettings: {
            showImages: true,
            showSharingOption: true,
            showFeedback: true,
            allowUploadPhoto: true,
        },
        images: [
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+81.jpg`,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/shutterstock_444402799_thumb.jpg`,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+83.jpg`,
            },
            {
                src: `https://static-maryoku.s3.amazonaws.com/storage/icons/RSVP/Image+84.jpg`,
            },
        ],
        files: [],
        feedbackQuestions: [
            {
                question: "What did you like or dislike about this event?",
                showQuestion: true,
                rank: 0,
                icon: "",
            },
            {
                question: "What did you think of the venue?",
                showQuestion: true,
                rank: 0,
                icon: "venuerental",
            },
            {
                question: "How did you like the catering service?",
                showQuestion: true,
                rank: 0,
                icon: "foodandbeverage",
            },
            {
                question: "Did you enjoy the activity?",
                showQuestion: true,
                rank: 0,
                icon: "decor",
            },
        ],
    },
};
const state = {
    baseInfo: {
        title: "",
        logoUrl: "",
    },
    SAVING_DATE: null,
    RSVP: null,
    COMING_SOON: null,
    FEEDBACK: null,
    SAVING_DATE_BACKUP: null,
    RSVP_BACKUP: null,
    COMING_SOON_BACKUP: null,
    FEEDBACK_BACKUP: null,
};

const mutations = {
    setCampaign(state, { name, data }) {
        Vue.set(state, name, data);
    },
    setBackupCampaign(state, { name, data }) {
        Vue.set(state, `${name}_BACKUP`, data);
    },
    setAttribute(state, { name, key, value }) {
        Vue.set(state[name], key, value);
    },
    initCampaign(state) {
        Vue.set(state, "SAVING_DATE", null);
        Vue.set(state, "RSVP", null);
        Vue.set(state, "COMING_SOON", null);
        Vue.set(state, "FEEDBACK", null);
    },
    setInitialized(state, value) {
        Vue.set(state, "initialized", value);
    },
    setAddtionalData(state, { name, key, value }) {
        if (!state[name].additionalData) {
            Vue.set(state[name], "additionalData", {});
        }
        Vue.set(state[name].additionalData, key, value);
    },
};
const getters = {
    campaignIssued(state) {
        return {
            SAVING_DATE: state["SAVING_DATE"] && state["SAVING_DATE"].campaignStatus === "STARTED",
            RSVP: state["RSVP"] && state["RSVP"].campaignStatus === "STARTED",
            COMING_SOON: state["COMING_SOON"] && state["COMING_SOON"].campaignStatus === "STARTED",
            FEEDBACK: state["FEEDBACK"] && state["FEEDBACK"].campaignStatus === "STARTED",
        };
    },
    defaultSettings(state) {
        if (state["SAVING_DATE"] && state["SAVING_DATE"].settings) {
            return state["SAVING_DATE"].settings;
        }
        if (state["RSVP"] && state["RSVP"].settings) {
            return state["RSVP"].settings;
        }
        if (state["COMING_SOON"] && state["COMING_SOON"].settings) {
            return state["COMING_SOON"].settings;
        }
        if (state["FEEDBACK"] && state["FEEDBACK"].settings) {
            return state["FEEDBACK"].settings;
        }
        return defaultSettings;
    },
};
const actions = {
    getCampaigns({ commit, state }, { event }) {
        return new Promise((resolve, reject) => {
            if (state.initialized) {
                resolve(state);
                return;
            }
            new Campaign()
                .for(new CalendarEvent({ id: event.id }))
                .get()
                .then(res => {
                    const campaigns = {};
                    let logoUrl = "";
                    if (res.length > 0) {
                        res.forEach(campaign => {
                            commit("setCampaign", {
                                name: campaign.campaignType,
                                data: campaign,
                            });
                            if (campaign.logoUrl) logoUrl = campaign.logoUrl;
                            campaigns[campaign.campaignType] = campaign;
                        });
                    }
                    const eventName = event.concept ? event.concept.name : "Event Name";
                    const defaultData = {
                        title: eventName,
                        // description: "",
                        logoUrl,
                    };
                    if (!campaigns["SAVING_DATE"]) {
                        commit("setCampaign", {
                            name: "SAVING_DATE",
                            data: { ...defaultCampaignData["SAVING_DATE"], ...defaultData },
                        });
                        commit("setBackupCampaign", {
                            name: "SAVING_DATE",
                            data: { ...defaultCampaignData["SAVING_DATE"], ...defaultData },
                        });
                    } else {
                        defaultData.title = campaigns["SAVING_DATE"].title;
                    }
                    if (!campaigns["RSVP"]) {
                        const rsvpData = { ...defaultCampaignData["RSVP"], ...defaultData };
                        if (event.places && event.places.includes("VIRTUAL")) {
                            rsvpData.allowOnline = true;
                        }
                        commit("setCampaign", {
                            name: "RSVP",
                            data: rsvpData,
                        });
                        commit("setBackupCampaign", {
                            name: "RSVP",
                            data: rsvpData,
                        });
                    }
                    if (!campaigns["COMING_SOON"]) {
                        commit("setCampaign", {
                            name: "COMING_SOON",
                            data: { ...defaultCampaignData["COMING_SOON"], ...defaultData },
                        });
                        commit("setBackupCampaign", {
                            name: "COMING_SOON",
                            data: { ...defaultCampaignData["COMING_SOON"], ...defaultData },
                        });
                    }
                    if (!campaigns["FEEDBACK"]) {
                        commit("setCampaign", {
                            name: "FEEDBACK",
                            data: { ...defaultCampaignData["FEEDBACK"], ...defaultData },
                        });
                        commit("setBackupCampaign", {
                            name: "FEEDBACK",
                            data: { ...defaultCampaignData["FEEDBACK"], ...defaultData },
                        });
                    }
                    commit("setInitialized", true);
                    resolve(campaigns);
                });
        });
    },
    saveCampaign({ commit, state }, data) {
        return new Promise((resolve, reject) => {
            const campaign = new Campaign(data);
            campaign.save().then(res => {
                console.log("camppaignData", res.item);
                commit("setCampaign", {
                    name: res.item.campaignType,
                    data: res.item,
                });
                resolve(res);
            });
        });
    },
    revertCampaign({ commit, state }, name) {
        const backupdata = state[`${name}_BACKUP`];
        commit("setCampaign", {
            name: name,
            data: Object.assign({}, backupdata),
        });
    },
    setLogo({ commit, state }, { logoUrl, campaign }) {
        commit("setAttribute", {
            name: "SAVING_DATE",
            key: "logoUrl",
            value: logoUrl,
        });
        commit("setAttribute", {
            name: "RSVP",
            key: "logoUrl",
            value: logoUrl,
        });
        commit("setAttribute", {
            name: "COMING_SOON",
            key: "logoUrl",
            value: logoUrl,
        });
        commit("setAttribute", {
            name: "FEEDBACK",
            key: "logoUrl",
            value: logoUrl,
        });
    },
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
