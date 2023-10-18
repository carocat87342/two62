<template>
  <div class="md-layout">
    <modal v-if="modalOpen">
      <template slot="header">
        <h4 class="modal-title">{{ todoIndex !== null && todoIndex > -1 ? 'Edit' : 'Create new' }} TODO</h4>
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="noticeModalHide">
          <md-icon>clear</md-icon>
        </md-button>
      </template>

      <template slot="body">
        <form>

            <div class="md-layout">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{'md-error': errors.has('title')}]" class="mb16">
                  <label>What</label>
                  <md-input v-model="form.title"
                            data-vv-name="title"
                            v-validate= "modelValidations.title"
                            required />
                  <span class="md-error" v-if="errors.has('title')">This field is required</span>
                </md-field>

              </div>

              <div class="md-layout-item md-small-size-100">
                <md-datepicker v-model="form.dueDateMillis" name="todo-date" md-immediately class="todo-date mb16">
                  <label>Due Date</label>
                </md-datepicker>
              </div>
            </div>

            <div class="md-layout">
              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{'md-error': errors.has('assignee')}]" class="mb16">
                  <label>Assign To</label>
                  <md-input v-model="form.assignee"
                            data-vv-name="assignee"
                            v-validate= "modelValidations.assignee"
                            required />
                  <span class="md-error" v-if="errors.has('assignee')">This field is required</span>
                </md-field>

              </div>

              <div class="md-layout-item md-small-size-100">
                <md-field :class="[{'md-error': errors.has('status')}]" class="mb16">
                  <label>Status</label>
                  <md-input v-model="form.status"
                            data-vv-name="status"
                            v-validate= "modelValidations.status"
                            required />
                  <span class="md-error" v-if="errors.has('status')">This field is required</span>
                </md-field>

              </div>
            </div>

        </form>
      </template>

      <template slot="footer">
        <md-button class="md-simple" @click="noticeModalHide">Cancel</md-button>
        <md-button class="md-primary" @click="validateModalForm">
          {{ todoIndex !== null && todoIndex > -1 ? 'Save' : 'Create'}}
        </md-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal } from '@/components'
import Vue from 'vue'

export default {
  name: 'event-modal-todo',
  props: {
    todoItem: Object,
    todoIndex: Number,
    componentIndex: Number,
    shouldUpdate: Boolean,
    updateTodo: Function
  },
  components: {
    Modal
  },
  data () {
    return {
      modalOpen: false,
      form: {
        id: null,
        title: null,
        dueDateMillis: null,
        assignee: null,
        status: null
      },
      modelValidations: {
        title: {
          required: true
        },
        assignee: {
          required: true
        },
        status: {
          required: true
        }
      }
    }
  },
  watch: {
    todoItem: function (val) {
      this.form.id = 'id' in val ? val.id : null
      this.form.title = 'title' in val ? val.title : ''
      this.form.dueDateMillis = 'dueDateMillis' in val ? new Date(val.dueDateMillis) : ''
      this.form.assignee = 'assignee' in val ? val.assignee : ''
      this.form.status = 'status' in val ? val.status : ''
    }
  },
  methods: {
    noticeModalHide () {
      this.clearForm()
      this.modalOpen = false
    },
    toggleModal (show) {
      this.modalOpen = show
    },
    clearForm () {
      this.form = {
        id: null,
        title: null,
        dueDateMillis: null,
        assignee: null,
        status: null
      }
    },
    validateModalForm () {
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          // transform date to timestamp
          this.form.dueDateMillis = new Date(this.form.dueDateMillis).getTime()

          let store = this.$store.state.eventData.components[this.componentIndex]
          if (this.todoIndex !== null) {
            Vue.set(store.todos, this.todoIndex, this.form)
          } else {
            delete this.form.id // remove id for new item
            store.todos.push(this.form)
          }

          if (this.shouldUpdate) {
            this.$props.updateTodo(store, this.form, this.todoIndex)
          }

          this.$store.commit('updateEventData', {index: this.componentIndex, data: store})
          this.clearForm()
          this.modalOpen = false
        } else {
          this.showNotify()
        }
      })
    },
    showNotify () {
      this.$notify({
        message: 'Please, check all required fields',
        icon: 'warning',
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: 'danger'
      })
    }
  }
}
</script>
<style lang="scss">

</style>
