<template>
  <div class="event-status-field">
    <div class="flex-end">
      <label>Status: </label>
      <md-field class="status-select">
        <md-select v-model="event.status" name="event-status" class="event-status">
          <md-option value="draft">Draft</md-option>
          <md-option value="approved">Approved</md-option>
          <md-option value="execution">Execution</md-option>
          <md-option value="done">Done</md-option>
        </md-select>
      </md-field>

      <md-button native-type="submit" @click="openImageGallery" class="md-success">
        Image Gallery
        <span class="badge md-round md-info" v-if="uploadedImages.length">{{ uploadedImages.length }}</span>
      </md-button>
      <md-button @click="editEvent()" class="md-success">
        Edit
      </md-button>
    </div>

    <event-gallery-modal ref="galleryModal"
                         :isModalLoading="isModalLoading"
                         :uploadedImages="uploadedImages">
    </event-gallery-modal>
  </div>

</template>

<script>
import CalendarEvent from '@/models/CalendarEvent'
import CalendarEventImage from '@/models/CalendarEventImage'
import Calendar from '@/models/Calendar'
import EventGalleryModal from './EventGalleryModal'

export default {
  name: 'event-actions-show',
  components: {
    EventGalleryModal
  },
  props: {
    event: Object
  },
  data: () => ({
    uploadedImages: [],
    isModalLoading: false
  }),
  created () {
    this.isModalLoading = true

    if (this.$store.state.calendarId === null) {
      Calendar.get().then((calendars) => {
        this.$store.state.calendarId = calendars[0].id
        this.getEventImages()
      })
        .catch((error) => {
          console.log(error)
          this.isModalLoading = false
        })
    } else {
      this.getEventImages()
    }
  },
  methods: {
    getEventImages () {
      CalendarEvent.custom(`${process.env.SERVER_URL}/1/calendars/${this.$store.state.calendarId}/events/${this.$route.params.id}/images/`).get().then(images => {
        this.uploadedImages = images.map((image) => {
          return {
            'src': `${process.env.SERVER_URL}${image.href}`,
            'thumb': `${process.env.SERVER_URL}${image.href}`,
            'id': image.id
          }
        })
        this.isModalLoading = false
      })
        .catch((error) => {
          console.log(error)
          this.isModalLoading = false
        })
    },
    editEvent () {
      this.$router.push({ path: `/events/${this.$route.params.id}/edit` })
    },
    updateEvent (status) {
      let _calendar = new Calendar({id: this.$store.state.calendarId})
      let editedEvent = new CalendarEvent({id: this.event.id})

      editedEvent.eventStatus = status
      editedEvent.for(_calendar).save().then(response => {
      })
        .catch((error) => {
          console.log(error)
        })
    },
    openImageGallery () {
      this.$refs.galleryModal.toggleModal(true)
    }
  },
  watch: {
    'event.eventStatus': {
      handler: function (newVal) {
        if (newVal != '' && newVal != undefined) {
          return this.updateEvent(newVal)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import 'vue-image-lightbox/dist/vue-image-lightbox.min.css';

  .event-status-field {
    display: flex;
    align-items: center;
    text-align: right;
    justify-content: flex-end;
    margin-top: 1px;
    margin-bottom: 8px;

    label {
      font-weight: 400;
      position: relative;
      top: 2px;
    }
    .md-layout {
      align-items: center;
    }
    .status-select {
      max-width: 150px;
      margin-left: 10px;
      margin-right: 20px;
    }
    .md-button {
      margin: 0 5px;

      &:last-child {
        margin-right: 0;
      }
    }
    .badge {
      top: -2px;
      margin-left: 4px;
      position: relative;
      background: #FF547C;
      border-radius: 50%;
      padding: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
    }

    .flex-end {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      align-items: center;
    }
  }
  .file-input {
    margin-right: 10px;
  }
</style>
