<template>
  <div class="md-layout">
    <div class="md-layout-item" style="text-align: center;">
      <img src="/static/img/maryoku-loader.gif" />
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import SockJS from 'sockjs-client' // NEW: SockJS & Stomp instead of socket.io
import Stomp from 'stompjs'
import TenantUser from '@/models/TenantUser'
import Model from '@/models/Model'

export default {
  components: {
  },
  methods: {
  },
  created () {
    const event = this.$route.query.event;
    this.$authService.setInvitationEvent(this.$authService.resolveTenantId(), event)
    this.$store.dispatch('auth/checkToken').then(
      (tenantUser) => {
        const tenantId = this.$authService.resolveTenantId()
        this.$authService.setTenant(tenantId)
      },
      error => {
        this.loading = false;
        this.$router.push({path: `/signin?invite=true`})
      }
    );
  },
  data () {
    return {
      serverURL: process.env.SERVER_URL
    }
  }
}
</script>
<style>
</style>
