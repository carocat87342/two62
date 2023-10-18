<template>
  <div class="md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" isFullScreen/>

  </div>
</template>

<script>

import EventHeaderForm from './components/EventHeaderForm.vue'
import EventCardComponent from './components/EventCardComponent.vue'
import EventComponentVendor from '@/models/EventComponentVendor'
import EventComponentTodo from '@/models/EventComponentTodo'
import EventComponentValue from '@/models/EventComponentValue'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import Occasion from '@/models/Occasion'
import EventComponent from '@/models/EventComponent'
import Vendors from '@/models/Vendors'
import { mapGetters } from 'vuex'
import moment from 'moment'
import VueElementLoading from 'vue-element-loading'
import Vue from 'vue'
import { TimeLine, TimeLineItem, PricingCard } from '@/components'
import EventActionsEdit from './components/EventActionsEdit'
// import auth from '@/auth';

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
  data: () => ({
    // auth: auth,
    responsive: false,
    calendarId: null,
    occasionsArray: null,
    componentsList: null,
    event: {},
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
      if (this.$store.state.eventData.components === null || !this.$store.state.eventData.components.length) {
        this.$store.state.eventData.components = []
      }

      this.isLoading = true
      let value = new EventComponent({ componentId: item.key, todos: [], values: [], vendors: [], calendarEvent: this.event.id }).for(this.calendar, this.event)
      value.save().then(result => {
        this.isLoading = false
        this.$store.commit('updateComponent', result)
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    updateVendor (component, subComponent, updatedItemIndex) {
      this.isLoading = true
      let componentIndex = this.$store.state.eventData.components.indexOf(component)
      let vendor = new EventComponentVendor(subComponent).for(this.calendar, this.event, new EventComponent(component))
      let vendorsArray = this.$store.state.eventData.components[componentIndex].vendors
      let vendorItemIndex = updatedItemIndex || vendorsArray.length - 1

      vendor.save().then(result => {
        this.isLoading = false
        Vue.set(vendorsArray, vendorItemIndex, result)
        this.$store.commit('updateEventData', {index: componentIndex, data: this.$store.state.eventData.components[componentIndex]})
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    updateTodo (component, subComponent, updatedItemIndex) {
      this.isLoading = true
      let componentIndex = this.$store.state.eventData.components.indexOf(component)
      let todo = new EventComponentTodo(subComponent).for(this.calendar, this.event, new EventComponent(component))
      let todosArray = this.$store.state.eventData.components[componentIndex].todos
      let todoItemIndex = updatedItemIndex || todosArray.length - 1

      todo.save().then(result => {
        this.isLoading = false
        Vue.set(todosArray, todoItemIndex, result)
        this.$store.commit('updateEventData', {index: componentIndex, data: this.$store.state.eventData.components[componentIndex]})
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    updateComponent (component, subComponent, updatedItemIndex) {
      this.isLoading = true
      let componentIndex = this.$store.state.eventData.components.indexOf(component)
      let value = new EventComponentValue(subComponent).for(this.calendar, this.event, new EventComponent(component))
      let componentsArray = this.$store.state.eventData.components[componentIndex].values
      let componentItemIndex = updatedItemIndex || componentsArray.length - 1

      value.save().then(result => {
        this.isLoading = false
        Vue.set(componentsArray, componentItemIndex, result)
        this.$store.commit('updateEventData', {index: componentIndex, data: this.$store.state.eventData.components[componentIndex]})
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    deleteVendor (component, subComponent) {
      this.isLoading = true
      let vendor = new EventComponentVendor(subComponent).for(this.calendar, this.event, new EventComponent(component))
      vendor.delete().then(result => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    deleteTodo (component, subComponent) {
      this.isLoading = true
      let todo = new EventComponentTodo(subComponent).for(this.calendar, this.event, new EventComponent(component))
      todo.delete().then(result => {
        this.isLoading = false
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    deleteComponentItem (component, subComponent) {
      this.isLoading = true
      let value = new EventComponentValue(subComponent).for(this.calendar, this.event, new EventComponent(component))
      value.delete().then(result => {
        this.isLoading = false
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    deleteComponent (component) {
      this.isLoading = true
      let value = new EventComponent(component).for(this.calendar, this.event)
      value.delete().then(result => {
        this.isLoading = false
      })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    getEventData () {
      CalendarEvent.custom(`${process.env.SERVER_URL}/1/calendars/${this.$store.state.calendarId}/events/${this.$route.params.id}`).get().then(event => {
        this.$store.state.eventData.components = event[0].components
        this.event = event[0]
        this.formData = {
          eventName: event[0].title,
          occasion: event[0].occasion,
          date: new Date(event[0].eventStartMillis),
          time: moment(event[0].eventStartMillis).format('HH:00'),
          duration: moment(event[0].eventEndMillis).diff(event[0].eventStartMillis, 'hours'),
          participants: event[0].numberOfParticipants,
          status: event[0].status,
          budget: event[0].totalBudget,
          location: event[0].location,
          budgetPerPersonFlag: event[0].budgetPerPersonFlag
        }
      })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })
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
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)

    this.$watch(
      () => {
        return this.$refs.dropdown.isOpen
      },
      (val) => {
        this.buttonRowClass = val ? 'large-z-index' : ''
      }
    )
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  created () {
    this.$auth.currentUser(this, true, function () {
      let calendar = ''

      if (this.$store.state.calendarId === null) {
        calendar = Calendar.get().then(calendars => {
          if (calendars.length === 0) {
            return
          }
          this.$store.state.calendarId = calendars[0].id
          this.calendar = new Calendar({id: this.$store.state.calendarId})
          this.getEventData()
        })
      } else {
        this.calendar = new Calendar({id: this.$store.state.calendarId})
        this.getEventData()
      }

      let occasions = ''
      if (this.$store.state.occasionsArray === null) {
        occasions = Occasion.get().then((occasions) => {
          this.$store.state.occasionsArray = occasions
          this.occasionsArray = occasions
        })
      } else {
        this.occasionsArray = this.$store.state.occasionsArray
      }

      let components = ''
      if (this.$store.state.componentsList === null) {
        components = EventComponent.get().then((componentsList) => {
          this.$store.state.componentsList = componentsList
          this.componentsList = componentsList
        })
      } else {
        this.componentsList = this.$store.state.componentsList
      }

      // vendors are dynamically changed, so always get them
      let vendors = Vendors.get().then((vendorsList) => {
        this.$store.state.vendorsList = vendorsList
      })

      Promise.all([vendors, components, occasions, calendar]).then(() => {
        this.isLoading = false
      })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })
    }.bind(this))
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
  .left-offset {
    margin-left: 30px;
    margin-bottom: -23px;
  }
  .dropdown-menu .dropdown-menu {
    min-width: 182px;
  }
  .margin-footer {
    //margin-bottom: 50px;
  }
  .read-only {
    pointer-events: none;
  }
  .dropdown .dropdown-menu .dropdown-toggle:hover .dropdown-menu {
    opacity: 1;
    transform: scale(1);
  }
  .dropdown .dropdown-menu .dropdown-toggle:after {
    font-family: 'Material Icons';
    content: 'chevron_right';
    border: 0 none;
    width: auto;
    height: auto;
  }
  .scrollable-container {
    // Commented because it causes constant scroll event if not needed
    //height: calc(100vh - 92px);
    overflow: auto;
    padding-top: 1px;
    // Commented because it add too much space
    //margin-top: 20px;
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
