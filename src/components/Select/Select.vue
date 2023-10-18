<template>
    <md-field :class='fieldStyle'>

        <label v-if='!editebleMode' :class='labelStyle'>{{label}}<span class='required-logo' v-if='required'>*</span></label>
        <label v-if='editebleMode' key='label-noeditable'  style="cursor: pointer !important;" @click='toggleEditableComponent'>{{label}}</label>
        <md-select v-if='typeof list[0]==="object"'   :value='value'  :name="name"  @input="triggerFunc($event,name)">
            <md-option v-for='item of list' :key='item[valueName[0]]' :value="item[valueName[1]]">{{`${trim?'':item[valueName[0]]} ${withSpan?item[valueName[1]]:''}`}}</md-option>
        </md-select >
        <md-select v-else  :name="name"  @input="triggerFunc($event,name)">
            <md-option v-for='(item,index) of list' :key='index' :value="item">{{item}}</md-option>
        </md-select >
         <span v-if='!editebleMode' class='md-error'>{{isErrors?'Required':''}}</span>
         <span v-if='editebleMode' class="md-suffix" key='input-editable' style="display: inline-block; white-space: nowrap;">
            <md-button v-close-popover @click.prevent="makeAction" v-show="isEditable" class="md-simple md-just-icon md-round md-sm md-success" style="padding: 0; margin: 0; text-align: right;"><md-icon>check</md-icon></md-button>
            <md-button v-close-popover @click.prevent="toggleEditableComponent" v-show="isEditable" class="md-simple md-just-icon md-round md-sm md-red" style="padding: 0; margin: 0; text-align: right;"><md-icon>close</md-icon></md-button>
            <md-button v-close-popover v-show="!isEditable" class="inline-edit md-simple md-just-icon md-round fa fa-edit button-height" @click='toggleEditableComponent'>
                <md-icon>edit</md-icon>
            </md-button>
      </span>
    </md-field>
</template>
<script>
export default {
  name: 'Select',

  model: {
  },
  props: {
    list: Array,
    required: Boolean,
    type: String,
    label: String,
    title: String,
    placeholder: String,
    icon: String,
    disabled: Boolean,
    labelStyle: String,
    for: String,
    name: String,
    onChange: Function,
    valueName: Array,
    isErrors: Boolean,
    withSpan: Boolean,
    trim: Boolean,
    editebleMode: Boolean,
    isEditable: Boolean,
    actionFunc: Function,
    ctx: Object,
    value: String,
    fieldStyle: String
  },
  methods: {
    triggerFunc: function (value, name) {
      this.onChange(value, name)
    },
    toggleEditableComponent () {
    },
    makeAction () {
      this.actionFunc(this.ctx, this.name)
    }

  }
}
</script>
<style lang="scss" scoped>
.required-logo{
        color:red;
    }
   .md-disabled {
    cursor: pointer;
  }

  .md-field .inline-edit {
    visibility: hidden;
  }

  .md-field:hover {
    .inline-edit {
      visibility: visible;
    }
  }

  .md-input {
    width: 80% !important;
    padding: 0 !important;
    margin-top: auto !important;
    margin-bottom: auto !important;
    cursor: pointer !important;
  }

  .md-select >.md-icon {
    display: none !important;
  }
  .md-field.without-border:after {
     height: 0px;
}
.button-height{
      height: 20px;
}
</style>
