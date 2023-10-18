<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
    <md-card class="md-card-profile">
        <div class="logo-block inform">
          <div class="event-planer-logo details">
            <md-icon class="company-logo">format_list_numbered</md-icon>
          </div>
          <div class="event-title inform-title">Event Information</div>
        </div>
           <div>
                <md-button  class="event-info-color-button" >Create Event Timeline</md-button>
      </div>
        <div>
        <event-cart/>
        </div>
       </md-card>
    </div>
  </div>
</template>
<script>
// MAIN MODULES
import moment from 'moment'
import EventsCart from './components/EventsCart.vue'

// COMPONENTS

export default {
  name: 'EventElements',
  components: {
    'event-cart': EventsCart
  },

  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  },
  computed: {
  },
  filters: {

  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.details{
     background-image: linear-gradient(to right, #ffa625, #fb8d02)!important
}
.event-info-color-button>.md-ripple{
    background:#ee4784 !important;

}
.inform{
      justify-content:start;
          margin: -20px 0px 0px 0px;
}
.inform-title{
  margin-left:15px;
}

</style>
