<template>
  <md-card
    class="md-card-tabs"
    :class="[{ 'flex-column': flexColumn }, { 'nav-pills-icons': navPillsIcons }, { 'md-card-plain': plain }]"
  >
    <md-card-content>
      <md-list class="nav-tabs md-card">
        <md-list-item
          v-for="(item, index) in tabName"
          @click="switchPanel(tabName[index])"
          :key="item"
          :class="[
            { active: isActivePanel(tabName[index]) },
            { [getColorButton(colorButton)]: isActivePanel(tabName[index]) },
            { [theme]: true },
          ]"
        >
          <div v-html="tabName[index]"></div>
          <md-icon v-if="navPillsIcons">{{ tabIcon[index] }}</md-icon>
        </md-list-item>
      </md-list>
      <transition name="fade" mode="out-in">
        <div class="tab-content">
          <template v-for="(item, index) in tabName">
            <template v-if="isActivePanel(tabName[index])">
              <div :class="getTabContent(index + 1)" :key="item">
                <slot :name="getTabContent(index + 1)"> This is the default text! </slot>
              </div>
            </template>
          </template>
        </div>
      </transition>
    </md-card-content>
  </md-card>
</template>

<script>
import _ from "underscore";

export default {
  props: {
    flexColumn: Boolean,
    navPillsIcons: Boolean,
    plain: {
      type: Boolean,
      default: true,
    },
    tabName: Array,
    tabIcon: Array,
    colorButton: {
      type: String,
      default: "",
    },
    syncRouter: Boolean,
    activeTab: {
      type: Number,
      default: 0,
    },
    theme: {
      type: String,
      default: "red",
    },
  },
  data() {
    return {
      activePanel: this.tabName[this.activeTab],
    };
  },
  computed: {},
  created() {
    console.log(this.tabName[this.activeTab]);
  },
  mounted() {
    this.$on("event-planner-nav-switch-panel", (index) => {
      this.switchPanel(this.tabName[index]);
    });

    this.$root.$on("goToTab", (value) => {
      this.activePanel = value;
    });

    if (this.syncRouter) {
      this.switchPanel(this.$route.query.t || 0);
    }
  },
  methods: {
    switchPanel(panel) {
      this.activePanel = panel;
      if (this.syncRouter && this.activePanel) {
        let panelIndex = _.findIndex(this.tabName, (t) => {
          return t === this.activePanel;
        });
        if (panelIndex > -1) {
          this.$router.push({
            query: {
              t: panelIndex,
            },
          });
        }
      }
    },
    isActivePanel(panel) {
      return this.activePanel === panel;
    },
    getColorButton: function (colorButton) {
      return "md-" + colorButton + "";
    },
    getTabContent: function (index) {
      return "tab-pane-" + index + "";
    },
  },
};
</script>

<style lang="css">
.nav-tabs.md-card {
  margin-top: 0px;
  /* width: 110%; */
  /* margin-left: -55px;
  padding-left: 55px; */
  margin-bottom: 0;
  justify-content: center;
}
.nav-tabs.md-card .md-list-item button {
  font-size: 20px !important;
  font-weight: normal !important;
}
.nav-tabs.md-card .md-card-content {
  padding: 0;
}
.tab-content {
  background-color: white;
  /* margin: 0 -2em !important; */
}
</style>

<style lang="scss" scoped>
.md-card-tabs {
  &.md-card {
    .md-list {
      .md-list-item {
        &-button {
          border-bottom: 2px solid rgba(0, 0, 0, 0);
          text-transform: capitalize;
          font-size: 20px;
          height: 100%;
          // margin-left: 50px;
          // margin-right: 50px;
          font-weight: normal;
        }
        &.red {
          &.active {
            .md-list-item-button {
              border-bottom-color: #f51355;
            }
          }
        }
        &.purple {
          &.active {
            .md-list-item-button {
              border-bottom-color: #641856;
            }
          }
        }
        &.active {
          .md-list-item-button {
            background: none !important;
            box-shadow: none;
            border-radius: 0;
            color: #000 !important;
            font-weight: bold;
            height: 100%;
          }
        }
      }
      img {
        height: 18px;
        width: auto;
        margin-right: 0.5em;
      }
    }
  }
  .nav-tabs.md-card {
    margin-left: auto;
    border-radius: 3px;
    background-color: white !important;
    border-bottom: 1px solid #e1e1e1;
    box-shadow: none;
  }
  .md-card-content {
    padding: 0;
  }
}
</style>
