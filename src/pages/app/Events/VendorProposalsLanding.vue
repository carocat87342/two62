<template>
  <div class="md-layout md-alignment-top-center pt-24">
    <div class="md-layout-item md-size-70" v-if="firstTime">
      <div class="margin-bottom-lg">
        <h3 class="title">
          <md-icon class="md-success md-size-2x margin-right-sm">check_circle</md-icon>You've been added to our marketplace as
          <a href="#">vetted vendor</a>.
        </h3>
      </div>
      <div class="margin-bottom-md">
        <h4 class="title">What's maryoku?</h4>
        <p>Our community based marketplace brings together event producers and vetted vendors to streamline event production.</p>
      </div>
      <div class="margin-bottom-lg">
        <h4 class="title">Win more quotes, get better leads</h4>
        <p>* Get insights about the competition and budget range to create winning quotes.</p>
        <p>* Get notified when quote outbided, and update your quote.</p>
        <p>* We study your proposals and build your auto proposal builder to save you time and energy.</p>
      </div>
    </div>
    <div class="md-layout-item md-size-70" v-else>
      <div class="margin-bottom-lg">
        <h3 class="title">
          <md-icon class="md-success md-size-2x margin-right-sm">check_circle</md-icon>Thank you
        </h3>
      </div>
    </div>
    <div class="md-layout-item md-size-70 margin-bottom-lg">
      <h4 class="title">Waiting for your quote:</h4>
      <md-card class="proposals--card">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item separated">
              <div class="proposal--title margin-bottom-lg">
                <md-icon class="proposal--icon">date_range</md-icon>
                <span>{{ eventDate }}</span>
              </div>
              <div class="md-layout align-with-title">
                <div class="md-layout-item md-size-50 margin-bottom-md">
                  <div>Guests</div>
                  <p
                    class="proposal--title"
                  >{{ proposalRequest ? proposalRequest.eventData.numberOfParticipants : '-' }}</p>
                </div>
                <div
                  v-if="proposalRequest.bidderRank > 1"
                  class="md-layout-item md-size-50 margin-bottom-md"
                >
                  <div>Budget</div>
                  <p class="proposal--title">
                    ${{ proposalRequest.bidRange.low }}
                    -
                    ${{ proposalRequest.bidRange.high }}
                  </p>
                </div>
                <div class="md-layout-item md-size-50 margin-bottom-md">
                  <div>Location</div>
                  <p class="proposal--title">{{getLocation}}</p>
                </div>
                <div class="md-layout-item md-size-50 margin-bottom-md">
                  <div>Requirements</div>
                  <p
                    class="proposal--title"
                  >{{ proposalRequest ? proposalRequest.requirements.length : '-' }}</p>
                </div>

                <div
                  class="md-layout-item md-size-100 margin-bottom-md alternative-date"
                  v-if="proposalRequest.eventData.flexibleWithDates"
                >
                  <md-button class="md-primary" @click="suggestAnotherDay">Suggest another day</md-button>
                  <br />
                  <br />
                  <md-datepicker
                    v-if="suggest"
                    v-model="proposalRequest.suggestedDates"
                    :md-disabled-dates="isDateDisabled"
                  >
                    <label>Alternative date</label>
                  </md-datepicker>
                </div>
              </div>
            </div>
            <div class="md-layout-item">
              <div class="proposal--title margin-bottom-lg centered">
                <span
                  v-if="proposalRequest.bidderRank > 1"
                >You're the {{proposalRequest.bidderRank | numeral('Oo')}} bidder</span>
                <span v-else>Budget</span>
              </div>
              <div class="md-layout md-alignment-top-center margin-bottom-lg">
                <div
                  v-if="proposalRequest.bidderRank > 1"
                  class="md-layout-item margin-bottom-md md-size-20"
                >
                  <div>Lowest</div>
                  <p class="proposal--title">
                    <!-- TODO: change this value -->
                    ${{ proposalRequest.bidRange.low }}
                  </p>
                </div>
                <div v-else class="md-layout-item margin-bottom-md md-size-20">
                  <div>Min</div>
                  <p
                    class="proposal--title"
                  >${{ proposalRequest ? proposalRequest.bidRange.low : '-' }}</p>
                </div>
                <div class="md-layout-item margin-bottom-md md-size-30">
                  <div class="arrow"></div>
                </div>
                <div
                  v-if="proposalRequest.bidderRank > 1"
                  class="md-layout-item margin-bottom-md md-size-20"
                >
                  <div>Highest</div>
                  <p class="proposal--title">
                    <!-- TODO: change this value -->
                    ${{ proposalRequest.bidRange.high }}
                  </p>
                </div>
                <div v-else class="md-layout-item margin-bottom-md md-size-20">
                  <div>Max</div>
                  <p
                    class="proposal--title"
                  >${{ proposalRequest ? proposalRequest.bidRange.high : '-' }}</p>
                </div>
              </div>

              <div class="proposal--title centered margin-bottom-lg">
                <span>Total Budget</span>
                <b>${{ proposalRequest.eventData.totalBudget }}</b>
              </div>

              <div class="centered">
                <md-button
                  v-if="!proposalRequest"
                  class="md-button md-primary"
                  @click.prevent="onSkipToAnotherEventRequest"
                >See more event requests</md-button>
                <md-button
                  v-else
                  @click.prevent="goToDetails"
                  class="md-button md-primary"
                >See full details</md-button>
              </div>
            </div>
          </div>
        </md-card-content>
      </md-card>
      <a href="#" @click.prevent="onSkipToAnotherEventRequest" v-if="showSkipLink">
        Skip to another event request
        <md-icon class="md-primary">keyboard_arrow_right</md-icon>
      </a>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vendors from '@/models/Vendors'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'

export default {
  props: ['proposalRequest', 'proposals', 'firstTime'],
  components: {},

  data () {
    return {
      showSkipLink: false,
      upcomingEvents: [],
      vendor: null,
      suggest: false
    }
  },
  created () {},
  mounted () {
    this.getVendor()

    let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })

    let m = new CalendarEvent().for(_calendar).fetch(this, true)
    m.then(allEvents => {
      console.log(allEvents)
      this.upcomingEvents = allEvents
      this.isLoading = false
    })
  },
  methods: {
    goToDetails () {
      this.$emit('goToDetails')
    },
    onSkipToAnotherEventRequest () {
      let index = _.findIndex(
        this.proposals,
        pr => pr.id === this.proposalRequest.id
      )
      let nextIndex = (index + 1) % this.proposals.length
      this.$emit('requestAnotherProposal', this.proposals[nextIndex].id)
    },
    getVendor () {
      this.$auth.currentUser(
        this,
        true,
        function () {
          Vendors.find(this.proposalRequest.vendorId).then(vendor => {
            this.vendor = vendor
          })
        }.bind(this)
      )
    },
    isDateDisabled (date) {
      let startDate = new Date(this.proposalRequest.eventData.eventStartMillis)
      let endDate = new Date(this.proposalRequest.eventData.eventStartMillis)
      let numberOfDaysToAdd = 3
      startDate.setDate(startDate.getDate() - 4)
      endDate.setDate(endDate.getDate() + numberOfDaysToAdd)

      return !(date >= startDate && date <= endDate)
    },
    suggestAnotherDay () {
      this.suggest = true
      this.proposalRequest.suggestedDates = new Date(
        this.proposalRequest.eventData.eventStartMillis
      )
    }
  },
  computed: {
    eventDate () {
      if (!this.proposalRequest) return '-'

      let date = new Date(this.proposalRequest.eventData.eventStartMillis)
      return moment(date).format('MMM D, YYYY [at] hh:mma')
    },
    getLocation () {
      console.log(this.proposalRequest)
      console.log(this.upcomingEvents)
      console.log(
        'test',
        this.upcomingEvents.filter(
          item =>
            item.participantsType ===
              this.proposalRequest.eventData.participantsType &&
            item.numberOfParticipants ===
              this.proposalRequest.eventData.numberOfParticipants
          // item.participantsType===this.proposalRequest.eventData.participantsType &&
          // item.eventStartMillis===this.proposalRequest.eventStartMillis &&
          // item.eventEndMillis===this.proposalRequest.eventEndMillis
        )
      )

      if (this.proposalRequest) {
        return this.proposalRequest.eventData.location || '-'
      } else {
        return '-'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";
@import "@/assets/scss/md/_variables.scss";

.md-success {
  color: $green-700 !important;
}

.title {
  font-weight: bold;
}

h4 {
  margin: 0;
}

p {
  margin: 10px 0 0 0;
}

.margin-bottom-lg {
  margin-bottom: 30px;
}

.margin-bottom-md {
  margin-bottom: 20px;
}

.margin-right-sm {
  margin-right: 10px;
}

.proposals--card {
  margin-top: 10px;
  margin-bottom: 10px;
}

.proposal--title {
  font-size: 20px;
  font-weight: 400;

  .proposal--icon {
    margin-right: 5px;
    margin-top: -5px;
  }
}

.align-with-title {
  padding-left: 34px;
}

.separated {
  border-right: 1px solid $input-border;
}

.centered {
  text-align: center;
}

.arrow {
  border-bottom: 1px solid $grey-600;
  position: relative;
  top: 46px;
  width: 60px;
  margin: auto;

  &::after {
    content: " ";
    position: absolute;
    width: 7px;
    height: 7px;
    border-bottom: 1px solid $grey-600;
    border-right: 1px solid $grey-600;
    transform: rotate(-45deg);
    bottom: -4px;
    right: 0px;
  }
}

.pt-24 {
  padding-top: 24px;
}
</style>
