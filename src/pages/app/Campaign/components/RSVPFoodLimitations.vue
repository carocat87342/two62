<template>
  <div class="d-flex food-limitaions">
    <div v-for="(key, index) in Object.keys(limitations)" :key="index" class="flex-1 food-limit-item text-center">
      <img :src="`${$iconURL}RSVP/${icons[key]}`" />
      <div>
        <div class="text-transform-capitalize">
          {{ key }}
        </div>
        <div>
          ({{ limitations[key].length }})
          <span style="color: #050505" @click="showPannel(key)" v-if="limitations[key].length"
            ><md-icon>keyboard_arrow_down</md-icon></span
          >
        </div>
      </div>
      <div class="popover-panel" v-if="key == openedKey">
        <div class="popup-item" v-for="(guest, guestIndex) in limitations[key]" :key="guestIndex">{{ guest.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      limitations: [],
      icons: {
        vegetarian: "milk.svg",
        vegan: "food+(4).svg",
        Wheat: "food+(1).svg",
        Shellfish: "animals.svg",
        Peanuts: "salty.svg",
        Milk: "food+(2).svg",
        Soy: "food+(4).svg",
        "Halal food": "spiritual.svg",
        Eggs: "shape.svg",
        "Tree Nuts": "food+(3).svg",
        "Kosher food": "kosher.svg",
      },
      openedKey: "",
    };
  },
  created() {
    this.limitations = this.data;
  },
  methods: {
    showPannel(key) {
      if (this.openedKey === key) this.openedKey = "";
      else this.openedKey = key;
    },
  },
};
</script>
<style lang="scss" scoped>
.food-limitaions {
  .food-limit-item {
    height: 100px;
    border-right: solid 1px #a0a0a0;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    &:last-child {
      border: none;
    }
    .popover-panel {
      position: absolute;
      background-color: white;
      box-shadow: 0 3px 19px 0 rgba(0, 0, 0, 0.3);
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 30px;
      columns: 2;
      .popup-item {
        width: 100px;
      }
    }
  }
}
</style>