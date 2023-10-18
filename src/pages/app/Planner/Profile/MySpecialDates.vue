<template>
  <div style="width:100%">
    <md-card>
      <md-card-header class="md-card-header-icon md-card-header-rose">
        <div class="card-icon" style="padding: 12px;">
          <md-icon>event_note</md-icon>
        </div>
        <h4 class="title profile-title" style="padding-left: 0;">My Special Dates</h4>
      </md-card-header>
      <md-card-content class="company-profile-section">
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C"/>
        <md-table>
          <md-table-row v-for="(item, index) in specialDaysList" :key="index">
            <md-table-cell v-if="item.canDelete">
              <label-edit :text="item.title"  :field-name="`title__${index}`"  @text-updated-blur="valueChanged" @text-updated-enter="valueChanged"></label-edit>
            </md-table-cell>
            <md-table-cell v-else>
              {{item.title}}
            </md-table-cell>
            <md-table-cell class="text-right">
              <label-edit :text="item.dateString" :field-name="`dateString__${index}`" mask="99/99/9999"  @text-updated-blur="valueChanged" @text-updated-enter="valueChanged"></label-edit>
            </md-table-cell>
            <md-table-cell>
              <md-button v-show="item.canDelete" class="md-simple md-red md-just-icon md-xs" @click="removeSpecialDay(index)"><md-icon>delete</md-icon></md-button>
            </md-table-cell>
          </md-table-row>
          <md-table-row >
            <md-table-cell colspan="3">
              <md-button class="md-simple md-red" style="width: 100%;" @click="addSpecialDay"><md-icon>add</md-icon>Add another special day</md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
        <!--<div class="md-layout mb16">
          <div class="md-layout-item md-size-100 md-small-size-100">
            <md-datepicker v-model="birthdayDate" >
              <label >Birthday Date</label>
            </md-datepicker>
          </div>
        </div>
        <div class="md-layout mb16">
          <div class="md-layout-item md-size-100 md-small-size-100">
            <md-datepicker v-model="workingSinceDate" >
              <label >workingSince Date</label>
            </md-datepicker>
          </div>
        </div>

        <new-special-date :DateList="specialDateList" ></new-special-date>-->

      </md-card-content>

    </md-card>
  </div>
</template>

<script>

import VueElementLoading from 'vue-element-loading'
import Me from '@/models/Me'
import _ from 'underscore'
import moment from 'moment'
import {LabelEdit} from '@/components'

export default {
  components: {
    VueElementLoading,
    LabelEdit
  },
  data () {
    return {
      specialDaysList: [
        { id: 'birthday', title: 'Birthday', dateMillis: null, dateString: null, canDelete: false },
        { id: 'workingSince', title: 'Working since', dateMillis: null, dateString: null, canDelete: false }
      ]
    }
  },
  props: {
    userInfo: Object,
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  mounted () {

  },
  methods: {
    valueChanged (val, fieldName) {
      let splittedFieldName = fieldName.split('__')
      let field = splittedFieldName[0]
      let index = Number(splittedFieldName[1])

      let specialDay = this.specialDaysList[index]
      specialDay[field] = val

      this.updateUser()
    },
    addSpecialDay () {
      this.specialDaysList.push({
        title: null,
        dateMillis: null,
        dateString: null,
        canDelete: true
      })
    },
    removeSpecialDay (index) {
      this.specialDaysList.splice(index, 1)
    },
    updateUser () {
      let specialDates = []
      for (let i = 2; i < this.specialDaysList.length; i++) {
        let specialDay = this.specialDaysList[i]
        specialDates.push({
          id: specialDay.id,
          description: specialDay.title,
          theDate: moment(specialDay.dateString, 'MM/DD/YYYY').toDate().getTime()
        })
      }

      this.isLoading = true

      new Me({id: this.userInfo.id, dietaryConstraints: dietaryConstraints}).save().then(res => {
        this.userInfo.dietaryConstraints = dietaryConstraints
        this.isLoading = false
        this.$notify(
          {
            message: 'Profile saved successfully',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
      })
    },
    addNewSpecialDateItem () {
      /* let checkEmptyRows= this.specialDateList.filter(row=>row.title=== null)
        if (checkEmptyRows.length >= 1 && this.specialDateList.length > 0)
          return
        this.specialDateList.push({
          title:'',
          selectedDate:null,
          editable:false
        }) */

    }
  },
  watch: {
    userInfo (newVal, oldVal) {
      let specialDates = newVal.importantDates
      let birthday = newVal.birthday
      let workingSince = newVal.companyStartDate

      if (birthday) {
        let birthdayItem = _.findWhere(this.specialDaysList, {id: 'birthday'})
        if (birthdayItem) {
          birthdayItem.dateMillis = birthday
          birthdayItem.dateString = moment(birthday).format('YYYY/MM/DD')
        }
      }

      if (workingSince) {
        let workingSinceItem = _.findWhere(this.specialDaysList, {id: 'workingSince'})
        if (workingSinceItem) {
          workingSinceItem.dateMillis = workingSince
          workingSinceItem.dateString = moment(workingSince).format('YYYY/MM/DD')
        }
      }

      this.specialDaysList.splice(2, this.specialDaysList.length)

      if (specialDates) {
        for (let i = 0; i < specialDates.length; i++) {
          let item = specialDates[i]
          this.specialDaysList.push({
            id: item.id,
            title: item.description,
            dateMillis: item.theDate,
            dateString: moment(item.theDate).format('YYYY/MM/DD')
          })
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .add-date{
    width: 66px;
    height: 12px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: left;
    color: #999999;
  }

  .my-special-date{
    width: 63px;
    height: 64px;
    border-radius: 3px;
    box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
    background-image: linear-gradient(to right, #23c4d8, #00acc1);
  }
  .my-special-date-main{
    width: 349px;
    height: 302px;
    border-radius: 6px;
    // box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.14);
    // background-color: #ffffff;
  }

  .add-date{
    cursor: pointer;

  }
</style>
