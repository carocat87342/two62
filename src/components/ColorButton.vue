<template>
  <div class="maryoku-component color-select-button">
    <div class="color-select-button-mask" @click="toggleColorPane()" v-if="showColorPane"></div>
    <md-button
      class="md-just-icon"
      :style="`background-color: ${bgc} !important; opacity:${alpha}; width:${size}px; height:${size}px`"
      @click="toggleColorPane()"
      v-if="bgc"
    ></md-button>
    <md-button
      class="add-button md-just-icon md-white"
      @click="toggleColorPane()"
      v-else
      :style="`width:${size}px; height:${size}px`"
    >
      <img :src="`${$iconURL}Concept/Asset 488.svg`" width="20" />
    </md-button>

    <chrome-picker
      :value="selectedColour"
      @input="updateValue"
      label="Pick Colour"
      picker="chrome"
      v-if="showColorPane"
    />
    <img :src="icon" @click="toggleColorPane()" v-if="icon" class="icon-img" />
  </div>
</template>
<script>
import { Chrome } from "vue-color";

let defaultValue = {
  hex: "#194d33e6",
  hsl: {
    h: 150,
    s: 0.5,
    l: 0.2,
    a: 0.9,
  },
  hsv: {
    h: 150,
    s: 0.66,
    v: 0.3,
    a: 0.9,
  },
  rgba: {
    r: 159,
    g: 96,
    b: 43,
    a: 0.9,
  },
  a: 0.9,
};

export default {
  name: "color-button",
  components: {
    "chrome-picker": Chrome,
  },
  props: {
    /**
     * Data binding
     * @model
     */
    value: {
      type: [Object, String],
    },
    size: {
      type: Number,
      default: 54,
    },

    icon: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    showColorPane: false,
    selectedColour: {
      hex: this.value ? this.value.color : "",
      a: this.value ? this.value.opacity : 1,
    },
  }),
  computed: {
    bgc() {
      if (this.selectedColour) return this.selectedColour.hex;
      return "";
    },
    alpha() {
      if (this.selectedColour) return this.selectedColour.a;
      return 1;
    },
  },
  methods: {
    hidePane: function (event) {
      this.showColorPane = false;
    },
    updateValue: function (value) {
      this.selectedColour = value;
      this.$emit("input", {
        color: this.selectedColour.hex,
        opacity: this.selectedColour.a,
      });
    },
    toggleColorPane: function () {
      document.getElementsByClassName("vc-chrome");
      this.showColorPane = !this.showColorPane;
      if (!this.showColorPane) {
        this.$emit("closed");
      }
    },
  },
  created() {
    this.selectedColour.hex = this.value.color;
    this.selectedColour.a = this.value.alpha;
  },
  watch: {
    value: function () {
      this.selectedColour.hex = this.value.color;
      this.selectedColour.a = this.value.opacity;
    },
  },
};
</script>
<style lang="scss" scoped>
.color-select-button {
  position: relative;
  &-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0px;
    top: 0px;
    z-index: 30;
  }
  .md-button {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin: 0px;
    // &.add-button {}
  }
  .add-button {
    -webkit-box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    background-color: #ffffff;
    border: dashed 1.5px #f51355;
    background-color: #ffffff;
    border-radius: 50%;
  }
  .vc-chrome {
    left: 65px;
    top: 0px;
    position: absolute;
    z-index: 100;
    &:before {
      content: "";
      width: 10px;
      height: 10px;
      position: absolute;
      border: 1px solid #989898;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      left: -6px;
      top: 22px;
    }
  }
  .icon-img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 25px;
    height: 25px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
}
</style>
