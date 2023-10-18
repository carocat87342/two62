<template>
  <div class="md-layout">
    <modal v-if="modalOpen" @close="noticeModalHide" class="inspirations-modal">
      <template slot="header">
        <h4 class="modal-title">Inspirations</h4>
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="noticeModalHide">
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C"/>
        <div class="inspiration-block">
          <div class="card-wrapper" v-for="item in inspirations" v-if="inspirations.length" :key="item.id" @click="openNewTab(item.link)">
            <product-card header-animation="false">
              <img class="img" slot="imageHeader" :src="item.image">

              <h4 slot="title" class="title">
                <a href="#">{{ item.title }}</a>
              </h4>
              <div slot="description" class="card-description">
                Posted by {{ item.author }}
              </div>
              <div slot="description" class="card-company">
                {{ item.company }}
              </div>

              <template slot="footer">
                <div class="price">
                  <h4>{{ item.score }}/5 <md-icon>star</md-icon></h4>
                </div>
                <div class="stats">
                  <p class="category">
                    <md-icon>inbox</md-icon>
                    #{{ item.category }}
                  </p>
                </div>
              </template>
            </product-card>
          </div>
          <div v-else>
            <div class="text-empty">No inspirations available</div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal, ProductCard } from '@/components'
import CalendarEventInspiration from '@/models/CalendarEventInspiration'
import CalendarEvent from '@/models/CalendarEvent'
import Calendar from '@/models/Calendar'
import VueElementLoading from 'vue-element-loading'

export default {
  name: 'event-modal-inspirations',
  components: {
    Modal,
    ProductCard,
    VueElementLoading
  },
  data () {
    return {
      modalOpen: false,
      inspirations: [],
      isLoading: true
    }
  },
  methods: {
    noticeModalHide: function () {
      this.modalOpen = false
    },
    toggleModal: function (show) {
      this.modalOpen = show
    },
    openNewTab (link) {
      window.open(link, true)
    }
  },
  created () {
    let inspirations = new CalendarEvent({id: this.$route.params.id}).inspirations()
      .custom(`${process.env.SERVER_URL}/1/calendars/${this.$store.state.calendarId}/events/${this.$route.params.id}/inspirations`).get().then(response => {
        this.inspirations = response
        this.isLoading = false
      })
      .catch((error) => {
        console.log(error)
        this.isLoading = false
      })
  }
}
</script>
<style lang="scss">
  .inspirations-modal {
    .modal-container {
      max-width: 400px;
    }
    .modal-body {
      padding-top: 0;
      max-height: 80vh;
      overflow: auto;
    }

    .md-card-header {
      margin: 0 auto !important;

      img {
        max-height: 150px;
        width: auto !important;
      }
    }
    .card-wrapper {
      cursor: pointer;
    }
    .text-empty {
      margin-top: 30px;
      font-size: 24px;
    }
  }

</style>
