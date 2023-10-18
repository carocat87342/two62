<template>
  <div class="multistate-progress">
    <div class="guests-progress d-flex justify-content-center align-center">
      <div
        v-for="(item, index) in calculatedData"
        :key="index"
        class="guests-progress__item green"
        :style="`width : ${item.percentage}%; z-index:${calculatedData.length - index};`"
      >
        <div class="value">{{ item.list.length }}</div>
        <div class="progress" :style="`background-color:${item.color}`"></div>
        <div class="percentage" :style="`color:${item.color}`">{{ item.percentage }}%</div>
      </div>
      <!-- <div class="guests-progress__item red" style="width : 21%;">
        <div class="value">240</div>
        <div class="progress"></div>
        <div class="percentage">21%</div>
      </div>
      <div class="guests-progress__item gray" style="width : 13%;">
        <div class="value">120</div>
        <div class="progress"></div>
        <div class="percentage">13%</div>
      </div>-->
    </div>

    <div class="guests-legends d-flex justify-content-center align-center mt-60">
      <div v-for="(item, index) in data" :key="index" class="mb-40 flex-1">
        <popper trigger="hover" :options="{ placement: 'bottom' }" v-if="item.list.length > 0">
          <div class="popper white-card" v-if="item.category == 'accepted'">
            <div class="font-size-22 popper-header">
              <span :style="`background-color:${item.color}`" class="dot"></span>
              <span class="font-bold">{{ item.label }}</span>
              ({{ item.list.length }})
            </div>
            <div class="d-flex">
              <div class="left-column">
                <div
                  v-for="(item, index) in item.list.filter((item) => item.isMainGuest)"
                  :key="`main-${index}`"
                  class="item-row"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="right-column">
                <div
                  v-for="(item, index) in item.list.filter((item) => !item.isMainGuest)"
                  :key="`main-${index}`"
                  class="item-row"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="popper white-card" v-else>
            <div class="font-size-22 popper-header">
              <span :style="`background-color:${item.color}`" class="dot"></span>
              <span class="font-bold">{{ item.label }}</span
              >({{ item.list.length }})
            </div>
            <div v-for="(item, index) in item.list" :key="index" class="item-row">{{ item.email }}</div>
          </div>

          <color-dot-label :color="item.color" slot="reference" class="legend">
            <span class="font-bold">{{ item.label }}</span>
            ({{ item.list.length }})
            <md-icon class="color-black">keyboard_arrow_down</md-icon>
          </color-dot-label>
        </popper>
        <color-dot-label v-else :color="item.color" class="legend">
          <span class="font-bold">{{ item.label }}</span>
          ({{ item.list.length }})
          <md-icon class="color-black">keyboard_arrow_down</md-icon>
        </color-dot-label>
      </div>
    </div>
  </div>
</template>
<script>
import ColorDotLabel from "@/components/ColorDotLabel";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
export default {
  components: {
    ColorDotLabel,
    Popper,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      colors: ["#2cde6b", "#f3423a", "#ffc001", "#43536a", "#cbc8c8"],
    };
  },
  created() {
    const calculatedData = [];
    const total = this.data.reduce((s, item) => {
      return s + item.list.length;
    }, 0);
    this.data.forEach((item) => {
      if (!item.list.length) return;
      item.percentage = Math.round((item.list.length / total) * 100);
      calculatedData.push(item);
    });
    this.calculatedData = calculatedData;
    console.log(this.data);
  },
  computed: {
    percentage() {
      const total = this.data.reduce((s, item) => {
        return s + item.list.length;
      }, 0);
      return Array.from(this.data, (item) => (item.list.length / total) * 100);
    },
  },
};
</script>
<style lang="scss" scoped>
.multistate-progress {
  .guests-progress {
    &__item {
      text-align: center;
      font-size: 20px;
      .progress {
        border-radius: 0 100px 100px 0;
        &::before {
          background-color: inherit;
          content: "";
          width: 50px;
          height: 100%;
          display: block;
          transform: translateX(-30px);
          z-index: 5;
        }
      }
      &:first-child {
        z-index: 10;
        .progress {
          border-radius: 100px;
        }
        .progress::before {
          display: none;
        }
      }

      &:last-child {
        z-index: 1;
        .progress {
          border-radius: 0 100px 100px 0;
          &::before {
            background-color: inherit;
            content: "";
            width: 50px;
            height: 100%;
            display: block;
            transform: translateX(-30px);
          }
        }
      }
      &:first-child {
        .progress {
          border-radius: 100px;
          overflow: hidden;
        }
      }
      .value {
        font-weight: bold;
        color: #050505;
      }

      .progress {
        height: 30px;
        margin: 0.6em 0;
      }
      .percentage {
        font-weight: bold;
      }

      &.green {
        .progress {
          background-color: #2cde6b;
        }
        .percentage {
          color: #2cde6b;
        }
      }
      &.red {
        .progress {
          background-color: #f51355;
        }
        .percentage {
          color: #f51355;
        }
      }
      &.gray {
        .progress {
          background-color: #d5d5d5;
        }
        .percentage {
          color: #d5d5d5;
        }
      }
    }
  }
  .guests-legends {
    .legend {
      cursor: pointer;
    }
    .popper {
      background-color: white;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      padding: 40px;
      text-align: left;
      .popper-header {
        margin-bottom: 20px;
        .dot {
          display: inline-block;
          border-radius: 50%;
          width: 15px;
          height: 15px;
        }
      }
      .item-row {
        padding: 5px 0;
      }
      .left-column {
        padding-right: 20px;
        border-right: solid 1px #e2e2e2;
      }
      .right-column {
        padding-left: 20px;
      }
    }
  }
}
</style>