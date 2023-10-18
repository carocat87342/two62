<template>
  <div class="md-layout text-left">

    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-blue md-card-header-flex">
          <div class="card-text">
            <h4 class="title">Important Dates</h4>
          </div>
        </md-card-header>
        <md-card-content style="text-align: left;">
          <collapse
            :collapse="[
              'Oct 19th : Happy Birthday - Alan Gur',
              'Oct 22nd : Happy Hour',
              'Nov 7th : Baby Shower - Jane Smith',]"
            icon="keyboard_arrow_down"
            color-collapse="success">
            <template slot="md-collapse-pane-1">
              <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
            </template>
            <template slot="md-collapse-pane-2">
              <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
            </template>
            <template slot="md-collapse-pane-3">
              <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
            </template>
          </collapse>
        </md-card-content>
      </md-card>
    </div>

    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50">
      <md-card class="bg-rose">
        <md-card-content>
          <h1>Rock Stars</h1>
        </md-card-content>
      </md-card>
    </div>

    <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
      <md-card>
        <md-card-header class="md-card-header-text md-card-header-blue md-card-header-flex">
          <div class="card-text">
            <h4 class="title">Our Story</h4>
          </div>
        </md-card-header>
        <md-card-content>
          <div class="md-layout">
            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
              <md-card class="md-card-stats md-red" style="padding-top: 20px; padding-bottom: 20px; border-color: blue; box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.4);">
                <md-card-content style="text-align: center;">
                  <h1 class="title text-rose"><strong><animated-number :value="12"></animated-number></strong></h1>
                  <h4 class="title text-gray">Company Events</h4>
                  <div class="stats text-gray mt-4" style="width: 80%;text-align: center;text-transform: capitalize; margin-left: auto; margin-right: auto;">
                    <slider value="26" :disabled="true"></slider>
                    Same as <strong class="text-info">26%</strong> of companies your size
                  </div>
                </md-card-content>
              </md-card>
            </div>

            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
              <md-card class="md-card-stats md-red" style="padding-top: 20px; padding-bottom: 20px; box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.4);">
                <md-card-content style="text-align: center;">
                  <h1 class="title text-rose"><strong><animated-number :value="83"></animated-number></strong>%</h1>
                  <h4 class="title text-gray">Event Attendance</h4>
                  <div class="stats text-gray mt-4" style="width: 80%;text-align: center;text-transform: capitalize; margin-left: auto; margin-right: auto;">
                    <slider value="54" :disabled="true"></slider>
                    Same as <strong class="text-info">54%</strong> of companies your size
                  </div>
                </md-card-content>
              </md-card>
            </div>

            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
              <md-card class="md-card-stats md-red" style="padding-top: 20px; padding-bottom: 20px; box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.4);">
                <md-card-content style="text-align: center;">
                  <h1 class="title text-rose">$<strong><animated-number :value="45"></animated-number></strong></h1>
                  <h4 class="title text-gray">Spend per Employee</h4>
                  <div class="stats text-gray mt-4" style="width: 80%;text-align: center;text-transform: capitalize; margin-left: auto; margin-right: auto;">
                    <slider value="21" :disabled="true"></slider>
                    Same as <strong class="text-info">21%</strong> of companies your size
                  </div>
                </md-card-content>
              </md-card>
            </div>

            <div class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-50">
              <md-card class="md-card-stats md-red" style="padding-top: 20px; padding-bottom: 20px; box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.4);">
                <md-card-content style="text-align: center;">
                  <h1 class="title text-rose"><strong><animated-number :value="91"></animated-number></strong></h1>
                  <h4 class="title text-gray">Level of Satisfaction</h4>
                  <div class="stats text-gray mt-4" style="width: 80%;text-align: center;text-transform: capitalize; margin-left: auto; margin-right: auto;">
                    <slider value="75" :disabled="true"></slider>
                    More than <strong class="text-info">75%</strong> of companies your size
                  </div>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>

import {
  StatsCard,
  ChartCard,
  AnimatedNumber,
  Slider,
  Collapse
} from '@/components'

export default {
  components: {
    StatsCard,
    ChartCard,
    AnimatedNumber,
    Slider,
    Collapse
  },
  data () {
    return {
      sliders: {
        simple: 26,
        rangeSlider: [20, 60]
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .noUi-horizontal {
    height: 6px;
  }
  .noUi-origin .noUi-handle {
    width: 24px !important;
    height: 24px !important;;
    top: -10px !important;;
  }
  .md-card .md-card-actions {
    border-top: none;
  }
  .bg-rose {
    background-color: #f8bbd0;
  }
</style>
