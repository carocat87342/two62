<template>
  <div class="md-layout members-group-list">
    <div class="md-layout-item md-medium-size-40 md-size-35">
      <md-card style="height: auto">
        <md-card-header class="md-card-header-text md-card-header-warning">
          <div class="card-text">
            <h4 class="title" style="color: white">Manage Groups</h4>
          </div>
          <!--<md-button class="md-purple md-sm pull-right md-icon-button" style="margin: 16px 6px;" @click="refreshList(true)" :disabled="working || noActions">
                        <md-icon style="font-size: 11px;padding:0; margin: 0; height: 15px;">refresh</md-icon>
                    </md-button>-->
          <md-button
            v-if="groupsList.length"
            class="md-info md-sm pull-right"
            style="margin: 16px 6px"
            @click="createNewGroup"
            :disabled="working"
            >Create New Group</md-button
          >
        </md-card-header>
        <md-card-content>
          <vue-element-loading :active="working" spinner="ring" color="#FF547C" />

          <md-table
            :md-fixed-header="false"
            :md-height="550"
            :md-card="false"
            v-model="groupsList"
            table-header-color="orange"
            class="table-striped table-hover"
          >
            <md-table-row
              slot="md-table-row"
              slot-scope="{ item, index }"
              :class="{
                'visible-row': visibleGroup && item.id === visibleGroup.id,
                'not-visible-row': visibleGroup && item.id !== visibleGroup.id,
              }"
              @click="groupDetails(item)"
            >
              <md-table-cell style="vertical-align: middle">
                <label-edit
                  v-if="item.id !== 'all'"
                  style="margin-top: 8px"
                  :scope="item"
                  :text="item.name"
                  field-name="name"
                  @text-updated-blur="groupNameChanged"
                  @text-updated-enter="groupNameChanged"
                ></label-edit>
                <h5 v-else style="font-weight: 500" class="">{{ item.name }}</h5>
              </md-table-cell>

              <md-table-cell style="vertical-align: middle; white-space: nowrap">
                <div style="margin-top: 4px" v-if="item.members">
                  <md-icon>group</md-icon> {{ item.members.length }}
                </div>
              </md-table-cell>

              <md-table-cell class="text-right" style="white-space: nowrap; vertical-align: middle">
                <md-button
                  style="margin-top: 8px"
                  class="md-success md-sm"
                  v-if="item.id === 'new'"
                  @click="saveGroup(item)"
                >
                  Save
                </md-button>
                <md-button
                  style="margin-top: 8px"
                  class="md-round md-danger md-just-icon"
                  v-if="item.id !== 'new' && !item.builtIn"
                  @click="deleteGroup(item)"
                >
                  <md-icon>delete</md-icon>
                </md-button>
                <md-button
                  style="margin-top: 8px"
                  class="md-round md-info md-just-icon"
                  v-if="item.id !== 'new'"
                  @click="groupDetails(item)"
                >
                  <md-icon>chevron_right</md-icon>
                  <md-tooltip md-direction="bottom">Manage group members</md-tooltip>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>

          <div class="text-center" v-if="!groupsList.length">
            <h4>You do not have any groups yet</h4>
            <md-button class="md-info" @click="createNewGroup"> <md-icon>event</md-icon> Create New Group </md-button>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item md-medium-size-60 md-size-65">
      <member-group-details
        @group-selected="selectGroup"
        @group-members-changed="updateGroup"
        @group-member-removed="updateGroups"
        :groups-list.sync="groupsList"
        :group-data.sync="visibleGroup"
        :all-members.sync="allMembers"
        :roles-list="rolesList"
        :permissions-list="permissionsList"
      ></member-group-details>
    </div>
  </div>
</template>
<script>
import TeamMember from "@/models/TeamMember";
import Team from "@/models/Team";

import MemberGroupDetails from "./MemberGroupDetails";
import LabelEdit from "@/components/LabelEdit";
import _ from "underscore";
import Swal from "sweetalert2";

export default {
  name: "member-groups-list",
  components: {
    LabelEdit,
    MemberGroupDetails,
  },
  props: {},
  data() {
    return {
      working: false,
      noActions: false,
      visibleGroup: null,
      groupsList: [],
      allMembers: [],
      rolesList: [
        { id: "ADMIN", title: "Administrator" },
        { id: "co_producer", title: "Co-Producer" },
        { id: "manager", title: "Manager" },
        { id: "team_leader", title: "Team Leader" },
        { id: "employee", title: "Employee" },
        { id: "guest", title: "Guest" },
      ],
      permissionsList: [
        { id: "view", title: "View", checked: false },
        { id: "create", title: "Create", checked: false },
        { id: "edit", title: "Edit", checked: false },
        { id: "request_budget", title: "Request Budget", checked: false },
        { id: "sign_off", title: "Sign-Off", checked: false },
        { id: "vote", title: "Vote", checked: false },
      ],
    };
  },
  mounted() {
    this.working = true;
    this.$auth.currentUser(this, true, () => {
      this.refreshList(false);
    });

    this.$root.$on("refresh-members", (force) => {
      this.refreshList(force);
    });
    // this.refreshList();
  },
  watch: {},
  methods: {
    refreshList(force) {
      this.working = true;
      this.visibleGroup = null;
      this.loadAllMembers(force);
    },
    loadAllMembers(force) {
      TeamMember.fetch(this, force).then((allMembers) => {
        this.allMembers = allMembers;
        this.loadTeams(force);
      });
    },
    loadTeams(force) {
      Team.fetch(this, force).then((teams) => {
        this.groupsList = teams;
        if (!_.findWhere(this.groupsList, { id: "all" })) {
          this.groupsList.splice(0, 0, {
            id: "all",
            name: "All members",
            builtIn: true,
          });
        }
        this.groupDetails(this.groupsList[0]);
        this.working = false;
      });
    },
    createNewGroup() {
      if (!this.groupsList.length || this.groupsList[0].id !== "new") {
        this.groupsList.splice(1, 0, { id: "new", title: "", selected: false });
      }
    },
    saveGroup(item) {
      Team.save(this, item).then((team) => {
        this.groupsList.splice(1, 0, team);
        this.groupDetails(team);
      });
    },
    updateGroups(item) {
      /* if (this.visibleGroup.id === 'all'){
                    this.groupsList.forEach((g)=>{
                        let index = _.findIndex(g.members, (m)=>{ return m.id === item.id; });
                        if (index > -1){
                            g.members.splice(index,1);
                        }
                    });

                    this.$ls.set("teams", this.groupsList, 1000 * 60 * 10);
                } */
      this.refreshList(true);
    },
    updateGroup(item) {
      if (item.id !== "all") {
        new Team(item).save().then((res) => {
          let itemIndex = _.findIndex(this.groupsList, (g) => {
            return g.id === item.id;
          });
          if (itemIndex > -1) {
            this.groupsList[itemIndex] = item;
          }
          // this.$ls.set("teams", this.groupsList, 1000 * 60 * 10);
          this.groupDetails(item);
        });
      } else {
        let itemIndex = _.findIndex(this.groupsList, (g) => {
          return g.id === item.id;
        });
        if (itemIndex > -1) {
          this.groupsList[itemIndex] = item;
        }
        // this.$ls.set("teams", this.groupsList, 1000 * 60 * 10);
        this.groupDetails(item);
      }
    },
    deleteGroup(item) {
      if (item.builtIn) return;

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success confirm-btn-bg btn-fill",
        cancelButtonClass: "md-button md-danger cancel-btn-bg btn-fill",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.value) {
          if (this.visibleGroup && this.visibleGroup.id === item.id) {
            this.visibleGroup = this.groupsList.length ? this.groupsList[0] : null;
          }
          new Team(item).delete().then((res) => {
            let index = _.findIndex(this.groupsList, (g) => {
              return g.id === item.id;
            });
            this.groupsList.splice(index, 1);
            // this.$ls.set("teams", this.groupsList, 1000 * 60 * 10);
          });
        }
      });
    },
    groupDetails(item) {
      if (item.id === "all") {
        item.members = this.allMembers;
      }
      this.visibleGroup = item;
    },
    selectGroup(item) {
      this.visibleGroup = _.findWhere(this.groupsList, { id: item.id });
    },
    groupNameChanged(val, fieldName, item) {
      item[fieldName] = val;

      if (item.id === "new") {
        item.id = null;
        delete item["id"];
        this.groupsList.splice(1, 1);
        this.saveGroup(item);
      } else {
        this.updateGroup(item);
      }
    },
    changeGroupSelection($event, item) {},
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";
.visible-row {
  background-color: $yellow-50 !important;
}
.not-visible-row {
  cursor: pointer;
}

.md-table-content {
  thead {
    display: none !important;
  }

  .md-table-row:not(:last-child) td {
    border-bottom-color: #ddd !important;
    border-top: 0 solid;
    border-bottom: 1px solid;
  }
}

thead {
  display: none;
}
</style>
