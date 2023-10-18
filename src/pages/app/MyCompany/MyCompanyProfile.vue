<template>
  <div class="md-layout text-left">

    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-rose md-card-header-flex">
          <div class="card-text">
            <h4 class="title">Who are we</h4>
          </div>
        </md-card-header>
        <md-card-content style="text-align: left;">
          <md-field>
            <label>Company Name</label>
            <md-input v-model="companyName" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Office Locations</label>
            <md-input v-model="officeLocations" type="text"></md-input>
          </md-field>
          <md-field>
            <label>Out Motto</label>
            <md-input v-model="ourMotto" type="text"></md-input>
          </md-field>

          <div class="title mt-4" style="text-align: center;">
            <h5>Make a buzz</h5>
            <md-button class="md-round md-just-icon md-twitter">
              <i class="fab fa-twitter"></i>
            </md-button>
            <md-button class="md-round md-just-icon md-facebook">
              <i class="fab fa-facebook"></i>
            </md-button>
            <md-button class="md-round md-just-icon md-pinterest">
              <i class="fab fa-pinterest"></i>
            </md-button>
            <md-button class="md-round md-just-icon md-facebook">
              <i class="fab fa-facebook"></i>
            </md-button>
          </div>
        </md-card-content>
        <md-card-actions md-alignment="space-between">
          <md-button class="md-success">Save</md-button>
        </md-card-actions>
      </md-card>
    </div>

  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      companyName: '',
      officeLocations: '',
      outMotto: ''
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>
