<template>
  <div style="width:100%">
    <md-card>
      <md-card-header class="md-card-header-icon md-card-header-green">
        <div class="card-icon" style="padding: 12px;">
          <md-icon>ballot</md-icon>
        </div>
        <h4 class="title profile-title">Holidays</h4>
      </md-card-header>
      <md-card-content>
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C"/>
        <div class="md-layout">
          <div v-for="(item, index) in holidayGroups" :key="item.id" class="md-layout-item md-size-50" style="text-align: left;">
            <md-checkbox v-model="item.flagOn" @change="toggleHolidayGroup(index)">{{item.title}}</md-checkbox>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>
<script>
import VueElementLoading from 'vue-element-loading'
// import auth from '@/auth';
import Me from '@/models/Me'
import _ from 'underscore'

export default {
  components: {
    VueElementLoading
  },
  props: {
    userInfo: Object,
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // auth: auth,
      holidayGroups: [
        { id: 'christian', title: 'Christian', flagOn: false },
        { id: 'islam', title: 'Islam', flagOn: false },
        { id: 'hindu', title: 'Hindu', flagOn: false },
        { id: 'buddhism', title: 'Buddhism', flagOn: false },
        { id: 'taoism', title: 'Taoism', flagOn: false },
        { id: 'shinto', title: 'Shinto', flagOn: false },
        { id: 'sikhism', title: 'Sikhism', flagOn: false },
        { id: 'judaism', title: 'Judaism', flagOn: false }
      ]
    }
  },
  methods: {
    toggleHolidayGroup (index) {
      this.updateUser()
    },
    updateUser () {
      let holidays = []
      for (let i = 0; i < this.holidayGroups.length; i++) {
        if (this.holidayGroups[i].flagOn) {
          holidays.push(this.holidayGroups[i].id)
        }
      }
      this.isLoading = true
      new Me({id: this.userInfo.id, celebratedHolidaysGroups: holidays}).save().then(res => {
        this.isLoading = false
        this.$notify(
          {
            message: 'Profile saved successfully',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'success'
          })
      })
    }
  },
  watch: {
    userInfo (newVal, oldVal) {
      let holidays = newVal.celebratedHolidaysGroups
      if (holidays) {
        for (let i = 0; i < holidays.length; i++) {
          let item = _.findWhere(this.holidayGroups, {id: holidays[i]})
          item.flagOn = true
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
