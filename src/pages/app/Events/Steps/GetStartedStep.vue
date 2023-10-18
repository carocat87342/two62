<template>
  <div>
    <vue-element-loading :active="isLoading" spinner="ring" color="#FF547C" is-full-screen />

    <div class="md-card">
      <div class="md-card-content">
        <div class="md-layout">
          <div class="md-layout-item">
            <h3 class="margin-bottom-md">Now, select elements:</h3>
            <div
              class="md-error"
              v-if="cerrors.selectedCategories"
            >{{ cerrors.selectedCategories[0] }}</div>
            <div class="list-container">
              <div class="list-container">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  @click="toggleSelectCategory(category)"
                  class="list-item"
                  :class="{'active': isCategorySelected(category) || isSelected(category)}"
                >
                  <div class="list-item--icon">
                    <md-icon
                      class="check-icon"
                      v-if="isCategorySelected(category) || isSelected(category)"
                    >check</md-icon>

                    <img
                      :src="`https://static-maryoku.s3.amazonaws.com/storage/img/event-elements/${category.id}.png`"
                    />
                  </div>
                  <div class="list-item--title">{{ category.title }}</div>
                </div>
              </div>
            </div>
            <label class="bold" style="font-size: 15px;">
              Select more elements
              <md-icon>keyboard_arrow_right</md-icon>
            </label>
            <div class="list-container">
              <div class="list-container">
                <div
                  v-for="subCategory in subCategories"
                  @click="toggleSelectSubCategory(subCategory)"
                  :key="subCategory.id"
                  class="list-item"
                  :class="{'active': isSubCategorySelected(subCategory) || isSelected(subCategory) }"
                >
                  <div class="list-item--icon">
                    <md-icon
                      class="check-icon"
                      v-if="isSubCategorySelected(subCategory) || isSelected(subCategory)"
                    >check</md-icon>
                    <img
                      :src="`https://static-maryoku.s3.amazonaws.com/storage/img/event-elements/${subCategory.id}.png`"
                    />
                  </div>
                  <div class="list-item--title">{{ subCategory.title }}</div>
                </div>

                <div class="list-item">
                  <md-button class="md-rose md-simple" @click="createCustomElement">
                    <md-icon>plus</md-icon>Create Custom Element
                  </md-button>
                </div>
              </div>
            </div>
            <div>
              <md-field class="margin-bottom-xxl">
                <label>Add a short paragraph about the event.</label>
                <br />
                <md-textarea
                  v-model="brief"
                  placeholder="Is there a dress code? Who is participating? What's the occasion?"
                ></md-textarea>
              </md-field>
            </div>
            <div class="text-right margin-bottom-xxl">
              <md-button @click="goBack" class="md-button md-default">Back</md-button>
              <md-button @click.prevent="validateAndSubmit" class="md-button md-primary">Continue</md-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <create-custom-element :event="newEvent" @getEventComponents="getEventComponents"></create-custom-element>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { Modal } from "@/components";
import EventComponent from "@/models/EventComponent";
import CalendarEvent from "@/models/CalendarEvent";
import Calendar from "@/models/Calendar";
import VueElementLoading from "vue-element-loading";

import CreateCustomElement from "./Modals/CreateCustomElement";

export default {
  name: "get-started-step",
  props: ["newEvent"],
  components: {
    VueElementLoading,
    CreateCustomElement,
    Modal,
  },
  methods: {
    ...mapMutations("EventPlannerVuex", ["setCustomElementModal"]),
    createCustomElement() {
      this.setCustomElementModal({ showModal: true });
    },
    isSelected(category) {
      return (
        _.findIndex(
          this.eventComponents,
          (o) => o.componentId === category.id,
        ) > -1
      );
    },
    isCategorySelected(category) {
      return (
        _.findIndex(this.selectedCategories, (o) => o.id === category.id) > -1
      );
    },

    isSubCategorySelected(subCategory) {
      return (
        _.findIndex(
          this.selectedSubCategories,
          (o) => o.id === subCategory.id,
        ) > -1
      );
    },

    toggleSelectSubCategory(subCategory) {
      if (this.isSubCategorySelected(subCategory)) {
        this.selectedSubCategories = this.selectedSubCategories.filter(
          (o) => o.id != subCategory.id,
        );
      } else {
        this.selectedSubCategories = this.selectedSubCategories.concat([
          subCategory,
        ]);
      }

      this.$set(
        this,
        "eventComponents",
        this.eventComponents.filter((o) => o.componentId != subCategory.id),
      );
    },

    toggleSelectCategory(category) {
      this.isLoading = true;

      if (this.isCategorySelected(category)) {
        this.selectedCategories = this.selectedCategories.filter(
          (o) => o.id != category.id,
        );
        // this.subCategories = this.subCategories.filter(o => o.categoryId != category.id);
        // this.selectedSubCategories = this.selectedSubCategories.filter(o => o.categoryId != category.id);
      } else if (!this.isSelected(category)) {
        this.selectedCategories = this.selectedCategories.concat([category]);
        // this.subCategories = this.subCategories.concat(category.childComponents);
      }

      this.$set(
        this,
        "eventComponents",
        this.eventComponents.filter((o) => o.componentId != category.id),
      );

      this.isLoading = false;
    },

    validateAndSubmit() {
      // this.$emit('goToNextPage');
      //  return;
      this.cerrors = {};

      if (
        !this.selectedCategories.length &&
        !this.selectedSubCategories.length
      ) {
        this.cerrors.selectedCategories = [
          "you must select at least one category",
        ];
        return;
      }

      this.isLoading = true;
      let promisses = [];

      let new_block = {
        componentId: null,
        componentCategoryId: null,
        todos: "",
        values: "",
        vendors: "",
        calendarEvent: { id: this.event.id },
      };

      this.event.brief = this.brief;
      promisses.push(this.event.save());

      this.selectedCategories.forEach((category) => {
        new_block.componentCategoryId = category.id;
        new_block.componentId = category.id;

        promisses.push(
          new EventComponent(new_block).for(this.calendar, this.event).save(),
        );
      });

      this.selectedSubCategories.forEach((category) => {
        new_block.componentCategoryId = category.id;
        new_block.componentId = category.id;

        promisses.push(
          new EventComponent(new_block).for(this.calendar, this.event).save(),
        );
      });

      Promise.all(promisses)
        .then(() => {
          this.isLoading = false;
          // this.$emit('goToNextPage');

          this.$router.push({
            path: `/events/` + this.event.id + "/edit/details",
          });
        })
        .catch((e) => {
          console.log("error -->", e);
          this.isLoading = false;
        });
    },
    goBack() {
      this.$emit("goToPrevPage");
    },
    getEventComponents() {
      this.isLoading = true;
      let vm = this;

      if (vm.newEvent) {
        vm.$auth.currentUser(vm, true, () => {
          Promise.all([
            CalendarEvent.find(
              vm.newEvent.item ? vm.newEvent.item.id : vm.$route.params.id,
            ),
            EventComponent.get(),
          ]).then(([event, components]) => {
            vm.calendar = new Calendar({ id: vm.$auth.user.defaultCalendarId });
            vm.event = event.for(vm.calendar);
            vm.categories = _.filter(components, function (item) {
              return item.promoted === true;
            });
            vm.subCategories = _.filter(components, function (item) {
              return item.promoted === false;
            });

            new EventComponent()
              .for(vm.calendar, vm.event)
              .get()
              .then((resp) => {
                console.log("components ", resp);

                resp.forEach((component) => {
                  // check if component is promoted or not
                  if (
                    _.findIndex(
                      this.categories,
                      (o) => o.title === component.title,
                    ) > -1
                  ) {
                    vm.selectedCategories = this.selectedCategories.concat([
                      component,
                    ]);
                  } else if (
                    _.findIndex(
                      this.subCategories,
                      (o) => o.title === component.title,
                    ) > -1
                  ) {
                    vm.selectedSubCategories = this.selectedSubCategories.concat(
                      [component],
                    );
                  }
                });
                // vm.selectedCategories = resp;
                vm.$set(vm, "eventComponents", resp);
                console.log(vm.selectedCategories);
              });
            vm.isLoading = false;
          });
        });
      }

      if (vm.$route.params.id) {
      }
    },
  },
  data() {
    return {
      isLoading: true,
      brief: null,
      event: null,
      calendar: null,
      cerrors: {},
      categories: [],
      subCategories: [],
      selectedCategories: [],
      selectedSubCategories: [],
      eventComponents: [],
      selectedEventComponents: [],
    };
  },
  mounted() {
    this.getEventComponents();

    this.$root.$on("get-event-components", () => {
      this.getEventComponents();
    });
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/md/_variables.scss";

// .textarea-262 {
//     width: 50%;
//     // border: 1px solid $input-border;
//     background: none;
//     border-radius: 4px;
//     height: 100px;
//     padding: 15px;
// }

.list-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 20px;
  flex-direction: row;

  .list-item {
    border-radius: 4px;
    cursor: pointer;
    width: 120px;
    text-align: center;
    margin-right: 10px;
    position: relative;

    &.active {
      .list-item--icon {
        background: $brand-primary;
        border-color: $brand-primary;
        .md-icon-font {
          color: white;
          content: "check";
        }

        .checked-item {
          position: absolute;
          right: 5px;
          top: 5px;
        }
      }
    }
  }

  .list-item--title {
    margin-top: 5px;
  }

  .list-item--icon {
    width: 120px;
    height: 120px;
    border: 1px solid #e0e0e0;
    text-align: center;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: auto;
    }
  }
  .check-icon {
    float: right;
    position: absolute;
    right: 0.2em;
    top: 0.2em;
  }
}
</style>
