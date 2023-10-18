<template>
  <div class="md-layout edit-event-details">
    <loader :active="isLoading"/>
    <div class="event-details-tabs">
       <tabs
        :tab-name="['BUDGET & PROPOSALS','TIMELINE', 'INVITEES']"
        color-button="rose"
        :active-tab="$store.state.EventPlannerVuex.eventDetailsActiveTab" ref="eventPlannerTabs" :sync-router="true">
         here you can add your content for tab-content
         <template slot="tab-pane-10" style="width: 100%;">
            <div class="md-layout">
                <div class="md-layout-item md-size-25">
                    <event-details-sidebar :event.sync="event" :event-statistics.sync="event.statistics"></event-details-sidebar>
                </div>
                <div class="md-layout-item md-size-75 text-left">
                    <md-card class="manage-vendors">
                        <md-card-content class="md-layout">
                            <div class="md-layout-item md-size-60">
                                <h4>Manage Vendor Proposals</h4>
                                <p>
                                    Save planning time by sending quote requests and easily compare them to get
                                    the best deals.
                                </p>

                                <ol>
                                    <li>Select desired services for the event</li>
                                    <li>Create and send inquiries to your vendors</li>
                                    <li>Get proposals and choose the best offers</li>
                                </ol>

                                <md-button name="event-planner-tab-event-details-banner-manage-proposals"
                                            class="event-planner-tab-event-details-banner-manage-proposals md-info" @click="openUploadModal()">
                                    Upload Vendors
                                </md-button>

                                <md-button name="event-planner-tab-event-details-banner-manage-proposals"
                                            class="event-planner-tab-event-details-banner-manage-proposals md-info"
                                            @click="selectServices">
                                    Select Services
                                </md-button>

                            </div>
                            <div class="md-layout-item md-size-40 promotion-video">
                                <iframe src="https://www.youtube.com/embed/ualjiukVg68"  frameborder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                                </iframe>
                            </div>
                        </md-card-content>
                    </md-card>

                    <div class="edit-event-boxes md-layout">
                        <md-card class="md-layout-item md-size-30">
                            <md-card-content>
                                <h4>Event Timeline</h4>
                                <p>
                                    Organize the event in a beautiful timeline.
                                </p>
                                <md-button name="event-planner-tab-event-details-banner-timeline"
                                            class="event-planner-tab-event-details-banner-timeline md-red md-simple got-to-component-btn"
                                            @click="selectTimeline">
                                    Edit Event Timeline
                                    <md-icon>arrow_forward</md-icon>
                                </md-button>
                            </md-card-content>
                        </md-card>

                        <md-card class="md-layout-item md-size-30">
                            <md-card-content>
                                <h4>Invitees Management</h4>

                                <p>
                                    Select invitees, send scheduled RSVP and messages.
                                </p>

                                <md-button name="event-planner-tab-event-details-banner-invitees"
                                            class="event-planner-tab-event-details-banner-invitees md-red md-simple got-to-component-btn"
                                            @click="selectInviteesManagement">
                                    Manage Invitees
                                    <md-icon>arrow_forward</md-icon>
                                </md-button>
                            </md-card-content>
                        </md-card>

                        <md-card class="md-layout-item md-size-30">
                            <md-card-content>
                                <h4>Publish Event Details</h4>
                                <p>
                                    Create a beautiful event page
                                    and send to invitees.
                                </p>

                                <md-button name="event-planner-tab-event-details-banner-event-page"
                                            class="event-planner-tab-event-details-banner-event-page md-red md-simple got-to-component-btn"
                                            @click="selectEventPage">
                                    Edit Event page
                                    <md-icon>arrow_forward</md-icon>
                                </md-button>
                            </md-card-content>
                        </md-card>
                    </div>
                </div>
            </div>
        </template>
         <template slot="tab-pane-1" style="width: 100%;">
            <div class="md-layout">
                <div class="md-layout-item md-size-25">
                    <event-details-sidebar :event.sync="event" :event-statistics.sync="event.statistics"></event-details-sidebar>
                </div>
                <div class="md-layout-item md-size-75">
                    <event-building-blocks :event.sync="event" :event-components="selectedComponents"
                                            @go-to-building-blocks="resetTab"></event-building-blocks>
                </div>
            </div>

        </template>
        <template slot="tab-pane-2" style="width: 100%;">
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <event-time-line :event="event" :event-components="selectedComponents"></event-time-line>

                </div>
            </div>

        </template>
        <template slot="tab-pane-3" style="width: 100%;">
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <event-invitees :event-data.sync="event"></event-invitees>
                </div>
            </div>
        </template>

        <!--<template slot="tab-pane-3" style="width: 100%;">
            <div class="md-layout">
                <div class="md-layout-item md-size-100">
                    <event-details :event.sync="event"
                                    :event-components="selectedComponents"></event-details>
                </div>
            </div>
        </template>-->

       </tabs>
    </div>

    <upload-vendors-modal ref="uploadModal"></upload-vendors-modal>

    <!--<sticky-budget :event="event" v-if="routeName !== 'EditEvent' && routeName !== 'EditBuildingBlocks'"></sticky-budget>-->

  </div>

</template>

<script>

import EventModal from './EventModal/'
import EventPlannerVuexModule from './EventPlanner.vuex'

// MAIN MODULES
import ChartComponent from '@/components/Cards/ChartComponent'
// import auth from '@/auth';
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import CalendarEventStatistics from '@/models/CalendarEventStatistics'
import EventComponent from '@/models/EventComponent'
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'

// COMPONENTS
import {AnimatedNumber, NavTabs} from '@/components'
import Icon from '@/components/Icon/Icon.vue'
import EventElements from './EventElements.vue'
import EventBlocks from './components/NewEventBlocks'
import EventBuildingBlocks from './components/EventBuildingBlocks'
import EventTimeLine from './components/EventTimeLine.vue'
import InviteesManagement from './components/EventBlocks/InviteesManagement.vue'
import InviteesManagementV2 from './components/EventBlocks/InviteesManagementV2.vue'
import EventInvitees from './components/EventInvitees.vue'
import EventDetailsSidebar from './components/EventDetailsSidebar'
import EventDetails from './EventDetails'

import EventPageRoutes from './components/EventPageRoutes.vue'
import MdCardContent
  from '../../../../node_modules/vue-material/src/components/MdCard/MdCardContent/MdCardContent.vue'
import {Tabs, Loader} from '@/components'
import UploadVendorsModal from '../Vendors/ImportVendors'

export default {
  components: {
    MdCardContent,
    NavTabs,
    EventBuildingBlocks,
    VueElementLoading,
    ChartComponent,
    AnimatedNumber,
    Icon,
    EventElements,
    EventBlocks,
    EventModal,
    EventTimeLine,
    InviteesManagement,
    EventPageRoutes,
    InviteesManagementV2,
    EventInvitees,
    Tabs,
    EventDetailsSidebar,
    EventDetails,
    UploadVendorsModal,
    Loader,
  },

  data () {
    return {
      // auth: auth,
      calendarEvent: {},
      selectedComponents: [],
      currentTab: 'blocks',
      eventId: null,
      percentage: 0,
      totalRemainingBudget: 0,
      remainingBudgetPerEmployee: 0,
      seriesData: [],
      isLoading: false,
      event: {statistics: {}},
      routeName: null,
      budgetPerEmployee: 0,
      activeTab: 0
    }
  },
  created () {
    this.routeName = this.$route.name
  },
  mounted () {
    let _self = this
    this.isLoading = true

    this.getEvent()
    const tab = this.$route.query.t || 0
    if (this.$refs.eventPlannerTabs) {
      this.$refs.eventPlannerTabs.$emit('event-planner-nav-switch-panel', tab)
    }

    if (this.components.length === 0) {
      this.$store.dispatch('event/getComponents', this)
      this.$store.dispatch('event/getCategories', {data: this.$auth.user.defaultCalendarId, ctx: this})
      this.$store.dispatch('event/getEventTypes', {data: this.$auth.user.defaultCalendarId, ctx: this})
      this.$store.dispatch('event/getCurrencies', this)
      this.$store.dispatch('event/getEventThemes', this)
    }

    this.$root.$on('calendar-refresh-events', () => {
      console.log('i am here')
      this.getEvent()
    })
  },
  methods: {
    ...mapMutations('EventPlannerVuex', [
      'setEventModal',
      'setEditMode',
      'setModalSubmitTitle',
      'setEventModalAndEventData',
      'setNumberOfParticipants',
      'setEventData'
    ]),
    getEvent () {
      this.$auth.currentUser(this, true, function () {
        let _calendar = new Calendar({id: this.$auth.user.defaultCalendarId})

        _calendar.calendarEvents().find(this.$route.params.id).then(event => {
          this.event = event
          this.eventId = event.id
          this.calendarEvent = event
          new EventComponent().for(_calendar, event).get().then(components => {
            this.event.components = components
            this.selectedComponents = components
          })

          this.getCalendarEventStatistics(event)

          this.$root.$emit('set-title', this.event, this.routeName === 'EditBuildingBlocks', this.routeName === 'InviteesManagement' || this.routeName === 'EventInvitees')
          this.isLoading = false
          console.log(event)
        })
      }.bind(this))
    },
    selectServices () {
      this.$refs.eventPlannerTabs.$emit('event-planner-nav-switch-panel', 1)
    },
    selectTimeline () {
      this.$root.$emit('event-planner-nav-switch-panel', 2)
    },
    selectInviteesManagement () {
      this.$root.$emit('event-planner-nav-switch-panel', 3)
    },
    selectEventPage () {
      this.$root.$emit('event-planner-nav-switch-panel', 4)
    },
    selectTab (tab) {
      this.currentTab = tab
    },
    selectedTab (tab) {
      return this.currentTab === tab
    },
    resetTab () {
      this.currentTab = null
    },
    openEventModal () {
      // window.currentPanel = this.$showPanel({
      //     component: EventSidePanel,
      //     cssClass: 'md-layout-item md-size-40 transition36 ',
      //     openOn: 'right',
      //     disableBgClick: true,
      //     props: {
      //         modalSubmitTitle: 'Save',
      //         editMode: true,
      //         sourceEventData: this.event
      //     }
      // })

      this.setEventData(this.event)
      this.setEventModal({showModal: true})
      this.setModalSubmitTitle('Save')
      this.setEditMode({editMode: true})
    },
    refreshEvents () {
      this.getCalendarEvents()
    },
    goToComponent (route) {
      this.$router.push({path: `/events/` + this.event.id + route})
      location.reload()
    },
    getCalendarEventStatistics (evt) {
      let calendar = new Calendar({id: this.$auth.user.defaultCalendarId})
      let event = new CalendarEvent({id: this.event.id})

      new CalendarEventStatistics().for(calendar, event).get()
        .then(resp => {
          this.totalRemainingBudget = (evt.budgetPerPerson * evt.numberOfParticipants) - resp[0].totalAllocatedBudget// evt.totalBudget - resp[0].totalAllocatedBudget;
          this.remainingBudgetPerEmployee = this.totalRemainingBudget / evt.numberOfParticipants// evt.totalBudget - resp[0].totalAllocatedBudget;
          this.percentage = 100 - ((resp[0].totalAllocatedBudget / (evt.budgetPerPerson * evt.numberOfParticipants)) * 100).toFixed(2)
          this.seriesData = [(100 - this.percentage), this.percentage]
          this.budgetPerEmployee = evt.budgetPerPerson// this.totalRemainingBudget / evt.numberOfParticipants;
          this.allocatedBudget = resp.totalAllocatedBudget
          this.event.statistics['allocatedBudget'] = this.allocatedBudget
        })
        .catch(error => {
          console.log(error)
        })
    },
    openUploadModal () {
      this.$refs.uploadModal.toggleModal(true)
    }
  },
  computed: {
    ...mapState('EventPlannerVuex', [
      'eventData',
      'eventModalOpen',
      'modalTitle',
      'modalSubmitTitle',
      'editMode'
    ]),
    ...mapGetters({
      components: 'event/getComponentsList'
    }),
    pieChart () {
      return {
        data: {
          labels: [' ', ' '], // should be empty to remove text from chart
          series: this.seriesData
        },
        options: {
          padding: 0,
          height: 156,
          donut: true,
          donutWidth: 15
        }
      }
    }
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format('MMM Do YYYY ')
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

<style scoped>
    .md-layout, .md-layout-item {
        width: initial;
    }

    .tab-content {
        background-color: transparent !important;
    }
</style>
