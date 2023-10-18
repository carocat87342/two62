<template>
  <div class="signup-modal">
    <div class="md-layout">
      <modal v-if="DietaryConstraintsModal">
        <template slot="header">
          <div class="md-layout d-flex text-center">
            <h2>Click on the relevant dietary constraints</h2>
          </div>
          <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
            <md-icon>clear</md-icon>
          </md-button>
        </template>
        <template slot="body">
          <div class="md-layout" style="margin-top: 5%">
            <div class="md-layout-item dietary-item" v-for="(item, index) in dietaryIconOnFirstList">
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.on}.png`"
                @click="toggleFlagFirstList(index)"
                v-if="item.flagOn"
              />
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.off}.png`"
                @click="toggleFlagFirstList(index)"
                v-if="!item.flagOn"
              />
            </div>
          </div>

          <div class="md-layout" style="margin-top: 5%">
            <div class="md-layout-item dietary-item" v-for="(item, index) in dietaryIconOnSecondList">
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.on}.png`"
                @click="toggleFlagSecondList(index)"
                v-if="item.flagOn"
              />
              <img
                :src="`https://static-maryoku.s3.amazonaws.com/storage/img/dietary/${item.off}.png`"
                @click="toggleFlagSecondList(index)"
                v-if="!item.flagOn"
              />
            </div>
          </div>

          <md-button class="md-info signup-btn md-round" @click="send()">Send</md-button>
        </template>
      </modal>
    </div>
  </div>
</template>
<script>
// import auth from '@/auth';
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
    isGoing: [Boolean, String],
  },
  data: () => ({
    // auth: auth,
    error: "",
    showOnIcon: true,
    showOffIcon: false,
    dietaryIconOnFirstList: [
      {
        on: "sugar_free_off",
        off: "sugar_free_on",
        flagOn: true,
      },
      {
        on: "egg_free_off",
        off: "egg_free_on",
        flagOn: true,
      },
      {
        on: "gluten_free_off",
        off: "gluten_free_on",
        flagOn: true,
      },
    ],
    dietaryIconOnSecondList: [
      {
        on: "gmo_free_off",
        off: "gmo_free_on",
        flagOn: true,
      },
      {
        on: "peanut_free_off",
        off: "peanut_free_on",
        flagOn: true,
      },
      {
        on: "lactose_free_off",
        off: "lactose_free_on",
        flagOn: true,
      },
    ],
  }),

  created() {},
  mounted() {},
  methods: {
    ...mapMutations("EventPlannerVuex", ["setDietaryConstraintsModal"]),
    closeModal() {
      this.setDietaryConstraintsModal({ showModal: false });
    },
    toggleFlagFirstList(index) {
      this.dietaryIconOnFirstList[index].flagOn = !this.dietaryIconOnFirstList[index].flagOn;
    },

    toggleFlagSecondList(index) {
      this.dietaryIconOnSecondList[index].flagOn = !this.dietaryIconOnSecondList[index].flagOn;
    },
    send() {
      this.closeModal();
    },
  },
  computed: {
    ...mapState("EventPlannerVuex", ["DietaryConstraintsModal"]),
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

.modal-container {
  max-width: 400px;
}
.add-date {
  width: 66px;
  height: 12px;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 300;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #999999;
}
.header-icon-dietary {
  width: 63px;
  height: 64px;
  border-radius: 3px;
  box-shadow: 0px 4px 20px 0 rgba(0, 0, 0, 0.14);
  background-image: linear-gradient(to right, #65ba69, #43a047 100%);
}

.dierty-constraints-main {
  width: 349px;
  height: 212px;
  border-radius: 6px;
  box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.14);
  background-color: #ffffff;
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
