<template>
  <div class="md-layout event-group-details">
    <div class="md-layout-item">
      <md-card style="min-height: 50%;">
        <md-card-header class="md-card-header-text md-card-header-warning">
          <div class="card-text">
            <h4 class="title" style="color: white;">
              {{groupData ? groupData.title : ''}}
              <small style="display: block;">Details</small>
            </h4>
          </div>
          <md-button class="md-info md-sm pull-right" style="margin: 16px 6px;" @click="addInvitee" :disabled="working || noActions">Add Invitee</md-button>
        </md-card-header>
        <md-card-content>
          <vue-element-loading :active="working" spinner="ring" color="#FF547C" />

          <div class="md-layout md-gutter" style="margin: 0;">
            <div class="md-layout-item md-size-100">
              <md-field>
                <multiselect :reset-after="true" @select="selectInvitee" :close-on-select="false" :preserve-search="true" placeholder="Search invitees" label="emailAddress" track-by="id" :searchable="true" :options="availableInvitees" :multiple="true" >
                  <template slot="tag" slot-scope="{option}">
                    <span style="display: none;"></span>
                  </template>
                  <template slot="noOptions">
                    All the available invitees are selected.
                  </template>
                </multiselect>
              </md-field>
            </div>

            <div class="md-layout-item md-size-100" style="margin-top: 8px;">

              <md-table v-model="groupData.invitees" class="table-striped table-hover">
                <md-table-row slot="md-table-row" slot-scope="{ item }" :key="item.id">
                  <md-table-cell md-label="Email Address" style="width: 40%;">
                    <label-edit tabindex="1"  :scope="item" :text="item.emailAddress" field-name="emailAddress"  @text-updated-blur="inviteeDetailsChanged" @text-updated-enter="inviteeDetailsChanged"></label-edit>
                  </md-table-cell>
                  <md-table-cell md-label="First Name" style="width: 20%;">
                    <label-edit tabindex="2" :scope="item" :text="item.firstName" field-name="firstName"  @text-updated-blur="inviteeDetailsChanged" @text-updated-enter="inviteeDetailsChanged"></label-edit>
                  </md-table-cell>
                  <md-table-cell md-label="Last Name" style="width: 20%;">
                    <label-edit tabindex="2" :scope="item"  :text="item.lastName" field-name="lastName"  @text-updated-blur="inviteeDetailsChanged" @text-updated-enter="inviteeDetailsChanged"></label-edit>
                  </md-table-cell>
                  <md-table-cell md-label="" style="width: 20%;" class="text-right">
                    <div style="white-space: nowrap;">
                      <md-button tabindex="4" class="md-success md-sm" style="width: auto;" :disabled="noActions" @click="saveInvitee(item)" v-if="item.id === 'new'">
                        Save
                      </md-button>
                      <md-button tabindex="5" class="md-danger md-simple md-sm" style="width: auto;" @click="cancelAddInvitee(item)" v-if="item.id === 'new'">
                        Cancel
                      </md-button>
                    </div>
                    <md-button class="md-danger md-round md-just-icon" :disabled="noActions" @click="removeInvitee(item)" v-if="item.id !== 'new'">
                      <md-icon>delete</md-icon>
                      <md-tooltip md-direction="bottom">Remove from this group</md-tooltip>
                    </md-button>
                  </md-table-cell>
                </md-table-row>
              </md-table>

            </div>
          </div>

          <!--<div class="text-center" v-if="!allInvitees.length && !groupData.invitees && !groupData.invitees.length">
            <h4>You do not have any invitees yet</h4>
            <md-button class="md-info" @click="addMember">
              <md-icon>person</md-icon> Add Invitee
            </md-button>
            <md-button class="md-purple" @click="assignMembers">
              <md-icon>group</md-icon> Import Invitees
            </md-button>
          </div>-->
          <div v-if="!groupData">
            Select group to see its details
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>
<script>

import EventInteraction from '@/models/EventInteraction'
import Calendar from '@/models/Calendar'
import GroupMembersPanel from './GroupMembersPanel'
import EventInvitee from '@/models/EventInvitee'
import LabelEdit from '@/components/LabelEdit'
import _ from 'underscore'

export default {
  name: 'event-group-details',
  components: { LabelEdit },
  props: {
    eventData: {
      type: Object,
      default: () => { return { title: ''} }
    },
    groupData: {
      type: Object
    }
  },
  data () {
    return {
      working: true,
      noActions: false,
      allInvitees: [],
      availableInvitees: []
    }
  },
  mounted () {
    if (this.eventData) {
      this.working = false
    }
  },
  methods: {
    addMember () {
      if (this.groupData.invitees.length && this.groupData.invitees[0].id === 'new') return

      this.groupData.invitees.unshift({id: 'new', firstName: null, lastName: null, emailAddress: null})
    },
    cancelAddMember () {
      if (this.groupData.invitees.length && this.groupData.invitees[0].id !== 'new') return

      this.groupData.invitees.shift()
    },
    saveMember (item) {
      this.noActions = true
      if (item.id === 'new') {
        item.id = null
        delete item['id']
        // alert(JSON.stringify(this.groupData))
        new EventInvitee(item).for(this.groupData).save().then(res => {
          this.groupData.invitees.shift()
          this.groupData.invitees.push(res)
          this.updateAvailableMembers()
        }).finally(() => {
          this.noActions = false
        })
      } else {
        new EventInvitee(item).for(this.groupData).save().then(res => {
          this.groupData.invitees.push(res)
          this.updateAvailableMembers()
        }).finally(() => {
          this.noActions = false
        })
      }
    },
    removeMember (item) {
      this.noActions = true
      new EventInvitee(item).for(this.groupData).delete().then(res => {
        let index = _.findIndex(this.groupData.invitees, (i) => { return i.id === item.id })
        this.groupData.invitees.splice(index, 1)
        this.updateAvailableMembers()
        this.noActions = false
      })
    },
    selectMember (item) {
      this.saveMember(item)
    },
    assignMembers () {
      window.currentPanel = this.$showPanel({
        component: GroupMembersPanel,
        cssClass: 'md-layout-item md-size-50 transition36 bg-grey',
        openOn: 'right',
        disableBgClick: false,
        props: {
          eventData: this.eventData,
          groupData: this.groupData
        }
      })
    },
    saveGroup () {

    },
    memberDetailsChanged (val, fieldName, item) {
      item[fieldName] = val
    },
    updateAvailableMembers () {
      this.availableInvitees = _.filter(this.allInvitees, (i) => { return !_.findWhere(this.groupData.invitees, {id: i.id}) })
    }
  },
  watch: {
    groupData (newVal, oldVal) {
      if (!this.groupData.invitees) {
        this.groupData.invitees = []
      }
      new EventInvitee().get().then(res => {
        this.allInvitees = res
        this.updateAvailableMembers()
        this.working = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/md/_colors.scss';

</style>
