<template>
    <div class="md-layout event-invitees" style="margin-top: 16px;">
        <div class="md-layout-item md-size-100">
            <nav-tabs
                :tab-name="['Invitees', 'Automated Interactions']"
                color-button="danger"
                plain>

                <!-- here you can add your content for tab-content -->
                <template slot="tab-pane-1">
                    <div class="md-layout" style="margin-top: 21px;">
                        <div class="md-layout-item md-medium-size-60 md-size-60">
                            <md-card style="height: auto;">
                                <md-card-header class="md-card-header-text md-card-header-warning">
                                    <div class="card-text text-left">
                                        <h4 class="title" style="color: white;">
                                            Event invitees
                                        </h4>
                                    </div>
                                    <!--<md-button class="md-purple md-md pull-right md-icon-button" style="margin-top: 16px; margin-right: 12px;" @click="refreshList(true)" :disabled="working || noActions">
                                        <md-icon style="font-size: 12px;padding:0; margin: 0; height: 18px;">refresh</md-icon>
                                    </md-button>-->
                                    <md-button class="md-info md-md pull-right" style="margin-top: 16px; margin-right: 12px;" v-if="!inviteesExpanded"  @click="toggleInviteesForm" :disabled="working || noActions">Add Invitees</md-button>
                                    <md-button class="md-success md-md pull-right" style="margin-top: 16px; margin-right: 12px;" v-if="inviteesExpanded" @click="toggleInviteesForm" :disabled="working || noActions">Done</md-button>
                                </md-card-header>
                                <md-card-content class="">
                                    <vue-element-loading :active="working" spinner="ring" color="#FF547C"/>
                                    <div class="md-layout" v-if="inviteesExpanded">
                                        <div class="md-layout-item">
                                            <md-button class="md-purple md-md" style="margin-top: 16px; margin-right: 12px;" @click="importInvitees" :disabled="working || noActions">Import from spreadsheet</md-button>
                                            <md-button class="md-info md-md" style="margin-top: 16px; margin-right: 12px;" @click="invite" :disabled="working || noActions">Add manually</md-button>
                                        </div>
                                    </div>
                                    <div class="md-layout md-gutter" style="margin: 0;">
                                        <h5>Select event invitees by selecting group members</h5>
                                        <div class="md-layout-item md-size-100">
                                            <md-field style="border: none;" class="clear-margins">
                                                <multiselect :show-no-results="false" :internalSearch="false" @search-change="searchOptions" :reset-after="true" @select="selectMember" :close-on-select="true" :preserve-search="true" placeholder="" label="emailAddress" track-by="id" :searchable="true" :options="allOptions" :multiple="true" >
                                                    <template slot="clear" slot-scope="props">
                                                        <div class="multiselect__clear" v-if="allOptions.length" @mousedown.prevent.stop="clearSearch(props.search)"></div>
                                                    </template>
                                                    <template slot="caret"><span></span></template>
                                                    <template slot="placeholder" class="pull-right">
                                                        <md-icon>search</md-icon> Search groups and participants
                                                    </template>
                                                    <template slot="option" slot-scope="{option}">
                                                        <div v-if="option.type === 'group'">
                                                            <div class="md-menu-item members-group dropdown-with-icons">
                                                                {{option.name}} <span class="text-gray">&nbsp;({{ option.members ? option.members.length : 0 }})</span>
                                                            </div>
                                                        </div>
                                                        <div v-if="option.type === 'person'">
                                                            <div class="md-menu-item" v-if="option.firstName || option.lastName">
                                                                {{ option.firstName }} {{ option.lastName }} <span class="text-gray">&nbsp;({{ option.emailAddress }})</span>
                                                            </div>
                                                            <div class="md-menu-item" v-else-if="option.displayName">
                                                                {{ option.displayName }} <span class="text-gray">&nbsp;({{ option.emailAddress }})</span>
                                                            </div>
                                                            <div class="md-menu-item" v-else>
                                                                {{ option.emailAddress }}
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template slot="tag" slot-scope="{option}">
                                                        <span style="display: none;"></span>
                                                    </template>
                                                    <template slot="noOptions">
                                                        All the available members are selected.
                                                    </template>
                                                </multiselect>
                                            </md-field>
                                        </div>
                                        <div class="md-layout-item md-size-100" v-if="eventInvitees.length">

                                            <md-table class="text-left " v-model="groups" >
                                                <tr class="md-table-row md-table-head-container">
                                                    <th class="md-table-head" style="width: 50%;">Group</th>
                                                    <th class="md-table-head md-numeric md-xs" style="width: 25%;">Invitees</th>
                                                    <th class="md-table-head md-numeric" style="width: 24%;">RSVP</th>
                                                    <th class="md-table-head" style="width: 1%;"></th>
                                                </tr>
                                                <template v-for="item in groups">
                                                    <tr class="md-table-row" style="cursor: pointer;"  @click="expandGroup(item)" :class="{'visible-row':item.expanded}">
                                                        <td class="md-table-cell">{{item.name}}</td>
                                                        <td class="md-table-cell md-numeric">{{item.members.length}}</td>
                                                        <td class="md-table-cell md-numeric">{{groupStats(item)}}</td>
                                                        <td class="md-table-cell md-numeric">
                                                            <md-button class="md-danger md-round md-xs md-just-icon" :disabled="noActions" @click="unselectMembers(item)">
                                                                <md-icon>remove</md-icon>
                                                                <md-tooltip md-direction="bottom">Unselect this group</md-tooltip>
                                                            </md-button>
                                                        </td>
                                                        <td class="md-table-cell">
                                                            <md-icon v-if="!item.expanded">arrow_drop_down</md-icon>
                                                            <md-icon v-if="item.expanded">arrow_drop_up</md-icon>
                                                        </td>
                                                    </tr>
                                                    <tr class="bg-white" v-if="item.expanded" :class="{'visible-row':item.expanded}">
                                                        <td class="md-table-cell text-center" colspan="4" style="max-width: 1px; padding: 24px;">
                                                            <event-invitee-group-details @unselect-member="unselectMember" :group.sync="item"></event-invitee-group-details>
                                                        </td>
                                                    </tr>
                                                </template>
                                            </md-table>
                                        </div>
                                        <div class="md-layout-item md-size-100 text-center" style="margin-top: 8px;" v-if="!eventInvitees.length">
                                            <md-icon>arrow_upward</md-icon>
                                            <h4>Search groups or members and invite them to this event</h4>
                                        </div>
                                    </div>
                                </md-card-content>
                                <md-card-actions>
                                    <div class="text-left">{{eventInvitees.length}} / {{eventData.numberOfParticipants}} expected invitees</div>
                                </md-card-actions>
                            </md-card>

                        </div>
                        <div class="md-layout-item md-medium-size-40 md-size-40">
                            <md-card class="md-card-plain">
                                <md-card-content>
                                    <div class="text-left">
                                        <h5>Invitation includes:</h5>
                                        <div v-for="(option, index) in InviteeTypes" :key="index">
                                            <md-radio v-model="eventData.participantsType" :value="option">{{option}}</md-radio>
                                        </div>
                                    </div>
                                </md-card-content>
                            </md-card>
                        </div>
                    </div>
                </template>
                <template slot="tab-pane-2">
                    <interactions-list :event-data.sync="eventData"></interactions-list>
                </template>
            </nav-tabs>
        </div>

        <import-members-panel   ref="importModalOpen"></import-members-panel>

    </div>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

import TeamMember from '@/models/TeamMember'
import Team from '@/models/Team'
import EventInvitee from '@/models/EventInvitee'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'

import VueElementLoading from 'vue-element-loading'
import LabelEdit from '@/components/LabelEdit'
import InteractionsList from '@/pages/app/Events/components/EventBlocks/InteractionsList'
import EventInviteeGroupDetails from '@/pages/app/Events/components/EventInviteeGroupDetails'

import MemberEditorPanel from '@/pages/app/Members/MemberEditorPanel'
import ImportMembersPanel from '@/pages/app/Members/ImportMembersPanel'

import { NavTabs, Tabs } from '@/components'
import _ from 'underscore'

export default {
  name: 'event-invitees',
  components: {
    VueElementLoading,
    LabelEdit,
    InteractionsList,
    NavTabs,
    EventInviteeGroupDetails,
    MemberEditorPanel,
    ImportMembersPanel
  },
  props: {
    eventData: Object
  },
  data: () => ({

    working: false,
    noActions: false,
    availableTeams: [],
    availableMembers: [],
    allOptions: [],
    eventInvitees: [],
    groups: [],
    inviteesExpanded: false,
    InviteeTypes: ['Guests Only', 'Guests and spouse', 'Guests and families', 'Guests siblings'],
    rolesList: [
      { id: 'ADMIN', title: 'Administrator'},
      { id: 'co_producer', title: 'Co-Producer'},
      { id: 'manager', title: 'Manager'},
      { id: 'team_leader', title: 'Team Leader'},
      { id: 'employee', title: 'Employee'},
      { id: 'guest', title: 'Guest'}
    ],
    permissionsList: [
      { id: 'view', title: 'View', checked: false},
      { id: 'create', title: 'Create', checked: false},
      { id: 'edit', title: 'Edit', checked: false},
      { id: 'request_budget', title: 'Request Budget', checked: false},
      { id: 'sign_off', title: 'Sign-Off', checked: false},
      { id: 'vote', title: 'Vote', checked: false}
    ]

  }),
  methods: {
    ...mapMutations('teams', ['setImportModal']),
    unselectMembers (group) {
      group.members.forEach((member) => {
        this.unselectMember(member)
      })
    },
    toggleInviteesForm () {
      this.inviteesExpanded = !this.inviteesExpanded
    },
    importInvitees () {
      this.$refs.importModalOpen.toggleModal(true)
      // window.currentPanel = this.$showPanel({
      //     component: ImportMembersPanel,
      //     cssClass: "md-layout-item md-size-100 h65 transition36",
      //     openOn: "bottom",
      //     props: {
      //
      //     }
      // });
    },
    invite () {
      let groupsWithoutAll = _.filter(this.availableTeams, (g) => { return g.id !== 'all' })
      let groups = []

      /* if (groupsWithoutAll.length > 0){
                    groups.push(groupsWithoutAll[0]);
                } */

      window.currentPanel = this.$showPanel({
        component: MemberEditorPanel,
        cssClass: 'md-layout-item md-size-40 transition36 ',
        openOn: 'right',
        props: {
          team: this.groupData,
          teamMember: { id: 'new', permissions: 'view', role: 'guest', groups: groups},
          permissionsList: this.permissionsList,
          canEditPermissions: false,
          rolesList: this.rolesList,
          groupsList: groupsWithoutAll
        }
      })
    },
    refreshList (force) {
      this.working = true
      let tasks = [this.loadTeams(force), this.loadAllMembers(force), this.loadEventInvitees(force)]
      Promise.all(tasks).then(() => {
        this.updateAllOptions()
        this.updateGroups()
        this.working = false
      })
    },
    updateGroups () {
      let updatedGroups = []
      let invitees = JSON.parse(JSON.stringify(this.eventInvitees))
      invitees.forEach((invitee) => {
        let personGroups = invitee.person.groups
        let personGroup
        if (personGroups.length > 0) {
          personGroup = personGroups[0]
        } else {
          personGroup = {id: 'unknown', name: 'All Guests'}
        }

        let group = _.findWhere(updatedGroups, {id: personGroup.id})
        if (!group) {
          group = personGroup
          group.members = []
          group.members.push(invitee)
          updatedGroups.push(group)
        } else {
          if (!group.members) {
            group.members = []
          }
          group.members.push(invitee)
        }
      })
      this.groups = updatedGroups
    },
    loadTeams (force) {
      let t = Team.fetch(this, force)
      t.then(teams => {
        this.availableTeams = teams
      })
      return t
    },
    loadAllMembers (force) {
      let m = TeamMember.fetch(this, force)
      m.then(allMembers => {
        this.availableMembers = allMembers
      })
      return m
    },
    loadEventInvitees (force) {
      let calendar = new Calendar({id: this.$auth.user.defaultCalendarId})
      let calendarEvent = new CalendarEvent(this.eventData)

      let e = EventInvitee.fetch(this, calendar, calendarEvent, force)
      e.then(invitees => {
        this.eventInvitees = invitees
      })
      return e
    },
    updateAllOptions () {
      this.allOptions = [...this.availableTeams]
      this.allOptions = _.filter(this.allOptions, (i) => {
        return i.id !== 'all' && _.findIndex(this.eventInvitees, (e) => {
          return e.person.id === i.id
        }) === -1
      })
    },
    clearSearch (query) {
      this.updateAllOptions()
    },
    searchOptions (query) {
      if (query) {
        let filteredGroups = _.filter(JSON.parse(JSON.stringify(this.allOptions)), (i) => {
          let isGroupName = i.name.toLowerCase().startsWith(query.toLowerCase())
          let members = _.filter(i.members, (m) => {
            return m.displayName.toLowerCase().startsWith(query.toLowerCase()) || m.emailAddress.toLowerCase().startsWith(query.toLowerCase())
          })
          if (members.length) {
            i.members = members
          }
          return isGroupName || members.length
        })
        this.allOptions = [...filteredGroups]
      } else {
        this.updateAllOptions()
      }
    },
    selectMember (item) {
      this.working = true
      let p
      if (item.type === 'person') {
        p = this.selectSingleMember(item)
      } else if (item.type === 'group') {
        p = this.selectGroup(item)
      }
      p.then(() => {
        EventInvitee.saveInvitees(this, this.eventData, this.eventInvitees)
        this.working = false
      })
    },
    selectGroup (item) {
      return new Promise((resolve, reject) => {
        let promises = []
        item.members.forEach((member) => {
          promises.push(this.selectSingleMember(member))
        })
        Promise.all(promises).then(() => {
          this.updateAllOptions()
          this.updateGroups()
          resolve()
        })
      })
    },
    selectSingleMember (item) {
      let i = new Promise((resolve, reject) => { res() })
      let index = _.findIndex(this.eventInvitees, (e) => {
        return e.person.id === item.id
      })
      if (index === -1) {
        let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
        let calendarEvent = new CalendarEvent(this.eventData)
        i = new EventInvitee({ person: { id: item.id } }).for(calendar, calendarEvent).save()
        i.then(res => {
          this.eventInvitees.unshift(res.item)
          this.updateAllOptions()
          this.updateGroups()
          this.$forceUpdate()
        })
      }
      return i
    },
    unselectMember (item) {
      this.working = true
      let calendar = new Calendar({id: this.$auth.user.defaultCalendarId})
      let calendarEvent = new CalendarEvent(this.eventData)
      let i = new EventInvitee(item).for(calendar, calendarEvent).delete().then(res => {
        let index = _.findIndex(this.eventInvitees, (e) => { return e.id === item.id })
        if (index > -1) {
          this.eventInvitees.splice(index, 1)
          EventInvitee.saveInvitees(this, this.eventData, this.eventInvitees)
          this.updateAllOptions()
          this.updateGroups()
          this.working = false
        }
      })
    },
    memberDetailsChanged (val, fieldName, item) {

    },
    openInteractionsManagementPanel () {
      this.$router.push({name: 'InviteesManagement', params: { id: this.eventData.id} })
      location.reload() // TODO Remove this
    },
    expandGroup (item) {
      if (item.expanded) {
        item.expanded = false
      } else {
        this.groups.forEach((g) => {
          g.expanded = false
        })
        item.expanded = true
      }
      this.$forceUpdate()
    },
    groupStats (group) {
      let percent = 0
      let responses = 0
      let attending = 0
      let totalInvitees = group.members ? group.members.length : 0
      /* this.eventInvitees.forEach((invitee)=>{
                    let theGroup = _.findWhere(invitee.person.groups, {id: group.id});
                    if (theGroup && invitee.inviteeResponse){
                        responses++;
                        if (invitee.inviteeResponse.attending){
                            attending++;
                        }
                    }
                }); */
      /* this.groups.forEach(aGroup => {
                    if (aGroup.members){
                        aGroup.members.forEach(member => {
                            let invitee = _.find(this.eventInvitees, (invitee)=>{ return invitee.id === member.id});
                            if (invitee){
                                if (invitee.inviteeResponse){
                                    responses++;
                                    if (invitee.inviteeResponse.attending){
                                        attending++;
                                    }
                                }
                            }
                        });
                    }
                }); */

      if (group.members) {
        group.members.forEach(member => {
          let invitee = _.find(this.eventInvitees, (invitee) => { return invitee.id === member.id })
          if (invitee) {
            if (invitee.inviteeResponse) {
              responses++
              if (invitee.inviteeResponse.attending) {
                attending++
              }
            }
          }
        })
      }
      percent = ((attending / totalInvitees) * 100).toFixed(0)

      return `${percent}%`
    },
    totalStats () {

    }
  },
  created () {

  },
  mounted () {
    this.$root.$on('member-added', (member) => {
      this.working = true
      this.$nextTick(() => {
        this.availableMembers.push(member)
        member.groups.forEach((g) => {
          if (!_.findWhere(this.availableTeams, {id: g.id})) {
            this.availableTeams.push(g)
          }
        })
        this.updateAllOptions()
        this.selectSingleMember(member).then(r => {
          this.working = false
        })
      })
    })
    this.working = true
    this.$auth.currentUser(this, true, () => {
      if (this.eventData && this.eventData.id) {
        this.refreshList(false)
      }
    })
  },
  computed: {
  },
  watch: {
    eventData (newVal, oldVal) {
      if (this.eventData && this.eventData.id) {
        this.refreshList(false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/md/_colors.scss';
    .members-group {
        font-weight: 500;
        &:hover {
            .md-icon {
                color: white;
            }
        }
    }

    .visible-row {
        background-color: $grey-50 !important;
        font-weight: 500;
    }
    .not-visible-row {
        cursor: pointer;
    }
    /*.multiselect__element {
      &:hover {
        .md-icon {
          color: white;
        }
      }
    }*/
</style>
