<template>
  <drop
    @drop="handleDrop(...arguments)"
    @dragenter="hadleDragEnter"
    @dragleave="handleDragLeave"
    style="height: 100%"
    class="timeline-empty-drop"
    :class="{ dropping: isHover }"
  >
    <div v-if="placeHolder" class="timeline-empty-start">Pleas drop here one of timeline slots</div>
    <div v-else class="timeline-empty-item">
      <div class="timeline-image" :style="hoverStyle">
        <md-icon>add</md-icon>
      </div>
      <div class="template-form ml-20" :style="hoverStyle">
        <md-icon>add</md-icon>
      </div>
    </div>
  </drop>
</template>
<script>
import { Drag, Drop } from "vue-drag-drop";
import { hexToRgbA } from "@/utils/helperFunction";

export default {
  components: {
    Drop,
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
    date: {
      type: [Object, String],
      default: "",
    },
    placeHolder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHover: false,
      droppingBlock: {},
    };
  },
  created() {},
  methods: {
    handleDrop() {
      this.isHover = false;
      this.$emit("addSlot", {
        date: this.date,
        block: this.droppingBlock,
        index: this.index,
      });
    },
    hadleDragEnter(data) {
      this.isHover = true;
      this.droppingBlock = data.block;
    },
    handleDragLeave(data) {
      this.isHover = false;
    },
  },
  computed: {
    hoverStyle() {
      if (!this.isHover) {
        return "";
      }
      return `border-color: ${this.droppingBlock.color}; background-color: ${hexToRgbA(
        this.droppingBlock.color,
        0.25,
      )}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.timeline-empty-drop {
  min-height: 20px;
  .timeline-empty-start {
    border: dashed 1px #a0a0a0;
    text-align: center;
    padding: 20px;
  }
  .timeline-empty-item {
    display: flex;
    opacity: 0;
    height: 20px;
    .timeline-image {
      padding: 2px;
      margin: 0 15px;
      width: 30px;
      height: 30px;
      text-align: center;
      border-style: solid;
      border-width: 1px;
      border-radius: 50%;
    }
    .template-form {
      text-align: center;
      flex-grow: 1;
      border-style: solid;
      border-width: 1px;
    }
  }
  &.dropping {
    min-height: 35px;
    .timeline-empty-item {
      height: 35px;
      opacity: 1;
    }
  }
}
</style>