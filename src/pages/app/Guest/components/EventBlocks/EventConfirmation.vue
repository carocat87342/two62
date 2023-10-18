<template>
    <div class="event-confirmation" style="position: absolute !important;">
        <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C"/>
        <div class="confirmation-section">
            <h4>Are you coming?</h4>
            <md-button class=" md-sm" @click="confirmGoing(true)" :class="[{'md-success': (userResponse && userResponse.attending), 'md-info' : !(userResponse && userResponse.attending)}]">
                Yes
            </md-button>
            <md-button class="md-info md-sm" @click="confirmGoing(false)" :class="[{'md-success': (userResponse && !userResponse.attending), 'md-info' : !(userResponse && !userResponse.attending)}]">
                No
            </md-button>
            <div class="event-confirmation-signin text-center" v-if="!userInfo">
                <md-button class="md-simple md-xs text-center" style="font-weight: 500; width: 100%;" @click="showSignIn">Already responded? Sign in</md-button>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'event-confirmation',
  components: {

  },
  props: {
    event,
    userInfo: Object,
    userResponse: Object
  },
  data: () => ({
    isLoading: false
  }),
  methods: {
    showSignIn () {
      this.$root.$emit('event-confirmation', null)
    },
    confirmGoing (isGoing) {
      this.$root.$emit('event-confirmation', isGoing)
    }

  },
  created () {

  },
  mounted () {

  },
  watch: {
    userResponse (newVal, oldVal) {
      this.isLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
