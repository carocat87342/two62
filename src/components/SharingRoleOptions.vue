<template>
  <div class="sharing-role-options" :class="{alignRight: align==='right'}">
    <div>
      <md-radio v-model="role" value="edit">
        <div class="note-item-label">Can Edit</div>
      </md-radio>
    </div>
    <div>
      <md-radio v-model="role" value="comment">
        <div class="note-item-label">Can comment</div>
      </md-radio>
    </div>
    <div>
      <md-radio v-model="role" value="view">
        <div class="note-item-label">Can view</div>
      </md-radio>
    </div>
  </div>
</template>
<script>
export default {
  name: "sharing-role-options",
  props: {
    align: {
      type: String,
      default: "left"
    },
    value: {
      type: String,
      default: "view"
    },
  },
  data() {
    return {
      role: this.value
    }
  },
  watch: {
    role(newValue, oldValue) {
      this.$emit("change", newValue)
    }
  },
}
</script>
<style lang="scss" scoped>
  .sharing-role-options{
    position: absolute;
    background-color: white;
    border: solid  1px #DADADA;
    z-index: 99999;
    box-shadow: 0 3px 25px 0 rgba(0, 0, 0, 0.16);
    padding: 10px 20px;
  }
  .alignRight {
    right: 15px;
  }
</style>