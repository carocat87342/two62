<template>
    <div class="event-info">

      <div class="tabs-actions text-right" v-if="!readonly">
        <md-button class="md-info md-sm edit-timeline-btn" v-if="!editMode" @click="toggleEditMode">
          Edit
        </md-button>
        <md-button class="md-info md-sm edit-timeline-btn" v-if="editMode" @click="editEventInfo">
          Save
        </md-button>
        <md-button class="md-default md-sm edit-timeline-btn" v-if="editMode" @click="toggleEditMode">
          Cancel
        </md-button>
      </div>

        <div class="info-item md-layout">
            <h4 class="md-layout-item md-size-30 md-small-size-100 md-red md-button md-round md-just-icon text-center">MEETING PLACE</h4>
            <md-field  class="md-layout-item md-size-65 md-small-size-100 md-button text-center" :class="{editable : editMode}" style="color: white; background-color: #fcfcfc !important; margin-left: 15px; border-bottom-left-radius: 0; border-top-left-radius: 0; min-height: auto; padding: 0 12px;">
                <md-textarea  v-model="event.eventPage.meetingPlaceDescription" placeholder="Add description here ..."></md-textarea>
            </md-field>
        </div>

        <div class="info-item md-layout">
          <h4 class="md-layout-item md-size-30 md-small-size-100 md-red md-button md-round md-just-icon text-center">WHEN TO ARRIVE</h4>
          <md-field  class="md-layout-item md-size-65 md-small-size-100 md-button text-center" :class="{editable : editMode}" style="color: white; background-color: #fcfcfc !important; margin-left: 15px; border-bottom-left-radius: 0; border-top-left-radius: 0; min-height: auto; padding: 0 12px;">
                <md-textarea  v-model="event.eventPage.whenToArrive " placeholder="Add description here ...">

                </md-textarea>
            </md-field>
        </div>

        <div class="info-item md-layout">
          <h4 class="md-layout-item md-size-30 md-small-size-100 md-red md-button md-round md-just-icon text-center">WHAT YOU NEED TO KNOW</h4>
          <md-field  class="md-layout-item md-size-65 md-small-size-100 md-button text-center" :class="{editable : editMode}" style="color: white; background-color: #fcfcfc !important; margin-left: 15px; border-bottom-left-radius: 0; border-top-left-radius: 0; min-height: auto; padding: 0 12px;">
                <md-textarea  v-model="event.eventPage.whatYouNeedToKnow " placeholder="Add description here ...">

                </md-textarea>
            </md-field>
        </div>

    </div>
</template>
<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import EventComponent from '@/models/EventComponent'
import VueElementLoading from 'vue-element-loading'
// import auth from '@/auth';

// COMPONENTS
import { Tabs } from '@/components'

export default {
  name: 'event-tabs',
  components: {
    Tabs
  },
  props: {
    event,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    editMode: false
  }),
  methods: {
    toggleEditMode () {
      this.editMode = !this.editMode
    },
    editEventInfo () {
      this.$parent.isLoading = true

      let _calendar = new Calendar({id: this.$auth.user.defaultCalendarId})
      let editedEvent = new CalendarEvent({id: this.event.id})

      editedEvent = this.event
      editedEvent.eventPage.meetingPlaceDescription = this.event.eventPage.meetingPlaceDescription
      editedEvent.eventPage.whenToArrive = this.event.eventPage.whenToArrive
      editedEvent.eventPage.whatYouNeedToKnow = this.event.eventPage.whatYouNeedToKnow
      delete editedEvent['owner']
      editedEvent.save().then(response => {
        this.toggleEditMode()
      })
        .catch((error) => {
          console.log(error)
        })
    }

  },
  created () {

  },
  mounted () {

  },
  computed: {

  }
}
</script>
