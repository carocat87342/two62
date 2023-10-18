<template>
  <modal class="planning-board-additioal-modal" :containerClass="`modal-container lg`">
    <template slot="header">
      <div class="maryoku-modal-header text-center">
        <img :src="`${$iconURL}NewRequirements/group-16281.svg`" />
        <div class="font-size-30 font-bold color-red mt-20">ALMOST DONE!</div>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button p-absolute" @click="$emit('cancel')">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="md-layout maryoku-modal-body"></div>
      <div>
        <div class="font-bold font-size-22">Anyting else?</div>
        <div class="mt-20">Would you like to add any of those categories?</div>
        <div class="tags mt-30">
          <tag-item
            @click="addTag(tag)"
            :tagLabel="tag"
            :key="tag"
            :isSelected="selectedTags.includes(tag)"
            v-for="tag in tags"
            class="m-5"
          ></tag-item>
        </div>
      </div>
      <div>
        <div v-for="section in selectedTags" :key="section" class="text-left sub-category" :id="section">
          <div class="font-bold-extra">{{ section }}</div>
          <div class="requirement-row text-left">
            <div v-for="subCategory in speicalRequirements[section]" :key="subCategory.subCategory" class="mt-30">
              <div v-if="subCategory.subCategory" class="font-bold color-gray">{{ subCategory.subCategory }}:</div>
              <div v-for="item in subCategory.items" :key="item.name" class="requirement-item">
                <md-checkbox v-model="item.selected" class="checkbox-label-wrapper">
                  <img
                    class="special-icon"
                    :src="getIcon(item.subCategory, item.name)"
                    v-if="getIcon(item.subCategory, item.name)"
                  />
                  {{ item.name }}
                </md-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-button md-black md-simple add-category-btn" @click="skip">
        No, Skip
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
      <md-button class="md-red md-bold add-category-btn" @click="save">Find Me Vendors</md-button>
    </template>
  </modal>
</template>
<script>
import { Modal, MaryokuInput } from "@/components";
import TagItem from "../TagItem.vue";
export default {
  name: "SpecialRequirementModal",
  components: {
    Modal,
    TagItem,
  },
  data() {
    return {
      tags: ["Sustainability", "Inclusion", "Security", "Signage & Printing", "Covid-19", "Transporation"],
      selectedTags: [],
      speicalRequirements: {
        Sustainability: [
          {
            subCategory: "",
            items: [
              { name: "Green policy", selected: false },
              { name: "Water saving protocols", selected: false },
              { name: "Green power and energy efficient", selected: false },
              { name: "Waste recycle procedures", selected: false },
              { name: "Non toxic products", selected: false },
            ],
          },
        ],
        Inclusion: [
          {
            subCategory: "",
            items: [
              { name: "Prioritizing diversity and inclution", selected: false },
              { name: "Women on senior staff", selected: false },
              { name: "Strict sexual harrasment policy", selected: false },
              { name: "Acknowledge all religious and cultural holidays", selected: false },
            ],
          },
        ],
        Security: [
          {
            subCategory: "Services",
            items: [
              { name: "Day of security", selected: false },
              { name: "Security consultation", selected: false },
              { name: "Personal security", selected: false },
              { name: "VIP security", selected: false },
              { name: "Parameter security", selected: false },
              { name: "Risk assessment", selected: false },
              { name: "Crowd control", selected: false },
            ],
          },
          {
            subCategory: "Staff",
            items: [
              { name: "Patrolling officers", selected: false },
              { name: "Bouncers", selected: false },
              { name: "Unarmed security", selected: false },
              { name: "Undercover", selected: false },
              { name: "Chaperones", selected: false },
              { name: "Body guards", selected: false },
              { name: "Armed security offices", selected: false },
              { name: "Paramedic", selected: false },
            ],
          },
        ],
        "Signage & Printing": [
          {
            subCategory: "Services",
            items: [
              { name: "Social media promotion", selected: false },
              { name: "Event registration tracking", selected: false },
              { name: "Graphic design services", selected: false },
            ],
          },
          {
            subCategory: "High profile sourcing",
            items: [
              { name: "Politicians", selected: false },
              { name: "Celebrities", selected: false },
              { name: "Influencers", selected: false },
              { name: "Artists", selected: false },
            ],
          },
        ],
        Transporation: [
          {
            subCategory: "Amenities",
            items: [
              { name: "Wifi", selected: false },
              { name: "Bar", selected: false },
              { name: "TV/Cable TV", selected: false },
              { name: "Restrooms", selected: false },
              { name: "Luggage", selected: false },
              { name: "Food", selected: false },
            ],
          },
          {
            subCategory: "Services",
            items: [
              { name: "Round trip", selected: false },
              { name: "One way", selected: false },
              { name: "Airport pickup/drop off", selected: false },
              { name: "Tours", selected: false },
            ],
          },
          {
            subCategory: "Staff",
            items: [{ name: "Uniformed drivers", selected: false }],
          },
        ],
        "Covid-19": [
          {
            subCategory: "Requests for all stuff members",
            items: [
              { name: "Mask wearing", selected: false },
              { name: "Enhanced cleaning", selected: false },
              { name: "Cancellation in mitigating circumstances Policy", selected: false },
              { name: "Social distancing", selected: false },
              { name: "Vaccination Certificate", selected: false },
            ],
          },
        ],
      },
    };
  },
  props: {
    subCategory: {
      type: Object,
      default: () => {},
    },
    defaultData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.selectedTags = Object.keys(this.defaultData);
    this.speicalRequirements = { ...this.speicalRequirements, ...this.defaultData };
  },
  methods: {
    onCancel: function (e) {
      this.$emit("cancel");
    },
    skip: function () {
      this.$emit("save", {});
    },
    save: function () {
      this.$emit("save", this.speicalRequirements);
    },
    addTag(tag) {
      const tagIndex = this.selectedTags.findIndex((item) => item === tag);
      if (tagIndex < 0) {
        this.selectedTags.push(tag);
      } else {
        this.selectedTags.splice(tagIndex, 1);
      }
      setTimeout(() => {
        this.goToSelectedTag(tag);
      }, 100);
    },
    getIcon(subCategory, name) {
      let icon = null;
      if (name === "All Indoor") {
        icon = "All indoor";
      } else if (name === "Pregnant women") {
        icon = "pregnant-women-dark";
      } else if (name === "All Outdoor") {
        icon = "All outdoor";
      } else if (name === "Accessible Bathrooms") {
        icon = "Accessible bathroom";
      } else if (name === "Accessibility for people with disabilities") {
        icon = "Accessible for people with disabilities";
      } else if (name === "Hotel accommodations within walking distance") {
        icon = "Hotel";
      } else if (name === "Shopping centers") {
        icon = "Shopping center";
      } else if (name === "Dining options within walking distance") {
        icon = "Food2";
      } else if (name === "Water saving protocols") {
        icon = "Water saving";
      } else if (name === "Green power and energy efficient") {
        icon = "Green power";
      } else if (name === "Waste recycle procedures") {
        icon = "Waste recycle";
      } else if (name === "Non toxic products") {
        icon = "Non toxic";
      } else if (name === "Prioritizing diversity and inclution") {
        icon = "Diversity";
      } else if (name === "Women on senior staff") {
        icon = "Women on senior";
      } else if (name === "Strict sexual harrasment policy") {
        icon = "sexual harassment";
      } else if (name === "Acknowledge all religious and cultural holidays") {
        icon = "All religious";
      } else if (name === "Green policy") {
        icon = "Green policy";
      }
      if (subCategory === "Accessibility") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else if (subCategory === "Around the space" && name === "Dining options within walking distance") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else if (icon) {
        return `${this.$secondIconURL}Requirements/Accessibility+Sustainability+and+Inclusion/${icon}.svg`;
      }
      return null;
    },
    goToSelectedTag(item) {
      const theElement = document.getElementById(item);
      if (!theElement) return;
      const y = theElement.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -50;
      const modalWrapper = document.getElementsByClassName("modal-wrapper")[0];
      if (modalWrapper) {
        modalWrapper.scrollTo({
          top: y + yOffset,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.planning-board-additioal-modal {
  /deep/ .modal-header {
    background-color: #f3f7fd !important;
    .maryoku-modal-header {
      width: 100%;
      padding-bottom: 50px;
    }
  }
  .sub-category {
    border-top: solid 1px #dbdbdb;
    margin-top: 30px;
    padding-top: 30px;
  }
  .requirement-row {
    .requirement-item {
      display: inline-block;
      min-width: 25%;
      // display: grid;
      // grid-template-columns: repeat(4, 25%);
    }
  }
  .checkbox-label-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      width: 25px;
      margin: 0 5px;
    }
  }
}
</style>
