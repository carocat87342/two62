<template>
  <div class="maryoku-popup">
    <div class="popup-target" @mouseenter="show">
      <slot name="content"></slot>
    </div>
    <div class="popup" :class="{open : showPopup}">
      <slot name="popup">
        <div class="popup-footer" v-if="showButtons">
          <md-button class="md-red md-simple normal-btn" @click="showPopup=false">Yes I'm sure</md-button>
          <md-button class="md-red normal-btn" @click="deleteTips">Yes I'm sure</md-button>
        </div>
      </slot>
      <md-button class="popup-close md-button md-simple edit-btn md-theme-default" @click="showPopup=false">
        <md-icon class="popup-close-icon">close</md-icon>
      </md-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "maryoku-popup",
  props:{
    showButtons:[Boolean]
  },
  data:()=>({
    showPopup:false,
  }),
  methods:{
    show() {
      this.showPopup = true
    },
    hide() {
      this.showPopup = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .maryoku-popup {
    position: relative;
    .open {
      display: block;
       transition: display 1s;
    }
    .popup {
      display: none;
      transition: display 0.5s;
      background: #FFF;
      position: absolute;
      left: 50%;
      z-index: 99;
      min-width: 450px;
      padding: 35px;
      z-index: 99;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.23);
      border-radius: 2px;
      -webkit-animation: fadeinout 0.5s linear forwards;
      animation: fadeinout 0.5s linear forwards;
      &-target {
        cursor: pointer;
      }
      &-header {
        font-family: "Manrope-ExtraBold";
        font-size: 22px;
        color: #050505;
        margin-bottom:30px;
      }
      &-close {
        position: absolute;
        right:30px;
        top: 30px;
        
        &-icon {
          color: #050505 !important;
          font-size: 30px !important;
        }
      }
      &-footer {
        margin-top: 30px;
        text-align: right;
      }
      &.open {
        display: block;
      }
    }
    @-webkit-keyframes fadeinout {
      0%{ opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes fadeinout {
       0%{ opacity: 0; }
      100% { opacity: 1; }
    }
  }
</style>