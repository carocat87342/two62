<template>
  <div class="md-layout show-page">

    <div class="md-layout-item md-size-100">
      <div class="event-form-padding">
        <form class="md-layout">
          <md-card class="md-layout-item md-size-100 padding-card">

            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label>Event Name: {{ event.title }}</label>
              </md-field>
            </div>

            <div class="md-layout">
              <div class="md-layout-item md-size-33 md-small-size-100 disabled-datepicker">
                <md-datepicker>
                  <label>Date: {{ event.eventStartMillis | formatDate }}</label>
                </md-datepicker>
              </div>

              <div class="md-layout-item md-size-33 md-small-size-100">
                <md-field class="select-with-icon">
                  <label>Time: {{ event.eventStartMillis | formatTime }}</label>
                </md-field>
              </div>

              <div class="md-layout-item md-size-33 md-small-size-100">
                <md-field class="select-with-icon">
                  <label>Event duration in hours: {{ convertMillisToHours(event.eventEndMillis - event.eventStartMillis) }}</label>
                </md-field>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item md-size-33 md-small-size-100">
                <md-field class="select-with-icon">
                  <label>Occasion: {{ event.occasion }}</label>
                </md-field>
              </div>

              <div class="md-layout-item md-size-33 md-small-size-100">
                <md-field>
                  <label>Number of Participants: {{ event.numberOfParticipants }}</label>
                </md-field>
              </div>

              <div class="md-layout-item md-size-33 md-small-size-100">
                <md-field>
                  <label>Location: {{ event.location }}</label>
                </md-field>
              </div>
            </div>
          </md-card>

          <chart-card
              class="md-size-100 md-layout-item"
              v-if="event.totalBudget && spentBudget > -1"
              :chart-data="pieChart.data"
              :chart-options="pieChart.options"
              :chart-responsive-options="pieChart.responsiveOptions"
              chart-type="Pie"
              header-icon
              chart-inside-content>
            <template slot="footer">
              <div class="md-layout">
                <div class="md-layout-item">
                  <i class="fa fa-circle text-success"></i> Remaining Budget (${{ event.totalBudget - spentBudget }})
                </div>
                <div class="md-layout-item">
                  <i class="fa fa-circle text-danger"></i> Spent Budget (${{ spentBudget }})
                </div>
                <div class="md-layout-item md-size-100" v-if="spentBudget > event.totalBudget">
                  <div class="warning text-warning">Budget is exceeded. You should either increase total budget or update costs</div>
                </div>

                <md-field style="margin: 20px 0 10px;">
                  <label>Total Budget: ${{ event.totalBudget }}</label>
                </md-field>
              </div>
            </template>
          </chart-card>

        </form>
      </div>
    </div>

  </div>
</template>
<script>

import {
  ChartCard
} from '@/components'
import CalendarEvent from '@/models/CalendarEvent'
import CalendarEventImage from '@/models/CalendarEventImage'
import Calendar from '@/models/Calendar'
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'event-info',
  components: {
    ChartCard
  },
  props: {
    event: Object
  },

  data: () => ({

  }),
  computed: {
    spentBudget () {
      let totalSpent = 0

      if (this.event.components) {
        this.event.components.forEach(function (component) {
          if (component && component.vendors) {
            component.vendors.forEach(function (val) {
              totalSpent += val.cost
            })
          }
        })
      }
      return totalSpent
    },
    sum: function (a, b) { return a + b },
    pieChart () {
      return {
        data: {
          labels: ['Bananas', 'Apples'],
          series: [this.calculateRemain(), this.calculateSpent()]
        },
        options: {
          donut: true,
          startAngle: 270,
          donutWidth: 15,
          showLabel: false
        },
        responsiveOptions: [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode',
            labelInterpolationFnc: function (value) {
              return value
            }
          }],
          ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
          }]
        ]
      }
    }
  },

  methods: {
    calculateSpent () {
      if (this.spentBudget === 0 || this.spentBudget === NaN) {
        return 0
      }
      return this.spentBudget
    },
    calculateRemain () {
      if (this.event.totalBudget === 0 || this.event.totalBudget === NaN || this.event.totalBudget === '' || this.event.totalBudget === undefined) {
        return this.calculateSpent() > 0 ? 0 : 1
      }
      if (this.spentBudget > this.event.totalBudget) {
        return 0
      }
      return this.event.totalBudget - this.spentBudget
    },

    convertHoursToMillis (hours) {
      return hours * 60 * 60 * 1000
    },
    convertMillisToHours (millis) {
      return millis / 3600000
    }
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format('YYYY-MM-DD')
    },
    formatTime: function (date) {
      return moment(date).format('HH:mm')
    }
  }
}
</script>

<style lang="scss">

  .event-form-padding {
    margin-top: 0;

    .padding-card {
      padding-top: 15px;
      padding-bottom: 30px;
    }
  }
  .md-datepicker .md-icon.md-theme-default.md-icon-image svg {
    fill: #ff5252;
  }
  .clickable-button {
    pointer-events: all;
  }
  .show-page {
    .md-field .md-icon {
      margin-left: 0;

      &::after {
        display: none;
      }
    }

    .padding-card {
      .md-field::after {
        display: none;
      }
    }
  }
  .disabled-datepicker {
    pointer-events: none;

    .md-button {
      display: none;
    }
  }
</style>
