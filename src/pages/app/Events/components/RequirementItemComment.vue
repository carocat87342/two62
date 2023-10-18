<template>
  <div class="comment-editor">
    <template v-if="showComponent">
      <div class="comment-title"> Add note</div>
      <textarea v-model="note" class="comment"></textarea>
      <div v-if="showComponent" class="comment-action">
        <button class="md-button md-black md-bold md-simple" style="margin-left: auto" @click="cancel">Cancel</button>
        <button class="md-button md-red md-bold" @click="save">Save</button>
      </div>
    </template>
    <template v-else>
      <div class="comment-add md-bold" @click="show">
        <md-icon class="icon color-red">{{ note ? 'remove_circle_outline' : 'add_circle_outline'}} </md-icon>
        {{ note ? 'Show' : 'Add'}} Note
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    name: "requirement-item-comment",
    props: {
      property: {
        type: Object,
        required: false,
      },

    },
    data: function () {
      return {
        note: null,
        showComponent: false
      }
    },
    methods: {
      save() {
        this.showComponent = false;
        this.$emit('save', this.property, this.note);
      },
      show() {
        this.showComponent = true;
      },
      cancel(){
        this.showComponent = false;
      },
    },
    watch: {
      property:{
        handler(newVal, oldVal){
          this.note = this.property.defaultNote;
        },
        deep: true,
      }
    },
    mounted() {

      if (this.property) {
        this.note = this.property.defaultNote;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .comment-editor {
    margin-top: 16px;
    font: normal 16px Manrope-Regular, sans-serif;
    min-width: 300px;
    position: relative;

    .comment-add {
      display: inline-block;
      vertical-align: middle;
      color: #f51355;
      font-weight: 600;
      cursor: pointer;

      .icon{
        color: #f51355;
        margin-right: 10px;
        font-size: 30px !important;
        font-weight: 500;
      }
    }
    .comment-title{
      font-weight: 600;
    }

    textarea.comment{
      width: 100%;
      resize: none;
      padding: 10px;
      border: solid 1px #a0a0a0;
      border-radius: 3px;
      min-height: 100px;
    }

    .comment-action{
      margin-top: 16px;
      display: flex;

      button{
        padding: 8px 16px;
      }
    }
  }
</style>
