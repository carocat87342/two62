<template>
  <div class="md-layout brief-details">
    <div class="md-layout-item md-size-15 event-components-list">
      <template v-for="(component, index) in eventComponents">
        <md-button
          class="md-primary"
          :key="index"
        >{{component.title}} ({{component.proposalsCount}})</md-button>
      </template>
    </div>
    <div class="md-layout-item md-size-85">
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <md-card>
            <md-card-content>
              <md-field class="horizontal-field">
                <label>Guest Count</label>
                <md-input type="number" placeholder="eg: 200"></md-input>
              </md-field>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-size-50">
          <md-card>
            <md-card-content style="display: flex;">
              <md-field class="horizontal-field">
                <label>Venue Budget</label>
                <md-input type="number" placeholder="$0.0"></md-input>
              </md-field>
              <md-field class="horizontal-field">
                <label>PerGuest</label>
                <md-input type="number" placeholder="$0.0"></md-input>
              </md-field>
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-size-100">
          <div class="section-header">
            <h3 class="section-title">Add Requirements</h3>
            <md-button class="md-primary md-sm md-simple">
              <md-icon>refresh</md-icon>load requirements from history
            </md-button>
          </div>
        </div>

        <div class="md-layout-item md-size-100">
          <div>
            <div class="list-container">
              <div
                v-for="category in categories"
                :key="category.id"
                class="list-item"
                :class="{'active': isCategorySelected(category)}"
              >
                <div class="list-item--header">
                  <div class="list-item--icon" @click="toggleSelectCategory(category)">
                    <md-icon v-if="isCategorySelected(category)">check</md-icon>
                    <md-icon v-else>arrow_forward</md-icon>
                  </div>
                  <div class="list-item--title">{{ category.value }}</div>
                </div>
                <div class="list-item--actions">
                  <md-button class="md-just-icon md-primary md-sm md-simple action-btn">
                    <md-icon>add_circle</md-icon>
                  </md-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-layout-item md-size-100">
      <div class="text-right margin-bottom-xxl">
        <md-button @click.prevent="back" class="md-button md-white">Back</md-button>
        <md-button class="md-button md-primary">Send to vendors</md-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Tabs, NavTabsCard } from '@/components'
import EventComponent from '@/models/EventComponent'
import CalendarEvent from '@/models/CalendarEvent'
import Calendar from '@/models/Calendar'
import VueElementLoading from 'vue-element-loading'

export default {
  components: {
    Tabs,
    NavTabsCard
  },
  data () {
    return {
      isLoading: true,
      brief: null,
      event: null,
      calendar: null,
      cerrors: {},
      categories: [],
      subCategories: [],
      selectedCategories: [],
      selectedSubCategories: [],
      eventComponents: []
    }
  },
  methods: {
    back () {
      this.$emit('goToPrevPage')
    },
    isCategorySelected (category) {
      return (
        _.findIndex(this.selectedCategories, o => o.id === category.id) > -1
      )
    },
    toggleSelectCategory (category) {
      if (this.isCategorySelected(category)) {
        this.selectedCategories = this.selectedCategories.filter(
          o => o.id != category.id
        )
        this.subCategories = this.subCategories.filter(
          o => o.categoryId != category.id
        )
        this.selectedSubCategories = this.selectedSubCategories.filter(
          o => o.categoryId != category.id
        )
      } else {
        this.selectedCategories = this.selectedCategories.concat([category])
        this.subCategories = this.subCategories.concat(
          category.childComponents
        )
      }
    }
  },
  mounted () {
    this.isLoading = true
    let vm = this

    this.$auth.currentUser(this, true, () => {
      Promise.all([
        CalendarEvent.find(vm.$route.params.id),
        EventComponent.get()
      ]).then(([event, components]) => {
        vm.calendar = new Calendar({ id: vm.$auth.user.defaultCalendarId })
        vm.event = event.for(vm.calendar)

        new EventComponent()
          .for(vm.calendar, vm.event)
          .get()
          .then(resp => {
            console.log('components ', resp)
            // vm.selectedCategories = resp;
            vm.$set(vm, 'eventComponents', resp)
          })
        vm.isLoading = false
      })
    })
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";

.list-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 20px;

  .list-item {
    display: flex;
    padding: 20px;
    margin-bottom: 15px;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    &.active {
      .list-item--icon {
        background: $brand-primary;
        border-color: $brand-primary;
        .md-icon-font {
          color: white;
          content: "check";
        }
      }
    }
  }

  .list-item--header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .list-item--actions {
  }

  .md-button.action-btn {
    height: auto;
    .md-ripple {
      padding: 0 !important;
    }
  }

  .list-item--title {
    font-size: 20px;
    margin-top: 5px;
  }

  .list-item--icon {
    width: 35px;
    height: 35px;
    border: 1px solid $input-border;
    border-radius: 50%;
    text-align: center;
    margin-right: 10px;
    padding-top: 3px;
  }
}
</style>
