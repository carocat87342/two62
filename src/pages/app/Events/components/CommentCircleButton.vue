<template>
  <dragging-component class="maryoku-component color-select-button"
    :class="{topIcon:showEditPane, dragging:isDragging}" ref="draggingComp"
    @dropped="onDropped(commentComponent)"
    @dragging="onDragging(commentComponent)"
    @activated="onActivated(commentComponent)"
    >
        <!-- <md-button
          class="add-button md-just-icon md-white"
          @click="toggleEditPane( $event )"
          v-if="showEditPane"
        >
          <img :src="`${$iconURL}common/message-yellow.svg`"  width="100%" style="width:30px">
        </md-button> -->
        <md-button
          class="add-button md-just-icon md-yellow"
          @click="toggleEditPane( $event )"
          @mouseenter="showComments($event)"
          @mouseleave="showCommentList=false"
        >
          <span> {{commentComponent.index}}</span>
        </md-button>
    </dragging-component>
</template>
<script>
import DragItDude from 'vue-drag-it-dude';
import DraggingComponent from '@/components/DraggingComponent'
export default {
  name: "comment-circle-button",
  components: {
    DraggingComponent,
  },
  props: {
    /**
     * Data binding
     * @model
     */
    value: {
      type: [Object, String]
    },
    commentComponent: {
      type: [Object]
    },
    selectedComponet: {
      type: [Object]
    }
  },
  data: () => ({
    showEditPane: false,
    showCommentList: true,
    isDragging:false
  }),
  methods: {
    hidePane: function(event) {
      this.showEditPane = false;
    },
    updateValue: function(value) {
    },
    toggleEditPane: function(event) {
      console.log("click Button", this.commentComponent)
      event.stopPropagation();
      event.preventDefault();
      if (this.isDragging) return;
      this.showEditPane = !this.showEditPane;
      this.$emit("toggleEditPane", this.commentComponent, this.showEditPane)

    },

    showComments: function(event) {

      setTimeout(()=>{
        if (this.isDragging) return;
        this.$emit("show", this.commentComponent)
        this.showCommentList = true
      },500)

    },
    onDropped(component) {
      console.log("left", this.$refs.draggingComp);
      if (!this.$refs.draggingComp.left && !this.$refs.draggingComp.top ) return
      if (this.$refs.draggingComp.left != component.positionX || this.$refs.draggingComp.top != component.positionY ) {
        component.positionX = this.$refs.draggingComp.left
        component.positionY = this.$refs.draggingComp.top
        setTimeout(()=>{this.isDragging = false}, 200);
        this.$emit("onDropped",component)
      } else {

      }
    },
    onDragging(component) {
      console.log("started dragging")
      this.isDragging = true
      if (this.$refs.draggingComp.left > 0 && this.$refs.draggingComp.top > 0){
        this.$emit("dragging", component, {x: this.$refs.draggingComp.left,y:this.$refs.draggingComp.top })
      }
    },
    onActivated(component) {
      console.log(this.$refs.draggingComp)
      console.log("started dragging")
      //this.isDragging = true
      // this.$emit("onDragginStart",component)
    }
  },
  created() {
  },
  watch: {
    selectedComponet(newValue, oldValue) {
      // console.log(newValue)
      if (!newValue) {
        this.showEditPane = false
      } else {
        this.showEditPane = this.commentComponent.index == newValue.index
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.color-select-button {
  position: absolute;
  &-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left:0px;
    top: 0px;
    z-index: 30;
  }
}
.dragging {
  width: 400px;
  height: 400px;
}
.md-button.add-button {
  width: 38px;
  height: 38px;
  // border-radius: 50%;
  margin:0px;
  // &.add-button {}
}
.add-button{
    -webkit-box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    border-radius: 50%;
  }
.vc-chrome {
  left: 65px;
  top: 0px;
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
.topIcon {
  z-index: 10 !important;
}
</style>
