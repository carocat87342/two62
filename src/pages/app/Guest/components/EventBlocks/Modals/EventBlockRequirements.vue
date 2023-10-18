<template>
  <div class="building-blocks-requirements">
    <div class="md-layout text-left">
      <md-card class="event-requirements__event-details event-details">
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-40">
              <div class="md-layout">
                <div class="md-layout-item md-size-100">
                  <div class="event-date">
                    <md-icon>local_mall</md-icon>
                    <label
                      >{{ event.eventStartMillis | formatDate }},
                      {{ event.eventStartMillis | formatTime }}
                      ({{ event.eventStartMillis | formatDuration(event.eventEndMillis) }}h)</label
                    >
                  </div>
                </div>
                <div class="md-layout-item md-size-100 required" style="margin-top: 2em">
                  <md-datepicker
                    v-model="eventData.date"
                    data-vv-name="date"
                    ref="datePicker"
                    v-validate="modelValidations.date"
                    required
                  >
                    <label>Date</label>
                  </md-datepicker>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field class="required" :class="[{ 'md-error': errors.has('time') }]">
                    <label>Start Time</label>
                    <md-select v-model="eventData.time" v-validate="modelValidations.time" data-vv-name="time" required>
                      <md-option v-for="hour in hoursArray" :key="hour" :value="hour">
                        {{ hour }}
                      </md-option>
                    </md-select>

                    <span class="md-error" v-if="errors.has('time')">The start time is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-field class="required" :class="[{ 'md-error': errors.has('duration') }]">
                    <label>Duration</label>
                    <md-select
                      v-model="eventData.duration"
                      v-validate="modelValidations.duration"
                      data-vv-name="duration"
                      required
                    >
                      <md-option v-for="hour in durationArray" :key="hour" :value="hour">
                        {{ hour + " hours" }}
                      </md-option>
                    </md-select>
                    <span class="md-error" v-if="errors.has('duration')">The duration is required</span>
                  </md-field>
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-60">
              <div class="md-layout">
                <div class="md-layout-item md-size-33">
                  <md-field class="required" :class="[{ 'md-error': errors.has('numberOfParticipants') }]">
                    <md-icon>person</md-icon>
                    <label>Guest Count</label>
                    <md-input
                      v-model="selectedBlock.numberOfParticipants"
                      data-vv-name="numberOfParticipants"
                      v-validate="modelValidations.numberOfParticipants"
                      required
                      type="number"
                      @change="updateEventComponent"
                    ></md-input>
                    <span class="md-error" v-if="errors.has('numberOfParticipants')">The Guest Count is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field class="required" :class="[{ 'md-error': errors.has('budget') }]">
                    <md-icon>account_balance_wallet</md-icon>
                    <label>Budget</label>
                    <md-input
                      v-model="selectedBlock.allocatedBudget"
                      data-vv-name="budget"
                      v-validate="modelValidations.totalBudget"
                      required
                      type="number"
                      @change="updateEventComponent"
                    ></md-input>
                    <span class="md-error" v-if="errors.has('budget')">The Budget is required</span>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-33">
                  <md-field class="disabled" style="pointer-events: none">
                    <label>Per Guest</label>
                    <md-input v-model="selectedBlock.budgetPerPerson" style="color: gray"></md-input>
                  </md-field>
                </div>
              </div>
            </div>
          </div>
        </md-card-content>
      </md-card>

      <h4
        class="md-title md-layout-item md-size-100 clear-margins"
        style="margin: 0; line-height: 51px; width: 100%; font-size: 20px"
      >
        {{ this.selectedBlock.title }} Requirements

        <md-button class="md-info md-sm add-new-requirements pull-right" @click="addNewValue">
          <md-icon>add</md-icon> Add Requirement
        </md-button>
      </h4>
      <div class="md-layout-item md-size-100 clear-margins">
        <md-card class="clear-margins">
          <md-card-content>
            <!--<h6 v-if="predefinedRequirements" class="small text-gray text-right clear-margins" style="display: block; width: 100%;">Predefined Requirements</h6>
                        <ul class="requirements-list text-right clear-margins" v-if="predefinedRequirements">
                            <li class="list-item" v-for="(item,index) in predefinedRequirements">
                                <div
                                    :class="`md-button ${item.color}`"
                                    @click="handleDrop(item)">
                                    {{item.title}}
                                    <md-icon>add_circle_outline</md-icon>
                                </div>
                            </li>
                        </ul>
                        <div style="background-color: white !important; display: block; border-radius: 8px;box-shadow: 0 0 3px #ccc;" >&nbsp;</div>-->
            <md-table class="clear-margins" v-if="eventBlockRequirements" v-model="filteredEventBlockRequirements">
              <!--                            <md-table-toolbar >-->
              <!--                                <div class="md-toolbar-section-start">-->
              <!--                                    <md-field>-->
              <!--                                        <md-input-->
              <!--                                            type="search"-->
              <!--                                            class="mb-3"-->
              <!--                                            clearable-->
              <!--                                            placeholder="Search requirements"-->
              <!--                                            v-model="searchQuery">-->
              <!--                                        </md-input>-->
              <!--                                    </md-field>-->
              <!--                                </div>-->
              <!--                                <div class="md-toolbar-section-end" v-if="false">-->
              <!--                                    <md-button class="md-icon-button">-->
              <!--                                        <md-icon>delete</md-icon>-->
              <!--                                    </md-button>-->
              <!--                                </div>-->
              <!--                            </md-table-toolbar>-->

              <md-table-empty-state
                :md-description="`No requirements found for '${searchQuery}'. Try a different search term or create a new requirement.`"
              >
                <md-button class="md-primary md-raised" @click="addNewValue">Add Requirement</md-button>
              </md-table-empty-state>

              <md-table-row slot="md-table-row" slot-scope="{ item, index }" :key="item.id">
                <md-table-cell>
                  <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
                  <event-block-requirement
                    :delete-value="deleteValue"
                    :requirement.sync="item"
                    :event-id="event.id"
                    :selected-block-id="selectedBlock.id"
                    :requirement-properties="getRequirementProperties(item)"
                  ></event-block-requirement>
                </md-table-cell>
              </md-table-row>
            </md-table>
            <md-table class="clear-margins" v-else v-model="dummyList">
              <md-table-row slot="md-table-row" slot-scope="{ item, index }" :key="item.id">
                <md-table-cell>
                  <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" />
                  <event-block-requirement
                    :delete-value="deleteValue"
                    :requirement.sync="item"
                    :event-id="event.id"
                    :selected-block-id="selectedBlock.id"
                    @requirement-saved="requirementSaved"
                    :requirement-properties="getRequirementProperties(item)"
                  ></event-block-requirement>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import EventComponentValue from "@/models/EventComponentValue";
import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import _ from "underscore";
import MdCardContent from "../../../../../../../node_modules/vue-material/src/components/MdCard/MdCardContent/MdCardContent.vue";
import ClickOutside from "vue-click-outside";
import { LabelEdit } from "@/components";
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";
import EventBlockRequirement from "./EventBlockRequirement";
export default {
  components: {
    MdCardContent,
    VueElementLoading,
    LabelEdit,
    draggable,
    Drag,
    Drop,
    ClickOutside,
    EventBlockRequirement,
  },
  props: {
    event: Object,
    selectedBlock: Object,
    predefinedRequirements: {
      type: Array,
      default: null,
    },
  },
  data: () => ({
    // auth: auth,
    isLoading: false,
    eventBlockRequirements: [],
    filteredEventBlockRequirements: [],
    searchQuery: "",
    dummyList: [
      {
        title: "",
        value: 1,
        comment: "",
        mandatory: true,
        editMode: true,
      },
    ],
    eventData: {},
    modelValidations: {
      title: {
        required: true,
      },
      date: {
        required: true,
      },
      time: {
        required: true,
      },
      duration: {
        required: true,
      },
      numberOfParticipants: {
        required: true,
        min_value: 1,
        max_value: 10000,
      },
      status: {
        required: true,
      },
      currency: {
        required: true,
      },
      eventType: {
        required: true,
      },
      category: {
        required: true,
      },
      budget: {
        required: true,
      },
      guestType: {
        required: true,
      },
    },
    durationArray: [...Array(12).keys()].map((x) => ++x),
    hoursArray: [],
  }),

  created() {
    [...Array(12).keys()].map((x) => (x >= 8 ? this.hoursArray.push(`${x}:00 AM`) : undefined));
    [...Array(12).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 PM`) : this.hoursArray.push(`${x}:00 PM`)));
    [...Array(8).keys()].map((x) => (x === 0 ? this.hoursArray.push(`12:00 AM`) : this.hoursArray.push(`${x}:00 AM`)));

    this.hoursArray.push();

    this.eventData.date = new Date(this.event.eventStartMillis);
    this.eventData.time = moment(new Date(this.event.eventStartMillis).getTime()).format("H:mm A");
    this.eventData.duration = (this.event.eventEndMillis - this.event.eventStartMillis) / 1000 / 60 / 60;

    if (this.selectedBlock.allocatedBudget && this.selectedBlock.numberOfParticipants) {
      this.$set(
        this.selectedBlock,
        "budgetPerPerson",
        this.selectedBlock.allocatedBudget / this.selectedBlock.numberOfParticipants,
      );
    }

    if (!this.selectedBlock.numberOfParticipants) {
      this.selectedBlock.numberOfParticipants = this.event.numberOfParticipants;
    }
  },
  mounted() {
    this.getBuildingBlockValues();
  },
  methods: {
    closePanel() {
      this.$emit("closePanel");
      this.$root.$emit("refreshBuildingBlock");
    },
    getBuildingBlockValues(newValueId = null) {
      this.isLoading = true;
      if (
        this.selectedBlock.values === null ||
        this.selectedBlock.values === undefined ||
        (this.selectedBlock.values && this.selectedBlock.valuesCount !== this.selectedBlock.values.length)
      ) {
        let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
        let event = new CalendarEvent({ id: this.event.id });
        let selected_block = new EventComponent({ id: this.selectedBlock.id });

        new EventComponentValue()
          .for(calendar, event, selected_block)
          .get()
          .then((values) => {
            this.selectedBlock.values = values;
            this.eventBlockRequirements = values || [];
            this.filteredEventBlockRequirements = this.eventBlockRequirements;
            this.$root.$emit("refreshRequirementsLength", this.eventBlockRequirements.length);

            if (newValueId) {
              let newValue = _.findWhere(this.eventBlockRequirements, {
                id: newValueId,
              });
              newValue.editMode = true;
              this.$forceUpdate();
            }
            this.isLoading = false;
          });
      } else {
        this.eventBlockRequirements = this.selectedBlock.values ? this.selectedBlock.values : [];
        this.filteredEventBlockRequirements = this.eventBlockRequirements;
        this.$root.$emit("refreshRequirementsLength", this.eventBlockRequirements.length);
        if (newValueId) {
          let newValue = _.findWhere(this.eventBlockRequirements, {
            id: newValueId,
          });
          newValue.editMode = true;
          this.$forceUpdate();
        }

        this.isLoading = false;
      }
    },
    addNewValue() {
      this.isLoading = true;

      // this.saveAllValues();

      let new_value = {
        eventComponent: { id: this.selectedBlock.id },
        editMode: true,
        mandatory: true,
        value: 1,
      };

      let new_req_value = {
        id: "string",
        eventComponent: { id: "string" },
        propertyId: "string", // The predefined requirement id
        propertyType: "string", // the requirement's values type (multi-selection, multi-selection-with-amount, boolean, string, float)
        title: "string",
        comment: "string",
        mandatory: "boolean",
        order: "number",
        dateCreated: "number",
        lastUpdated: "number",
        value: "string|number|boolean|object", // For Yes/No boolean values
        multipleSelectionValues: "array of strings", // For multiple-selection, the ids of the selected options
        multipleSelectionAndAmountValues: "object", // . Key-Value object for multiple-selection-with-amount, the key is the id of the selected option and the value is the amount
      };

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentValue(new_value)
        .for(calendar, event, selected_block)
        .save()
        .then((res) => {
          let newRequirement = JSON.parse(JSON.stringify(res.item));
          newRequirement.editMode = true;
          if (_.isArray(this.selectedBlock.values)) {
            this.selectedBlock.values.splice(0, 0, newRequirement);
          }
          this.getBuildingBlockValues(newRequirement.id);
        });
    },
    handleDrop(data) {
      this.isLoading = true;

      let item = {};
      item.title = data.title;
      item.value = 1;
      item.mandatory = true;
      item.eventComponent = { id: this.selectedBlock.id };
      item.editMode = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let eventObject = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentValue(item)
        .for(calendar, eventObject, selected_block)
        .save()
        .then((res) => {
          let newRequirement = JSON.parse(JSON.stringify(res.item));
          this.selectedBlock.values.splice(0, 0, newRequirement);
          this.getBuildingBlockValues(res.item.id);
          this.isLoading = false;
        });
    },
    deleteValue(valueId) {
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
          this.isLoading = true;
          let calendar = new Calendar({
            id: this.$auth.user.defaultCalendarId,
          });
          let event = new CalendarEvent({ id: this.event.id });
          let selected_block = new EventComponent({
            id: this.selectedBlock.id,
          });

          let value = new EventComponentValue({ id: valueId });

          value
            .for(calendar, event, selected_block)
            .delete()
            .then((resp) => {
              this.selectedBlock.values.splice(
                _.findIndex(this.selectedBlock.values, (v) => {
                  return v.id === value.id;
                }),
                1,
              );
              this.getBuildingBlockValues();
              this.isLoading = false;
              this.$forceUpdate();
            })
            .catch((error) => {
              this.$notify({
                message: "Error while trying to delete this requirement",
                horizontalAlign: "center",
                verticalAlign: "top",
                type: "danger",
              });

              console.log(error);
            });
        }
      });
    },
    editRequirementItemProperty(property, val, item) {
      if (!item) {
        return;
      }
      this.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });
      let value = new EventComponentValue({ id: item.id });

      value[property] = val || false;

      value
        .for(calendar, event, selected_block)
        .save()
        .then((resp) => {
          this.selectedBlock.values.splice(
            _.findIndex(this.selectedBlock.values, (v) => {
              return v.id === value.id;
            }),
            1,
          );
          this.selectedBlock.values.push(JSON.parse(JSON.stringify(resp.item)));
          this.isLoading = false;
          this.cancelEdit(item);
          this.getBuildingBlockValues();
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          this.$notify({
            message: "Error while trying to modify this requirement",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
    /**
     * Edit requirement item
     * @{val} new value for the item property
     * @{fieldName} the id for the item
     * @{scope} property name to set the new value in it
     * */
    editValue(val, fieldName, scope) {
      let item = _.findWhere(this.eventBlockRequirements, { id: fieldName });

      this.editRequirementItemProperty(scope, val, item);
    },
    saveAllValues() {
      let _self = this;
      this.eventBlockRequirements.forEach((block) => {
        _self.editValue(block);
      });
    },
    editItemDescription(item) {
      item.editMode = !item.editMode;
      this.$forceUpdate();
    },
    cancelEdit(item) {
      item.editMode = false;
      this.$forceUpdate();
    },
    itemChanged(item) {
      this.editRequirementItemProperty("comment", item.comment, item);
    },
    mustHaveChanged(item) {
      this.editRequirementItemProperty("mandatory", item.mandatory, item);
    },
    requirementSaved(requirement) {
      let item = _.findWhere(this.eventBlockRequirements, {
        id: requirement.id,
      });
      if (!item) {
        this.selectedBlock.values.splice(0, 0, requirement);
        this.getBuildingBlockValues();
      }
    },
    filterRequirements() {
      this.filteredEventBlockRequirements = _.filter(this.eventBlockRequirements, (v) => {
        return v.title.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      });
    },
    getRequirementProperties(item) {
      let object = null;
      if (item.propertyId) {
        object = _.find(this.selectedBlock.predefinedRequirements, (req) => {
          return req.title === item.title;
        });
      }

      return object;
    },
    updateEventComponent() {
      this.$set(
        this.selectedBlock,
        "budgetPerPerson",
        this.selectedBlock.allocatedBudget / this.selectedBlock.numberOfParticipants,
      );
      this.$forceUpdate();

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      selected_block.numberOfParticipants = this.selectedBlock.numberOfParticipants;
      selected_block.allocatedBudget = this.selectedBlock.allocatedBudget;
      selected_block.budgetPerPerson = this.selectedBlock.allocatedBudget / this.selectedBlock.numberOfParticipants;

      selected_block
        .for(calendar, event)
        .save()
        .then((resp) => {
          console.log(resp);

          this.$notify({
            message: "Field updated successfully",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);

          this.$notify({
            message: "Error while trying to modify this requirement",
            horizontalAlign: "center",
            verticalAlign: "top",
            type: "danger",
          });
        });
    },
  },
  computed: {},
  watch: {
    searchQuery(newVal, oldVal) {
      this.filterRequirements();
    },
  },
  filters: {
    formatDate: function (date) {
      return moment(date).format("MMM Do YYYY ");
    },
    formatTime: function (date) {
      return moment(date).format("h:00 A");
    },
    formatDuration: function (startDate, endDate) {
      return moment(endDate).diff(startDate, "hours");
    },
  },
};
</script>
