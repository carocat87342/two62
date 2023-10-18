<template>
  <div class="d-flex campaign-title-editor" v-if="!isEditing">
    {{ content }}
    <md-button class="md-simple md-icon-button edit-btn ml-10" @click="isEditing = true">
      <!-- <img :src="`${$iconURL}Campaign/edit-dark.svg`" style="width: 20px; margin-left: 20px" /> -->
      <md-button class="edit-btn md-simple md-red">Edit</md-button>
    </md-button>
  </div>
  <div class="d-flex campaign-title-editor" v-else>
    <input
      v-model="content"
      class=""
      :class="{ isEditing: isEditing }"
      v-autowidth="{ maxWidth: '960px', minWidth: '20px', comfortZone: 0 }"
    />
    <md-button class="md-simple maryoku-btn md-black" @click="cancel"> Cancel </md-button>
    <md-button class="maryoku-btn md-red" @click="changeText"> Save </md-button>
  </div>
</template>
<script>
export default {
  props: {
    defaultValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: this.defaultValue,
      isEditing: false,
    };
  },
  methods: {
    changeText(e) {
      console.log(this.content);
      this.$emit("change", this.content);
      this.isEditing = false;
    },
    cancel() {
      this.content = this.defaultValue;
      this.isEditing = false;
    },
  },
  watch: {
    defaultValue(newValue, oldValue) {
      console.log(newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
.campaign-title-editor {
  height: 52px;
  align-items: center;
  button {
    margin-left: 10px !important;
  }
  input {
    padding: 0 10px;
    color: #050505;
    width: max-content;
    border: none;
    box-shadow: none;
    font-size: inherit;
    &.isEditing {
      border: solid 1px #a0a0a0;
    }
  }
}
</style>