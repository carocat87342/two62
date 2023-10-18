import moment from 'moment'

export default {
  namespaced: true,
  state() {
    return {
      publicEventData: {
        id: null,
        dateData: {},
        numberOfParticipants: 0,
        guestType: "",
        location: "",
        locationId: "",
        places: [],
        occasion: '',
        occasionCache: '',
        title: '',
        eventStartMillis: null,
        theme: '',
        time: '',
        duration: '',
        status: 'draft',
        totalBudget: '',
        currency: '',
        eventType: '',
        eventTheme: null,
        category: null,
        expectingPeople: null,
        eventTime: null,
        eventPlaceNeeded: false,
        flexibleWithDates: false,
        eventSongId: null,
        eventDayPart: null,
        internalEvent: false,
        expectedAttendacePercent: null,
        eventMovieId: null,
        eventNeededServices: null,
        guestTypes: null,
        guestGroupName: ""
      },
      eventDecisionFactors: {
        eventDecisionFactor1: 50,
        eventDecisionFactor2: 50,
        eventDecisionFactor3: 50,
        eventDecisionFactor4: 50
      },
      shoWSignupModal: false,
      currentStep: '/create-event-wizard'
    }
  },

  mutations: {
    setSingupModal(state, data) {
      state.shoWSignupModal = data.showModal
    },
    setCurrentStep(state, data) {
      state.currentStep = data.currentPage
    },
    setEventProperty(state, { key, actualValue }) {
      state.publicEventData[key] = actualValue
    },
    setEventDecisionFactor(state, { key, actualValue }) {
      state.eventDecisionFactors[key] = actualValue
    },
    setEventData(state, data) {
      state.publicEventData['id'] = data.id
      state.publicEventData['occasion'] = data.occasion ? data.occasion : state.eventData['occasion']
      state.publicEventData['occasionCache'] = state.eventData['occasion']
      state.publicEventData['theme'] = data.theme
      state.publicEventData['title'] = data.title
      state.publicEventData['numberOfParticipants'] = data.numberOfParticipants
      state.publicEventData['totalBudget'] = data.totalBudget
      state.publicEventData['currency'] = data.currency
      state.publicEventData['eventType'] = data.eventType
      state.publicEventData['eventStartMillis'] = data.eventStartMillis
      state.publicEventData['category'] = data.category
      state.publicEventData['time'] = moment(data.eventStartMillis).format('h:00 A')
      state.publicEventData['duration'] = moment(data.eventEndMillis).diff(data.eventStartMillis, 'hours')
    }
  }
}
