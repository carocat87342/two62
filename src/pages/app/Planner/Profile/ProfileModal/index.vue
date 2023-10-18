<template>
  <div>
    <modal v-if="showModal" >
      <template slot="header">
        <h4 class="modal-title">Edit Personal Information</h4>
        <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <form>
          <div class="md-layout mb16">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label>Name</label>
                <md-input v-model="name"/>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label>Email</label>
                <md-input v-model="email" />
              </md-field>
            </div>
          </div>
          <div class="md-layout mb16">
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label>Department</label>
                <md-input v-model="department"/>
              </md-field>
            </div>
            <div class="md-layout-item md-small-size-100">
              <md-field>
                <label>Branch</label>
                <md-input v-model="branch" />
              </md-field>
            </div>
          </div>
          <div class="md-layout mb16">
            <div class="md-layout-item md-size-100 md-small-size-100">
              <md-datepicker v-model="birthdayDate" >
                <label >Birthday Date</label>
              </md-datepicker>
            </div>
          </div>
          <div class="md-layout mb16">
            <div class="md-layout-item md-size-100 md-small-size-100">
              <md-datepicker v-model="workingSinceDate" >
                <label >WorkingSince Date</label>
              </md-datepicker>
            </div>
          </div>
          <div class="md-layout mb16">
            <div class="md-layout-item md-size-100 md-small-size-100">
              <md-field>
                <label>Role</label>
                <md-input v-model="role" readonly/>
              </md-field>
            </div>
          </div>
        </form>
      </template>
      <template slot="footer">
        <md-button class="md-success" style="margin-right:3%">save</md-button>
        <md-button class="md-danger" @click="closeModal">Close</md-button>
      </template>
    </modal>
  </div>
</template>

<script>
import {
  Modal
} from '@/components'

export default {

  data () {
    return {
      birthdayDate: null,
      workingSinceDate: null,
      name: '',
      email: '',
      department: '',
      branch: '',
      role: 'intial Role'
    }
  },
  components: {
    Modal
  },
  props: {
    showModal: Boolean
  },

  methods: {
    closeModal () {
      this.$emit('closePersonalInformationModal')
    }
  }
}

</script>

<style lang="scss">
</style>
