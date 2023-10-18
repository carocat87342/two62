<template>
  <md-card class="md-card-tabs components-card"
    :class="[
      {'flex-column': flexColumn},
      {'nav-pills-icons': navPillsIcons},
      {'md-card-plain': plain}
    ]">
    <!--<md-card-header>
      <slot name="header-title"></slot>
    </md-card-header>-->

    <md-card-content style="padding: 0;">
      <div class="component-header" >
        <h3 class="title" style="font-weight: bold;">{{ componentTitle }} <small class="md-small text-gray" style="margin: 0 4px;"><i class="fa fa-chevron-right"></i></small></h3>
        <md-list class="nav-tabs" style="margin-right: auto; margin-left: 0; padding:0;" >
          <md-list-item
            v-for="(item, index) in tabName"
            @click="switchPanel(tabName[index])"
            :key="item"
            :class="[
              {active: isActivePanel(tabName[index])},
              {[getColorButton(colorButton)]: isActivePanel(tabName[index])}]">
              {{tabName[index]}}
            <md-icon v-if="navPillsIcons">{{tabIcon[index]}}</md-icon>
          </md-list-item>
        </md-list>
        <div class="actions-wrapper">
          <!--<md-button class="md-just-icon md-simple" @click.native='showInspirations()' v-if="!readonly && componentObjectId">
            <md-icon>reorder</md-icon>
          </md-button>-->
          <md-button class="md-just-icon md-simple" @click.native="showSwalComponent()" v-if="!readonly">
            <md-icon>close</md-icon>
          </md-button>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <div class="components-tab-content">
          <template v-for="(item, index) in tabName">
            <template v-if="isActivePanel(tabName[index])">
              <div :class="getTabContent(index + 1)" :key="item">
                <slot :name="getTabContent(index + 1)">
                  This is the default text!
                </slot>
              </div>
            </template>
          </template>
        </div>
      </transition>
    </md-card-content>
  </md-card>
</template>

<script>
export default {
  props: {
    flexColumn: Boolean,
    navPillsIcons: Boolean,
    plain: Boolean,
    tabName: Array,
    tabIcon: Array,
    componentTitle: String,
    readonly: Boolean,
    showInspirations: Function,
    componentObjectId: String,
    showSwalComponent: Function,
    colorButton: {
      type: String,
      default: ''
    }
  },
  name: 'event-tabs',
  data () {
    return {
      activePanel: this.tabName[0]
    }
  },
  computed: {},
  methods: {
    switchPanel (panel) {
      this.activePanel = panel
    },
    isActivePanel (panel) {
      return this.activePanel === panel
    },
    getColorButton: function (colorButton) {
      return 'md-' + colorButton + ''
    },
    getTabContent: function (index) {
      return 'tab-pane-' + index + ''
    }
  }
}
</script>

<style lang="scss">
  .components-card.md-card {
    box-shadow: 0 0 0 0 transparent;
    margin: 0;
  }
  .component-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      text-align: left;
    }
    .actions-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .components-tab-content {
    text-align: left;
  }
  .md-card-tabs.components-card .md-list .md-list-item .md-list-item-button {
    min-width: 60px;

    .md-list-item-content {
      padding: 2px 8px;
    }
  }
</style>
