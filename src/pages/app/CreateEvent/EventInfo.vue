<template>
    <div class="">
        <div class="section-header">
            <h2 class="section-title">Tell us about the people you invited?</h2>
            <div class="steps-wizard">
                <ul class="steps-wizard-items">
                    <li v-for="index in step" :key="index"></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="form-section">

                <md-field class="purple-field">
                    <label>How many people do you invite?</label>
                    <md-input type="number"
                              v-model="eventData.numberOfParticipants"
                              data-vv-name="numberOfParticipants"
                              v-validate= "modelValidations.numberOfParticipants"
                            ></md-input>
                    <span class="md-error" v-if="errors.has('numberOfParticipants')">This field is required</span>
                </md-field>

                <div class="maryoku-field" :class="{'has-value' : eventData.expectedAttendacePercent}">
                    <v-select v-model="eventData.expectedAttendacePercent"
                              :options="expectingPeopleList"
                              :class="{'has-value' : eventData.expectedAttendacePercent}"
                              data-vv-name="location"
                              v-validate= "modelValidations.expectedAttendacePercent"></v-select>
                    <label>% people you're expecting to show up</label>
                    <span class="md-error" v-if="errors.has('expectedAttendacePercent')">This field is required</span>
                </div>

<!--                <md-checkbox v-model="eventData.internalEvent">Internal company event</md-checkbox>-->

                <div class="form-actions">
                    <md-button class="md-rose next-btn custom-btn"
                               @click="goToNext"
                               :class="[{'disabled': !eventData.numberOfParticipants || !eventData.expectedAttendacePercent}]"> Next </md-button>
                </div>

            </div>
        </div>

        <go-back navigation="create-event-wizard"></go-back>

    </div>
</template>

<script>

import GoBack from './componenets/GoBack'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'


export default {
  components: {
    GoBack
  },
  data () {
    return {
      step: 2,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
      eventDate: null,
      eventData: {},
      expectingPeople: ['80% - 85%', '85% - 90%', '90% - 95%', '95% - 100%'],
      expectingPeopleList: [
        {
          label: '80% - 85%',
          value: 85
        },
        {
          label: '85% - 90%',
          value: 90
        },
        {
          label: '90% - 95%',
          value: 95
        },
        {
          label: '95% - 100%',
          value: 100
        }
      ],
      modelValidations: {
        numberOfParticipants: {
          required: true
        },
        expectedAttendacePercent: {
          required: true
        }
      }
    }
  },
  created () {
    this.$set(this.eventData, 'numberOfParticipants', this.publicEventData.numberOfParticipants)
    this.$set(this.eventData, 'expectedAttendacePercent', this.publicEventData.expectedAttendacePercent)
    this.$set(this.eventData, 'internalEvent', this.publicEventData.internalEvent)
  },
  methods: {
    ...mapMutations('PublicEventPlanner', ['setEventProperty', 'setCurrentStep']),

    goToNext () {
      let vm = this

      this.cerrors = {}
      this.validating = true

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.setEventProperty({key: 'numberOfParticipants', actualValue: this.eventData.numberOfParticipants})
          this.setEventProperty({key: 'expectedAttendacePercent', actualValue: this.eventData.expectedAttendacePercent})
          this.setEventProperty({key: 'internalEvent', actualValue: this.eventData.internalEvent})
          this.setCurrentStep({currentPage: '/event-budget'})
          this.$router.push({ path: `/event-budget`})
        } else {

        }
      })
    }
  },
  computed: {
    ...mapState('PublicEventPlanner', [
      'publicEventData'
    ])
  }
}
</script>
<style lang="scss">

    .form-section {
        width : 30%;
        margin : 0 auto;
        padding : 0 2em;
        min-height: 440px;
    }

    .event-time {
        display: flex;
        flex:1;
        flex-direction: row;
        justify-content: space-between;

        .md-radio {
            margin-right: 0;
            width: 47%;
        }
    }
</style>
