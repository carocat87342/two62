<template>
  <div>
    <slideout-panel></slideout-panel>
    <router-view></router-view>

    <NotificationModal v-if="isNotificationModal" :name="name"></NotificationModal>
    <ActionModal v-if="isActionModal" :name="name"></ActionModal>
  </div>
</template>

<script>
// import auth from '@/auth';
// import Model from '@/models/Model'
import { NOTIFICATION, ACTION } from "./constants/modal";

const components = {
    NotificationModal: () => import('@/components/Modals/NotificationModal.vue'),
    ActionModal: () => import('@/components/Modals/ActionModal.vue'),
}

export default {
  components,
  data () {
    return {
      // auth: auth
    }
  },
  mounted () {
    const that = this
    if (window.focusEventListener != null) {
      window.removeEventListener('focus', window.focusEventListener)
      window.focusEventListener = null
    }

    let initialMessage = document.getElementById('initial-message')
    if (initialMessage) {
      initialMessage.remove()
    }
    const loadingBackground = document.getElementById('loading-background');
    if (loadingBackground) {
      loadingBackground.remove()
    }
  },
  computed: {
    name() {
        return this.$store.state.modal.name;
    },
    isNotificationModal(){
        return Object.keys(NOTIFICATION).includes(this.name)
    },
    isActionModal(){
        return Object.keys(ACTION).includes(this.name)
    }
  },
  watch: {
    name(newVal){console.log('watch.name', newVal, Object.keys(ACTION))}
  }
}
</script>
<style lang="scss">
.slideout.transition36 {
  transition: transform 0.36s ease-out !important;
}
.slideout.w100 {
  width: 100% !important;
}
.slideout.w75 {
  width: 75% !important;
}

.slideout.w50 {
  width: 50% !important;
}

.slideout.w25 {
  width: 25% !important;
}

.slideout.h25 {
  height: 25% !important;
}

.slideout.h50 {
  height: 50% !important;
}

.slideout.h65 {
  height: 65% !important;
}

.slideout.h75 {
  height: 75% !important;
  padding-left: 89px;
}

.slideout.h100 {
  height: 100% !important;
}

.slideout.bg-grey {
  background-color: #eeeeee !important;
}
</style>
