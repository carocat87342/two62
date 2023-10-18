<template>
  <div class="md-layout" style="max-height: 100vh;">
    <div class="md-layout-item md-size-5" style="padding: 0; margin: 0;">
      <h4 class="md-title">
        <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon"><md-icon>arrow_back</md-icon></md-button>
      </h4>
    </div>
    <div class="md-layout-item md-size-95" style="max-height: 90vh;">
      <h4 class="md-title" style="margin-bottom: 0; line-height: 51px;">
        My Profile
      </h4>

      <div class="md-layout" style="overflow: auto; max-height: 90vh; margin-left: -15px;">
        <div class="md-layout-item md-large-size-33 md-medium-size-50 md-small-size-100">
          <personal-information :user-info="userInfo" :is-loading="isLoading"></personal-information>
        </div>
        <div class="md-layout-item md-large-size-33 md-medium-size-50 md-small-size-100">
          <dietary-constraints :user-info="userInfo" :is-loading="isLoading"></dietary-constraints>
        </div>
        <div class="md-layout-item md-large-size-33 md-medium-size-50 md-small-size-100">
          <my-events :user-info="userInfo" :is-loading="isLoading" :events="upComingEvents"  ></my-events>
        </div>
        <div class="md-layout-item md-large-size-33 md-medium-size-50 md-small-size-100">
          <holidays-celebrate :user-info="userInfo" :is-loading="isLoading"></holidays-celebrate>
        </div>
        <div class="md-layout-item md-large-size-33 md-medium-size-50 md-small-size-100">
          <my-special-dates :user-info="userInfo" :is-loading="isLoading"></my-special-dates>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueElementLoading from 'vue-element-loading'
import PersonalInformation from './PersonalInformation.vue'
import MyEvents from './MyEvents.vue'
import DietaryConstraints from './DietaryConstraints.vue'
import MySpecialDates from './MySpecialDates.vue'
import HolidaysCelebrate from './HolidaysCelebrate.vue'
import {LabelEdit} from '@/components'
import Me from '@/models/Me'
// import auth from '@/auth';
import {
  mapGetters
} from 'vuex'

export default {
  components: {
    VueElementLoading,
    PersonalInformation,
    MyEvents,
    DietaryConstraints,
    MySpecialDates,
    HolidaysCelebrate,
    LabelEdit
  },
  data () {
    return {
      // auth: auth,
      upComingEvents: [],
      userInfo: {},
      isLoading: false
    }
  },
  computed: {

  },
  mounted () {
    this.isLoading = true
    new Me().get().then(me => {
      this.userInfo = me[0]
      this.isLoading = false
    })
  },
  methods: {
    closePanel () {
      this.$emit('closePanel')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
