<template>
    <div class="">
        <div class="container">
            <div class="title">
              3/5
              <div class="mt-1">
                Location Location Location
              </div>
            </div>
            <div class="text-center">
              Where is the event scheduled to take place? (City or region would be enough)
            </div>
            <div class="location event-basic-info">
              <div class="mt-4rem">
                <location-input v-model="location" placeholder="Type city / region or specific address here…" @change="changeLocation"></location-input>
              </div>
            </div>
        </div>
        <wizard-status-bar :currentStep="3" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
    </div>
</template>

<script>

import GoBack from './componenets/GoBack'
import SelectedValue from './componenets/SelectedValue'
import WizardStatusBar from './componenets/WizardStatusBar'
import { MaryokuInput, LocationInput} from '@/components'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    GoBack,
    WizardStatusBar,
    MaryokuInput,
    LocationInput
  },
  created () {
    if (this.publicEventData.location) {
      this.location = this.publicEventData.location
    }
  },
  methods: {
    ...mapMutations('PublicEventPlanner', ['setEventProperty', 'setCurrentStep']),
    validateDate () {
      return this.$refs.datePicker.$el.classList.contains('md-has-value')
    },
    validateAndSubmit () {
      // this.$emit('goToNextPage');
      //  return;
      let vm = this

      this.cerrors = {}
      this.validating = true

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          // this.$parent.isLoading = true;

          if (this.eventId) {
            vm.updateEvent()
          } else {
            vm.createEvent()
          }
        } else {
          this.showNotify()
        }
      })

      if (!this.eventType) {

      } else {
        // this.$emit('goToNextPage');
      }
    },
    changeLocation(loc) {
      this.locationData = loc;
    },
    showNotify () {
      this.$notify({
        message: 'Please, check all required fields',
        icon: 'warning',
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: 'danger'
      })
    },
    goToNext() {
      this.setEventProperty({ key: 'location', actualValue: this.location})
      this.setEventProperty({ key: 'locationId', actualValue: this.locationData.id})
      this.$router.push({path: `/event-wizard-building`})
    },
    skip() {
      this.$router.push({path: `/event-wizard-building`})
    },
    back() {
      this.$router.push({path: `/event-wizard-guests-type`})
    }
  },
  data () {
    return {
      location: "",
      locationData: {}
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

    .location.event-basic-info {
        width: 450px;
        margin: 0 auto;
        padding: 0px;
        min-height: 300px;
        max-width: 100%;
    }
    .form-input {
      background: white;
    }
</style>
