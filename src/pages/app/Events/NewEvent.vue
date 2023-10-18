<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />

    <div class="md-layout-item md-size-100">
      <event-actions-edit :formData="formData"></event-actions-edit>
    </div>

    <div
      class="md-layout-item md-size-30 md-small-size-100 scrollable-container"
      style="margin-top: -42px;"
    >
      <event-header-form
        :selected-date="selectedDate"
        :selected-occasion="selectedOccasion"
        :occasionOptions="occasionsArray"
        :formData="formData"
      ></event-header-form>
    </div>

    <div
      class="md-layout-item md-size-70 md-small-size-100 scrollable-container"
      v-if="components===null || !components.length"
    >
      <pricing-card card-class="md-card-plain" icon-color="icon-black">
        <drop-down
          slot="category"
          direction="down"
          ref="dropdown"
          class="dropdown-component-button empty-timeline"
        >
          <md-button slot="title" class="md-info md-block" data-toggle="dropdown">
            <md-icon>add</md-icon>Add Event Component
          </md-button>
          <ul class="dropdown-menu" :class="{'dropdown-menu-right': responsive}">
            <li
              v-for="item in componentsList"
              :key="item.id"
              @click="createNewComponent($event, item)"
            >
              <a :class="item.childComponents ? 'dropdown-toggle' : ''">
                {{ item.value }}
                <ul class="dropdown-menu" v-if="item.childComponents">
                  <li
                    v-for="subItem in item.childComponents"
                    :key="subItem.id"
                    @click="createNewComponent($event, subItem)"
                  >
                    <a>{{ subItem.title }}</a>
                  </li>
                </ul>
              </a>
            </li>
          </ul>
        </drop-down>
        <h6 slot="category" class="category">Event Components</h6>
        <md-icon slot="icon">extension</md-icon>
        <h3 slot="title" class="title black-color">Space, Catering, Decorations and more ...</h3>
        <p
          slot="description"
          class="card-description"
        >Plan and manage here all the ingredients for a successful event.</p>
        <!--<md-button slot="footer" class="md-info"><md-icon>add</md-icon> Event Component</md-button>-->
      </pricing-card>
    </div>
    <div
      class="md-layout-item md-size-70 md-small-size-100 scrollable-container"
      v-if="components !== null && components.length"
    >
      <time-line plain :type="'simple'" class="mt-0">
        <template v-if="$store.state.vendorsList">
          <event-card-component
            v-for="(component, index) in components"
            :key="'event-card-component-' + index"
            :componentObject="component"
            :componentIndex="index"
          ></event-card-component>
        </template>

        <!--<time-line-item inverted badge-type="danger" badge-icon="card_travel" class="empty-timeline">
          <div slot="header">
            <drop-down direction="down" ref="dropdown" class="dropdown-component-button">
              <md-button slot="title" class="md-button md-block md-primary dropdown-toggle" data-toggle="dropdown">
                <i class="material-icons">add</i> Add Component
              </md-button>
              <ul class="dropdown-menu" :class="{'dropdown-menu-right': responsive}">
                <li v-for="item in componentsList" :key="item.id" @click="createNewComponent($event, item)">
                  <a :class="item.childComponents ? 'dropdown-toggle' : ''">
                    {{ item.value }}
                    <ul class="dropdown-menu" v-if="item.childComponents">
                      <li v-for="subItem in item.childComponents" :key="subItem.id" @click="createNewComponent($event, subItem)">
                        <a>{{ subItem.title }}</a></li>
                    </ul>
                  </a>
                </li>
              </ul>
            </drop-down>
          </div>
        </time-line-item>-->
        <time-line-item
          inverted
          transparent
          badge-type="info"
          badge-icon="chevron_right"
          class="empty-timeline"
          style="text-align: center;"
        >
          <div slot="content">
            <drop-down direction="down" ref="dropdown" class="dropdown-component-button">
              <md-button slot="title" class="md-info md-block" data-toggle="dropdown">
                <md-icon>add</md-icon>Add Event Component
              </md-button>
              <ul class="dropdown-menu" :class="{'dropdown-menu-right': responsive}">
                <li
                  v-for="item in componentsList"
                  :key="item.id"
                  @click="createNewComponent($event, item)"
                >
                  <a :class="item.childComponents ? 'dropdown-toggle' : ''">
                    {{ item.value }}
                    <ul class="dropdown-menu" v-if="item.childComponents">
                      <li
                        v-for="subItem in item.childComponents"
                        :key="subItem.id"
                        @click="createNewComponent($event, subItem)"
                      >
                        <a>{{ subItem.title }}</a>
                      </li>
                    </ul>
                  </a>
                </li>
              </ul>
            </drop-down>
          </div>
        </time-line-item>
      </time-line>
    </div>
  </div>
</template>

<script>
import EventHeaderForm from './components/EventHeaderForm.vue'
import EventCardComponent from './components/EventCardComponent.vue'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import Occasion from '@/models/Occasion'
import EventComponent from '@/models/EventComponent'
import Vendors from '@/models/Vendors'
import { mapGetters } from 'vuex'
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import { TimeLine, TimeLineItem, PricingCard } from '@/components'
import EventActionsEdit from './components/EventActionsEdit'

export default {
  components: {
    EventHeaderForm,
    EventCardComponent,
    VueElementLoading,
    TimeLine,
    TimeLineItem,
    EventActionsEdit,
    PricingCard
  },
  props: {
    selectedDate: String,
    selectedOccasion: String
  },
  data: () => ({
    responsive: false,
    calendarId: null,
    occasionsArray: null,
    componentsList: null,
    formData: null,
    readOnly: true,
    isLoading: true,
    buttonRowClass: ''
  }),

  methods: {
    onResponsiveInverted () {
      if (window.innerWidth < 768) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    createNewComponent (e, item) {
      this.$refs.dropdown.closeDropDown()
      e.stopPropagation()
      if (
        this.$store.state.eventData.components === null ||
        !this.$store.state.eventData.components.length
      ) {
        this.$store.state.eventData.components = []
      }

      this.$store.commit('updateComponent', {
        componentId: item.key,
        icon: item.icon,
        color: item.color,
        todos: [],
        values: [],
        vendors: []
      })
    },
    sentProposalRequest () {
      let routeData = this.$router.resolve({ path: '/events/proposal' })
      window.open(routeData.href, '_blank')
    }
  },
  computed: {
    ...mapGetters({
      myState: 'getMyState'
    }),
    components () {
      return this.$store.state.eventData.components
    }
  },
  watch: {
    $route (to, from) {
      this.readOnly =
        ['EventEdit', 'EventNew'].indexOf(this.$route.name) === -1
    }
  },
  mounted () {
    this.formData = {
      occasion: this.$route.params.selectedOccasion,
      date: moment(this.$route.params.selectedDate, 'YYYY-MM-DD').toDate()
    }
    this.onResponsiveInverted()
    this.readOnly = ['EventEdit', 'EventNew'].indexOf(this.$route.name) === -1
    window.addEventListener('resize', this.onResponsiveInverted)

    this.$watch(
      () => {
        return this.$refs.dropdown.isOpen
      },
      val => {
        this.buttonRowClass = val ? 'large-z-index' : ''
      }
    )

    this.$store.state.eventData = {
      id: null,
      calendar: { id: null },
      title: 'Jamil',
      eventStartMillis: null,
      eventEndMillis: null,
      eventType: null,
      numberOfParticipants: null,
      totalBudget: null,
      status: null,
      components: null
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  created () {
    let occasions = ''
    if (this.$store.state.occasionsArray === null) {
      occasions = Occasion.get().then(occasions => {
        this.$store.state.occasionsArray = occasions
        this.occasionsArray = occasions
      })
    } else {
      this.occasionsArray = this.$store.state.occasionsArray
    }

    let components = ''
    if (this.$store.state.componentsList === null) {
      components = EventComponent.get().then(componentsList => {
        this.$store.state.componentsList = componentsList
        this.componentsList = componentsList
      })
    } else {
      this.componentsList = this.$store.state.componentsList
    }

    // vendors are dynamically changed, so always get them
    let vendors = Vendors.get().then(vendorsList => {
      this.$store.state.vendorsList = vendorsList
    })

    Promise.all([occasions, components, vendors])
      .then(() => {
        this.isLoading = false
      })
      .catch(error => {
        console.log(error)
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
.dropdown-component-button {
  width: 40%;
  margin: 0 auto;
  margin-bottom: -30px;
  margin-top: -15px;
}
.dropdown .dropdown-menu .dropdown-menu {
  left: 97%;
  margin-top: -5px;
}
.dropdown-menu .dropdown-menu {
  min-width: 182px;
}
.read-only {
  pointer-events: none;
}
.dropdown .dropdown-menu .dropdown-toggle:hover .dropdown-menu {
  opacity: 1;
  transform: scale(1);
}
.left-offset {
  margin-left: 30px;
  margin-bottom: -23px;
}
.margin-footer {
  //margin-bottom: 50px;
}
.dropdown .dropdown-menu .dropdown-toggle:after {
  font-family: "Material Icons";
  content: "chevron_right";
  border: 0 none;
  width: auto;
  height: auto;
}
.scrollable-container {
  //height: calc(100vh - 92px);
  overflow: auto;
  padding-top: 1px;
  //margin-top: 20px;

  .md-card {
    margin: 30px 0;
  }
}
.md-toolbar-section-center {
  justify-content: center;
  display: flex;
  align-items: center;
  flex: 1;
}
.modal-z-index {
  z-index: 5;
}
.large-z-index {
  z-index: 6;
  position: relative;
}
.mt-0 {
  .timeline.timeline-simple {
    margin-top: 0;
  }
}
@media (max-width: 960px) {
  .mt-small-20 {
    margin-top: 20px;
  }
  .scrollable-container {
    height: auto;
  }
}
</style>
