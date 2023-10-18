<template>
  <div class="md-layout interactions-list">
    <div class="md-layout-item md-medium-size-45 md-size-35">
      <md-card style="min-height: 50%">
        <md-card-header class="md-card-header-text md-card-header-warning">
          <div class="card-text">
            <h4 class="title" style="color: white">Manage Groups</h4>
          </div>
          <md-button
            v-if="groupsList.length"
            class="md-info md-sm pull-right"
            style="margin: 16px 6px"
            @click="createNewGroup"
            :disabled="working"
            >Add Group</md-button
          >
        </md-card-header>
        <md-card-content style="min-height: 100%">
          <vue-element-loading :active="working" spinner="ring" color="#FF547C" />

          <md-table :md-card="false" v-model="groupsList">
            <md-table-row
              slot="md-table-row"
              slot-scope="{ item, index }"
              :class="{
                'visible-row': visibleGroup && item.id === visibleGroup.id,
                'not-visible-row': visibleGroup && item.id !== visibleGroup.id,
              }"
              @click="groupDetails(item)"
            >
              <md-table-cell class="text-center" style="width: 5%; vertical-align: middle">
                <md-switch
                  class="md-switch-rose"
                  style="margin: auto"
                  v-model="item.enabled"
                  @change="changeGroupSelection($event, item)"
                ></md-switch>
              </md-table-cell>

              <md-table-cell style="vertical-align: middle">
                <label-edit
                  style="margin-top: 8px"
                  :scope="item"
                  :text="item.title"
                  field-name="title"
                  @text-updated-blur="groupNameChanged"
                  @text-updated-enter="groupNameChanged"
                ></label-edit>
                <!--<div class="timing-form" v-if="item.editMode">
                  <md-card class="md-card-plain md-gutter" style="margin: 0; padding: 0;">
                    <md-card-content style="padding: 12px 0;">
                      <div class="md-layout">
                        <div class="md-layout-item md-size-65">
                          <md-field>
                            <label>Send this interaction</label>
                            <md-select v-model="item.sendDateOption" name="sendDateOption" id="sendDateOption">
                              <md-option value="sendOnDate">On a specific date</md-option>
                              <md-option value="sendDaysBeforeEvent">Days before the event</md-option>
                            </md-select>
                          </md-field></div>
                        <div class="md-layout-item md-size-35">
                          <md-field v-if="item.sendDateOption === 'sendOnDate'">
                            <md-input v-model="item.sendOnDate"
                                      data-vv-name="sendOnDate"
                                      v-focus/>
                          </md-field>
                          <md-field v-if="item.sendDateOption === 'sendDaysBeforeEvent'">
                            <md-input v-model="item.sendDaysBeforeEvent"
                                      data-vv-name="sendDaysBeforeEvent" v-focus/>
                          </md-field>
                        </div>
                        <div class="md-layout-item md-size-100">
                          <md-checkbox v-model="item.includePageLink"
                                       :id="`include-${index}`"></md-checkbox>
                          &lt;!&ndash;<label style=" margin:  14px 16px 14px 0" :for="`include-${index}`">Include a link to the <a :href="`/#/events/${eventData ? eventData.id : ''}/public`">event public page</a>?</label>&ndash;&gt;
                          <label style=" margin:  14px 16px 14px 0" :for="`include-${index}`">Include a link to the event public page?</label>
                        </div>
                      </div>
                    </md-card-content>
                  </md-card>
                </div>-->
              </md-table-cell>
              <md-table-cell style="vertical-align: middle">
                <div style="margin-top: 4px" v-if="item.invitees">
                  {{ item.invitees.length }} <md-icon>group</md-icon>
                </div>
              </md-table-cell>
              <md-table-cell class="text-right" style="width: 80px; vertical-align: middle">
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
                  v-if="item.id !== 'new'"
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
    <div class="md-layout-item md-medium-size-55 md-size-65">
      <event-group-details :group-data.sync="visibleGroup" :event-data="eventData"></event-group-details>
    </div>
  </div>
</template>
<script>
import EventInteraction from "@/models/EventInteraction";
import EventGroupDetails from "./EventGroupDetails";
import Calendar from "@/models/Calendar";
import EventInviteeGroup from "@/models/EventInviteeGroup";
import LabelEdit from "@/components/LabelEdit";
import _ from "underscore";
import Swal from "sweetalert2";

export default {
  name: "event-groups-list",
  components: {
    LabelEdit,
    EventGroupDetails,
  },
  props: {
    eventData: {
      type: Object,
      default: () => {
        return { title: "" };
      },
    },
  },
  data() {
    return {
      working: false,
      groupsList: [],
      visibleGroup: null,
    };
  },
  mounted() {
    this.working = true;
    if (this.eventData) {
      this.refreshList();
    }
  },
  watch: {
    eventData(newVal, oldVal) {
      this.refreshList();
    },
  },
  methods: {
    refreshList() {
      this.working = true;
      new EventInviteeGroup().get().then((res) => {
        this.groupsList = res;
        this.working = false;
        if (this.groupsList.length) {
          this.groupDetails(this.groupsList[0]);
        }
      });
    },
    createNewGroup() {
      if (!this.groupsList.length || this.groupsList[0].id !== "new") {
        this.groupsList.unshift({ id: "new", title: "", selected: false });
      }
    },
    saveGroup(item) {
      new EventInviteeGroup(item).save().then((res) => {
        // this.working = false;
        this.groupsList.unshift(res.item);
        this.groupDetails(res.item);
      });
    },
    deleteGroup(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonClass: "md-button md-success btn-fill",
        cancelButtonClass: "md-button md-danger btn-fill",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.value) {
          if (this.visibleGroup && this.visibleGroup.id === item.id) {
            this.visibleGroup = this.groupsList.length ? this.groupsList[0] : null;
          }
          new EventInviteeGroup(item).delete().then((res) => {
            let index = _.findIndex(this.groupsList, (g) => {
              return g.id === item.id;
            });
            this.groupsList.splice(index, 1);
          });
        }
      });
    },
    groupDetails(item) {
      this.visibleGroup = item;
    },
    groupNameChanged(val, fieldName, item) {
      item[fieldName] = val;

      if (item.id === "new") {
        item.id = null;
        delete item["id"];
        this.groupsList.shift();
      }
      this.saveGroup(item);
    },
    changeGroupSelection($event, item) {},
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_colors.scss";
.visible-row {
  background-color: $grey-50;
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
</style>
