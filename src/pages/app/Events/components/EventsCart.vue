<template>
  <div class="md-layout">
    <div class="md-layout-item md-size-25">
    <md-card class="md-card-profile">
        <div class='event-cart-header title-block'>
        <div class='title-div'>
        <div class='title'>{{title}}</div>
        </div>
        <div class='button-block'>
            <div>
            <md-icon class='icon'>attach_file</md-icon>
            </div>
            <div class='message-block'>
            <md-icon class='icon'>speaker_notes</md-icon>
            <div class='message-count-block'>            3
            </div>
            </div>
            <div>
            <md-icon class='icon'>restore_from_trash</md-icon>
            </div>
        </div>
        </div>
         <md-card-content>
        <div >
        <div >
        <span class='proposal-title'>{{0}}</span>
        <span class='proposal-title'>Proposal</span>
        </div>
        <div class='main-proposal-container'>
        <div class='proposal-block'>
        <span class='proposal-title proposal-number'>Allocated Budget</span>
        <span class='proposal-title proposal-number'>$10</span>
        </div>
        <div class='proposal-block'>
        <span class='proposal-title proposal-number'>Best Proposal</span>
        <span class='proposal-title proposal-number'>$10</span>
        </div>
        </div>
        </div>
         <div class="md-layout-item md-size-100">
          <div class="fc-divider" style="color: #eeeeee; margin: 15px 0;"></div>
         </div>
         <div>
          <span class='proposal-title proposal-footer'>Manage Proposals</span>
         </div>
         <div>
         </div>
        </md-card-content>
       </md-card>
    </div>
  </div>
</template>
<script>
// MAIN MODULES
import moment from 'moment'

// COMPONENTS

export default {
  name: 'event-cart',
  props: {
    title: {type: String, default: 'test'}
  },
  components: {

  },

  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  },
  computed: {
  },
  filters: {

  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.event-cart-header{
    height: 44px;
    background: red;
    border-radius: 10px 10px 0px 0px;
    &.title-block{
    display: flex;
    justify-content: space-between;
    }
    .title-div{
    display: flex;
    align-items: center;
    .title{
        opacity: 0.8;
        font-family: 'Roboto';
        font-size: 18px;
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        text-align: left;
        color: rgba(255, 255, 255, 0.8);
        margin-left: 15px;
    }
    }

}
.button-block{
    display: flex;
    align-items: center;
  .button-height{
      height: 20px;

}
}

.icon{
        color: white !important;
        cursor: pointer;
        margin: 0px 2px;
}
.button-main{
  background: #ee4784;
}
.proposal-title{
  opacity: 0.8;
  font-family: "Roboto";
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: rgba(149, 149, 149, 0.8);
}
.proposal-number{
    font-size: 15px;
    font-weight: 400;
}
.proposal-footer{
  font-size: 13px;
  font-weight: 500;
  color: #21c998;
}
.proposal-block{
    display: flex;
    justify-content: space-between;
}
.main-proposal-container{
  margin-top:21px;
}
.message-block{
  position:relative;
  .message-count-block{
    position: absolute;
    top: 0px;
    left: 18px;
    color: white;
    background: blue;
    width: 18px;
    height: 18px;
    border-radius: 10px;
}
}

</style>
