<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-100">
      <div class="table table-stats text-right">
        <div class="text-right">
          <md-button class="md-success" @click="openTeamInviteSidePanel">
            <md-icon>person_add</md-icon>Invite
          </md-button>
          <md-button name="vendors-upload-vendors" @click="openUploadModalSidePanel" class="vendors-upload-vendors md-info">
              Upload Excel File
          </md-button>
        </div>
      </div>
      <md-card>
        <md-card-content style="min-height: 60px;">
          <vue-element-loading :active="teamMembersLoading" spinner="ring" color="#FF547C"/>
          <team-table  :current-user-id="$auth.user.id" :available-permissions="permissions" :available-roles="roles"
            :team-id="team.id"
            :teamMembers="teamMembers"
            @membersRefresh="fetchData(pagination.from)"
            :openEditTeamInviteSidePanel="openEditTeamInviteSidePanel"></team-table>
          <md-card-actions md-alignment="space-between" v-if="pagination.limit < pagination.total">
            <div>
              <p
                class="card-category"
              >Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} entries</p>
            </div>
            <pagination
              class="pagination-no-border pagination-success"
              @input="pageChanged($event)"
              v-model="pagination.page"
              :per-page="pagination.limit"
              :total="pagination.total"
            ></pagination>
          </md-card-actions>
        </md-card-content>
      </md-card>
    </div>
    <!-- <invite-modal @membersRefresh="fetchData(pagination.from)" :team="team" ref="inviteModal"></invite-modal> -->
        <!-- <upload-modal  ref="uploadModal"></upload-modal> -->
  </div>
</template>

<script>
// import auth from '@/auth';
import InviteModal from './InviteModal/'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import TeamTable from './Table'
import Team from '@/models/Team'
import teamVuexModule from './team.vuex'
import VueElementLoading from 'vue-element-loading'
import { Pagination } from '@/components'
import { paginationMixins } from '@/mixins'

export default {
  components: {
    InviteModal,
    'team-table': TeamTable,
    //  UploadModal,
    VueElementLoading,
    Pagination
  },
  mixins: [paginationMixins],
  data () {
    return {
      // auth: auth,
      team: {},
      teamMembers: [],
      teamMembersLoading: true,
      roles: [
        { id: 'ADMIN', title: 'Administrator'},
        { id: 'co_producer', title: 'Co-Producer'},
        { id: 'manager', title: 'Manager'},
        { id: 'team_leader', title: 'Team Leader'},
        { id: 'employee', title: 'Employee'},
        { id: 'guest', title: 'Guest'}
      ],
      permissions: [
        { id: 'sign_off', title: 'Sign-Off'},
        { id: 'edit', title: 'Edit'},
        { id: 'create', title: 'Create'},
        { id: 'request_budget', title: 'Request Budget'},
        { id: 'view', title: 'View'},
        { id: 'vote', title: 'Vote'}
      ]
    }
  },
  created () {
    this.$store.registerModule('teamVuex', teamVuexModule)

    this.$auth.currentUser(
      this,
      true,
      function () {
        this.fetchData(this.pagination.from)
      }.bind(this)
    )
  },
  destroyed () {
    this.$store.unregisterModule('teamVuex')
  },
  methods: {
    ...mapMutations('teamVuex', [
      'resetForm',
      'setInviteModal',
      'setEditMode',
      'setModalTitle',
      'setMemberProperty'
    ]),
    fetchData (page) {
      this.teamMembersLoading = true
      /* Team.get().then(teams => {
          this.team = teams[0];
          teams[0].members().get().then(members => {
            this.teamMembers = members;
            this.teamMembersLoading = false;
          });
        }, (error) => {
          console.log(error)
        }); */

      let currentUserId = this.$auth.user.id
      new Team({ id: this.$auth.user.defaultGroupId })
        .members()
        .page(Number(page))
        .limit(this.pagination.limit)
        .get()
        .then(members => {
          /* let result = members[0].results.filter(function(item, pos) {
            return item.id != currentUserId;
          }); */

          this.teamMembers = members[0].results
          this.updatePagination(members[0].model)
          this.teamMembersLoading = false
        })
    },
    // openUploadModal(){
    //    // this.$refs.uploadModal.toggleModal(true);
    // },

    openUploadModalSidePanel () {
      this.resetForm()
      this.setMemberProperty({ key: 'role', actualValue: 'co_producer' })
      this.setMemberProperty({ key: 'permissions', actualValue: ['sign_off'] })

      // this.setInviteModal({ showModal: true })
      this.setEditMode({ editMode: false })
      this.setModalTitle('Invite your Team')
      window.currentPanel = this.$showPanel({
        component: UploadModal,
        cssClass: 'md-layout-item md-size-40 transition36 ',
        openOn: 'right',
        props: {
          membersRefresh: () => this.fetchData(this.pagination.from),
          team: this.team
        }
      })
    },
    openTeamInviteSidePanel () {
      this.resetForm()
      this.setMemberProperty({ key: 'role', actualValue: 'co_producer' })
      this.setMemberProperty({ key: 'permissions', actualValue: ['view'] })

      // this.setInviteModal({ showModal: true })
      this.setEditMode({ editMode: false })
      this.setModalTitle('Invite your Team')
      window.currentPanel = this.$showPanel({
        component: InviteModal,
        cssClass: 'md-layout-item md-size-40 transition36 ',
        openOn: 'right',
        props: {
          membersRefresh: () => this.fetchData(this.pagination.page),
          team: this.team,
          availablePermissions: this.permissions
        }
      })
    },
    openEditTeamInviteSidePanel (showModal, teamMember) {
      // this.setInviteModalAndTeamMember({showModal: show, teamMember: item})
      window.currentPanel = this.$showPanel({
        component: InviteModal,
        cssClass: 'md-layout-item md-size-40 transition36 ',
        openOn: 'right',
        props: {

          membersRefresh: () => this.fetchData(this.pagination.page),
          team: teamMember,
          availablePermissions: this.permissions
        }
      })
    },

    openInviteModal () {}
  }
}
</script>
<style >
.md-table-head-label {
  font-weight: 500;
}
</style>
