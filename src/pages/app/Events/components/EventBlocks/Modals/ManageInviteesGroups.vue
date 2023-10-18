<template>
  <div class="manage-groups-panel">
    <div class="md-layout" style="max-height: 100vh">
      <div class="md-layout">
        <div class="md-layout-item md-size-50">
          <h4 class="section-title">
            <b>Manage Groups</b>
          </h4>
          <md-card>
            <md-card-header class="md-card-header-text">
              <h4 class="title2">Groups</h4>
              <div class="card-actions pull-right">
                <!--<md-button class="md-info" @click="removeMember">Remove</md-button>-->
                <md-button class="md-info md-sm event-planner-tab-invitees-management-create-group" @click="addMember"
                  >Create Group</md-button
                >
              </div>
            </md-card-header>
            <md-card-content class="groups-list">
              <!-- Groups -->
              <div
                class="group"
                v-for="(group, index) in selectedEventGroups"
                :key="index"
                :class="{ selected: selectedGroup && selectedGroup.id === group.id }"
              >
                <h4>
                  <label-edit
                    :text="group.title"
                    :field-name="index"
                    @text-updated-blur="groupTitleChanged"
                    @text-updated-enter="groupTitleChanged"
                  ></label-edit>
                </h4>

                <div class="card-actions pull-right">
                  <md-button class="md-danger md-sm md-just-icon md-simple" @click="removeGroup(group.id)">
                    <md-icon>delete_outline</md-icon>
                  </md-button>
                  <md-button class="md-success md-sm md-just-icon md-simple" @click="ManageInvitees(group)">
                    <md-icon>group_add</md-icon>
                  </md-button>
                </div>
              </div>
              <!-- ./Groups -->
            </md-card-content>
          </md-card>
        </div>
        <div class="md-layout-item md-size-50" v-if="groupInvitees.length">
          <h5>
            Add members to '
            <span>{{ selectedGroup.title }}</span
            >' group manually <br />or
            <md-button class="md-simple md-info upload-members-btn">Upload members from file</md-button>
          </h5>
          <md-card>
            <md-card-header class="md-card-header-text">
              <h4 class="title2">Member List</h4>
              <div class="card-actions pull-right" v-if="!adding">
                <md-button class="md-danger md-sm" @click="removeMember">Remove</md-button>
                <md-button class="md-info md-sm" @click="addInvitee">Add Invitee</md-button>
              </div>
            </md-card-header>
            <md-card-content>
              <!-- Groups -->
              <ul class="members-list" v-if="!adding">
                <li class="member-item" v-for="(item, index) in groupInvitees" :key="index">
                  <md-checkbox v-model="item.selected" class="member-checkbox"></md-checkbox>
                  <div class="member-name">{{ item.fullName }}</div>
                  <div class="member-email">{{ item.emailAddress }}</div>
                </li>
              </ul>

              <div class="adding-members" v-else-if="adding">
                <h5>Add invitee to {{ selectedGroup.title }}</h5>
                <md-field class="md-layout-item">
                  <label>User Name</label>
                  <md-input type="email" v-model="newUser"></md-input>
                </md-field>
                <md-field class="md-layout-item">
                  <label>Email Address</label>
                  <md-input type="email" v-model="newValue"></md-input>
                </md-field>
                <div>
                  <md-button class="md-info md-sm" @click="saveInvitee">Save</md-button>
                  <md-button class="md-default md-sm" @click="cancel">Cancel</md-button>
                </div>
              </div>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import EventPageHeaderImage from "@/models/EventPageHeaderImage";
import { Modal, LabelEdit } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import EventInviteeGroup from "@/models/EventInviteeGroup";
import EventInvitee from "@/models/EventInvitee";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import _ from "underscore";

export default {
  components: {
    LabelEdit,
  },
  props: {
    event: Object,
    selectedEventGroups: Array,
  },
  data: () => ({
    // auth: auth,
    isLoaded: false,
    membersList: [],
    members: [],
    adding: false,
    newUser: "",
    newValue: "",
    groups: [],
    selectedGroup: null,
    groupInvitees: [],
  }),

  created() {},
  mounted() {},
  methods: {
    addMember() {
      // define new group
      let newGroup = {
        title: "New Group",
      };

      // save new group
      new EventInviteeGroup(newGroup)
        .save()
        .then((resp) => {
          this.$notify({
            message: "Group created successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });

          this.selectedEventGroups.push(resp);
          this.saveInviteeGroups();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeMember() {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.members = _.reject(this.groupInvitees, function (member) {
            return member.selected === true;
          });

          this.members.forEach((member) => {
            let invitee = new EventInvitee({ id: member.id }).for(this.selectedGroup);

            invitee
              .delete()
              .then((resp) => {
                this.$notify({
                  message: "Invitees deleted successfully",
                  horizontalAlign: "center",
                  verticalAlign: "top",
                  type: "success",
                });

                this.getGroupInvitees(this.selectedGroup);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      });
    },
    ManageInvitees(group) {
      this.selectedGroup = group;

      // get invitees for selected groups
      this.getGroupInvitees(group);
    },
    getGroupInvitees(group) {
      let selected_group = new EventInviteeGroup({ id: group.id });

      new EventInvitee()
        .for(selected_group)
        .get()
        .then((resp) => {
          this.groupInvitees = resp;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addMember() {
      this.adding = true;
    },
    cancel() {
      this.adding = false;
    },
    saveMember() {
      let invitee = {
        fullName: this.newUser,
        emailAddress: this.newValue,
      };

      // add invitee to the selected group
      new EventInvitee(invitee)
        .for(this.selectedGroup)
        .save()
        .then((resp) => {
          this.$notify({
            message: "Invitee added successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });

          this.adding = false;

          // refresh invitees group list
          this.getGroupInvitees(this.selectedGroup);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    groupTitleChanged(val, index) {
      let group = new EventInviteeGroup({ id: this.groups[index].id });

      group.title = val;

      group
        .save()
        .then((resp) => {
          this.$notify({
            message: "Group modified successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    removeGroup(id) {
      Swal.fire({
        title: "Are you sure?",
        text: `You won't be able to revert this!`,
        showCancelButton: true,
        confirmButtonClass: "md-button md-success",
        cancelButtonClass: "md-button md-danger",
        confirmButtonText: "Yes, delete it!",
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          let group = new EventInviteeGroup({ id: id });

          group
            .delete()
            .then((resp) => {
              this.$notify({
                message: "Group removed successfully!",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "success",
              });

              this.selectedEventGroups.splice(
                _.findIndex(this.selectedEventGroups, (g) => {
                  return g.id === id;
                }),
                1,
              );
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    saveInviteeGroups() {
      let _calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });

      let selectedGroupsIds = [];

      this.selectedEventGroups.forEach((group) => {
        selectedGroupsIds.push({ id: group.id, title: group.title });
      });

      event = this.event;
      event.inviteeGroups = selectedGroupsIds.length ? selectedGroupsIds : null;

      event
        .for(_calendar)
        .save()
        .then((resp) => {
          console.log("Group added to event");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {},
};
</script>
<style lang="scss" scope>
.md-datepicker {
  .md-icon.md-date-icon {
    display: none;
    & ~ label {
      left: 0;
    }
  }
  input {
    margin-left: 0 !important;
  }
  &.md-field::before,
  &.md-field::after {
    width: 100%;
  }
}

.md-field > .md-icon ~ .md-input {
  margin: 0;
}
</style>
<style lang="scss">
.modal-z-index {
  z-index: 5;
}

.large-z-index {
  z-index: 6;
  position: relative;
}

.move-center {
  margin: 0 auto !important;
}

.move-left {
  margin-left: 0 !important;
  margin-right: auto !important;
}

.move-right {
  margin-right: 0 !important;
  margin-left: auto !important;
}

.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
}

.items-center-v {
  align-items: center;
}

.items-center-g {
  justify-content: center;
}

.justify-beetwen {
  justify-content: space-between;
}

.md-field .md-error {
  text-align: left;
}

.swal2-container {
  z-index: 10000;
}
</style>
