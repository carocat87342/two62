<template>
  <div class="invitees-management">
    <vue-element-loading
      :active="isLoading"
      spinner="ring"
      is-full-screen
      color="#FF547C"
      isFullScreen
    />
    <!--<md-button name="event-planner-tab-invitees-management-event-page" class="event-planner-tab-invitees-management-event-page md-info" @click="goToComponent('')">
            Event Page
    </md-button>-->

    <div class="md-layout">
      <div class="md-layout-item md-size-30" style="display: none;">
        <md-card>
          <md-card-header class="md-card-header-icon md-card-header-warning">
            <div class="card-icon">
              <md-icon>contacts</md-icon>
            </div>
            <h4 class="title2">Select Invitees</h4>
          </md-card-header>
          <md-card-content>
            <md-button
              name="event-planner-tab-invitees-management-manage-groups"
              class="event-planner-tab-invitees-management-manage-groups md-info pull-right md-sm"
              @click="showManageGroupSection()"
            >Manage Groups</md-button>

            <md-autocomplete
              data-vv-name="eventGroup"
              :md-options="possibleEventGroupsList"
              @md-selected="eventGroupSelected"
              class="change-icon-order select-with-icon mb16"
              :class="[{'md-error': errors.has('occasion')}]"
              :md-open-on-focus="false"
              value
            >
              <label>Search Groups</label>

              <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <!--<md-highlight-text :md-term="term">{{ item.title }}</md-highlight-text>-->
                <span>{{ item.title }}</span>
              </template>

              <template
                slot="md-autocomplete-empty"
                slot-scope="{ term }"
              >No groups match your search, you can create a new group.</template>

              <!--<span class="md-error" v-if="errors.has('occasion')">This field is required</span>-->
            </md-autocomplete>

            <div>
              <md-chip
                v-for="option in selectedEventGroups"
                :key="option.id"
                :md-deletable="true"
                :md-clickable="true"
                class="md-rose"
                @md-delete="eventGroupUnselected($event, option)"
              >{{option.title}}</md-chip>
            </div>

            <!--<div class="md-layout">
                              <label class="md-layout-item md-size-10">
                                  Invitees Group
                              </label>
                              <div class="md-layout-item md-size-30">
                                  <md-field class="invitees-group-list">
                                      <md-select v-model="selected_audience" name="select">
                                          <md-option v-for="(option, index) in audienceList" :key="index"
                                                     :value="option.value">{{ option.title }}
                                          </md-option>
                                      </md-select>
                                  </md-field>
                              </div>
                              <div class="md-layout-item md-size-40">
                                  <md-button name="event-planner-tab-invitees-management-save"
                                             class="md-info" @click="goToComponent('')">
                                      Save
                                  </md-button>
                                  <md-button name="event-planner-tab-invitees-management-manage-groups"
                                             class="md-info" @click="showManageGroupSection()">
                                      Manage Groups
                                  </md-button>
                              </div>
            </div>-->
            <!--<div class="md-layout">-->
            <!--<div class="md-layout-item md-size-100">-->
            <!--<h3>Select existing group or</h3>-->
            <!--<md-button class="md-success"> Create new Group </md-button>-->
            <!--</div>-->
            <!--<div class="md-layout-item md-size-100">-->

            <!--</div>-->
            <!--</div>-->
            <!--<div class="md-layout">-->
            <!--<div class="md-layout-item md-size-100">-->
            <!--<label>What is the nature of the group?</label>-->
            <!--</div>-->
            <!--<div class="md-layout-item md-size-100">-->
            <!--<md-radio v-model="nature_group" :value="1">Invited alone</md-radio>-->
            <!--<md-radio v-model="nature_group" :value="2">Invited with spouses only</md-radio>-->
            <!--<md-radio v-model="nature_group" :value="3">Invited with other team</md-radio>-->
            <!--<md-radio v-model="nature_group" :value="4">Invited with family</md-radio>-->
            <!--<md-radio v-model="nature_group" :value="5">Invited with customers</md-radio>-->
            <!--</div>-->
            <!--</div>-->
          </md-card-content>
        </md-card>
      </div>
      <!--<md-card class="md-layout-item rsvp-card">
                <div class="rsvp-card_icon">
                    <md-icon>notifications</md-icon>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-100 md-form-label">
                        Send RSVP?
                    </label>
                    <div class="md-layout-item md-size-100">
                        <md-checkbox v-model="send_rsvp">
                            A notification will be sent  to invitees that haven’t confirmed their status.
                        </md-checkbox>
                    </div>
                </div>
                <div class="md-layout">
                    <label class="md-layout-item md-size-100 md-form-label">
                        When would you like to set this?
                    </label>
                    <div class="md-layout-item md-size-100">
                        <md-radio v-model="when_set_email" :value="1">Send email 3 weeks before the event</md-radio>
                        <md-radio v-model="when_set_email" :value="2">Send email 3 days before the event</md-radio>
                    </div>
                </div>
      </md-card>-->
      <div class="md-layout-item md-size-70">
        <md-card v-if="interactionsList">
          <md-card-header class="md-card-header-icon md-card-header-rose">
            <div class="card-icon">
              <md-icon>contacts</md-icon>
            </div>
            <h4 class="title2">Manage Interactions</h4>
          </md-card-header>
          <md-card-content class="md-layout">
            <div class="md-layout-item md-size-100">
              <p
                class="desc"
              >Automate the interactions with the audience selected for this event. Select the text that will be written in the mail for each type of interaction.</p>

              <!-- Interactions List -->
              <div class="interactions-list" v-if="interactionsList.length">
                <div
                  class="interactions-list_item"
                  v-for="(item,index) in interactionsList"
                  :key="index"
                  @click="selectInteraction(item)"
                  :class="{selected_interaction : selectedInteraction && item.id===selectedInteraction.id}"
                >
                  <div class="md-layout">
                    <div class="md-layout-item">
                      <h4 class="interaction-title">
                        <md-checkbox v-model="item.enabled" @change="checkItem(item)"></md-checkbox>
                        {{item.title}}
                      </h4>
                    </div>
                  </div>
                  <div
                    class="md-layout"
                    v-if="selectedInteraction && item.id===selectedInteraction.id"
                  >
                    <div class="md-layout-item md-size-100">
                      <div class="send-date-field md-layout">
                        <label class="md-form-label md-layout-item md-size-25">Send Date</label>
                        <md-datepicker class="md-layout-item md-size-75" v-model="item.sendOnDate">
                          <label></label>
                        </md-datepicker>
                      </div>
                    </div>
                    <div class="md-layout-item md-size-100">
                      <div class="send-date-field md-layout">
                        <label
                          class="md-form-label md-layout-item md-size-65"
                        >Days to send before the event</label>
                        <md-field class="md-layout-item md-size-35">
                          <md-input type="number" v-model="item.sendDaysBeforeEvent"></md-input>
                        </md-field>
                      </div>
                    </div>
                    <div class="md-layout-item md-size-100">
                      <div class="send-date-field">
                        <md-checkbox v-model="item.include_link" :id="`include-${index}`"></md-checkbox>
                        <label
                          style=" margin:  14px 16px 14px 0"
                          :for="`include-${index}`"
                        >Include link to event page</label>
                      </div>
                      <div style="margin-bottom : 1em;">
                        Still don't have one?
                        <a href="javascript:void(0)" @click="goToComponent('')">click here</a>
                        to create event page
                      </div>
                    </div>
                    <div class="md-layout-item md-size-100">
                      <div class="text-right">
                        <md-button class="md-success md-sm" @click="editInteraction(item)">Save</md-button>
                        <md-button
                          class="md-rose md-sm"
                          @click="editInteractionDesign(item)"
                        >Edit Design</md-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- ./Interactions List -->
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import EventComponent from '@/models/EventComponent'
import VueElementLoading from 'vue-element-loading'
// import auth from '@/auth';
import EventInteraction from '@/models/EventInteraction'
import moment from 'moment'
import _ from 'underscore'
import EventInviteeGroup from '@/models/EventInviteeGroup'

// Get dummy images from EventPageHeaderImage
import EventPageHeaderImage from '@/models/EventPageHeaderImage'
import ManageInviteesGroups from './Modals/ManageInviteesGroups.vue'
import EditInteractionDesign from './Modals/EditInteractionDesign.vue'

export default {
  name: 'invitees-management',
  components: {
    VueElementLoading
  },
  props: {
    event
  },
  data: () => ({
    // auth: auth,
    isLoading: true,
    selected_audience: null,
    nature_group: null,
    send_rsvp: false,
    when_set_email: null,
    audienceList: [],
    interactions: [],
    interactionsList: null,
    selectedInteraction: null,
    templateImage: null,
    possibleEventGroupsList: [],
    selectedEventGroups: []
  }),
  methods: {
    eventGroupSelected (group) {
      this.possibleEventGroupsList.splice(
        _.findIndex(this.possibleEventGroupsList, g => {
          return g.id === group.id
        }),
        1
      )
      this.selectedEventGroups.push(group)
      this.saveInviteeGroups()
    },
    eventGroupUnselected ($event, group) {
      this.selectedEventGroups.splice(
        _.findIndex(this.possibleEventGroupsList, g => {
          return g.id === group.id
        }),
        1
      )
      this.possibleEventGroupsList.push(group)
      this.saveInviteeGroups()
    },
    goToComponent (route = null) {
      this.$router.push({ path: `/events/` + this.event.id + route })
      location.reload()
    },
    selectInteraction (item) {
      this.selectedInteraction = Object.assign({}, item)
    },
    editInteraction (item) {
      this.isLoading = true

      // Edit event interaction
      let interaction = new EventInteraction({ id: item.hashed_id })

      interaction.templateId = item.id
      interaction.title = item.title
      interaction.sendOnDate = this.getEventStartInMillis(item.sendOnDate)
      interaction.sendDaysBeforeEvent = item.sendDaysBeforeEvent
      interaction.line1 = item.line1
      interaction.line2 = item.line2
      interaction.line3 = item.line3
      interaction.templateImage = item.templateImage
      interaction.event = { id: this.event.id }

      interaction
        .save()
        .then(resp => {
          this.isLoading = false

          this.$notify({
            message: 'Changes saved successfully',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getEventStartInMillis (sendDate) {
      let eventStartTime = new Date(sendDate).getTime()
      return eventStartTime
    },
    checkEventInteraction (interactionId, index) {
      let interaction = _.findWhere(this.interactions, {
        templateId: interactionId
      })

      if (interaction) {
        this.interactionsList[index].sendOnDate = new Date(
          interaction.sendOnDate
        )
        this.interactionsList[index].sendDaysBeforeEvent =
          interaction.sendDaysBeforeEvent
        this.interactionsList[index].line1 = interaction.line1
        this.interactionsList[index].line2 = interaction.line2
        this.interactionsList[index].line3 = interaction.line3
        this.interactionsList[index].hashed_id = interaction.id
        this.interactionsList[index].templateImage = interaction.templateImage
        this.interactionsList[index].enabled = interaction.enabled
          ? interaction.enabled
          : false
        return true
      } else {
        return false
      }
    },
    checkItem (item) {
      if (item.enabled && !item.hashed_id) {
        this.saveInteraction(item)
      } else if (item.enabled && item.hashed_id) {
        this.EnableDisableInteraction(item, true)
      } else {
        this.EnableDisableInteraction(item, false)
      }
    },
    saveInteraction (item) {
      this.isLoading = true

      let new_interaction = {
        title: item.title,
        templateId: item.id,
        templateImage: this.selectedInteraction
          ? this.selectedInteraction.templateImage
          : '',
        sendOnDate: null,
        sendDaysBeforeEvent: 0,
        event: { id: this.event.id },
        enabled: true
      }

      // Save event interaction
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
      let event = new CalendarEvent({ id: this.event.id })

      new EventInteraction(new_interaction)
        .for(calendar, event)
        .save()
        .then(res => {
          this.isLoading = false
        })
        .catch(error => {
          console.log('Error while saving ', error)
        })
    },
    EnableDisableInteraction (item, status) {
      // Edit event interaction
      this.isLoading = true

      let interaction = new EventInteraction({ id: item.hashed_id }).for(
        new Calendar({ id: this.$auth.user.defaultCalendarId }),
        this.event
      )
      interaction.enabled = status
      interaction.templateId = item.id
      interaction.title = item.title
      interaction.templateImage = item.templateImage
      interaction.sendOnDate = this.getEventStartInMillis(item.sendOnDate)
      interaction.sendDaysBeforeEvent = item.sendDaysBeforeEvent
      interaction.line1 = item.line1
      interaction.line2 = item.line2
      interaction.line3 = item.line3
      interaction.event = { id: this.event.id }

      interaction
        .save()
        .then(resp => {
          this.isLoading = false
          this.$forceUpdate()
        })
        .catch(error => {
          console.log(error)
        })
    },
    showManageGroupSection () {
      window.currentPanel = this.$showPanel({
        component: ManageInviteesGroups,
        cssClass: 'md-layout-item md-size-75 transition36 bg-grey',
        openOn: 'right',
        props: { event: this.event }
      })
    },
    editInteractionDesign (item) {
      if (!item.line1) {
        item.line1 = this.event.title
      }

      if (!item.line2) {
        item.line2 = moment(this.event.eventStartMillis).format(
          'YYYY-MM-DD H:mm A'
        )
      }

      window.currentPanel = this.$showPanel({
        component: EditInteractionDesign,
        cssClass: 'md-layout-item md-size-45 transition36 bg-grey',
        openOn: 'right',
        props: { event: this.event, selectedInteraction: item }
      })
    },
    getEventInviteeGroup () {
      new EventInviteeGroup()
        .get()
        .then(resp => {
          this.possibleEventGroupsList = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveInviteeGroups () {
      let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
      let event = new CalendarEvent({ id: this.event.id })

      let selectedGroupsIds = []

      this.selectedEventGroups.forEach(group => {
        selectedGroupsIds.push({ id: group.id, title: group.title })
      })

      event = this.event
      event.inviteeGroups = selectedGroupsIds.length ? selectedGroupsIds : null

      event
        .for(_calendar)
        .save()
        .then(resp => {
          this.$notify({
            message: 'Changes saved successfully',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success'
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getEventInteractions () {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
      let event = new CalendarEvent({ id: this.event.id })
      new EventInteraction()
        .for(calendar, event)
        .get()
        .then(res => {
          this.interactions = res

          // Get List of available interactions
          new EventInteraction().get().then(res => {
            this.interactionsList = res
            this.interactionsList.forEach((item, index) => {
              this.checkEventInteraction(item.id, index)
            })
          })
        })
    }
  },
  created () {},
  mounted () {
    this.isLoading = false

    // Get Event Interactions
    this.getEventInteractions()

    // get event invitees groups
    this.getEventInviteeGroup()

    // Set Selected Groups to selected groups tags field
    this.selectedEventGroups = this.event.inviteeGroups
      ? this.event.inviteeGroups
      : []
  },
  computed: {},
  watch: {}
}
</script>
