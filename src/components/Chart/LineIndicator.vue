<template>
<div >
<div class='indecator-event-block' v-if='isRate&&isNoDataRate'>
<div class='indicator-event-info-block-rate'>
<span class='indicator-event-type-title-rate'>{{categoryEvent}}</span>
</div>
<div><span class='indicator-event-info-number-currentV'>{{`${Math.floor(leftWidth)}%`}}</span></div>
</div>
<div class='indecator-event-block' v-if='!isRate&&isNoData'>
<div class='indicator-event-info-block'>
<div class='indicator-event-type-title'>{{typeEvent}}</div>
<div class='indicator-event-date-title'>{{eventDate}}</div>
</div>
<div v-if='isNoData'><span class='indicator-event-info-number-currentV'>{{currentValue}}</span>/<span class='indicator-event-info-number-total'>{{total}}</span></div>
</div>
<div class='indicator-block' v-if='!isRate&&isNoData'>
<div class='indicator-line' :class='leftIndicatorStyle' :style="{  width: leftWidth + '%' }"/>
<div class='indicator-line' :class='rightIndicatorStyle' :style="{  width: rightWidth + '%' }"/>
</div>
<div class='indicator-block' v-if='isRate&&isNoDataRate'>
<div class='indicator-line' :class='leftIndicatorStyle' :style="{  width: leftWidth + '%' }"/>
<div class='indicator-line' :class='rightIndicatorStyle' :style="{  width: rightWidth + '%' }"/>
</div>
<div v-if='!isRate&&!isNoData'>{{'No data yet, add your events'}}<span><router-link to="/events"> now</router-link></span></div>
<div v-if='isRate&&!isNoDataRate'>{{'No data yet, add your events'}}<span><router-link to="/events"> now</router-link></span></div>
</div>
</template>
<script>
export default {
  name: 'LineIndicator',
  data () {
    return {

    }
  },
  props: {
    text: String,
    buttonStyle: String,
    onClick: Function,
    total: String,
    currentValue: String,
    leftSide: Number,
    leftIndicatorStyle: String,
    rightIndicatorStyle: String,
    isRate: Boolean,
    eventDate: {type: String, default: ''},
    typeEvent: String,
    categoryEvent: String
  },
  computed: {
    leftWidth () {
      if (this.currentValue * 100 / this.total) {
        return this.currentValue * 100 / this.total
      } else {
        return 0
      }
    },
    rightWidth () {
      if (this.currentValue && this.total) {
        return 100 - this.currentValue * 100 / this.total
      } else {
        return 100
      }
    },
    isNoData () {
      return Boolean(this.typeEvent && this.currentValue && this.total)
    },
    isNoDataRate () {
      return Boolean(this.categoryEvent && this.currentValue && this.total)
    }
  },
  methods: {

  }
}
</script>
<style lang="scss">
    .indicator-block{
        display: flex;
        margin: 5px 0px

    }
    .icon-control-panel{
        cursor:pointer;
    }
    .indicator-line{
        height: 12px;;
    }
    .indecator-event-block{
        display: flex;
        justify-content: space-between;
    }
    .indicator-event-date-title{
       font-size: 0.64rem;
        font-weight: 500;
        color:#c6c6c6
    }
    .indicator-event-type-title{
        width: 238px;
        height: 11px;
        font-family: 'Roboto';
        font-size: 12px;
        font-weight: 300;
        font-style: normal;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: normal;
        text-align: left;
        color: #292929;
    }
    .indicator-event-info-block{
        display:flex;
        flex-direction: column;
        line-height: 0.84rem;
    }
    .indicator-event-info-number-total{
        font-family: "Roboto";
        font-size: 14px;
        font-weight: 300;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.71;
        letter-spacing: normal;
        text-align: left;
        color: #999999;
    }
    .indicator-event-info-number-currentV{
        font-family: "Roboto";
        font-size: 14px;
        font-weight: 300;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.71;
        letter-spacing: normal;
        text-align: left;
        color: #000000;
    }
    .indicator-event-info-block-rate{
        display:flex;
        flex-direction: column;
        line-height: 0.84rem;
            justify-content: center
    }
    .indicator-event-type-title-rate{
        font-size: 0.85rem;
        font-weight: 500;
        color:#c6c6c6
    }
    .right-side-indicator{
    background: #f7f7f7;
  }
  .left-side-indicator-participants{
    background: #21c4d7;
  }
  .left-side-indicator-rate{
    background:#ffa322;
  }
</style>
