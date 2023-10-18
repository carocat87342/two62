<template>
    <div class="">
        <div class="container">
            <div class="title">
              4/5
            </div>
            <selected-value :value="publicEventData.occasion.name" :property="publicEventData.occasion.value"></selected-value>
            <div class="event-basic-info wizard-religion">
              <div class="setting-title mt-5">
                <img :src="`${$iconURL}Onboarding/enter-gray.svg`" class="indicator">
                Choose religion, &  the holiday 
              </div>
              <div class="text-center mt-2 select-wrapper">
                <multiselect
                  v-model="religion"
                  :options="religions"
                  :close-on-select="true"
                  :clear-on-select="true"
                  tag-placeholder="Add this as new tag"
                  placeholder="Type to search category"
                ></multiselect>
              </div>
              <div class="mt-3 holiday-types">
                <div class="text-left type" @click="selectedHoldiay=type" :class="{selected:type.selected}" v-for="(type) in holidays" :key="type.value">
                    <md-checkbox class="md-checkbox-circle md-red" v-model="selectedHoldiay" :value="type"><span :class="{selected: selectedHoldiay.value == type.value}">{{type.name}}</span></md-checkbox>
                </div>
              </div>
            </div>
        </div>
        <wizard-status-bar :currentStep="4" @next="goToNext" @skip="skip" @back="back"></wizard-status-bar>
    </div>
</template>

<script>

import GoBack from './componenets/GoBack'
import SelectedValue from './componenets/SelectedValue'
import WizardStatusBar from './componenets/WizardStatusBar'
import { MaryokuInput} from '@/components'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Multiselect from "vue-multiselect";
export default {
  components: {
    GoBack,
    SelectedValue,
    WizardStatusBar,
    MaryokuInput,
    Multiselect
  },
  created () {
    if(this.publicEventData.religion) {
      this.religion = this.publicEventData.religion
    }
    if (this.publicEventData.holidays) {
      this.types = this.publicEventData.holidays
    }
  },
  methods: {
    ...mapMutations('PublicEventPlanner', ['setEventProperty', 'setCurrentStep']),
    validateDate () {
      return this.$refs.datePicker.$el.classList.contains('md-has-value')
    },
    validateAndSubmit () {
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
      this.setEventProperty({ key: "religion", actualValue: this.religion})
      this.setEventProperty({ key: "holidays", actualValue: this.types})
      this.$router.push({path: `/event-wizard-vibes`})
    },
    skip() {
      this.$router.push({path: `/event-wizard-vibes`})
    },
    back() {
      this.$router.push({path: `/event-wizard-celebrating`})
    }
  },
  data () {
    return {
      types: [
        { value: "all", name: "All Islamic holidays", selected:false, religion:'islam' },
        { value: "Eid-al-Fitr", name: "Eid-al-Fitr (End of Ramadan)", selected:false, religion:'islam' },
        { value: "Ramadan", name: "Ramadan (start)", selected:false, religion:'islam' },
        { value: "Eid", name: "Eid Al-Adha", selected:false, religion:'islam' },
        { value: "Waqf", name: "Waqf al Arafa - Hajj", selected:false, religion:'islam' },
        { value: "Laylat", name: "Laylat al Qadr", selected:false, religion:'islam' },
        { value: "Hijra", name: "Hijra - Islamic New Year", selected:false, religion:'islam' },
        { value: "Milad", name: "Milad un Nabi", selected:false, religion:'islam' },
        { value: "Lailat", name: "Lailat al Miraj", selected:false, religion:'islam' },
        { value: "Ashura", name: "Day of Ashura / Muharram", selected:false, religion:'islam' },
        { value: "Nabi", name: "Milad un Nabi (Shia)", selected:false, religion:'islam' },
        
        { value: "rosh-hashana", name: "Rosh Hashana", selected:false, religion: 'judaism' },
        { value: "sukkot", name: "Sukkot", selected:false, religion: 'judaism' },
        { value: "simchat-torah", name: "Simchart Torah", selected:false, religion: 'judaism' },
        { value: "chanukah", name: "Chanukah", selected:false, religion: 'judaism' },
        { value: "purim", name: "Purim", selected:false, religion: 'judaism' },
        { value: "pesach", name: "Pesach", selected:false, religion: 'judaism' },
        { value: "shavout", name: "Judaism", selected:false, religion: 'judaism' },

        { value: "good-friday", name: "Good Friday", selected:false, religion: 'christianity' },
        { value: "easter", name: "Easter", selected:false, religion: 'christianity' },
        { value: "christmass", name: "Christmass", selected:false, religion: 'christianity' },
        { value: "tThanksgiving", name: "Thanksgiving", selected:false, religion: 'christianity' },
        { value: "new-year", name: "New Year", selected:false, religion: 'christianity' },

        { value: "diwali", name: "Diwali - Festival of light", selected:false, religion: 'hindu' },
        { value: "sussera", name: "Dussera", selected:false, religion: 'hindu' },
        { value: "ganesha", name: "Ganesha Chaturthi", selected:false, religion: 'hindu' },
        { value: "holi", name: "Holi", selected:false, religion: 'hindu' },
        { value: "krishna", name: "Krishna Jenmashtami", selected:false, religion: 'hindu' },
        { value: "maha", name: "Maha Shivaratri", selected:false, religion: 'hindu' },
        { value: "raksha", name: "Raksha Bandhan", selected:false, religion: 'hindu' },
        { value: "navratri", name: "Navratri", selected:false, religion: 'hindu' },
      ],
      religions: [
        'Christianity',
        'Islam',
        'Hindu',
        'Judaism'
        // 'Buddhism',
        // 'Other'
      ],
      religion: "",
      selectedHoldiay : {}
    }
  },
  computed: {
    ...mapState('PublicEventPlanner', [
      'publicEventData'
    ]),
    holidays() {
      if (!this.religion)  return []
      return this.types.filter(item=>item.religion === this.religion.toLowerCase())
    }
  },
  watch: {
    religion(newValue, oldValue) {
      
    }
  },

}
</script>
<style lang="scss">

    .event-basic-info.wizard-religion {
        width: 100%;
        margin: 0 auto;
        padding: 0;
        .select-wrapper {
          width: 400px;
          margin: 30px auto;
          max-width: 100%;
        }
        .holiday-types {
          width: 900px;
          margin: 30px auto;
          columns: 200px 3;
          .type {
            padding: 10px;
            &.selected {
              font-family: "Manrope-Bold";
            }
          }
        }
    }
    
    .md-checkbox-circle {
      margin: 0px;
    }
    .input-name {
      width: 80%;
      text-align: right;
      .form-input {
        width: 280px;
        margin: 0 0 0 auto;
        display: inline-block;
      }
    }
    .indicator-reverse {
      transform: scaleX(-1);
      margin-left: 20px;
    }
    @media screen and (max-width: 500px) {
      .event-basic-info.wizard-religion {
        .holiday-types {
          columns: 200px 1;
          .type {
            padding: 10px;
            &.selected {
              font-family: "Manrope-Bold";
            }
          }
        }
      }
    }
    
</style>
