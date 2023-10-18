import axios from 'axios'
import Industry from '@/models/Industry'
import Me from '@/models/Me'
import Customer from '@/models/Customer'
import Calendar from '@/models/Calendar'
import listMonth, { months_short } from '@/constants/month'
import { of } from 'rxjs'

function getReq(endpoint) {
  return axios({
    method: 'get',
    url: `${process.env.SERVER_URL}${endpoint}`,
    headers: { 'Authorization': `Bearer ${window.localStorage.getItem('manage_id_token')}` }
  })
}
function postReq(endpoint, data) {
  return axios({
    method: 'post',
    url: `${process.env.SERVER_URL}${endpoint}`,
    headers: { 'Authorization': `Bearer ${window.localStorage.getItem('manage_id_token')}` },
    data
  })
}
/*
company part - should post to `/1/onboarding/customer`
employee part - should post to `/1/onboarding/me`
List of industries get from: `/1/industries`
 */
// state

const state = {
  user: {},
  industry: [],
  customer: {},
  charts: {},
  upcomingEvents: [],
  company: {
    branches: []
  }
}

// getters
const getters = {
  getUser: (state, user, rootState) => {
    return state.user
  },
  getIndustryList: (state) => {
    return state.industry
  },
  getCompany: (state) => {
    return state.company
  },
  getCustomer: (state) => {
    return state.customer
  },
  getChartStatistics: (state) => state.charts,
  getUpcomingEvents: (state) => {
    return state.upcomingEvents
  },
  getChartNumberOfEventsPerYear: (state) => {
    if (state.charts.numberOfEventsPerYear) {
      const parse_data = []
      const parse_label = []
      if (state.charts.numberOfEventsPerYear) {
        const chart = state.charts.numberOfEventsPerYear
        for (let key in chart) {
          parse_label.push(key)
          parse_data.push(chart[key])
        }

        return {
          labels: parse_label,
          datasets: [{
            data: parse_data,
            pointBackgroundColor: 'white',
            pointStyle: 'circle',
            borderColor: [
              'white'
            ],
            borderWidth: 3
          }]
        }
      } else {
        return {
          labels: [],
          datasets: [{
            label: '# of type Events',
            data: [],
            backgroundColor: '#25d0a2'

          }]
        }
      }
    }
  },
  getChartEventPerEmployee: (state) => {
    const parse_data = []
    const parse_month = []

    if (state.charts.eventCostPerEmployeePerYearMonth) {
      const chart = state.charts.eventCostPerEmployeePerYearMonth

      for (let key in chart) {
        const moths = key.split('__')

        parse_month.push(months_short[moths[1] - 1])
        parse_data.push(chart[key])
      }

      if (parse_month.length < 6 && parse_data.length < 6) {
        return {
          labels: parse_month.sort(),
          datasets: [{
            data: parse_data.sort(),
            pointBackgroundColor: 'white',
            pointStyle: 'circle',
            borderColor: [
              'white'
            ],
            borderWidth: 3
          }]
        }
      } else {
        const arrLenght = parse_data.length - 6
        const dataCh = parse_data.sort().splice(arrLenght)
        const labemlCh = parse_month.sort().splice(arrLenght)
        return {
          labels: labemlCh,
          datasets: [{
            data: dataCh,
            backgroundColor: [
              'rgba(255, 255, 255, 0.2)'
            ],
            borderColor: [
              '#26cfa0'
            ],
            borderWidth: 1
          }]
        }
      }
    }
  },
  getChartEventsPerCategory: (state) => {
    const parse_data = []
    const parse_label = []
    if (state.charts.eventsPerCategory) {
      const chart = state.charts.eventsPerCategory
      for (let key in chart) {
        const moths = key.split('__')
        parse_label.push(key)
        parse_data.push(chart[key])
      }
      return {
        labels: parse_label,
        datasets: [{
          label: '# of type Events',
          data: parse_data,
          backgroundColor: 'white'

        }]
      }
    } else {
      return {
        labels: [],
        datasets: [{
          label: '# of type Events',
          data: [],
          backgroundColor: '#25d0a2'

        }]
      }
    }
  },
  getChartParticipantsPerEvent: (state) => {
    const currentYear = new Date().getFullYear()
    const months = listMonth
    let listRete = null
    if (state.charts.participantsPerEventPerYearMonthEventType) {
      const chart = state.charts.participantsPerEventPerYearMonthEventType

      let filterYear = null
      for (let key in chart) {
        if (key === currentYear) {
          filterYear = chart[key]
        }
      }
      listRete = months.map((item, index) => {
        for (let month in filterYear) {
          const currentObj = []
          if ((month - 1) === index) {
            const categori = filterYear[month]
            for (let key in categori) {
              const obj = {}
              obj['typeEvent'] = key
              obj['total'] = String(categori[key].Invited || 0)
              obj['currentValue'] = String(categori[key].Actual || 0)
              currentObj.push(obj)
            }
          } else {
            currentObj.push({ typeEvent: '', total: '', currentValue: '' })
          }
          return currentObj
        }
      })
    }

    return listRete
  },
  getChartSatisfactionRate: (state) => {
    const currentYear = new Date().getFullYear()
    const months = listMonth
    let listRete = null
    if (state.charts.satisfactionRatesPerYearMonth) {
      const chart = state.charts.satisfactionRatesPerYearMonth
      let filterYear = null
      for (let key in chart) {
        if (key === currentYear) {
          filterYear = chart[key]
        }
      }

      listRete = months.map((item, index) => {
        for (let month in filterYear) {
          const currentObj = []
          if ((month - 1) === index) {
            const categori = filterYear[month]
            for (let key in categori) {
              const obj = {}
              obj['category'] = key
              obj['total'] = '100'
              obj['currentValue'] = String(categori[key])
              currentObj.push(obj)
            }
          } else {
            const a = { category: '', total: '', currentValue: '' }
            currentObj.push(a)
          }
          return currentObj
        }
      })
    }

    return listRete
  }

}
// actions
const actions = {
  getUserFromApi({ commit, state }, data) {
    Me.get()
      .then(res => {
        if (res[0] && (res[0].pictureUrl === '' || res[0].pictureUrl === 'none')) {
          res[0].pictureUrl = 'https://static-maryoku.s3.amazonaws.com/storage/img/placeholder.jpg'
        }
        commit('setUser', res[0])
        commit('setCustomer', res[0].customer)
        Customer.find(res[0].customer.id)
          .then(res => commit)
          .catch(e => console.log(e, 'eto customer, error'))
        new Customer({ id: res[0].customer.id })
          .statistics()
          .get()
          .then(res => commit('setCustomerChart', res[0]))
          .catch(e => console.log(e, 'chart api errors'))

        let _calendar = new Calendar({ id: res[0].defaultCalendarId })

        _calendar.calendarEvents().get().then(events => {
          let upcomingEvents = events.reduce(function (result, element) {
            // TODO : Eyal, Please notice that the status not returned
            // if (element.status && element.status.toLowerCase() !== 'done') {
            //   result.push(element);
            // }
            result.push(element)

            return result
          }, [])
          commit('setUpcomingEvents', upcomingEvents)
        })
      }

      )
      .catch(e => console.log(e))
  },
  async getIndustry({ commit, state }) {
    Industry
      .get()
      .then(res => {
        commit('setIndustries', res)
      })
      .catch(e => {
        commit('setIndustries', [])
      })
  },
  async sendCompanyInfo({ commit, state }, info) {
    try {
      const res = await postReq('/1/onboarding/me', info)
    } catch (e) {

    }
  },
  async sendOMInfo({ commit, state }, om) {
    try {
      const res = await postReq('/1/onboarding/customer', om)
    } catch (e) {

    }
  },
  async sendEvent({ commit, state }, event) {
    try {
      const res = await postReq('/1/onboarding/me', event)
    } catch (e) {

    }
  },
  async sendDietary({ commit, state }, dietary) {
    try {
      const res = await postReq('/1/onboarding/me', dietary)
    } catch (e) {

    }
  },
  async sendInvitation({ commit, state }, email) {
    try {
      const res = await postReq('/1/onboarding/me', email)
    } catch (e) {

    }
  },
  async sendIndustry({ commit, state }, branch) {
    try {
      //    const res=await postReq('/1/onboarding/me',email)
      commit('addBranch', branch)
    } catch (e) {

    }
  },
  async editBranchAddress({ commit, state }, payload) {
    try {
      commit('editBranch', payload)
    } catch (e) {
      console.log(e)
    }
  },
  async deleteBranchToCompany({ commit, state }, branch) {
    try {
      commit('deleteBranch', branch)
    } catch (e) {
      console.log(e)
    }
  },
  putUserFromApi({ commit, state }, data) {
    console.log(data, 'putUserFromApi')
    if (data['phoneNumber']) {
      new Me({ ...data }).save().then(res => {
        commit('setUser', res)
      })
        .catch(e => console.log(e, 'false user'))
      return
    }

    new Customer({ ...data }).save().then(res => {
      Me.get()
        .then(res => {
          commit('setUser', res[0])
          commit('setCustomer', res[0].customer)
          Customer.find(res[0].customer.id)
            .then(res => commit)
            .catch(e => console.log(e, 'eto customer, error'))
        }

        )
        .catch(e => console.log(e))
    })
      .catch(e => console.log(e, 'false customer'))
  },
  getChartsFromApi({ commit, state }, id) {
    new Customer({ id: id })
      .statistics()
      .get()
      .then(res => commit('setCustomerChart', res[0]))
      .catch(e => console.log(e, 'chart api errors'))
  }

}

// mutations
const mutations = {

  setUser(state, data) {
    state.user = data
  },
  setIndustries(state, industry) {
    state.industry = industry
  },
  setCustomer(state, customer) {
    state.customer = customer
  },
  addBranch(state, industry) {
    state.customer.branches.push(industry)
  },
  deleteBranch(state, branchIndex) {
    const updatedBranches = state.customer.branches.filter((item, index) => index !== branchIndex)
    state.customer.branches = updatedBranches
  },
  editBranch(state, branchInfo) {
    let editedBranches = state.customer.branches.slice()
    editedBranches[branchInfo.index].onelineAddress = branchInfo.newAddress
    state.customer.branches = editedBranches
  },
  setCustomerChart(state, charts) {
    state.charts = charts
  },
  setUpcomingEvents(state, data) {
    state.upcomingEvents = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
