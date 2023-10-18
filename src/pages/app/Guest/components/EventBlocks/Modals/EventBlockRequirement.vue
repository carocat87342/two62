<template>
  <div class="md-layout requirement-item" :class="{'edit-mode' : requirement.editMode}">
    <vue-element-loading :active="working" spinner="ring" color="#FF547C"></vue-element-loading>
    <div class="md-layout-item clear-margins" :class="{'md-size-90' : !requirement.editMode, 'md-size-100' : requirement.editMode}">
      <md-card class="md-card-plain" style="margin: 8px;" v-if="!requirement.editMode">
        <md-card-header>
          <h5 class="title" style="font-weight: bold;">
              <template v-if="requirement.title && !isNotCounted(requirement.title.toLowerCase())">
                  {{ getRequirementValue(requirement) || 1}}
                  <md-icon class="text-gray" style="font-size: 14px !important;">close</md-icon>
              </template>

            {{requirement.title}}
            <badge v-if="requirement.mandatory" class="inline-badge" type="danger">Must Have</badge>
          </h5>
        </md-card-header>
        <md-card-content>
          <div class="md-layout" v-if="requirement.comment">
            <div class="md-layout-item md-size-100" style="margin-left: 6px !important; margin-bottom: 8px;">
              {{requirement.comment}}
            </div>
          </div>
        </md-card-content>
      </md-card>
      <md-card class="md-card-plain" style="margin: 8px;" v-if="requirement.editMode">
        <md-card-header>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-75">
              <md-field>
                <label>Title</label>
                <md-input type="text" v-model="tempTitle"></md-input>
              </md-field>
            </div>
            <div class="md-layout-item md-size-25">
              <div style="margin-top: 12px;">
                <md-switch class="md-switch-success" style="" v-model="tempMandatory">Must Have</md-switch>
              </div>
            </div>
            <div class="md-layout-item md-size-100" >

              <!-- Multi Select Options list -->
              <template v-if="tempOptions.length">
                <div class="multi-select-options">
                  <div class="multi-select-options__item "
                    :class="{ 'with-amount' : requirementPropertiesType === 'multi-selection-with-amount'}"
                    v-for="(option , index) in tempOptions "
                    >
                    <md-checkbox
                      class="readonly"
                      @change="getSelectedOptions"
                      v-model="option.checked"
                      :key="option.id">{{ option.title }}</md-checkbox>
                    <md-field v-if=" requirementPropertiesType === 'multi-selection-with-amount'">
                      <md-input v-model="option.value" @change="getSelectedOptions"></md-input>
                    </md-field>
                  </div>
                </div>
                <!-- ./Multi Select Options list -->
                <!-- Other field -->
                <md-checkbox
                  v-if="requirementPropertiesType === 'multi-selection'"
                  class="readonly"
                  v-model="otherOption.checked"
                  key="other">
                  <input v-model="otherOption.label" placeholder="Other" class="other-input"></input>
                </md-checkbox>
                <!-- ./Other field -->
                <br>
              </template>
              <!-- Additional Options list -->
              <template v-if="tempAdditionalOptions.length && requirement.title !== 'Lighting' ">
                <md-checkbox
                  @change="getAdditionalSelectedOptions"
                  v-for="(option , index) in tempAdditionalOptions "
                  class="readonly"
                  v-model="option.checked"
                  :key="option.id">{{ option.title }}</md-checkbox>
              </template>
              <!-- ./Additional Options list -->
            </div>
            <div class="md-layout-item md-size-15">
              <md-field
                v-if="requirementPropertiesType === 'multi-selection-with-amount'"
                >
                <label>Quantity</label>
                <md-input v-focus type="text" v-model="tempValue"></md-input>
              </md-field>
              <template v-else-if="requirementPropertiesType === 'boolean' && !tempAdditionalOptions.length && !tempOptions.length">
                <div class="boolean-options">
                  <md-radio v-model="tempValue" value="true">Yes</md-radio>
                  <md-radio v-model="tempValue" value="false">No</md-radio>
                </div>
              </template>
            </div>
          </div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-size-75">
              <md-field>
                <label>Add a Comment</label>
                <md-input type="text" v-model="tempComment"></md-input>
              </md-field>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <div class="md-layout-item " :class="{'md-size-10' : !requirement.editMode, 'md-size-100' : requirement.editMode}">
      <div class="text-right pull-right" style="margin : 25px 0 10px; white-space: nowrap;">
        <md-button v-if="!requirement.editMode" class="md-xs md-round md-just-icon md-default hover" @click="startEdit(requirement)">
          <md-icon>add</md-icon>
        </md-button>
        <md-button v-if="!requirement.editMode" class="md-xs md-round md-just-icon md-danger hover" @click="deleteValue(requirement.id)">
          <md-icon>delete_outline</md-icon>
        </md-button>
        <md-button v-if="requirement.editMode" class="md-xs md-default md-simple" @click="cancelEdit">
          <md-icon>close</md-icon>
          close
        </md-button>
        <md-button v-if="requirement.editMode" class="md-xs md-red md-simple" @click="saveEdit(requirement)">
          <md-icon>check</md-icon>
          Save
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import LabelEdit from "@/components/LabelEdit";
import Badge from "@/components/Badge";
import EventComponentValue from "@/models/EventComponentValue";
import EventComponent from "@/models/EventComponent";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import _ from "underscore";

export default {
  name: "event-block-requirement",
  components: {
    LabelEdit,
    Badge,
  },
  props: {
    requirement: Object,
    deleteValue: Function,
    eventId: String,
    selectedBlockId: String,
    requirementProperties: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      working: false,
      tempValue: 1,
      tempTitle: "",
      tempComment: "",
      tempMandatory: false,
      reqType: "",
      tempOptions: [],
      tempAdditionalOptions: [],
      otherOption: {},
      selectedOptions: [],
      additionalSelectedOptions: [],
      notCounted: [
        "lighting",
        "parking",
        "accessibility for disabled",
        "smoking section",
        "dance floor",
        "coat check",
        "separate cocktail hour space",
        "stage",
      ],
    };
  },
  mounted() {
    if (this.requirement.editMode) {
      this.startEdit(this.requirement);
    }
  },
  methods: {
    isNotCounted(component) {
      return _.indexOf(this.notCounted, component.toLowerCase()) > -1;
    },
    adjustInputSize(refName) {
      let input = this.$refs[refName];
      if (input) {
        input.size = input.value ? Math.ceil(input.value.length * 1.3) : 2;
      }
    },
    startEdit(requirement) {
      this.requirement.editMode = true;
      this.tempValue = requirement.value;
      this.tempTitle = requirement.title;
      this.tempComment = requirement.comment;
      this.tempMandatory = requirement.mandatory;
      this.reqType = requirement.type;
      this.tempOptions =
        this.requirementProperties &&
        this.requirementProperties.multiSelectionOptions
          ? this.requirementProperties.multiSelectionOptions
          : [];
      this.tempAdditionalOptions =
        this.requirementProperties &&
        this.requirementProperties.additionalOptions
          ? this.requirementProperties.additionalOptions
          : [];

      this.checkSelectedOptions();

      this.$forceUpdate();
    },
    cancelEdit() {
      this.requirement.editMode = false;
      this.$forceUpdate();
    },
    saveEdit(requirement) {
      this.working = true;
      requirement.value = this.tempValue;
      requirement.title = this.tempTitle;
      requirement.comment = this.tempComment;
      requirement.mandatory = this.tempMandatory;
      requirement.multipleSelectionValues = this.selectedOptions;
      requirement.additionalOptionsValues = this.additionalSelectedOptions;

      let calendar = new Calendar({
        id: this.$auth.user.defaultCalendarId,
      });
      let event = new CalendarEvent({
        id: this.eventId,
      });
      let selectedBlock = new EventComponent({
        id: this.selectedBlockId,
      });

      new EventComponentValue(this.requirement)
        .for(calendar, event, selectedBlock)
        .save()
        .then((res) => {
          this.requirement.editMode = false;
          this.working = false;
          this.$forceUpdate();
          this.$root.$emit("requirement-saved", this.requirement);
        });
    },
    getSelectedOptions() {
      this.selectedOptions = [];

      // mapping multi select options
      _.map(this.tempOptions, (option) => {
        if (option.checked === true) {
          let obj = {};
          let value = option.value ? parseInt(option.value) : 0;
          obj[option.id] = value;

          this.selectedOptions.push(obj);
        }
      });
    },
    getAdditionalSelectedOptions() {
      this.additionalSelectedOptions = [];
      // mapping additionl options
      _.map(this.tempAdditionalOptions, (option) => {
        if (option.checked === true) {
          let obj = {};
          let value = option.value ? parseInt(option.value) : 0;
          obj[option.id] = value;

          this.additionalSelectedOptions.push(obj);
        }
      });
    },
    checkSelectedOptions() {
      if (this.requirement.multipleSelectionValues) {
        _.map(this.tempOptions, (option, key) => {
          if (_.contains(this.requirement.multipleSelectionValues, option.id)) {
            this.tempOptions[key].checked = true;
          }
        });
      }
    },
    getRequirementValue(requirement) {
      return requirement.value !== "[]" ? requirement.value : 0;
    },
  },
  computed: {
    requirementPropertiesType() {
      console.log(this.requirementProperties);
      if (this.requirementProperties != null) {
        return this.requirementProperties.type;
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.requirement-input {
  border-radius: 3px;
  border: none;
  box-shadow: 0 0 3px #aaa;
  padding: 3px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.separator {
  border-left: 1px dashed #ddd;
}

.inline-badge {
  background-color: white;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 4px 6px 3px 6px;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 1.5px;
  line-height: 14px;
  margin-left: 8px;
  display: inline;
  top: -2px;
  position: relative;
}

.md-table-cell-container {
  .md-button {
    &:not(.md-just-icon) {
      width: auto;
      .md-ripple {
        font-size: 13px;
      }
    }
  }
}

.other-input {
  border-bottom: 1px solid #efefef;
  box-shadow: none;
  border-radius: 0;
  font-size: 14px;
  margin-top: -11px;
}
</style>
