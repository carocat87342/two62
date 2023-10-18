<template>
  <div>
    <md-card >
      <md-card-header class="md-card-header-text md-card-header-warning">
        <div class="card-text">
          <h4 class="title fc-white">Manage Vendor's proposals</h4>
          <div class="ct-label">Applicable vendors from your list</div>
        </div>
        <div class="header-actions pull-right mt-1">
          <md-button class="md-info" @click="manageBlockVendors">
            Add Vendors
          </md-button>
          <md-button class="md-default">
            Send
          </md-button>
        </div>
      </md-card-header>
      <md-card-content class="minh-60">
        <md-table  v-if="blockVendors" v-model="blockVendors"  table-header-color="orange" class="vendors-table">
          <md-table-row slot="md-table-row" slot-scope="{ item }" :key="blockVendors.indexOf(item)"   >
            <md-table-cell md-label="Vendor Name"  > {{ item.vendor.vendorDisplayName }}</md-table-cell>
            <md-table-cell md-label="Recommended by">
              <img :src="`https://bit.ly/2Qcsg27`" width="20" class="w-100pi">
            </md-table-cell>
            <md-table-cell md-label="Inquiry Sent">
              {{ `11/1/2019` }}
            </md-table-cell>
            <md-table-cell md-label="Last Proposal"  > {{ `11/17/2019 08:30` }}</md-table-cell>
            <md-table-cell class="vendors-table_item-actions">
              <md-button v-if="true" class="md-button md-info md-sm md-theme-default auto-width md-just-icon" @click="viewProposals(item)">
                View Proposals
              </md-button>
              <md-button v-if="true" class="md-button md-default md-sm md-theme-default auto-width md-just-icon">
                Inquiry Sent
              </md-button>
            </md-table-cell>
          </md-table-row>
        </md-table>
        <template v-if="!blockVendors.length">
          <h5>Your vendors list is empty</h5>
          <p>import your vendors and refresh this page after you're done</p>
        </template>
      </md-card-content>
      <md-card-actions md-alignment="right" v-if="blockVendors.length">
        <md-button class="md-info" >
          Compare proposals
        </md-button>
        <md-button class="md-info">
          Give me proposals
        </md-button>
      </md-card-actions>
    </md-card>
    <upload-vendors-modal ref="uploadModal"></upload-vendors-modal>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import Calendar from '@/models/Calendar'
import CalendarEvent from '@/models/CalendarEvent'
import EventComponent from '@/models/EventComponent'
import EventComponentVendor from '@/models/EventComponentVendor'
import VueElementLoading from 'vue-element-loading'
// import auth from '@/auth'

import UploadVendorsModal from '../../../Vendors/ImportVendors'
import ManageBlockVendors from './Modals/ManageBlockVendors.vue'
import ViewProposals from './Modals/ViewProposals.vue'

export default {
  name: 'event-blocks',
  components: {
    VueElementLoading,
    UploadVendorsModal,
    ManageBlockVendors,
    ViewProposals
  },
  props: {
    selectedBlock: Object,
    event: Object
  },
  data: () => ({
    // auth: auth,
    isLoading: true,
    blockVendors: []
  }),
  methods: {
    openUploadModal () {
      this.$refs.uploadModal.toggleModal(true)
    },
    manageBlockVendors () {
      window.currentPanel = this.$showPanel({
        component: ManageBlockVendors,
        cssClass: 'md-layout-item md-size-55 transition36 bg-grey',
        openOn: 'right',
        props: {
          event: this.event,
          selectedBlock: this.selectedBlock
        }
      })
    },
    getBlockVendors () {
      let calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId
      })
      let event = new CalendarEvent({
        id: this.event.id
      })
      let selected_block = new EventComponent({
        id: this.selectedBlock.id
      })

      new EventComponentVendor().for(calendar, event, selected_block).get()
        .then(resp => {
          this.blockVendors = resp
        })
        .catch(error => {
          console.log('EventComponentVendor error =>', error)
        })
    },
    viewProposals (item) {
      window.currentPanel = this.$showPanel({
        component: ViewProposals,
        cssClass: 'md-layout-item md-size-45 transition36 bg-grey',
        openOn: 'right',
        props: {
          event: this.event,
          vendor: item
        }
      })
    }

  },
  created () {},
  mounted () {
    this.isLoading = false
    this.getBlockVendors()

    this.$root.$on('VendorAdded', () => {
      this.getBlockVendors()
    })
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
  .fc-white {
    color: white;
  }
  .mt-1 {
    margin-top : 1em;
  }
  .minh-60 {
    min-height: 60px;
  }
  .w-100pi {
    width: 100px !important;
  }
</style>
