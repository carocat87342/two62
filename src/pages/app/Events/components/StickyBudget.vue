<template>
       <div class="sticky-budget" v-if="event">
           <div class="md-layout">
               <div class="md-layout-item "
                    :class="[
                    {'md-large-size-30  md-xlarge-size-35': expanded},
                    {'md-large-size-20  md-xlarge-size-15': !expanded}]"
               >
                    <div class="section-content">
                        <md-button class="md-info md-just-icon" @click="toggleExpanded">
                            <md-icon>{{expandButtonIcon}}</md-icon>
                        </md-button>
                        <div v-if="expanded">
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Event Name</div>
                                <div class="md-layout-item md-large-size-50 md-caption title-text">{{event.occasion}}</div>
                            </div>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Event Type</div>
                                <div class="md-layout-item md-large-size-50  md-caption title-text">{{event.eventType}} </div>
                            </div>

                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Date</div>
                                <div class="md-layout-item md-large-size-50 md-caption title-text">
                                    {{event.eventStartMillis | formatDate}}
                                </div>
                            </div>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Participants</div>
                                <div class="md-layout-item md-large-size-50 md-caption title-text">{{event.numberOfParticipants}} + Spouses</div>
                            </div>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Location</div>
                                <div class="md-layout-item md-large-size-50 md-caption title-text">{{event.location}}</div>
                            </div>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-large-size-50 md-caption title-text">Time & Duration:</div>
                                <div class="md-layout-item md-large-size-50 md-caption title-text">{{event.eventStartMillis | formatTime}} {{event.eventStartMillis | formatDuration(event.eventEndMillis)}} Hours</div>
                            </div>
                        </div>
                    </div>
               </div>
               <div class="md-layout-item md-large-size-30  md-xlarge-size-30" v-if="buildingBlocksList.length && expanded">
                   <div class="building-blocks-list md-info">
                       <div class="md-layout md-gutter gutter-header">
                           <div class="md-layout-item md-caption title-text">Items</div>
                           <div class="md-layout-item md-caption title-text">budget</div>
                           <md-button class="md-default md-sm md-just-icon md-simple edit-blocks">
                               <md-icon>edit</md-icon>
                           </md-button>
                       </div>
                       <div class="md-layout md-gutter" v-for="(block,index) in buildingBlocksList" :key="index">
                           <div class="md-layout-item md-caption title-text">{{block.value}}</div>
                           <div class="md-layout-item  md-caption title-text">${{0}}</div>
                       </div>
                   </div>
               </div>
               <div class="md-layout-item md-size-40 budgets-charts" v-if="expanded">
                   <div class="budgets-charts_list">
                       <div class="md-layout md-gutter">
                           <div class="md-layout-item md-size-80  title-text">Total budget for the event</div>
                           <div class="md-layout-item  md-size-20 md-caption ">${{calendarEvent.totalBudget}}</div>
                       </div>

                       <div class="md-layout md-gutter">
                           <div class="md-layout-item md-size-80  title-text">Selected Items</div>
                           <div class="md-layout-item  md-size-20 md-caption ">$0</div>
                       </div>
                       <div class="md-layout md-gutter">
                           <div class="md-layout-item md-size-80  title-text">Total Remaining Budget</div>
                           <div class="md-layout-item  md-size-20 md-caption t">$0</div>
                       </div>
                       <div class="md-layout md-gutter">
                           <div class="md-layout-item md-size-80  title-text">Budget per participant</div>
                           <div class="md-layout-item  md-size-20 md-caption ">$0</div>
                       </div>
                   </div>
                   <div style="display: grid;">
                       <chart-component
                               :chart-data="pieChart.data"
                               :chart-options="pieChart.options"
                               chart-type="Pie"
                               style="grid-column: 1; grid-row: 1; color:#eeeeee"/>
                       <animated-number class="percentage" ref="percentageNumber" style="text-align: center;" :value="percentage" suffix="%"></animated-number>
                   </div>
               </div>

               <div class="md-layout-item md-large-size-45 md-xlarge-size-55" v-if="!expanded">
                   <u class="event-info">
                       <li class="event-info_item">
                           <md-icon>calendar_today</md-icon>  {{event.eventStartMillis | formatDate}}, {{event.eventStartMillis | formatTime}}
                       </li>
                       <li class="event-info_item">
                           <md-icon>people</md-icon>  {{event.numberOfParticipants}} + Spouses
                       </li>
                       <li class="event-info_item">
                           <md-icon>place</md-icon>  {{event.location}}
                       </li>
                   </u>
               </div>

               <div class="md-layout-item md-large-size-35  md-xlarge-size-25" v-if="!expanded">
                   <ul class="event-info budget-info">
                       <li class="event-info_item">
                           <div class="budget-title">Per participant</div>
                           <div class="budget-value pull-right">$15</div>
                       </li>
                       <li class="event-info_item">
                           <div class="budget-title">Remaining Budget</div>
                           <div class="budget-value pull-right">${{totalRemainingBudget}}</div>
                           <!--<div class="budget-value red-value pull-right">${{calendarEvent.totalBudget}}</div>-->
                       </li>
                   </ul>
               </div>
           </div>
      </div>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import Calendar from '@/models/Calendar'
import EventComponent from '@/models/EventComponent'
// import auth from '@/auth';
import moment from 'moment'
import ChartComponent from '@/components/Cards/ChartComponent'
import {
  ChartCard,
  AnimatedNumber
} from '@/components'

export default {
  name: 'sticky-budget',
  components: {
    ChartComponent,
    AnimatedNumber,
    ChartCard
  },
  props: {
    event
  },
  data: () => ({
    // auth: auth,
    selectedComponents: [],
    currentTab: 'blocks',
    eventId: null,
    percentage: 0,
    totalRemainingBudget: 0,
    seriesData: [],
    calendarEvent: {},
    buildingBlocksList: [],
    expanded: false,
    expandButtonText: 'VIEW FULL EVENT DETAILS',
    expandButtonIcon: 'arrow_upward'
  }),
  methods: {
    getEvent () {
      this.$auth.currentUser(this, true, function () {
        let _calendar = new Calendar({id: this.$auth.user.defaultCalendarId})

        _calendar.calendarEvents().find(this.$route.params.id).then(event => {
          this.eventId = event.id
          this.calendarEvent = event
          this.totalRemainingBudget = event.totalBudget - event.allocatedBudget
          this.percentage = 100 - ((event.allocatedBudget / event.totalBudget) * 100).toFixed(2)
          this.seriesData = [(100 - this.percentage), this.percentage]
        })
      }.bind(this))
    },
    toggleExpanded () {
      this.expanded = !this.expanded

      if (this.expanded) {
        this.expandButtonText = 'HIDE FULL EVENT DETAILS'
        this.expandButtonIcon = 'arrow_downward'
      } else {
        this.expandButtonText = 'VIEW FULL EVENT DETAILS'
        this.expandButtonIcon = 'arrow_upward'
      }
    }
  },
  created () {
    this.getEvent()
  },
  mounted () {
    EventComponent.get()
      .then(res => {
        this.$set(this, 'buildingBlocksList', res)
      })
      .catch(error => {
        console.log('Error ', error)
      })

    console.log('calendarEvent => ', this.calendarEvent)
  },
  computed: {

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
    },
    dataCompletedTasksChart () {
      return {
        data: {
          labels: ['12am', '3pm', '6pm', '9pm', '12pm', '3am', '6am', '9am'],
          series: [[230, 750, 450, 300, 280, 240, 200, 190]]
        },

        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    }

  },
  filters: {
    formatDate: function (date) {
      return moment(date).format('MMM D, YYYY')
    },
    formatTime: function (date) {
      return moment(date).format('h:00 A')
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, 'hours')
    }
  }
}
</script>
