<template>
  <div @click="addFromEvent( $event )" class="click-capture">
    <comment-circle-button
      class="item"
      v-for="(item, index) in unresolvedComponents"
      :key="index"
      :style="{left: `${item.positionX}px`, top: `${item.positionY}px`}"
      :commentComponent="item"
      @save="saveComment"
      @show="showComments"
      @toggleEditPane="toggleEditPane"
      @onDropped="movedCommentComponent"
      @onDragginStart="isDragging=true"
      @dragging="draggingButton"
      :selectedComponet="selectedCommentComponent"
    ></comment-circle-button>

    <!-- Comments List -->
    <transition name="fade">
      <div
        class="comments-list"
        v-if="isOpenCommentListsPane"
        @click="paneClick($event)"
        :style="{left: `${panelPosition.x}px`, top: `${panelPosition.y - 40}px`}"
      >
        <div style="height:40px; margin-right:25px" class="text-right">
          <md-button class="md-simple md-just-icon md-round md-black font-size-30" @click="closeCommentListPane">
            <md-icon class="font-size-30">clear</md-icon>
          </md-button>
        </div>
        <div>
          <div v-if="selectedCommentComponent && selectedCommentComponent.comments">
            <comment-item
              :comment="mainComment"
              :isEditing="editingCommentId == mainComment.id"
              :isMain="true"
              :replies="replies.length"
              @updateComment="updateComment"
              @resolve="resolveCommentComponent"
              @favorite="markAsFavorite"
              @delete="deleteComment"
            ></comment-item>
            <comment-item
              v-for="(comment) in replies"
              :key="comment.id"
              :comment="comment"
              :isMain="false"
              @updateComment="updateComment"
              @resolve="resolveCommentComponent"
              @favorite="markAsFavorite"
              @delete="deleteComment"
            ></comment-item>
          </div>
          <div class="form-group position-relative reply-form" :class="{'main-form':!this.selectedCommentComponent.length }">
              <fade-transition v-if="showAddress">
                  <md-card class="position-absolute notification-card">
                      <md-card-content class="d-flex align-center position-relative p-10">
                          <md-menu md-size="medium" class="action-menu">
                              <md-menu-item v-for="c in customers" :key="c.id" @click="toAddress(c)">
                                  {{c.name}}
                              </md-menu-item>
                          </md-menu>
                      </md-card-content>
                  </md-card>
              </fade-transition>
            <textarea
              rows="4"
              class="form-control"
              placeholder="Write reply here"
              v-model="editingComment"
              ref="commentEditor"
              @input="getMessage"
            ></textarea>
            <img :src="`${this.$iconURL}comments/SVG/editor-dark.svg`" class="text-icon" />
            <div class="footer">
              <md-button class="md-simple normal-btn" @click="closeCommentListPane">Cancel</md-button>
              <md-button
                class="md-simple md-black normal-btn"
                @click="saveComment($event, 'reply')"
              >Submit</md-button>
            </div>
          </div>
        </div>

      </div>
    </transition>
    <div :class="{mask:isOpenCommentListsPane}" v-if="isOpenCommentListsPane"></div>
  </div>
  <!-- End Comments List -->
</template>
<script>
import { mapActions } from "vuex";
import CommentCircleButton from "./CommentCircleButton";
import EventCommentComponent from "@/models/EventCommentComponent";
import { postReq, getReq } from "@/utils/token";
import { FadeTransition } from "vue2-transitions";
import CommentItem from "./CommentItem";

export default {
  components: {
    CommentCircleButton,
    FadeTransition,
    CommentItem,
  },
  props:{
      commentComponents:{
        type: Array,
        required: true,
      },
  },
  data() {
    return {
      items: [],
      mostRecentClickCoordinates: null,
      selectedComponentIndex : -1,
      hoveredComponent: null,
      comments: [],
      editingComment: "",
      panelPosition: {
        x: 0,
        y: 0
      },
      isCommentEditing: false,
      isOpenCommentListsPane: false,
      isExistingCommentEditing: false,
      isDragging: true,
      editingCommentId: "",
      isFavorite: false,
      showAddress: false,
      customers: [],
      selectedCustomer: null,
    };
  },
  computed: {
    selectedCommentComponent() {
      return this.commentComponents[this.selectedComponentIndex]
    },
    mainComment() {
      if (this.commentComponents[this.selectedComponentIndex].comments) {
        return this.commentComponents[this.selectedComponentIndex].comments[0]
      }
      return {}
    },
    replies() {
      if (this.commentComponents[this.selectedComponentIndex].comments) {
        return this.commentComponents[this.selectedComponentIndex].comments.filter((item, index)=>index>0)
      }
      return []
    },
    unresolvedComponents() {
      return this.commentComponents.filter(item => !item.isResolved);
    }
  },
  created() {
    console.log('commentPanel.created', this.$auth);
  },
  methods: {
    ...mapActions("comment", [
      "getCommentComponents",
      "addCommentComponent",
      "deleteCommentComponent",
      "updateCommentComponent",
      "getCommentsAction",
      "updateCommentAction",
      "addComment",
      "deleteCommentAction"
    ]),
    selectItem(event, item) {
      item.isEditing = !item.isEditing;
      event.stopPropagation();
    },
    showComments(commentComponent) {
      if (this.isOpenCommentListsPane) return;
      this.comments = commentComponent.comments
      this.selectedComponentIndex = this.commentComponents.findIndex(item=>item.index === commentComponent.index);
      this.setEditPanePosition(commentComponent.positionX, commentComponent.positionY )
      console.log(this.commentComponents);
      console.log(this.selectedComponentIndex)
      this.isOpenCommentListsPane = true;

      // this.getCommentsAction(commentComponent.id).then(comments => {
      //   this.hoveredComponent = commentComponent;
      //   this.comments = comments;
      //   this.comments = comments;
      //   if (!comments || comments.length === 0) return;
      //   this.setEditPanePosition(this.hoveredComponent.positionX, this.hoveredComponent.positionY )
      //   this.isOpenCommentListsPane = true;
      // });
    },

    setEditPanePosition(x, y) {
      const deviceWidth = window.innerWidth;
      if (x > deviceWidth - 700) {
        this.panelPosition = {
          x: x - 580,
          y: y
        };
      } else {
        this.panelPosition = {
          x: x + 40,
          y: y
        };
      }
    },
    toggleEditPane(commentComponent, isEditing) {
      console.log('toggleEditPane', commentComponent, isEditing);
      if (isEditing) {
        this.showComments(commentComponent)
      } else {
        // this.selectedCommentComponent = null;
      }
      this.isOpenCommentListsPane = isEditing;
    },
    clearStatus() {
      if (this.selectedComponentIndex >=0 ) {
        if (!this.commentComponents[this.selectedComponentIndex].comments || this.commentComponents[this.selectedComponentIndex].comments.length === 0 ) {
          this.commentComponents.splice(this.selectedComponentIndex, 1)
        }
      }
      this.isCommentEditing = false;
      this.isOpenCommentListsPane = false;
      this.selectedComponentIndex = -1;
      this.hoveredComponent = null;
      this.comments = [];
    },
    addFromEvent(event) {
      console.log('addFromEvent');
      if (this.isOpenCommentListsPane) {
        this.clearStatus();
        return;
      }
      var element = document.querySelector(".click-capture");
      var top = element.offsetTop;
      const maxIndex = this.commentComponents
        ? this.commentComponents.reduce((index, item) => {
            if (item.index > index) index = item.index;
            return index;
          }, 0)
        : 0;

      const newComentComponent = {
        dateTime: Date.now(),
        positionX: event.clientX - 80,
        positionY: event.clientY - 100 + window.scrollY,
        index: maxIndex + 1,
        isEditing: false,
        url: this.$route.path
      }
      this.commentComponents = this.commentComponents.concat([newComentComponent])
      this.selectedComponentIndex = this.commentComponents.length - 1;
      // this.addCommentComponent({
      //   dateTime: Date.now(),
      //   positionX: event.clientX - 80,
      //   positionY: event.clientY - 100 + window.scrollY,
      //   index: maxIndex + 1,
      //   isEditing: false,
      //   url: this.$route.path
      // }).then(commentComponent => {
      //   this.selectedCommentComponent = commentComponent
      // });
      this.setEditPanePosition(event.clientX - 80, event.clientY - 100 + window.scrollY )
      this.openEditor()
      this.mostRecentClickCoordinates = {
        x: event.clientX,
        y: event.clientY
      };
      event.stopPropagation();
    },
    closeCommentListPane() {
      this.clearStatus();
    },
    openEditor() {
      this.isOpenCommentListsPane = true;
      setTimeout(()=>{
        this.$refs.commentEditor.focus();
      }, 100)
    },
    enter(element) {
      var clickX = this.mostRecentClickCoordinates.x;
      var clickY = this.mostRecentClickCoordinates.y;
      var rect = element.getBoundingClientRect();
      var deltaX = clickX - rect.left - rect.width / 2;
      var deltaY = clickY - rect.top - rect.height / 2;
      element.style.transform = `translateX( ${deltaX}px ) translateY( ${deltaY}px )`;
      element.style.transition = "none";
      this.__force_paint__ = document.body.offsetHeight;
      element.style = null;
    },
    paneClick: function(event) {
      event.stopPropagation();
    },
    async saveComment(event, type) {
      let selectedComponent = this.commentComponents[this.selectedComponentIndex];
      console.log('saveComment', selectedComponent);
      const comment = {
            commentComponent: { id: selectedComponent.id },
            description: this.editingComment,
            parentId: this.mainComment ? this.mainComment.id : null,
            email: this.selectedCustomer ? this.selectedCustomer.email : null,
      };
      this.$emit('saveComment', {component: selectedComponent, comment, index: this.selectedComponentIndex})

      this.editingComment = ""
      event.stopPropagation();
    },
    resolveCommentComponent() {
      this.editingCommentId = "";
        const commentComponent = new EventCommentComponent({
            id: this.hoveredComponent.id,
            isResolved: true
        });
      this.$emit('updateCommentComponent', commentComponent)

      this.isOpenCommentListsPane = false;
    },
    editComment(comment) {
      this.isEditing = true;
      this.editingCommentId = comment.id;
    },
    markAsFavorite(comment, isFavorite) {
      const hoveredComponent = this.commentComponents[this.selectedComponentIndex]
      comment.eventCommentComponent.id = hoveredComponent.id;
      if (isFavorite) {
        if (!comment.favoriteUsers) comment.favoriteUsers = [];
        comment.favoriteUsers.push(this.$auth.user.id);
        comment.myFavorite = true;
      } else {
        const index = comment.favoriteUsers.findIndex(
          item => item.id == this.$auth.id
        );
        comment.favoriteUsers.splice(index, 1);
        comment.myFavorite = false;
      }
      console.log(comment)
      const selectedComponent = this.commentComponents[this.selectedComponentIndex];
      const commentIndex = hoveredComponent.comments.findIndex(item=>item.id===comment.id)
      this.commentComponents[this.selectedComponentIndex].comments[commentIndex] = comment
      this.$emit('updateComment', {comment, component: new EventCommentComponent({id: selectedComponent.id})})
    },

    deleteComment(comment) {
      this.$emit('deleteComment', {comment, index:this.selectedComponentIndex} )
    },
    updateComment(comment) {
      console.log('panel.updateComment', comment);
      this.editingCommentId = "";

      const selectedComponent = this.commentComponents[this.selectedComponentIndex];
      this.$emit('updateComment', {comment, component: new EventCommentComponent({id: selectedComponent.id})})
    },
    movedCommentComponent(movedCommentComponent) {
      const commentComponent = new EventCommentComponent({
        id: movedCommentComponent.id,
        positionX: movedCommentComponent.positionX,
        positionY: movedCommentComponent.positionY
      });
      this.$emit('updateCommentComponent', commentComponent)
      // this.updateCommentComponent(commentComponent).then(() => {
        this.isOpenCommentListsPane = false;
      // });
    },
    draggingButton(component, position) {
      console.log(position);
      if (this.isCommentEditing && this.selectedCommentComponent) {
        if (position.x < 600) {
          this.$refs.editingPanel.style.left = `${position.x - 20}px`;
          this.$refs.editingPanel.style.top = `${position.y + 80}px`;
        } else {
          this.$refs.editingPanel.style.left = `${position.x - 530}px`;
          this.$refs.editingPanel.style.top = `${position.y + 80}px`;
        }
        this.$refs.editingPanel.style.left = `${this.panelPosition.x}px`;
        this.$refs.editingPanel.style.top = `${this.panelPosition.y}px`;

        if (this.mainComment) {
          this.editingComment = this.mainComment.description;
        }
      }
    },
    async getMessage(e){
      console.log('getMessage', e.target.value);
      if(e.target.value.includes('@')){
        let queryArray = e.target.value.split('@')

        let res = await getReq(`/1/customers?name=${queryArray[1]}`);
        console.log('customers', res);
        this.customers = res.data;

        this.showAddress = true;
      }
    },
    toAddress(customer){
      console.log('toAddress', customer, this.editingComment);

      this.selectedCustomer = customer;
      let queryArray = this.editingComment.split('@');
      queryArray[1] = customer.name;

      this.editingComment = queryArray.join('@') + ' ';
      this.showAddress = false
    }
  },
  watch:{
    commentComponents(newVal){
        console.log('commentComponent', newVal)
    }
  }
};
</script>

<style scoped lang="scss">
.item {
  &-enter {
    opacity: 0;
  }
  &-enter-active {
    transition-duration: 300ms, 200ms;
    transition-property: transform, opacity;
    transition-timing-function: ease;
  }
  &-enter-to {
    opacity: 1;
    transform: translateX(0px) translateY(0px);
  }
}
.items {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  width: 500px;
}

.item {
  flex: 0 0 auto;
  margin: 0px 12px 12px 0px;
  padding: 0px 0px 0px 0px;
  width: 38px;
  position: absolute;
  transform: translate(-50%, -50%);
  font-family: "Manrope-ExtraBold";
  color: white;
  font-size: 20px;
  // display: flex;
  justify-content: center;
  align-items: center;
  &.editing {
    background-color: white;
    box-shadow: 0 3px 17px 0 rgba(0, 0, 0, 0.15);
  }
  display: flex;
  align-items: center;
  justify-items: center;
}

.mask {
  width: 100vw;
  top: 0;
  height: 100vh;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.08);
}

.click-capture {
  bottom: 0px;
  cursor: pointer;
  left: 0px;
  position: absolute;
  right: 0;
  top: 100px;
  overflow: hidden;
  // Since clicking around the document will often lead to text-selection, let's just
  // remove the ability to select text in this demo.
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  z-index: 9999;
}
.comments-list {
  position: absolute;
  width: 550px;
  min-height: 210px;
  box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
  background: white;
  z-index: 10;
  padding: 0px 0px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &.comment-edit-pane{
    padding: 20px 25px;
  }
  textarea {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    border: solid 1px #989898;
    background-image: none;
    padding: 10px;
    padding-right: 25px;
  }
  .footer {
    text-align: right;
    width: 100%;
  }
  .comments-child {
    padding-left: 40px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    & > div {
      border-top: solid 1px #cecece;
    }
  }
  .reply-form {
    padding-top: 20px;
    padding-left: 70px;
    padding-right: 25px;
  }
  .main-form {
    padding-left: 25px;
  }
  .text-icon {
    position: absolute;
    right: 30px;
    top: 30px;
    width: 20px;
  }
  .font-size-30 {
    font-size: 30px !important;
  }
}
</style>
