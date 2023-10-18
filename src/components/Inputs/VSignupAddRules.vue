<template>
  <div class="v-signup-add-rules-wrapper">
    <template v-if="comType == 'rule'">
      <div class="add-rule-cont">
        <h4>{{ title.title }}</h4>
        <div class="field" :class="{ suffix: focusedRule != '' }">
          <input :placeholder="title.placeholder" ref="additionalRule" v-model="focusedRule" />
          <a :disabled="true" @click="addRule()" :class="`${theme}`">Add</a>
        </div>
        <div class="rules-cont" v-if="rules.length > 0">
          <div class="rule" v-for="(r, rIndex) in rules" :key="rIndex">
            <span>Event must be {{ r }}</span>
            <div class="actions">
              <img :src="`${iconUrl}Asset 527.svg`" @click="editRule(r)" />
              <img :src="`${iconUrl}Asset 529.svg`" @click="removeRule(r)" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="cancel-policy-cont">
        <div class="title-cont">
          <h4>{{ title.title }}</h4>
          <span>{{ title.subTitle }}</span>
        </div>
        <div class="input-cont">
          <div class="ifthan">
            <div>
              <span>
                <strong>If</strong>
                {{ title.labels.if }}
              </span>
            </div>
            <input :placeholder="title.placeholder.if" ref="ifPolicy" v-model="focusedCancelPolicy.if" />
          </div>
          <div class="arrow">
            <img :src="`${iconUrl}Group 4585 (2).svg`" />
          </div>
          <div class="ifthan">
            <div>
              <span>
                <strong>Than</strong>
                {{ title.labels.than }}
              </span>
            </div>
            <input :placeholder="title.placeholder.than" ref="thanPolicy" v-model="focusedCancelPolicy.than" />
          </div>
          <div class="action">
            <a :disabled="true" @click="addCancelPolicy()">Add</a>
          </div>
        </div>
        <div class="policies-cont" v-if="policies.length > 0">
          <div class="policy" v-for="(p, pIndex) in policies" :key="pIndex">
            <div class="pitem">
              <b>If</b>
              {{ p.if }}
            </div>
            <div class="pitem">
              <b>Than</b>
              {{ p.than }}
            </div>
            <div class="actions">
              <img :src="`${iconUrl}Asset 527.svg`" @click="editCancelPolicy(p)" />
              <img :src="`${iconUrl}Asset 529.svg`" @click="removeCancelPolicy(p)" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import VueElementLoading from "vue-element-loading";

export default {
  name: "v-signup-add-rules",
  components: {
    VueElementLoading,
  },
  props: {
    comType: String,
    title: Object,
    defaultRules: {
      type: Array,
      default: () => [],
    },
    theme: {
      type: String,
      default: "red",
    },
    isMainService: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      rules: [],
      policies: [],
      focusedRule: null,
      focusedCancelPolicy: {
        if: null,
        than: null,
      },
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
    };
  },
  mounted() {
    this.rules = this.defaultRules || [];
  },
  methods: {
    addCancelPolicy() {
      this.policies.push({
        if: this.$refs.ifPolicy.value,
        than: this.$refs.thanPolicy.value,
      });
      this.$refs.ifPolicy.value = null;
      this.$refs.thanPolicy.value = null;
      this.focusedCancelPolicy = {
        if: null,
        than: null,
      };
    },
    editCancelPolicy(p) {
      this.focusedCancelPolicy = this.policies.filter((policy) => policy == p)[0];
      this.policies = this.policies.filter((policy) => policy != p);
    },
    removeCancelPolicy(p) {
      this.policies = this.policies.filter((policy) => policy != p);
    },
    addRule() {
      console.log(this.$refs.additionalRule.value);
      this.rules.push(this.$refs.additionalRule.value);
      this.$refs.additionalRule.value = null;
      this.focusedRule = null;
      if (this.isMainService)
        this.$store.commit("vendorSignup/setField", { field: "additionalRules", value: this.rules });
      else this.$store.commit("vendorService/setField", { field: "additionalRules", value: this.rules });
    },
    editRule(r) {
      this.focusedRule = this.rules.filter((rule) => rule == r)[0];
      this.rules = this.rules.filter((rule) => rule != r);
      this.$store.commit("vendorSignup/setField", { field: "additionalRules", value: this.rules });
    },
    removeRule(r) {
      this.rules = this.rules.filter((rule) => rule != r);
      if (this.isMainService)
        this.$store.commit("vendorSignup/setField", { field: "additionalRules", value: this.rules });
      else this.$store.commit("vendorService/setField", { field: "additionalRules", value: this.rules });
    },
  },
};
</script>
<style lang="scss" scoped>
.v-signup-add-rules-wrapper {
  width: 100%;
  color: #050505;

  .add-rule-cont {
    h4 {
      margin: 0 0 0.5rem 0;
      text-transform: capitalize;
      font: 800 16px Manrope-Regular, sans-serif;
    }

    .field {
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 100%;
        border: 1px solid #707070;
        border-radius: 0;
        margin-right: 1rem;
      }

      a {
        font: 800 16px Manrope-Regular, sans-serif;
        color: #ffffff;
        border-radius: 3px;
        padding: 13px 2rem;
        cursor: pointer;

        &.red {
          background-color: #f51355;
        }
        &.purple {
          background-color: #641856;
        }
        &:hover {
          color: #dddddd !important;
        }
      }
    }
    .suffix {
      &:before {
        content: "Event must";
        position: absolute;
        margin-left: 2rem;
        border-right: 1px solid #818080;
        padding-right: 7px;
      }
      input {
        padding-left: 8rem;
      }
    }
    .rules-cont {
      margin-top: 2rem;
      .rule {
        padding: 2rem 0;
        border-top: 1px solid #818080;
        border-bottom: 1px solid #818080;
        display: flex;
        justify-content: space-between;

        span {
          font: 800 16px Manrope-Regular, sans-serif;
        }

        .actions {
          img {
            cursor: pointer;
            &:first-child {
              width: 21px;
              margin-right: 1rem;
            }
            &:last-child {
              width: 19px;
            }
          }
        }
      }
    }
  }
  .cancel-policy-cont {
    .title-cont {
      display: flex;
      align-items: center;
      margin: 0 0 0.5rem 0;
      h4 {
        margin: 0 1rem 0 0;
        font: 800 16px Manrope-Regular, sans-serif;
      }
      span {
        font: normal 14px Manrope-Regular, sans-serif;
      }
    }
    .input-cont {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 2rem;

      .ifthan {
        flex: 4;
        span {
          strong {
            font: 800 22px Manrope-Regular, sans-serif;
            margin-right: 0.5rem;
          }
          font: normal 16px Manrope-Regular, sans-serif;
        }
        input {
          font-size: 16px;
          padding: 22px 30px;
          width: 100%;
          border: 1px solid #707070;
          border-radius: 0;
          margin-right: 1rem;
        }
      }
      .arrow {
        flex: 1;
        text-align: center;
        padding-bottom: 1rem;
        img {
          width: 30px;
        }
      }
      .action {
        flex: 1;
        text-align: right;

        a {
          display: inline-block;
          font: 800 16px Manrope-Regular, sans-serif;
          color: #ffffff;
          background-color: #f51355;
          border-radius: 3px;
          padding: 13px 2rem;
          cursor: pointer;

          &:hover {
            color: #dddddd !important;
          }
        }
      }
    }
    .policies-cont {
      margin-top: 2rem;
      .policy {
        display: flex;
        justify-content: space-between;
        padding: 2rem 0;
        border-top: 1px solid #818080;
        border-bottom: 1px solid #818080;

        .pitem {
          font: normal 16px Manrope-Regular, sans-serif;
          b {
            margin-right: 0.5rem;
          }
        }
        .actions {
          img {
            cursor: pointer;
            &:first-child {
              width: 21px;
              margin-right: 1rem;
            }
            &:last-child {
              width: 19px;
            }
          }
        }
      }
    }
  }
}
</style>
