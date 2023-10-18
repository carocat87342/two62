<template>
  <div
    v-if="type == 'textarea'"
    class="maryoku-textarea"
    :style="size == 'normal' ? 'padding:40px 140px 40px 40px' : 'padding:30px 40px 30px 30px'"
    :class="{ disabled: disabled }"
  >
    <textarea
      v-model="content"
      @input="handleInput"
      :placeholder="placeholder"
      :rows="rows"
      class="textarea js-autoresize"
      :disabled="disabled"
      :style="`font-size:${fontSize}px`"
    ></textarea>
    <span class="close-button" @click="clearContent" v-if="!disabled">
      <img :src="`${$iconURL}Campaign/Group+3602.svg`" />
    </span>
  </div>
  <div v-else class="maryoku-textarea input" :class="inputClass">
    <textarea
      v-model="content"
      @input="handleInput"
      :rows="1"
      class="textarea js-autoresize"
      :disabled="disabled"
    ></textarea>
    <div class="place-holder color-dark-gray font-size-16">
      <img v-if="type == 'emails'" :src="`${$iconURL}Campaign/emails-gray.svg`" style="width: 20px; margin: 0 7px" />
      <img
        v-if="type == 'phones'"
        :src="`${$iconURL}Choose+vendor+and+Proposal/phone-gray.svg`"
        style="width: 20px; margin: 0 7px"
      />
      {{ placeholder }}
    </div>
  </div>
</template>
<script>
import { setResizeListeners } from "@/utils/auto-resize.js";

export default {
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    value: String,
    rows: {
      type: String,
      default: "3",
    },
    type: {
      type: String,
      default: "textarea",
    },
    inputStyle: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "normal",
    },
    tooltip: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: [String, Number],
    },
  },
  data() {
    return {
      content: "",
      inputClass: `${this.inputStyle}`,
    };
  },
  mounted() {
    setResizeListeners(this.$el, ".js-autoresize");
  },
  methods: {
    handleInput(e) {
      this.$emit("input", this.content);
      this.$emit("change", { value: this.content, type: this.inputStyle });
    },
    clearContent() {
      this.content = "";
      this.$emit("input", this.content);
      this.$emit("change", { value: this.content, type: this.inputStyle });
    },
  },
  created() {
    this.content = this.value;
  },
  computed: {
    getClass: function () {
      return `${this.inputStyle} ${this.value ? "active" : ""} ${this.size}`;
    },
  },
  watch: {
    content: function (newValue) {
      this.inputClass = `${this.inputStyle} ${newValue ? "active" : ""}`;
      setTimeout(() => {
        setResizeListeners(this.$el, ".js-autoresize");
      }, 100);
    },
    value: function (newValue) {
      this.content = newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin background-icon($url) {
  background: $url;
  background-repeat: no-repeat;
  background-size: 25px 50%;
  background-position: left;
  background-position-x: 20px;
  background-position-y: 20px;
  padding: 1em 20px 1em 50px;
}
.maryoku-textarea {
  position: relative;
  border: solid 1px #a0a0a0;
  border-radius: 3px;
  background: white;
  display: flex;
  &.disabled {
    opacity: 0.6;
  }
  &.input {
    padding: 1em 2.5em 1em 1.5em;
    textarea {
      z-index: 2;
      background: transparent;
    }
    .place-holder {
      display: block;
      position: absolute;
      left: 0px;
      top: 0px;
      height: 100%;
      padding: 1em 25px;
      z-index: 1;
    }
    &.active {
      .place-holder {
        display: none;
      }
    }
  }
  .close-button {
    right: 35px;
    top: 30px;
    position: absolute;
    cursor: pointer;
  }

  textarea {
    width: 100%;
    resize: none;
    border: none;
    padding: 2px;
    // overflow: hidden;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  textarea::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  textarea {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  textarea[disabled="disabled"] {
    opacity: 0.6;
  }
}
</style>