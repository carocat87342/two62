<template>
  <div class="vendor-starting-fee-item-wrapper">
    <div class="collapsed" @click="expand()">
      <div class="d-flex justify-content-between w-100">
        <div>
          <div>
            <img
              :src="
                theme === 'red'
                  ? `${$iconURL}Vendor Signup/Group 5479 (2).svg`
                  : `${$iconURL}common/checked-circle-purple.svg`
              "
            />
            <span class="value label">{{ item.label }}</span>
          </div>
          <div v-if="item.dry === true" class="mt-5">Allowed Dry Run</div>
          <div v-if="item.dry === false" class="mt-5">Not Allowed Dry Run</div>
        </div>
        <div class="qty text-transform-capitalize">
          <span v-if="this.item.value && this.item.value.constructor.name !== 'Array'">{{ getQty() }}</span>
          <img v-if="item.desc" :src="`${$iconURL}NewSubmitPorposal/Group 4770 (2).svg`" />
          <img v-else :src="`${$iconURL}Vendor Signup/Asset 528.svg`" />
        </div>
      </div>
      <div
        class="text-transform-capitalize pl-40"
        v-if="this.item.value && this.item.value.constructor.name == 'Array'"
      >
        {{ getQty() }}
      </div>
    </div>

    <div class="expanded" v-if="expanded">{{ item.desc }}</div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "vendor-starting-fee-item",
  props: {
    item: Object,
    theme: {
      type: String,
      default: "red",
    },
  },
  components: {},
  data() {
    return {
      expanded: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    expand() {
      if (this.item.desc) {
        this.expanded = !this.expanded;
      }
    },
    getQty() {
      if (this.item.value) {
        if (this.item.value.constructor.name == "Array") {
          return this.item.value.join(", ");
        } else if (this.item.value.constructor.name == "String") {
          return this.item.value;
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },
  computed: {},
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-starting-fee-item-wrapper {
  font-family: Manrope-Regular, sans-serif;
  color: #050505;
  border-bottom: 1px solid #dddddd;
  cursor: pointer;

  .collapsed {
    width: 100%;
    padding: 2rem 0;
    .with-qty {
      text-align: right;
      span {
        margin-right: 2rem;
      }
    }
    img {
      width: 20px;

      &:first-child {
        margin-right: 1rem;
      }
    }
    span {
      flex: 1;
      display: inline-block;
      &.label {
        text-transform: capitalize;
      }
      &.value {
        font: 800 16px Manrope-Regular, sans-serif;
      }
      &.qty {
        font: normal 16px Manrope-Regular, sans-serif;
      }
    }
    &:nth-child(2n + 1) {
      margin-right: 1rem;
    }
  }
  .expanded {
    max-width: 40%;
    font: normal 14px Manrope-Regular, sans-serif;
    padding-bottom: 1rem;
  }
  .rotate-90 {
    transform: rotate(90deg);
  }
}
</style>
