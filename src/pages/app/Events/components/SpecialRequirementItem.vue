<template>
  <div class="special-request-section mt-30">
    <div>
      <div class="font-size-22 font-bold">
        <md-checkbox class="md-red md-checkbox-circle" v-model="data.isSelected" @change="changeItem">{{
          data.subCategory
        }}</md-checkbox>
      </div>
      <div></div>
      <div class="special-request-section-description">
        <div class="font-size-20 font-bold mt-20" v-if="data.desc">{{ data.desc }}</div>
        <div class="mt-10" v-if="data.subCategory === 'Sitting arrangement'">
          You may select up to 2 options and we will endeavor to incorporate them into your event
        </div>
        <div class="mt-10" v-if="data.subCategory === 'Sitting arrangement'">Please select up to 2 options</div>
      </div>
    </div>
    <div class="mt-30 mb-20" v-if="data.subCategory !== 'Sitting arrangement'">
      <md-checkbox
        v-for="(item, index) in data.options"
        class="md-simple md-red"
        v-model="item.selected"
        :key="index"
        @change="changeItem()"
      >
        <div class="checkbox-label-wrapper">
          <img :src="getIcon(item.name)" />
          {{ item.name }}
        </div>
      </md-checkbox>
    </div>
    <template v-else>
      <div class="special-request-section-options">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-50 md-small-size-100 p-50"
            v-for="(option, index) in data.options"
            :key="index"
          >
            <div>
              <md-checkbox class="md-simple md-red" v-model="option.selected" @change="changeItem">
                <span>{{ option.item }}</span>
              </md-checkbox>
              <div class="ml-30">
                <span class="font-bold">Popular for:</span>
                {{ option.popular }}
                <div>
                  <img :src="`${$iconURL}Requirements/${option.icon}`" />
                </div>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-50 md-small-size-100 p-50">
            <div class="d-flex">
              <md-checkbox class="md-simple md-red" @change="changeItem" v-model="data.hasOtherOption">
                <span class="font-bold">Other:</span>
              </md-checkbox>
              <maryoku-input class="flex-1" v-model="data.otherOptionContent"></maryoku-input>
            </div>
          </div>
        </div>
      </div>
      <div class="special-request-section-description">
        <div class="font-size-20 font-bold">Is there going to be group work at the event?</div>
        <div class="mt-10">Which will require dedicated tables?</div>
        <div>
          <md-checkbox class="md-checkbox-circle md-red" v-model="isGroup" :value="true">Yes</md-checkbox>
          <md-checkbox class="md-checkbox-circle md-red" v-model="isGroup" :value="false">No</md-checkbox>
        </div>
        <div v-if="isGroup" class="d-flex align-start mt-20">
          <img :src="`${$iconURL}Requirements/enter-gray.svg`" style="margin-top: -10px" />
          <div>
            <div class="font-size-20 font-bold">Around what size of groups?</div>
            <div class="d-flex justify-content-between mt-10">
              <md-radio
                v-for="(size, idx) in data.groupSizes"
                v-model="groupSize"
                :key="idx"
                :value="size.item"
                @change="sizeChange"
              >
                {{ `${size.item} people` }}</md-radio
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";

export default {
  name: "special-requirement-item",
  components: {
    MaryokuInput,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isGroup: false,
      groupSize: null,
    };
  },
  methods: {
    getSpecialItem() {
      if (this.data.subCategory === "Sitting arrangement") {
        this.data.groupSizes.map((size) => {
          if (size.selected) {
            this.isGroup = true;
            this.groupSize = size.item;
          }
        });
      }
    },
    getIcon(name) {
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
      } else {
        icon = `${name}`;
      }
      if (this.data.subCategory === "Accessibility") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else if (this.data.subCategory === "Around the space" && name === "Dining options within walking distance") {
        return `${this.$iconURL}Requirements/${icon}.svg`;
      } else {
        return `${this.$secondIconURL}Requirements/Accessibility+Sustainability+and+Inclusion/${icon}.svg`;
      }
    },
    changeItem() {
      this.$emit("change");
    },
    sizeChange() {
      console.log("sizeChange");
      this.data.groupSizes.map((size) => {
        size.selected = size.item === this.groupSize;
      });
      this.$emit("change");
    },
  },
  mounted() {
    this.getSpecialItem();
  },
};
</script>
<style lang="scss" scoped>
</style>
