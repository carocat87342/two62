<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />
  </div>
</template>

<script>
// MAIN MODULES
import ChartComponent from '@/components/Cards/ChartComponent'
// import auth from '@/auth'
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import EventPlannerVuexModule from './EventPlanner.vuex'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

// COMPONENTS
import { AnimatedNumber } from '@/components'
import Icon from '@/components/Icon/Icon.vue'
import { Collapse } from '@/components'

// EVENT COMPONENTs
import EventBanner from './components/EventBlocks/EventBanner.vue'
import EventTabs from './components/EventBlocks/EventTabs.vue'
import EventImages from './components/EventBlocks/EventImages.vue'
import EventQuestionsAnswers from './components/EventBlocks/EventQuestionsAnswers.vue'
import EventTimeLineItems from './components/EventBlocks/EventTimelineItems.vue'
import PublishEventModal from './components/EventBlocks/Modals/PublishEvent.vue'

export default {
  props: {
    event: {
      type: Object,
      default: null
    }
  },
  components: {
    VueElementLoading,
    ChartComponent,
    AnimatedNumber,
    Icon,
    Collapse,
    EventBanner,
    EventTabs,
    EventImages,
    EventQuestionsAnswers,
    EventTimeLineItems,
    PublishEventModal
  },

  data () {
    return {
      calendarEvent: {},
      seriesData: [],
      isLoading: false
    }
  },
  created () {
    this.$store.registerModule('EventPlannerVuex', EventPlannerVuexModule)
  },
  mounted () {
    if (this.event) {
      this.calendarEvent = this.event
    } else {
      this.getEvent()
    }

    this.$root.$on('refreshEvent', () => {
      this.getEvent()
    })
  },
  methods: {
    ...mapMutations('EventPlannerVuex', [
      'setEventPageData',
      'setEventPageProperty',
      'setPublishEventModal'
    ]),
    getEvent () {
      this.isLoading = true
      this.$auth.currentUser(
        this,
        true,
        function () {
          let _calendar = new Calendar({
            id: this.$auth.user.defaultCalendarId
          })

          _calendar
            .calendarEvents()
            .find(this.$route.params.id)
            .then(event => {
              this.calendarEvent = event.for(_calendar)
              this.totalRemainingBudget =
                event.totalBudget - event.allocatedBudget
              this.percentage =
                100 -
                ((event.allocatedBudget / event.totalBudget) * 100).toFixed(2)
              this.seriesData = [100 - this.percentage, this.percentage]
              console.log('Event Data => ', event)
              if (event.eventPage === null) {
                this.setEventPageData()
              }

              // this.$root.$emit("set-title",{title: event.title, link:"/edit"})
              this.$root.$emit(
                'set-title',
                event,
                this.routeName === 'EditBuildingBlocks',
                true
              )
              this.isLoading = false
            })
        }.bind(this)
      )
    },
    getEventDate (eventStartMillis) {
      let x = new Date(eventStartMillis)
      return x.getDate() + '-' + x.getMonth() + '-' + x.getFullYear()
    },
    setEventPageData () {
      let _calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId
      })
      let editedEvent = new CalendarEvent({
        id: this.calendarEvent.id
      })

      editedEvent = this.calendarEvent
      editedEvent.eventPage = this.eventPage

      editedEvent
        .save()
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error)
        })
    },
    publishEvent () {
      this.setPublishEventModal({
        showModal: true
      })
    },
    goBack () {
      this.$router.push({
        name: 'EditBuildingBlocks',
        params: {
          id: this.calendarEvent.id
        }
      })
    }
  },
  computed: {
    ...mapState('EventPlannerVuex', ['eventPage']),
    pieChart () {
      return {
        data: {
          labels: [' ', ' '], // should be empty to remove text from chart
          series: this.seriesData
        },
        options: {
          padding: 0,
          height: 120,
          donut: true,
          donutWidth: 12
        }
      }
    },
    date: {
      get () {
        return this.calendarEvent.eventStartMillis
          ? new Date(this.calendarEvent.eventStartMillis)
          : null
      },
      set (value) {
        let eventStartTime = new Date(value).getTime()
      }
    }
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format('Do, MMM')
    },
    formatTime: function (date) {
      return moment(date).format('h:00 A')
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, 'hours')
    }
  },
  watch: {}
}
</script>
