<template>
  <div class="md-layout invitees-management-v2">
    <vue-element-loading :active="isLoading" spinner="ring" is-full-screen color="#FF547C" isFullScreen/>
    <div class="md-layout-item md-size-100">
      <interactions-list :event-data.sync="eventData"></interactions-list>
    </div>
  </div>
</template>
<script>

import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import VueElementLoading from 'vue-element-loading'
import EventInteraction from '@/models/EventInteraction'

import InteractionsList from './InteractionsList'
export default {
  name: 'invitees-management-v2',
  components: {
    VueElementLoading,
    InteractionsList
  },
  props: {
    eventData: Object
  },
  data: () => ({

    isLoading: true
  }),
  methods: {

  },
  created () {
  },
  mounted () {
    this.isLoading = false
  },
  computed: {},
  watch: {
  }
}
</script>
