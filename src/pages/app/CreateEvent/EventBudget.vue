<template>
    <div class="">
        <div class="section-header">
            <h2 class="section-title">And the million dollar question - your budget</h2>
            <div class="steps-wizard">
                <ul class="steps-wizard-items">
                    <li v-for="index in step" :key="index"></li>
                </ul>
            </div>
        </div>
        <div class="container">
            <div class="form-section">

                <md-field class="purple-field">
                    <label>Total budget</label>
                    <md-input
                        type="number"
                        v-model="eventData.totalBudget"
                        data-vv-name="totalBudget"
                        v-validate= "modelValidations.totalBudget"
                        @change="totalBudgetChanged"
                    ></md-input>
                    <span class="md-error" v-if="errors.has('totalBudget')">This field is required</span>

                </md-field>

                <div class="divider text-center mt10">
                    Or
                </div>

                <md-field class="purple-field">
                    <label>Per guest budget</label>
                    <md-input
                        type="number"
                        v-model="eventData.budgetPerPerson"
                        data-vv-name="budgetPerPerson"
                        v-validate= "modelValidations.budgetPerPerson"
                        @change="budgetPerPersonChanged"
                    ></md-input>
                    <span class="md-error" v-if="errors.has('budgetPerPerson')">This field is required</span>

                </md-field>
                <div class="field-small-note" v-if="publicEventData.expectedAttendacePercent"> <small>Guest estimation: {{ Math.round(publicEventData.numberOfParticipants * (publicEventData.expectedAttendacePercent.value / 100))}}</small> </div>

                <div class="form-actions two-btns">
                    <md-button class="md-default next-btn custom-btn"
                               @click="skip"
                               :class="[{'opacity-btn' : buttonLabel === 'Build my budget'}]"
                               @mouseover="buttonLabel='I don\'t know'" @mouseleave="buttonLabel='Build my budget'" > {{buttonLabel}} </md-button>
                    <md-button class="md-rose next-btn custom-btn"
                               @click="goToNext"
                               :class="[{'disabled': !eventData.budgetPerPerson || !eventData.totalBudget}]"> Next </md-button>
                </div>

            </div>
        </div>

        <go-back navigation="about-invited"></go-back>

    </div>
</template>

<script>

import GoBack from './componenets/GoBack'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import numeral from 'numeral'

export default {
  components: {
    GoBack
  },
  data () {
    return {

      step: 3,
      haveEventPlace: false,
      flexibleWithDates: false,
      eventTime: null,
      eventData: {

      },
      modelValidations: {
        totalBudget: {
          required: true
        },
        budgetPerPerson: {
          required: true
        }
      },
      buttonLabel: 'Build my budget'

    }
  },
  created () {
    this.$http.defaults.headers.common.Authorization = this.$authHeader
    this.$set(this.eventData, 'totalBudget', this.publicEventData.totalBudget)
    this.$set(this.eventData, 'budgetPerPerson', this.publicEventData.budgetPerPerson)
  },
  methods: {
    ...mapMutations('PublicEventPlanner', ['setEventProperty', 'setCurrentStep']),
    goToNext () {
      let vm = this

      this.cerrors = {}
      this.validating = true

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.setEventProperty({key: 'totalBudget', actualValue: this.eventData.totalBudget})
          this.setEventProperty({key: 'budgetPerPerson', actualValue: this.eventData.budgetPerPerson})
          this.setCurrentStep({currentPage: 'event-vibe'})
          this.$router.push({ path: `/event-vibe`})
        } else {
        }
      })
    },
    skip () {
      this.$router.push({ path: `/event-vibe`})
    },
    totalBudgetChanged () {
      this.eventData.budgetPerPerson = Math.round(this.eventData.totalBudget / this.publicEventData.numberOfParticipants)
    },
    budgetPerPersonChanged () {
      this.eventData.totalBudget = this.eventData.budgetPerPerson * this.publicEventData.numberOfParticipants
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

        .divider {
            margin-top : 1em;
        }

        .field-small-note {
            font-size: 15px;
            color : #aaa;
            font-weight: bold;
            text-align: center;
        }
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
