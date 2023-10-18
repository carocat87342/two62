<template>
    <div class="md-layout">
        <div class="md-layout-item md-size-100">
            <member-groups-list></member-groups-list>
        </div>
    </div>
</template>
<script>

import TeamMember from '@/models/TeamMember'
import Team from '@/models/Team'

import MemberGroupsList from './MemberGroupsList'
import MemberGroupDetails from './MemberGroupDetails'

export default {
  components: {
    MemberGroupsList,
    MemberGroupDetails
  },
  data () {
    return {
      working: false,
      groups: []
    }
  },
  mounted () {
    this.working = false
    // this.$root.$emit('set-title',null);
  }
}
</script>
<style lang="scss" scoped>
</style>
