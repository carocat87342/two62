<template>
  <div class="adding-building-blocks-panel">
    <div class="md-layout" style="max-height: 50vh">
      <div class="md-layout-item md-size-5" style="padding: 0; margin: 0">
        <h4 class="md-title">
          <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </h4>
      </div>
      <div class="md-layout-item md-size-95" style="max-height: 50vh">
        <h4 class="md-title" style="margin-bottom: 0; line-height: 51px"><b>Back to table</b> / Add Building Block</h4>
        <p>Drag & Drop building blocks to your working panel to add new services or products to your event</p>
        <div class="md-layout" style="overflow: auto; max-height: 80vh">
          <md-field>
            <md-icon>search</md-icon>
            <md-input placeholder="Search for event element" v-model="searchQuery"></md-input>
          </md-field>
          <div
            v-for="(item, index) in filteredEventBlocks"
            :key="index"
            class="md-layout-item md-size-100 mx-auto event-element-item"
            @click="addBlock(item)"
          >
            <drag
              :class="`md-button md-warning block-item text-center`"
              :transfer-data="{ item }"
              v-if="!item.childComponents"
            >
              <!--<md-icon>{{item.icon}}</md-icon>-->
              {{ item.title }}
            </drag>
          </div>
        </div>
      </div>
    </div>

    <drop @drop="handleDrop" class="draggable-area" v-if="isLoaded">
      <p>
        <img
          src="https://static-maryoku.s3.amazonaws.com/storage/img/drag_drop_white.png"
          alt="drag and drop"
          style="width: 52px"
        />
      </p>
      <p style="font-size: 20px; margin: 0">Drag building blocks here</p>
    </drop>
  </div>
</template>
<script>
// import auth from '@/auth';
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import EventPageHeaderImage from "@/models/EventPageHeaderImage";
import { Modal } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";

import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";
import draggable from "vuedraggable";
import { Drag, Drop } from "vue-drag-drop";
import VueElementLoading from "vue-element-loading";

export default {
  components: {
    draggable,
    Drag,
    Drop,
    VueElementLoading,
  },
  props: {
    event: Object,
  },
  data: () => ({
    // auth: auth,
    categoryBuildingBlocks: [],
    isLoaded: false,
    filteredEventBlocks: [],
    searchQuery: "",
  }),

  created() {},
  mounted() {
    this.getCategoryBlocks();
  },
  methods: {
    ...mapMutations("EventPlannerVuex", ["setBuildingBlockModal"]),
    closeModal() {
      this.setBuildingBlockModal({ showModal: false });
    },
    closePanel(payload) {
      this.$emit("closePanel", payload);
    },
    addBuildingBlock(item) {
      // Save event interaction
      let calendar = new Calendar({ id: this.$auth.user.defaultCalendarId });
      let event = new CalendarEvent({ id: this.event.id });

      let new_block = {
        componentId: item.key,
        componentCategoryId: item.categoryId,
        todos: "",
        values: "",
        vendors: "",
        calendarEvent: { id: event.id },
      };

      new EventComponent(new_block)
        .for(calendar, event)
        .save()
        .then((res) => {
          this.$parent.isLoading = false;

          this.setBuildingBlockModal({ showModal: false });

          new EventComponent()
            .for(calendar, event)
            .find(res.item.id)
            .then((item) => {
              this.$emit("closePanel", item);
            });
          this.$root.$emit("refreshBuildingBlock");
        })
        .catch((error) => {
          console.log("Error while saving ", error);
        });
    },
    getCategoryBlocks() {
      EventComponent.get()
        .then((res) => {
          setTimeout(() => {
            this.isLoaded = true;
          }, 500);

          this.categoryBuildingBlocks = res;
          this.filteredEventBlocks = this.categoryBuildingBlocks;
        })
        .catch((error) => {
          console.log("Error ", error);
        });
    },
    handleDrop(data, event) {
      this.$parent.isLoading = true;

      let block = data.item ? data.item : data.item1;

      if (block) {
        this.addBuildingBlock(block);
      } else {
        this.$parent.isLoading = false;
      }
    },
    addBlock(item) {
      this.addBuildingBlock(item);
    },
    filterEventElements() {
      this.filteredEventBlocks = _.filter(this.categoryBuildingBlocks, (v) => {
        return v.title.toString().toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
      });
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["addBuildingBlockModal"]),
  },
  watch: {
    searchQuery(newVal, oldVal) {
      this.filterEventElements();
    },
  },
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
