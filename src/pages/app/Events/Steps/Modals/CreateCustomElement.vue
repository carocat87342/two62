<template>
  <div class="create-custom-element-modal">
    <div class="md-layout">
      <modal v-if="CreateCustomElementModal">
        <template slot="header">
          <div class="md-layout d-flex text-center">
            <h2>Create Custom Element</h2>
          </div>
          <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body">
          <md-field>
            <label>Name</label>
            <md-input v-model="name"></md-input>
          </md-field>
          <md-button class="md-rose" @click="CreateCustomElement"> Submit </md-button>
        </template>
      </modal>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth'
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import CalendarEvent from "@/models/CalendarEvent";
import { Modal } from "@/components";
import Calendar from "@/models/Calendar";
import EventComponent from "@/models/EventComponent";
import Swal from "sweetalert2";
import { error } from "util";
import moment from "moment";

export default {
  components: {
    Modal,
  },
  props: {
    event: Object,
  },
  data: () => ({
    // auth: auth,
    error: "",
    name: "",
    calendar: null,
    eventData: null,
  }),
  created() {},
  mounted() {
    let vm = this;
  },
  methods: {
    ...mapMutations("EventPlannerVuex", ["setCustomElementModal"]),
    closeModal() {
      this.$root.$emit("get-event-components");
      this.setCustomElementModal({
        showModal: false,
      });
    },
    CreateCustomElement() {
      console.log(this.event);
      let vm = this;
      let new_block = {
        componentId: "custom",
        todos: "",
        values: "",
        vendors: "",
        calendarEvent: {
          id: this.event.item.id,
        },
        componentCategoryId: "custom",
        title: vm.name,
      };
      console.log(new_block);
      vm.$auth.currentUser(vm, true, () => {
        vm.calendar = new Calendar({
          id: vm.$auth.user.defaultCalendarId,
        });
        vm.eventData = new CalendarEvent({
          id: this.event.item.id,
        });
        console.log(vm.calendar);
        new EventComponent(new_block)
          .for(vm.calendar, vm.eventData)
          .save()
          .then((resp) => {
            console.log(resp);
            vm.$root.$emit("get-event-components");
            vm.closeModal();
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["CreateCustomElementModal"]),
  },
};
</script>

<style lang="scss" scope>
.modal-container {
  max-width: 500px;
}
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
