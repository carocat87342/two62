<template>
  <modal class="budget-handle-minus-model" >
    <template slot="header">
      <div class="model__header">
        <div class="font-size-30 arrow"><md-icon >arrow_back</md-icon></div>
        <div class="minus-value">-${{value | withComma}}</div>
        <h2>
          Oops, The changes you made <br/>
          have got you in the minus
        </h2>
        <div class="header-description">
          What would you like to do?
        </div>
      </div>
      
    </template>
    <template slot="body">
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
            <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="keep"><span calss="option-label">Keep me in minus for now</span></md-radio>
            <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="take"><span calss="option-label"></span> Take that money from ‘Unexpected’ category</md-radio>
            <md-radio v-model="selectedOption" class="md-layout-item md-size-100" value="add"><span calss="option-label"></span> Add more money</md-radio>
        </div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-red add-category-btn" @click="selectOption">Select</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal} from '@/components'
export default {
  name: "budget-handle-minus-modal",
  components: {
    Modal,
  },
  props: {
    show:[Boolean],
    value:[ Number ],
  },
  data: ()=>{
    return {
      selectedOption:"keep"
    }
  },
  methods: {
    selectOption() {
      this.$emit("select", this.selectedOption, this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-container {
  max-width: 900px !important;
}
.model__header {
  padding: 0px 20px;
  text-align: left !important;
  .arrow {
    margin: 10px 0px 20px;
    font-size: 40px;
    i {
      color: #050505 !important;
    }
  }
  .minus-value {
    font-family: "Manrope-Regular";
    font-size: 40px;
    color: #f51355;
  }
  h2 {
    font-family: "Manrope-ExtraBold";
    font-size: 30px;
  }
}
.md-layout {
  text-align: left !important;
  padding-left:15px;
  padding-bottom: 40px;
  .md-layout-item {
    padding-left:0px;
    .option-label {
      color: #050505 !important;
    }
  }
}
</style>