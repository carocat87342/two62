<template>
 <div>
    <div class="md-layout mb16"  v-for="(item,index) in DateList " :key="item.id">

        <div class="md-layout-item md-size-30" style="padding-right:0px; padding-left:0px;">
            <md-field style="width:100%">
                <label>title</label>
                <md-input v-model="item.title"  style="width:100%" :disabled="item.editable"/>
            </md-field>
        </div>
        <div class="md-layout-item md-size-50" style="padding-right:0px; padding-left:0px;">
            <md-datepicker id="datePicker" v-model="item.selectedDate"  />
        </div>
        <div class="md-layout-item md-size-10 add-date" style="padding-right:0px; padding-left:15px; " @click="saveItem(index)">
            <md-icon style="font-size: 19px !important; color: green; margin-top: 20px;" >done</md-icon>
        </div>
        <div class="md-layout-item md-size-10 add-date" style="padding-right:0px; padding-left:15px; " @click="deleteItem(index)">
            <md-icon style="font-size: 19px !important; color: red; margin-top: 20px;">delete</md-icon>
        </div>

        <md-dialog-confirm
        :md-active.sync="dialogFlag"
        md-title="remove special date Item"
        md-content="Are you sure you want delete this Item ?"
        md-confirm-text="Agree"
        md-cancel-text="Disagree"
        @md-cancel="onCancel"
        @md-confirm="confirmDelete" />
    </div>
 </div>
</template>

<script>
export default {
  components: {

  },
  data () {
    return {
      title: '',
      selectedDate: null,
      dialogFlag: false,
      disableChangeDataFlag: false,
      indexItem: null
    }
  },
  props: {
    item: Object,
    index: Number,
    DateList: Array
  },
  methods: {
    saveItem (index) {
      this.DateList[index].editable = true
    },
    deleteItem (index) {
      this.dialogFlag = !this.dialogFlag
      this.indexItem = index
    },
    disagreeRemoveItem () {
      this.dialogFlag = false
    },
    confirmDelete () {
      this.dialogFlag = false
      this.DateList.splice(this.indexItem, 1)
      this.indexItem = null
    }
  }
}
</script>

<style lang="scss">
    .add-date:hover {
        cursor: pointer;
    }

    input{
        width: 100%
    }

</style>
