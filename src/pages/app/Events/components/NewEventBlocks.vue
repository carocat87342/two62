<template>
  <div class="manage-proposals md-layout">
    <vue-element-loading :active="isLoading" spinner="ring" is-full-screen color="#FF547C" isFullScreen />

    <div class="md-layout-item md-size-100">
      <h3 @click="goBack"><md-icon>arrow_back</md-icon> Send inquiry and manage proposals</h3>

      <p>Send out one inquiry to all vendors and we'll organize all the proposals for you to choose the best one.</p>
    </div>

    <div class="md-layout-item md-size-40">
      <md-card>
        <md-card-header :class="`md-card-header-icon md-card-header-${selectedBlock.color}`">
          <div class="card-icon">
            <md-icon>{{ selectedBlock.icon }}</md-icon>
          </div>
          <h4 class="title2" style="text-transform: capitalize">{{ selectedBlock.componentId }}</h4>
        </md-card-header>

        <md-card-content class="md-layout blocks-list">
          <div class="blocks-list_item md-layout" v-for="(block, index) in eventBlocks">
            <div class="md-layout-item md-size-100">
              <md-field>
                <label>Requirement Description</label>
                <md-textarea
                  v-model="block.title"
                  type="text"
                  :rows="block.title ? parseInt(block.title.length / 33) + 1 : 2"
                ></md-textarea>
              </md-field>
            </div>

            <div class="md-layout-item md-size-50">
              <md-field>
                <label>Priority</label>
                <md-select v-model="block.priority" name="select">
                  <md-option v-for="(option, index) in prioritiesList" :key="index" :value="option.value">{{
                    option.value
                  }}</md-option>
                </md-select>
              </md-field>
            </div>

            <div class="md-layout-item md-size-50 block-actions">
              <md-button class="md-info md-sm md-just-icon md-simple" @click="editValue(block)">
                <md-icon>create</md-icon>
              </md-button>
              <md-button class="md-danger md-sm md-just-icon md-simple" @click="deleteValue(block.id)">
                <md-icon>delete_outline</md-icon>
              </md-button>
            </div>
          </div>
        </md-card-content>

        <md-card-actions md-alignment="right">
          <md-button class="md-info" @click="addNewValue">Add Requirement</md-button>
          <md-button class="md-info" @click="saveAllValues">Save</md-button>
        </md-card-actions>
      </md-card>
    </div>

    <div class="md-layout-item md-size-60">
      <manage-proposals :selectedBlock="selectedBlock" :event="event"></manage-proposals>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Calendar from "@/models/Calendar";
import CalendarEvent from "@/models/CalendarEvent";
import EventComponent from "@/models/EventComponent";
import EventComponentValue from "@/models/EventComponentValue";
import EventComponentVendor from "@/models/EventComponentVendor";
import VueElementLoading from "vue-element-loading";
// import auth from '@/auth';
import ManageProposals from "./EventBlocks/ManageProposals.vue";
import Swal from "sweetalert2";
import { LabelEdit } from "@/components";

export default {
  name: "event-blocks",
  components: {
    VueElementLoading,
    ManageProposals,
    LabelEdit,
  },
  props: {
    selectedBlock: Object,
    event: Object,
  },
  data: () => ({
    // auth: auth,
    isLoading: true,
    eventBlocks: [],
    prioritiesList: [
      {
        label: "Preferred",
        value: "Preferred",
      },
      {
        label: "Nice to have",
        value: "Nice to have",
      },
      {
        label: "Must have",
        value: "Must have",
      },
    ],
    blockVendors: [],
  }),
  methods: {
    goBack() {
      this.$emit("go-to-building-blocks", {});
    },
    getBuildingBlockValues() {
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentValue()
        .for(calendar, event, selected_block)
        .get()
        .then((values) => {
          this.eventBlocks = values;
        });
    },
    addNewValue() {
      this.$parent.isLoading = true;

      this.saveAllValues();

      let new_value = {
        eventComponent: { id: this.selectedBlock.id },
      };

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });

      new EventComponentValue(new_value)
        .for(calendar, event, selected_block)
        .save()
        .then((res) => {
          this.$parent.isLoading = false;
          this.getBuildingBlockValues();
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
          this.$parent.isLoading = true;
          let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
          let event = new CalendarEvent({ id: this.event.id });
          let selected_block = new EventComponent({ id: this.selectedBlock.id });

          let value = new EventComponentValue({ id: valueId });

          value
            .for(calendar, event, selected_block)
            .delete()
            .then((resp) => {
              this.getBuildingBlockValues();
              this.$parent.isLoading = false;
              this.$forceUpdate();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    editValue(item) {
      this.$parent.isLoading = true;

      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });
      let selected_block = new EventComponent({ id: this.selectedBlock.id });
      let value = new EventComponentValue({ id: item.id });

      value.title = item.title;
      value.priority = item.priority;

      value
        .for(calendar, event, selected_block)
        .save()
        .then((resp) => {
          this.$parent.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.$parent.isLoading = false;
        });
    },
    saveAllValues() {
      let _self = this;
      this.eventBlocks.forEach((block) => {
        _self.editValue(block);
      });
    },
  },
  created() {},
  mounted() {
    this.isLoading = false;
    this.getBuildingBlockValues();
  },
  computed: {},
};
</script>
<style lang="scss">
.mt-auto {
  margin-top: auto;
}
.light-theme {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .md-list {
    flex-direction: column;
    justify-content: flex-end;
  }
  .md-tab {
    padding-top: 0;
    .md-list {
      padding-top: 0;
      flex-wrap: wrap;
    }
  }
  .md-list.md-theme-default .md-list-item-container:not(.md-list-item-default):not([disabled]):hover {
    background: none;
  }
  .md-list-item-content {
    font-size: 12.5px;
    color: #6a6869;
    cursor: pointer;
    flex-direction: column;
    .image-block {
      margin-bottom: 10px;
    }
  }
  .md-content {
    width: 100%;
  }
  .md-button {
    height: 50px;
    color: #3c4858 !important;
    i,
    &:hover,
    &:hover i,
    &:focus,
    &:focus i,
    &:active,
    &:active i,
    &:active:focus,
    &:active:focus i,
    &:active:hover {
      color: #3c4858 !important;
    }
    .caret {
      width: auto;
      min-width: 0;
      margin-right: 0;
      margin-left: auto;
    }
    .md-ripple {
      padding: 0 !important;
      .md-button-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 100%;
        .item {
          display: flex;
          align-items: center;
          padding: 13px;
          width: 100%;
          text-align: left;
          background-color: rgba($color: #000000, $alpha: 0.05) !important;
          &.selected {
            background-color: #ffd966 !important;
          }
        }
      }
    }
  }
  .md-list {
    display: flex;
    flex-direction: row;
  }
  .md-tabs-navigation {
    flex-direction: column;
    margin: 0;
    padding: 0;
    margin-right: 5%;
    overflow: hidden;
    box-shadow: none;
    -webkit-box-shadow: none;
    min-width: 230px;
    max-width: 230px;
    margin-left: 0 !important;
    flex: 1 1 230px;
  }
}
</style>
