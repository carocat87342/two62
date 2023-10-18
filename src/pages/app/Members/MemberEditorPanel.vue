<template>
  <div class="md-layout team-member-editor" style="height: 90vh; max-height: 90vh; overflow: hidden">
    <vue-element-loading :active="working" spinner="ring" color="#FF547C" />
    <div class="md-layout-item md-size-5" style="padding: 0; margin: 0">
      <h4 class="md-title">
        <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
          <md-icon>arrow_back</md-icon>
        </md-button>
      </h4>
    </div>
    <div class="md-layout-item md-size-95" style="height: 90vh; max-height: 90vh">
      <h4 class="md-title" style="margin-bottom: 0; line-height: 51px">{{ modalTitle }}</h4>
      <div class="md-layout" style="overflow: auto; height: 90vh; max-height: 90vh; margin-top: 14px">
        <div class="md-layout-item mx-auto">
          <div class="md-layout">
            <div class="md-layout-item md-size-100" style="margin-bottom: 16px" v-if="editMode">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-50">
                  <md-field
                    style="margin-right: 10px; width: 97%"
                    :class="[
                      { 'md-valid': !errors.has('firstName') && touched.firstName },
                      { 'md-error': errors.has('firstName') },
                    ]"
                  >
                    <label>First Name</label>
                    <md-input
                      ref="focusable"
                      v-model="teamMember.firstName"
                      data-vv-name="firstName"
                      type="text"
                      v-focus
                      name="firstName"
                      v-validate="modelValidations.firstName"
                    ></md-input>
                    <slide-y-down-transition>
                      <md-icon class="error" v-show="errors.has('firstName')">close</md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                      <md-icon class="success" v-show="!errors.has('firstName') && touched.firstName">done</md-icon>
                    </slide-y-down-transition>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field
                    :class="[
                      { 'md-valid': !errors.has('lastName') && touched.lastName },
                      { 'md-error': errors.has('lastName') },
                    ]"
                  >
                    <label>Last Name</label>
                    <md-input
                      v-model="teamMember.lastName"
                      data-vv-name="lastName"
                      type="text"
                      name="lastName"
                      v-validate="modelValidations.lastName"
                    ></md-input>
                    <slide-y-down-transition>
                      <md-icon class="error" v-show="errors.has('lastName')">close</md-icon>
                    </slide-y-down-transition>
                    <slide-y-down-transition>
                      <md-icon class="success" v-show="!errors.has('lastName') && touched.lastName">done</md-icon>
                    </slide-y-down-transition>
                  </md-field>
                </div>
              </div>
            </div>

            <div v-if="!this.editMode" class="md-layout-item md-size-100" style="margin-bottom: 16px">
              <label>One or more email addresses</label>
              <md-field
                class="height-auto"
                :class="[{ 'md-valid': !errors.has('email') && touched.email }, { 'md-error': errors.has('email') }]"
              >
                <md-input
                  v-model="teamMember.emailAddress"
                  data-vv-name="email"
                  type="email"
                  name="email"
                  required
                  rows="1"
                  v-validate="modelValidations.email"
                  v-focus
                  placeholder="john@example.com,brad@example.com"
                ></md-input>
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('email')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('email') && touched.email">done</md-icon>
                </slide-y-down-transition>

                <span class="md-error" v-if="errors.has('email')">{{ errors.first("email") }}</span>
              </md-field>
            </div>
            <div v-if="this.editMode" class="md-layout-item md-size-100" style="margin-bottom: 16px">
              <md-field
                v-if="this.editMode"
                class="height-auto"
                :class="[{ 'md-valid': !errors.has('email') && touched.email }, { 'md-error': errors.has('email') }]"
              >
                <label>Email address</label>
                <md-input
                  v-model="teamMember.emailAddress"
                  data-vv-name="email"
                  type="email"
                  name="email"
                  required
                  v-validate="modelValidations.email"
                ></md-input>
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('email')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('email') && touched.email">done</md-icon>
                </slide-y-down-transition>

                <span class="md-error" v-if="errors.has('email')">{{ errors.first("email") }}</span>
              </md-field>
            </div>

            <div class="md-layout-item md-size-100" style="margin-bottom: 16px" v-if="canEditPermissions">
              <md-field
                :class="[{ 'md-valid': !errors.has('role') && touched.role }, { 'md-error': errors.has('role') }]"
              >
                <label for="select">Role</label>
                <md-select
                  required
                  v-model="teamMember.role"
                  name="select"
                  data-vv-name="role"
                  v-validate="modelValidations.role"
                >
                  <md-option v-for="role in rolesList" :key="role.id" :value="role.id">{{ role.title }}</md-option>
                </md-select>
                <slide-y-down-transition>
                  <md-icon class="error" v-show="errors.has('role')">close</md-icon>
                </slide-y-down-transition>
                <slide-y-down-transition>
                  <md-icon class="success" v-show="!errors.has('role') && touched.role">done</md-icon>
                </slide-y-down-transition>
                <span class="md-error" v-if="errors.has('role')">{{ errors.first("role") }}</span>
              </md-field>
            </div>

            <div class="md-layout-item md-size-100" style="margin-bottom: 16px" v-if="!editMode">
              <label>Groups</label>
              <md-field>
                <multiselect
                  @tag="createNewGroup"
                  tag-placeholder="Add this as new group"
                  :hide-selected="true"
                  :close-on-select="false"
                  v-model="teamMember.groups"
                  placeholder
                  label="name"
                  track-by="id"
                  :searchable="true"
                  :options="groupsList"
                  :multiple="true"
                  :taggable="true"
                >
                  <template slot="tag" slot-scope="{ option }" style="padding: 12px">
                    <md-chip
                      style="
                        background-color: #ff547c !important;
                        color: #fff;
                        font-weight: 500;
                        font-size: 14px;
                        text-align: left;
                      "
                      :md-deletable="true"
                      @md-delete="removeGroup(option)"
                      >{{ option.name }}</md-chip
                    >
                  </template>
                </multiselect>
              </md-field>
            </div>

            <div class="md-layout-item md-size-100" style="margin-bottom: 16px" v-if="canEditPermissions && false">
              <div style="margin-top: 8px">
                <label>Permissions</label>
                <!--<md-field>
                                    <multiselect :hide-selected="true" :close-on-select="false" v-model="permission" tag-placeholder="Select permissions" placeholder="Select permissions" label="title" track-by="id" :searchable="false" :options="permissionsList" :multiple="true" :taggable="true" >

                                        <template slot="tag" slot-scope="{option}" style="padding: 12px;">
                                            <md-chip style="background-color: #FF547C !important; color: #fff; font-weight: 500; font-size: 14px; text-align: left;" :md-deletable="permission.length > 1" @md-delete="removePermission(option)">{{option.title}}</md-chip>
                                        </template>

                                    </multiselect>
                </md-field>-->
                <div>
                  <md-checkbox
                    :disabled="availablePermission.id === 'view'"
                    v-for="availablePermission in allPermissions"
                    :key="availablePermission.id"
                    v-model="permission"
                    :value="availablePermission.id"
                    >{{ availablePermission.title }}</md-checkbox
                  >
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-100" style="margin-top: 24px">
              <div class="pull-right">
                <md-button v-if="editMode" native-type="validated" class="md-success" @click="saveMemberDetails"
                  >Save</md-button
                >
                <md-button v-else native-type="validated" class="md-success" @click="sendInvitation">Invite</md-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { Modal, SimpleWizard, WizardTab } from "@/components";
import Swal from "sweetalert2";
import Team from "@/models/Team";
import TeamMember from "@/models/TeamMember";
import { SlideYDownTransition } from "vue2-transitions";
import _ from "underscore";

export default {
  components: {
    Modal,
    SlideYDownTransition,
    SimpleWizard,
    WizardTab,
  },
  props: {
    team: {
      type: Object,
      required: false,
    },
    teamMember: {
      type: Object,
      required: false,
    },
    permissionsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    rolesList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    groupsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    canEditPermissions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      working: false,
      permission: [],
      allPermissions: [],
      modalTitle: "",
      editMode: false,
      greenSuccess: false,
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        permissions: false,
        role: false,
      },
      emailArray: [],
      modelValidations: {
        firstName: {
          required: false,
        },
        lastName: {
          required: false,
        },
        email: {
          required: true,
        },
        role: {
          required: true,
        },
        permissions: {
          required: true,
        },
      },
    };
  },
  mounted() {
    let permissions = this.teamMember.permissions ? this.teamMember.permissions.split(",") : [];
    this.allPermissions = JSON.parse(JSON.stringify(this.permissionsList));
    this.allPermissions.forEach((p) => {
      let index = _.findIndex(permissions, (ip) => {
        return p.id === ip;
      });
      if (index > -1) {
        p.checked = true;
        this.permission.push(p.id);
      }
    });

    console.log(this.permission);

    this.editMode = this.teamMember.id !== "new";
    this.modalTitle = this.editMode ? "Edit member details" : "Invite team members";
  },
  computed: {},
  methods: {
    createNewGroup(groupName) {
      Team.save(this, { name: groupName }).then((team) => {
        this.groupsList.splice(1, 0, team);
      });
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res);
        return res;
      });
    },
    closePanel() {
      this.$emit("closePanel");
    },
    validateEmails() {
      if (!this.teamMember.emailAddress || this.teamMember.emailAddress === "") {
        return false;
      }

      this.emailArray = [];
      let pattern = /(^[a-zA-Z0-9]([a-zA-Z0-9_\.\+]*)@([a-zA-Z0-9_\.]*)([.][a-z]{1,3})$)|(^[a-zA-Z0-9]([a-zA-Z0-9_\.]*)@([a-zA-Z0-9_\.]*)(\.[a-z]{1,3})(\.[a-z]{2,})*$)/i;
      let emailValidateMap = [];
      let emailList = this.teamMember.emailAddress
        .replace(/(?:\r\n|\r|\n)/g, ",")
        .split(",")
        .map(function (item) {
          return item.trim();
        });

      emailList = emailList.filter(function (item, pos) {
        if (item != "") {
          return emailList.indexOf(item) === pos;
        }
      });

      emailList.forEach((item, index) => {
        emailValidateMap.push(pattern.test(item));
      });

      let errorMap = emailValidateMap.filter(function (item) {
        return item === false;
      });

      if (errorMap.length) {
        this.$validator.errors.add({
          field: "email",
          msg: "Email is not correct!",
        });
        return false;
      }

      this.emailArray = emailList;

      return true;
    },
    saveMemberDetails() {
      this.working = true;
      this.teamMember.permissions = this.permission.join(",");
      let member = {
        id: this.teamMember.id,
        firstName: this.teamMember.firstName,
        lastName: this.teamMember.lastName,
        emailAddress: this.teamMember.emailAddress,
        role: this.teamMember.role,
        permissions: this.teamMember.permissions,
      };
      new TeamMember(member).save().then((res) => {
        this.working = false;
        this.closePanel();
      });
    },
    sendInvitation() {
      this.working = true;
      this.$validator.validateAll().then((res) => {
        if (this.validateEmails() && res) {
          if (this.editMode) {
            this.updateTeamMember();
          } else {
            this.teamMember.id = null;
            delete this.teamMember["id"];
            let promises = [];
            let members = [];
            this.emailArray.forEach((item, index) => {
              console.log("Send invitation: email: " + JSON.stringify(item));
              let member = Object.assign({}, this.teamMember, {
                emailAddress: item,
                username: item,
              });
              if (member) {
                member.permissions = _.map(this.permission, (v) => {
                  return v.id;
                }).join(",");
                console.log("Send invitation: saving team member ");
                let p = new TeamMember(member).save();
                promises.push(p);
                p.then((res) => {
                  let ps = [];
                  this.teamMember.groups.forEach((group) => {
                    let tg = new TeamMember(res.item).for(new Team(group)).save();
                    ps.push(tg);
                  });

                  Promise.all(ps).then((r) => {
                    console.log("Send invitation: member attached ");
                    res.item.groups = this.teamMember.groups;
                    members.push(res.item);
                    this.$root.$emit("member-added", res.item);
                    member = {};
                  });
                });
              }
            });
            Promise.all(promises).then(() => {
              this.closePanel();
            });
          }
        } else {
          this.working = false;
          this.$emit("on-validated", res);
          return res;
        }
      });
    },
    updateTeamMember() {
      this.teamMember
        .save()
        .then((result) => {
          /*
                        this.$notify({
                          message: "Team member Update successfully!",
                          horizontalAlign: "center",
                          verticalAlign: "top",
                          type: "success"
                        }); */
          this.closePanel();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    removePermission(option) {
      let index = _.findIndex(this.permission, (item) => {
        return item.id === option.id;
      });
      this.permission.splice(index, 1);
    },
    removeGroup(option) {
      let index = _.findIndex(this.teamMember.groups, (g) => {
        return g.id === option.id;
      });
      this.teamMember.groups.splice(index, 1);
    },
  },
  watch: {
    firstName() {
      this.touched.firstName = true;
    },
    lastName() {
      this.touched.lastName = true;
    },
    email() {
      this.touched.email = true;
    },
    role() {
      this.touched.role = true;
    },
    permissions() {
      this.touched.permissions = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";

.mt-0 {
  margin-top: 0;
}
.md-field.md-has-textarea.height-auto:not(.md-autogrow) .md-textarea {
  height: auto;
  min-height: auto;
}
.md-field.md-has-textarea.height-auto:not(.md-autogrow):after,
.md-field.md-has-textarea.height-auto:not(.md-autogrow):before {
  height: 1px;
  top: auto;
  bottom: 10px;
}
.mb25 {
  margin-bottom: 25px;
}
.modal-header .color-success {
  color: #42b983;
}
.btn-position {
  position: absolute;
  right: 15px;
  font-weight: bold;
  top: 20px;
  font-size: 17px;
  background-color: transparent !important;
  box-shadow: none !important;
  color: gray !important;
  border-color: transparent;
  cursor: pointer;

  &:hover,
  &:visited,
  &:focus,
  &:active {
    background-color: transparent !important;
    box-shadow: none !important;
    color: gray !important;
  }
}
.swal2-container {
  z-index: 999999;
}
.header-position {
  position: relative;
}
.move-left {
  margin-right: 15px !important;
}
.success-box {
  position: absolute;
  top: 45px;
  width: 25%;
  height: 50px;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.md-tooltip {
  z-index: 9999 !important;
}
</style>
