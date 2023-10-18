<template>
  <div class="event-status-field">
    <div class="flex-end">
      <label style="display: none;">Status: </label>
      <md-field class="status-select" style="display: none;">
        <md-select v-model="status" name="event-status" class="event-status" @md-selected="changeFormStatus($event)">
          <md-option value="draft">Draft</md-option>
          <md-option value="approved">Approved</md-option>
          <md-option value="execution">Execution</md-option>
          <md-option value="done">Done</md-option>
        </md-select>
      </md-field>

      <md-button native-type="submit" @click="openImageGallery" class="md-success"  style="display: none;">
        Image Gallery
        <span class="badge md-round md-info" v-if="uploadedImages.length">{{ uploadedImages.length }}</span>
      </md-button>

      <md-button native-type="submit" @click="submitForm" class="md-success">
        Save
      </md-button>
    </div>

    <event-gallery-modal ref="galleryModal"
                         :isModalLoading="isModalLoading"
                         :uploadedImages="uploadedImages"
                         :onFileChange="onFileChange"
                         :removeImage="removeImage">
    </event-gallery-modal>
  </div>

</template>

<script>
import CalendarEvent from '@/models/CalendarEvent'
import CalendarEventImage from '@/models/CalendarEventImage'
import Calendar from '@/models/Calendar'
import EventGalleryModal from './EventGalleryModal'

export default {
  name: 'event-actions-edit',
  components: {
    EventGalleryModal
  },
  props: {
    formData: Object,
    shouldUpdate: Boolean,
    event: Object
  },
  data: () => ({
    uploadedImages: [],
    isModalLoading: false,
    status: 'draft'
  }),
  mounted () {
    if (this.formData) {
      this.status = this.formData.status
    }
    // get images from server
    if (this.$props.shouldUpdate) {
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
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length) return
      this.createImage(files[0])
    },
    createImage (file) {
      let reader = new FileReader()
      let _this = this

      reader.onload = e => {
        if (this.$props.shouldUpdate) {
          this.isModalLoading = true
          let _calendar = new Calendar({id: this.$store.state.calendarId})
          let editedEvent = new CalendarEvent({id: this.event.id})

          return new CalendarEventImage({featuredImageFile: e.target.result}).for(_calendar, editedEvent).save().then(result => {
            _this.uploadedImages.push({src: e.target.result, thumb: e.target.result, id: result.id})
            this.isModalLoading = false
          })
            .catch((error) => {
              console.log(error)
              this.isModalLoading = false
            })
        } else {
          _this.uploadedImages.push({ src: e.target.result, thumb: e.target.result })
        }
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (index, imgId) {
      if (this.$props.shouldUpdate) {
        this.isModalLoading = true

        let _calendar = new Calendar({id: this.$store.state.calendarId})
        let editedEvent = new CalendarEvent({id: this.event.id})

        return new CalendarEventImage({id: imgId}).for(_calendar, editedEvent).delete().then(result => {
          this.uploadedImages.splice(index, 1)
          this.isModalLoading = false
        })
          .catch((error) => {
            console.log(error)
            this.isModalLoading = false
          })
      } else {
        this.uploadedImages.splice(index, 1)
      }
    },
    openImageGallery () {
      this.$refs.galleryModal.toggleModal(true)
    },
    changeFormStatus (e) {
      this.$root.$emit('statusChange', e)
    },
    submitForm () {
      this.$root.$emit('submitForm', this.uploadedImages)
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
