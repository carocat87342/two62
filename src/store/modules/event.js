import Vue from "vue";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventNote from "@/models/EventNote";
import Currency from "@/models/Currency";
import EventTheme from "@/models/EventTheme";
import EventComponent from "@/models/EventComponent";
import { postReq, getReq } from "@/utils/token";
import EventTimelineDate from "@/models/EventTimelineDate";
import Proposal from "@/models/Proposal";

const state = {
    currentUser: {},
    param1: "test param",
    eventData: {
        id: null,
        occasion: "",
        occasionCache: "",
        title: "",
        date: null,
        time: "",
        duration: "",
        numberOfParticipants: "",
        status: "draft",
        totalBudget: "",
        currency: "",
        location: "",
        eventType: null,
        category: null,
        components: null,
        componentComponents: [],
    },
    initBookingRequirements: {},
    bookingRequirements: {},
    checkList: [],
    components: [],
    notes: [],
    commentComponents: [],
    comments: {}, // The object for comments { componentId: commentslist<EventComment> }
    vendorsList: null,
    currencies: [],
    categories: [],
    eventTypes: [],
    eventThemes: [],
    calendarId: null,
    timelineDates: [],
    requirements: null,
    requirementsForVendor: {},
    budgetNotification: [],
    proposals: {},
};

const getters = {
    getCurrenciesList: state => {
        return state.currencies;
    },
    getCategoriesList: state => {
        return state.categories;
    },
    getEventTypesList: state => {
        return state.eventTypes;
    },
    getEventThemesList: state => {
        return state.eventThemes;
    },
    getComponentsList: state => {
        return state.components;
    },
    getBookingRequirements: state => {
        return state.bookingRequirements;
    },
    budgetStatistics: state => {
        const allocatedBudget = state.eventData.components.reduce((s, item) => {
            return s + item.allocatedBudget;
        }, 0);
        const bookedBudget = state.eventData.components.reduce((s, item) => {
            return s + item.bookedBudget;
        }, 0);
        const savedBudget = state.eventData.components.reduce((s, item) => {
            if (item.bookedBudget) {
                return s + (item.allocatedBudget - item.bookedBudget);
            } else {
                return s;
            }
        }, 0);
        return {
            total: state.eventData.totalBudget,
            allocated: allocatedBudget,
            allocatedPercentage: ((allocatedBudget * 100) / state.eventData.totalBudget).toFixed(1),
            booked: bookedBudget,
            bookedPercentage: ((bookedBudget * 100) / state.eventData.totalBudget).toFixed(1),
            saved: savedBudget,
        };
    },
    showBudgetNotification: state => {
        return state.budgetNotification;
    },
};
const actions = {
    saveEventAction({ commit, state, dispatch }, event) {
        return new Promise((resolve, reject) => {
            console.log('saveEventAction', event)
            event
                // .for(event.calendar)
                .save()
                .then(res => {
                    console.log('event', res);
                    commit("setEventData", res);
                    dispatch("getTimelineDates", event.id);
                    resolve(event);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    getEventAction({ commit, state, dispatch }, { eventId }) {
        return new Promise((resolve, reject) => {
            CalendarEvent.find(eventId).then(event => {
                commit("initEventData");
                commit("setEventData", event);
                dispatch("getTimelineDates", event.id);
                resolve(event);
            });
        });
    },
    getEventById({ commit, state }, eventId) {
        return new Promise((resolve, reject) => {
            CalendarEvent.find(eventId).then(event => {
                commit("setEventData", event);
                resolve(event);
            });
        });
    },
    getEventThemes({ commit, state }, ctx) {
        new EventTheme()
            .fetch(ctx, false)
            .then(res => {
                commit("setEventThemes", res);
            })
            .catch(e => {
                commit("setEventThemes", []);
            });
    },
    async getCurrencies({ commit, state }, ctx) {
        new Currency()
            .fetch(ctx, false)
            .then(res => {
                commit("setCurrencies", res);
            })
            .catch(e => {
                commit("setCurrencies", []);
            });
    },
    async getCategories({ commit, state }, { data, ctx }) {
        let _calendar = new Calendar({ id: data });
        _calendar
            .categories()
            .fetch(ctx, false)
            .then(res => {
                commit("setCategories", res);
            })
            .catch(e => {
                commit("setCategories", []);
            });
    },
    async getEventTypes({ commit, state }, { data, ctx }) {
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
    async getComponents({ commit, state }, ctx) {
        new EventComponent()
            .fetch(ctx, false)
            .then(res => {
                commit("setComponents", res);
            })
            .catch(e => {
                commit("setComponents", []);
            });
    },

    /** Notes */
    async getEventNotes({ commit, state }, data) {
        const calendarId = state.eventData.calendar.id;
        const eventId = state.eventData.id;
        const calendar = new Calendar({ id: calendarId });
        const event = new CalendarEvent({ id: eventId });
        const filters = data.filters || [];
        const res = await postReq(`/1/calendars/${calendarId}/events/${eventId}/notes/search`, { filters: filters });
        commit("setEventNotes", res.data);

        // new EventNote()
        //   .where("test","test")
        //   .for(calendar, event)
        //   .get()
        //   .then(notes => {
        //     commit('setEventNotes', notes)
        //   });
    },
    async addEventNote({ commit, state }, note) {
        const calendarId = state.eventData.calendar.id;
        const eventId = state.eventData.id;
        const calendar = new Calendar({ id: calendarId });
        const event = new CalendarEvent({ id: eventId });
        new EventNote(note)
            .for(calendar, event)
            .save()
            .then(res => {
                if (!note.id) {
                    const notes = [...state.notes, res];
                    commit("setEventNotes", notes);
                } else {
                    const index = state.notes.findIndex(item => item.id === note.id);
                    commit("updateEventNote", { index, note });
                }
            });
    },
    async removeNote({ commit, state }, note) {
        const index = state.notes.findIndex(item => item.id === note.id);
        commit("removeEventNote", { index, note });
    },

    async updateEventNote({ commit, state }, note) {
        const calendarId = state.eventData.calendar.id;
        const eventId = state.eventData.id;
        const calendar = new Calendar({ id: calendarId });
        const event = new CalendarEvent({ id: eventId });
        new EventNote(note)
            .for(calendar, event)
            .save()
            .then(res => {
                const index = state.notes.findIndex(item => item.id === note.id);
                commit("updateEventNote", { index, note });
            });
    },
    getTimelineDates({ commit, state }, eventId) {
        return new Promise((resolve, reject) => {
            new EventTimelineDate()
                .for(new CalendarEvent({ id: eventId }))
                .get()
                .then(res => {
                    commit("setTimelineDates", res);
                });
        });
    },

    getRequirements({ commit, state }) {
        const eventId = state.eventData.id
        return new Promise((resolve, reject) => {
            if (state.requirements) {
                resolve(state.requirements)
            } else {
                getReq(`/1/vendor/property?eventId=${eventId}`).then((res) => {
                    commit("setRequirements", res.data)
                    resolve(res.data)
                }).catch(e => {
                    reject(e)
                });
            }
        })
    },

    getProposals({ commit, state }, payload) {
        return new Promise((resolve, reject) => {
            new Proposal()
                .params(payload)
                .get()
                .then((result) => {
                    state.eventData.components.map(c => {
                        let proposals = result.filter(it => it.eventComponentId == c.id) || [];
                        commit("setProposalsByCategory", { category: c.componentId, proposals });
                    })
                    resolve(result)
                })
        })
    },
    updateProposal({ commit, state }, payload) {
        console.log('updateProposal', payload);
        return new Promise((resolve, reject) => {
            new Proposal({ ...payload.proposal })
                .save()
                .then((result) => {
                    let proposals = state.proposals[payload.category];
                    if (proposals) {
                        let index = proposals.findIndex(p => p.id == payload.proposal.id);
                        console.log(payload.category, index, payload.proposal);
                        Vue.set(proposals, index, result)
                        commit("setProposalsByCategory", { category: payload.category, proposals });
                    }
                    resolve(result)
                })
        })
    }
};

const mutations = {
    initEventData(state) {
        state.eventData = {};
    },
    setEventData(state, eventData) {
        state.eventData = { ...state.eventData, ...eventData };
    },
    setCurrencies(state, currencies) {
        state.currencies = currencies;
    },
    setCategories(state, categories) {
        state.categories = categories;
    },
    setEventTypes(state, eventTypes) {
        state.eventTypes = eventTypes;
    },
    setEventThemes(state, eventThemes) {
        state.eventThemes = eventThemes;
    },
    setComponents(state, components) {
        state.components = components;
    },
    setInitBookingRequirements(state, requirements) {
        state.initBookingRequirements = requirements;
    },
    setBookingRequirements(state, requirements) {
        state.bookingRequirements = requirements;
    },
    setEventNotes(state, notes) {
        state.notes = notes;
    },

    updateEventNote(state, { index, note }) {
        state.notes[index] = note;
    },
    removeEventNote(state, { index, note }) {
        state.notes.splice(index, 1);
    },
    updateComponent(state, params) {
        state.eventData.components.push(params);
    },
    setTimelineDates(state, data) {
        state.timelineDates = data;
        Vue.set(state.eventData, "timelineDates", data);
    },
    setRequirements(state, data) {
        state.requirements = data
    },
    setRequirementsForVendor(state, data) {
        Vue.set(state.requirementsForVendor, data.category, data.requirements)
    },
    setSubCategory(state, data) {
        Vue.set(state.requirementsForVendor[data.category], data.subCategory, data.items)
    },
    setRequirementTypes(state, data) {
        if (!state.requirementsForVendor[data.category]) {
            Vue.set(state.requirementsForVendor, data.category, {})
        }
        if (!state.requirementsForVendor[data.category].types) {
            Vue.set(state.requirementsForVendor[data.category], 'types', {})
        }
        Vue.set(state.requirementsForVendor[data.category].types, data.type, data.services)
    },
    setBudgetNotification(state, event_id) {
        state.budgetNotification.push(event_id);
    },
    setProposalsByCategory(state, { category, proposals }) {
        Vue.set(state.proposals, category, proposals);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
