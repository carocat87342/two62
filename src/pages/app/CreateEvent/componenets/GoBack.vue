<template>
    <div class="back-section" @click="goTo">
        <md-icon>keyboard_arrow_left</md-icon> <span class="back-text"> Go Back </span>
    </div>
</template>

<script>

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    navigation: {
      type: String,
      default: 'https://www.maryoku.com/home.html'
    },
    home: {
      type: Boolean,
      default: false
    }
  },
  components: {

  },
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations('PublicEventPlanner', ['setEventProperty', 'setCurrentStep']),

    goTo () {
      console.log(this.navigation)
      this.setCurrentStep({currentPage: this.navigation})

      if (this.home) {
        console.log('i am here')
        location.href = this.navigation
      } else {
        this.$router.push({ path: this.navigation})
      }
    }
  }
}
</script>
<style lang="scss">

</style>
