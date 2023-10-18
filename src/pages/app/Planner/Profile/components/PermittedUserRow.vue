<template>
  <div class="permission-row">
    <div><avartar :name="user.email" :color="palette[index]"></avartar></div>
    <div>{{ user.email }}</div>
    <div>
      {{ user.eventList[0].concept ? user.eventList[0].concept.name : user.eventList[0].title
      }}<md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
    </div>
    <div>
      <popper trigger="click" :options="{ placement: 'bottom' }">
        <div class="popper white-card permit-page">
          <div class="font-size-22 popper-header"></div>
          <div>
            <div class="mb-30">All pages</div>
            <div class="mb-30">Specific pages</div>
            <multiselect
              class="mb-30"
              v-model="permittedPages"
              :options="availablePages"
              :close-on-select="true"
              :clear-on-select="true"
              tag-placeholder="Add this as new tag"
              placeholder="Choose pages"
              label="title"
              track-by="id"
              @select="selectPage"
            ></multiselect>
            <div class="page-tags">
              <div class="page-tag" v-for="(page, index) in selectedPages" :key="page.id">
                {{ page.title }}
                <md-button class="md-simple edit-btn md-red" @click="removeSelectedPage(index)">
                  <md-icon>close</md-icon>
                </md-button>
              </div>
            </div>
          </div>
        </div>

        <md-button class="md-simple maryoku-btn md-black" slot="reference">
          <span class="font-regular">All pages</span
          ><md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
        </md-button>
      </popper>
    </div>
    <div>
      <md-menu md-size="big" md-align-trigger class="schedule-menu">
        <md-button md-menu-trigger class="md-simple md-black schedule-menu-btn maryoku-btn">
          <span class="font-size-16 font-regular"> Can {{ permittedRole }} </span>
          <md-icon class="schedule-menu-btn-icon">keyboard_arrow_down</md-icon>
        </md-button>
        <md-menu-content class="permit-user-role">
          <md-menu-item class="text-center" @click="selectRole('view')">
            <span class="font-size-16" :class="{ 'font-bold-extra': permittedRole === 'view' }"> Can view </span>
          </md-menu-item>
          <md-menu-item class="text-center" @click="selectRole('edit')">
            <span class="font-size-16" :class="{ 'font-bold-extra': permittedRole === 'edit' }"> Can edit </span>
          </md-menu-item>
          <md-menu-item class="text-center" @click="selectRole('comment')">
            <span class="font-size-16" :class="{ 'font-bold-extra': permittedRole === 'comment' }"> Can comment </span>
          </md-menu-item>
          <md-divider></md-divider>
          <md-menu-item class="text-center" @click="removeUser">
            <span class="font-size-16" :class="{ 'font-bold-extra': false }"> Remove </span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </div>
  </div>
</template>
<script>
import Avartar from "@/components/Avartar.vue";
import Popper from "vue-popperjs";
import Collaborator from "@/models/Collaborator";

import "vue-popperjs/dist/vue-popper.css";
export default {
  components: {
    Avartar,
    Popper,
  },
  props: {
    index: {
      type: Number,
      default: -1,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    console.log(this.user.role);
  },
  data() {
    return {
      permittedPages: [],
      selectedPages: [],
      allPages: [
        { id: "125", title: "Event Detail" },
        { id: "123", title: "Concept" },
        { id: "124", title: "Timeline" },
        { id: "136", title: "Proposals" },
        { id: "126", title: "Budget" },
        { id: "127", title: "Requirements" },
      ],
      palette: [
        "rgb(58,56,56)",
        "rgb(68,84,106)",
        "rgb(255,192,0)",
        "rgb(255,82,124)",
        "rgb(165,165,165)",
        "rgb(32,201,151)",
        "rgb(0,188,212)",
        "rgb(100,25,86)",
        "rgb(0,188,212)",
        "rgb(0,176,80)",
        "rgb(255,0,102)",
      ],
    };
  },
  methods: {
    selectRole(role) {
      new Collaborator({ id: this.user.id, role }).save().then((res) => {
        this.$emit("update", res.item);
      });
    },
    selectPage(selectedoption, id) {
      this.selectedPages.push(selectedoption);
    },
    removeSelectedPage(index) {
      this.selectedPages.splice(index, 1);
    },
    removeUser() {
      new Collaborator({ id: this.user.id }).delete().then((res) => {
        this.$emit("remove", this.user);
      });
    },
  },
  computed: {
    availablePages() {
      return this.allPages.filter((page) => {
        return this.selectedPages.findIndex((item) => item.id === page.id) < 0;
      });
    },
    permittedRole() {
      return this.user.role;
    },
  },
};
</script>
<style lang="scss" scoped>
.permission-row {
  .page-tags {
    .page-tag {
      padding: 14px 25px;
      color: #f51355;
      font-weight: bold;
      border: solid 1px #f51355;
      border-radius: 30px;
      margin-right: 10px;
      margin-bottom: 20px;
      display: inline-block;
      line-height: 100%;
      button {
        vertical-align: middle;
        i {
          font-size: 20px !important;
          font-weight: bolder;
        }
      }
    }
  }
  .permit-page {
    width: 550px;
    padding: 40px;
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.13);
    border: solid 0.5px #d5d5d5;
    background-color: #ffffff;
    font-size: 16px;
    text-align: left;
    /deep/ .multiselect {
      box-shadow: 0 3px 13px 0 rgba(0, 0, 0, 0.15);
      border: none;
      .multiselect__tags {
        border: none;
        // display: none;
      }
    }
  }
}
.permit-user-role.md-menu-content {
  min-width: 300px;
  .md-list {
    padding: 30px 0;
    .md-list-item {
      margin: 15px 0px;
      &:not(:last-child) {
        margin-bottom: 15px !important;
      }
      /deep/ .md-list-item-button {
        padding-left: 30px;
        padding-right: 30px;
        font-size: 16px !important;
        font-family: "Manrope-Regular";
      }
    }
  }
}
</style>