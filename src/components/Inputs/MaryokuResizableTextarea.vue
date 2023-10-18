<template>
  <div class="maryoku-resizable-wrapper">
  <div contenteditable
      class="maryoku-resizable-textarea" 
      :data-placeholder="placeholder"
      v-text="content"
      @keydown="editing"
      @blur="onEdit" >
      
  </div>
  </div>
</template>
<script>

export default {
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    value: String,
    rows: {
      type: String,
      default: "3"
    },
    type: {
      type: String,
      default: "textarea"
    },
    inputStyle: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "normal"
    },
  },
  data() {
    return {
      content: "",
      inputClass: `${this.inputStyle}`,
      hiddenPlaceholder: false,
    }
  },
  mounted () {
  },
  methods: {
    handleInput(e) {
      this.$emit("input", this.content);
      this.$emit("change", { value: this.content, type: this.inputStyle});
    },
    clearContent() {
      this.content = ""
      this.$emit("input", this.content);
      this.$emit("change", { value: this.content, type: this.inputStyle});
    },
    editing(evt) {
      console.log("editing")
      var src = evt.target.innerHTML
      // this.content = src
      this.$emit("input", src);
      this.$emit("change", { value: src, type: this.inputStyle});
    },
    onEdit() {
      this.$el.querySelector('.maryoku-resizable-textarea').blur()
      this.hiddenPlaceholder = false
    },
    clickPlaceholder() {
      this.hiddenPlaceholder = true
      this.$el.querySelector('.maryoku-resizable-textarea').click()
    }
  },
  created () {
    this.content = this.value
  },
  computed: {
    getClass: function() {
      return `${this.inputStyle} ${this.value ? "active" : ""} ${this.size}`;
    },
  },
  watch: {
    content: function(newValue) {
      this.inputClass = `${this.inputStyle} ${newValue ? "active" : "" }`;
      this.$emit("input", newValue);
      this.$emit("change", { value: newValue, type: this.inputStyle});
      console.log("emit")
    },
    value: function(newValue) {
      this.content = newValue
      
    }
  }
}
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
.maryoku-resizable-wrapper {
  position: relative;
  min-height: 55px;
  background: #ffffff;
  box-shadow: none;
  width: 100%;
  padding: 1em 1.5em;
  font-size: 16px;
  color: #050505;
  font-family: 'Manrope-Regular',sans-serif;
  border: solid 0.5px #bcbcbc;
  border-radius: 3px;
  .placeholder {
    position: absolute;
    top: 1em;
  }
}
.maryoku-resizable-textarea {
  &:empty:before {
    content: attr(data-placeholder);
    color: #808080
  }
  &.input{
    padding: 1em 1.5em;
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
    // overflow: hidden;
  }
  
    /* Hide scrollbar for Chrome, Safari and Opera */
  textarea::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  textarea{
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
}

</style>