<template>
  <md-card class="md-card-profile">
    <vue-element-loading
      :active="isLoading"
      spinner="ring"
      is-full-screen
      color="#FF547C"
      isFullScreen
    />
    <md-card-header>
      <md-card-content>
        <div class="md-layout-item md-size-100">
          <h4 style="text-align:left;">Team Building Event</h4>
        </div>
      </md-card-content>
    </md-card-header>
    <md-card-content>
      <div class="md-layout-item md-size-100">
        <md-tabs class="light-theme">
          <template slot="md-tab" slot-scope="{ tab }">
            <div class="item" :class="{selected: selectedComponents(tab.data.id)}">
              <i
                class="fa fa-square"
                style="margin-right: 15px;"
                :style="`color: ${tab.icon}!important;`"
              ></i>
              {{ tab.label }}
              <i
                v-if="tab.data.childComponents"
                class="caret fas fa-caret-right"
              ></i>
            </div>
          </template>

          <md-tab
            v-for="item in components"
            :key="item.id"
            :id="`tab-${item.value}`"
            :md-icon="`${item.color}`"
            :md-label="`${item.value}`"
            :md-template-data="item"
            @click="!item.childComponents ? selectComponent(item) : ''"
          >
            <div class="md-layout">
              <div class="md-layout-item">
                <md-list>
                  <md-list-item
                    v-for="child in item.childComponents"
                    :key="child.id"
                    @click="selectComponent(child)"
                  >
                    <div class="image-block">
                      <img v-show="!selectedComponents(child.id)" :src="`${child.imageOff}`" />
                      <img v-show="selectedComponents(child.id)" :src="`${child.imageOn}`" />
                    </div>
                    {{child.title}}
                  </md-list-item>
                </md-list>
              </div>
            </div>
          </md-tab>
        </md-tabs>
      </div>
    </md-card-content>
    <md-card-content class="mt-auto">
      <div class="md-layout-item" style="text-align:right;">
        <md-button class="md-success">Next</md-button>
      </div>
    </md-card-content>
  </md-card>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Calendar from '@/models/Calendar'
import EventComponent from '@/models/EventComponent'
import VueElementLoading from 'vue-element-loading'
// import auth from '@/auth';

export default {
  name: 'event-blocks',
  components: {
    VueElementLoading
  },
  props: {
    event: Object,
    eventComponents: Array
  },
  data: () => ({
    // auth: auth,
    componentsData: [],
    isLoading: true
  }),
  methods: {
    selectComponent (item) {
      if (this.componentsData.includes(item.id)) {
        this.componentsData.splice(this.componentsData.indexOf(item.id), 1)
        this.deleteComponent(item)
      } else {
        this.componentsData.push(item.id)
        this.createComponent(item)
      }
    },
    selectedComponents (id) {
      return this.componentsData.includes(id)
    },
    async createComponent (component) {
      this.isLoading = true
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
      let value = new EventComponent({
        componentId: component.id,
        todos: [],
        values: [],
        vendors: [],
        calendarEvent: this.event.id
      }).for(calendar, this.event)

      value
        .save()
        .then(result => {
          this.eventComponents.push(Object.assign({}, result))
          this.isLoading = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    async deleteComponent (component) {
      this.isLoading = true
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId })
      let componentId = null
      let componentsArray = this.eventComponents
      this.eventComponents.forEach(function (item, index, componentsArray) {
        if (item.componentId === component.id) {
          componentId = item.id
          componentsArray.splice(index, 1)
        }
      })

      if (componentId) {
        let eventComponent = new EventComponent({ id: componentId }).for(
          calendar,
          this.event
        )

        eventComponent
          .delete()
          .then(result => {
            this.eventComponents = componentsArray
            this.isLoading = false
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    selectEventComponents () {
      let map = []

      this.eventComponents.forEach(function (item) {
        map.push(item.componentId)
      })

      this.componentsData = map
    }
  },
  created () {},
  mounted () {
    this.isLoading = false
    this.selectEventComponents()
  },
  computed: {
    ...mapGetters({
      components: 'event/getComponentsList'
    })
  },
  watch: {
    // eventComponents(newVal, oldVal) {
    //     this.selectEventComponents();
    // },
  }
}
</script>
<style lang="scss">
.mt-auto {
  margin-top: auto;
}
.light-theme {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .md-list {
    flex-direction: column;
    justify-content: flex-end;
  }
  .md-tab {
    padding-top: 0;
    .md-list {
      padding-top: 0;
      flex-wrap: wrap;
    }
  }
  .md-list.md-theme-default
    .md-list-item-container:not(.md-list-item-default):not([disabled]):hover {
    background: none;
  }
  .md-list-item-content {
    font-size: 12.5px;
    color: #6a6869;
    cursor: pointer;
    flex-direction: column;
    .image-block {
      margin-bottom: 10px;
    }
  }
  .md-content {
    width: 100%;
  }
  .md-button {
    height: 50px;
    color: #3c4858 !important;
    i,
    &:hover,
    &:hover i,
    &:focus,
    &:focus i,
    &:active,
    &:active i,
    &:active:focus,
    &:active:focus i,
    &:active:hover {
      color: #3c4858 !important;
    }
    .caret {
      width: auto;
      min-width: 0;
      margin-right: 0;
      margin-left: auto;
    }
    .md-ripple {
      padding: 0 !important;
      .md-button-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        .item {
          display: flex;
          align-items: center;
          padding: 13px;
          width: 100%;
          text-align: left;
          background-color: rgba($color: #000000, $alpha: 0.05) !important;
          &.selected {
            background-color: #ffd966 !important;
          }
        }
      }
    }
  }
  .md-list {
    display: flex;
    flex-direction: row;
  }
  .md-tabs-navigation {
    flex-direction: column;
    margin: 0;
    padding: 0;
    margin-right: 5%;
    overflow: hidden;
    box-shadow: none;
    -webkit-box-shadow: none;
    min-width: 230px;
    max-width: 230px;
    margin-left: 0 !important;
    flex: 1 1 230px;
  }
}
</style>
