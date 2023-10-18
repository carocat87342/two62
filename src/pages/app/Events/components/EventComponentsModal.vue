<template>
  <div class="md-layout">
    <modal v-if="modalOpen" @close="noticeModalHide" :allow-click-outside="false">
      <template slot="header">
        <h4 class="modal-title">
          {{ componentItemIndex !== null && componentItemIndex > -1 ? 'Edit' : 'Add new' }} component
        </h4>
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="noticeModalHide">
          <md-icon>clear</md-icon>
        </md-button>
      </template>

      <template slot="body">
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C"/>
        <form>

            <div class="md-layout">
              <div class="md-layout-item">
                <md-autocomplete v-model="form.title"
                                 data-vv-name="title"
                                 v-validate= "modelValidations.title"
                                 required
                                 :md-options="propertyValues"
                                 @md-changed="setValue"
                                 @md-opened="mdOpenedTitle"
                                 class="change-icon-order select-with-icon mb16"
                                 :class="[{'md-error': errors.has('title')}]">
                  <label>Requirement</label>
                  <span class="md-error" v-if="errors.has('title')">This field is required</span>

                  <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                    <md-highlight-text :md-term="term">{{ item.title }}</md-highlight-text>
                    <div class="text-gray pull-right small" style="text-transform: uppercase;">{{ item.group}}</div>
                  </template>
                </md-autocomplete>
                <!--<v-selectmenu :data="propertyValues"  key-field="id" show-field="title" class="md-select-menu change-icon-order select-with-icon mb16" :class="[{'md-error': errors.has('title')}]">
                </v-selectmenu>-->
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item">
                <md-autocomplete v-model="form.value"
                                 data-vv-name="value"
                                 v-validate= "modelValidations.value"
                                 required
                                 :md-options="propertyValuesArray"
                                 @md-opened="mdOpenedValue"
                                 class="change-icon-order select-with-icon mb16"
                                 :class="[{'md-error': errors.has('value')}]">
                  <label>Value</label>
                  <span class="md-error" v-if="errors.has('value')">This field is required</span>
                </md-autocomplete>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item">
                <md-field :class="[{'md-error': errors.has('comment')}]" class="mb16">
                  <label>Comment</label>
                  <md-textarea md-autogrow
                               v-model="form.comment"
                               data-vv-name="comment"
                               style="min-height: 36px;"></md-textarea>
                  <span class="md-error" v-if="errors.has('comment')">This field is required</span>
                </md-field>
              </div>
            </div>

        </form>
      </template>

      <template slot="footer">
        <md-button class="md-simple" @click="noticeModalHide">Cancel</md-button>
        <md-button class="md-primary" @click="validateModalForm">
          {{ componentItemIndex !== null && componentItemIndex > -1 ? 'Save' : 'Create' }}
        </md-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal } from '@/components'
import EventComponent from '@/models/EventComponent'
import EventComponentProperty from '@/models/EventComponentProperty'
import VueElementLoading from 'vue-element-loading'
import Vue from 'vue'

export default {
  name: 'event-modal-components',
  props: {
    componentItem: Object,
    component: Object,
    componentIndex: Number,
    componentItemIndex: Number,
    componentId: String,
    shouldUpdate: Boolean,
    updateComponent: Function
  },
  components: {
    Modal,
    VueElementLoading
  },
  data () {
    return {
      isLoading: true,
      modalOpen: false,
      form: {
        id: null,
        title: '',
        value: null,
        comment: null
      },
      modelValidations: {
        title: {
          required: true
        },
        value: {
          required: true
        },
        comment: {
          required: true
        }
      },
      propertyValuesObjects: [],
      propertyValues: [],
      propertyValuesArray: [],
      list: [
        {id: 1, name: 'Chicago Bulls', desc: 'bbb'},
        {id: 2, name: 'Cleveland Cavaliers', desc: 'aaa'}
      ]
    }
  },
  methods: {
    noticeModalHide () {
      this.modalOpen = false
    },
    toggleModal (show) {
      this.modalOpen = show
    },
    validateModalForm () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          let store = this.$store.state.eventData.components[this.componentIndex]
          this.form.propertyId = 'custom'

          if (this.componentItemIndex !== null) {
            Vue.set(store.values, this.componentItemIndex, this.form)
          } else {
            delete this.form.id // remove id key
            this.form.propertyId = 'custom'
            store.values.push(this.form)
          }

          if (this.shouldUpdate) {
            this.$props.updateComponent(store, this.form, this.componentItemIndex)
          }

          this.$store.commit('updateEventData', {index: this.componentIndex, data: store})
          this.clearForm()
          this.modalOpen = false
        } else {
          this.showNotify()
        }
      })
    },
    clearForm () {
      this.form = {
        id: null,
        title: null,
        value: null,
        comment: null
      }
    },
    setValue (selectedProperty) {
      let changedPropertyItem = this.propertyValuesObjects.find((val) => val.title === selectedProperty)

      if (changedPropertyItem) {
        this.propertyValuesArray = 'possibleValues' in changedPropertyItem ? changedPropertyItem.possibleValues.map((val) => val.title) : []
      } else {
        this.propertyValuesArray = []
      }
    },
    showNotify () {
      this.$notify({
        message: 'Please, check all required fields',
        icon: 'warning',
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: 'danger'
      })
    },
    mdOpenedTitle: function () {
      this.form.title += ' '
      this.form.title = this.form.title.substring(0, this.form.title.length - 1)
    },
    mdOpenedValue: function () {
      this.form.value += ' '
      this.form.value = this.form.value.substring(0, this.form.value.length - 1)
    },
    getEventComponentProperty () {
      let eventProperty = new EventComponentProperty().for(new EventComponent({id: this.component.componentId}))

      eventProperty.get().then(eventProperties => {
        this.propertyValuesObjects = eventProperties
        this.propertyValues = []
        eventProperties.forEach((eventProperty) => {
          /* let p = {
              id: eventProperty.id,
                title: eventProperty.title
            }; */
          if (eventProperty.type === 'Group') {
            // p["list"] = [];

            eventProperty.childProperties.forEach((childProperty) => {
              let childP = {
                id: childProperty.id,
                title: childProperty.title,
                group: eventProperty.title
              }
              this.propertyValues.push(childP)
            })
          }
          // this.propertyValues.push(p);
        })
        this.isLoading = false
      })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })
    }
  },
  mounted () {
    if (this.$store.state.componentsList === null) {
      EventComponent.get().then((componentsList) => {
        this.$store.state.componentsList = componentsList
        this.getEventComponentProperty()
      })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
        })
    } else {
      this.getEventComponentProperty()
    }
  },
  watch: {
    componentItem: function (val) {
      this.form.id = 'id' in val ? val.id : null
      this.form.title = 'title' in val ? val.title : ''
      this.form.value = 'value' in val ? val.value : ''
      this.form.comment = 'comment' in val ? val.comment : ''
    }
  }
}
</script>
<style lang="scss">
  .change-icon-order {
    .md-menu {
      order: 2;
    }
    .md-icon {
      order: 1;
    }
  }
</style>
