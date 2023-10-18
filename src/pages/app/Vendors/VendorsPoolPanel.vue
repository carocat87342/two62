<template>
    <div class="md-layout" style="height: 98vh; max-height: 98vh; overflow: hidden">
        <vue-element-loading :active="working" spinner="ring" color="#FF547C"/>
        <div class="md-layout-item md-size-5" style="padding: 0; margin: 0;">
            <h4 class="md-title">
                <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
                    <md-icon>arrow_back</md-icon>
                </md-button>
            </h4>
        </div>
        <div class="md-layout-item md-size-95" style="height: 90vh; max-height: 90vh; ">
            <h4 class="md-title" style="margin-bottom: 0; line-height: 51px;">
                Vendors Pool
            </h4>
            <div class="md-layout" style="overflow: auto; height: 90vh; max-height: 90vh; margin-top: 14px;">
                <div class="md-layout-item mx-auto">
                    <vendors-pool :in-panel="true"></vendors-pool>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueElementLoading from 'vue-element-loading'
import VendorsPool from './VendorsPool'

export default {
  name: 'vendors-pool-panel',
  components: {
    VueElementLoading,
    VendorsPool
  },
  data () {
    return {
      working: false
    }
  },
  mounted () {

  },
  methods: {
    closePanel () {
      this.$emit('closePanel')
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>

</style>
