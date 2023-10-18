<template>
  <div class="policy-cont" id="Policy">
    <div class="rules">
      <div class="rules">
        <div class="rule" v-for="(policy, yIndex) in validPolicy" :key="yIndex">
          <div class="item">{{ policy.name }}</div>
          <div class="item" v-if="policy.type === 'MultiSelection'">
            <span class="mr-10" v-for="(v, vIndex) in policy.value">
              {{ `${v}${vIndex == policy.value.length - 1 ? "" : ","}` }}
            </span>
          </div>
          <div class="item" v-else-if="policy.type === 'Including'">
            <span class="mr-10" v-if="policy.value"> Yes </span>
            <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost}` }} </span>
          </div>
          <div class="item" v-else>
            <span v-if="policy.type === 'Number' && !policy.isPercentage">$</span>
            <span v-if="policy.value === true">Yes</span>
            <span v-else>{{ policy.value }}</span>
            <span v-if="policy.isPercentage">%</span>
            <span class="ml-50" v-if="policy.hasOwnProperty('attendees')"> {{ policy.attendees }} attendees </span>
          </div>
        </div>
      </div>
    </div>
    <div class="rules" v-if="additionalRules && additionalRules.length">
      <h5 class="font-bold font-size-20">Additional Rules</h5>
      <div class="rule" v-for="(policy, yIndex) in additionalRules" :key="yIndex">
        <div class="item">Event must be {{ policy }}</div>
      </div>
    </div>
    <div class="not-allowed" v-if="service.vendorCategory == 'venuerental'">
      <h5>We don't allow these 3rd party vendor:</h5>
      <p>{{ mergeStringItems(service.notAllowed) }}</p>
    </div>
    <div class="dont-work">
      <h5>We don't work on:</h5>
      <div class="item" v-if="mergeStringItems(vendor.selectedWeekdays)">
        <img :src="`${$iconURL}common/close-circle-outlined-purple.svg`" />
        {{ mergeStringItems(vendor.selectedWeekdays) }}
      </div>
      <div class="item" v-for="(d, dIndex) in vendor.exDonts" :key="dIndex">
        <img :src="`${$iconURL}common/close-circle-outlined-purple.svg`" />
        {{ d.holiday }}
      </div>
      <div class="item" v-if="vendor.dontWorkDays && vendor.dontWorkDays.length > 0">
        <img :src="`${$iconURL}common/close-circle-outlined-purple.svg`" />
        {{ dontWorkDays() }}
      </div>
      <div class="item" v-if="vendor.dontWorkTime">
        <img :src="`${$iconURL}common/close-circle-outlined-purple.svg`" />
        {{ dontWorkTime() }}
      </div>
    </div>
    <div v-if="vendor.healthPolicy || vendor.guaranteed && vendor.guaranteed.length"
       class="healthy-policy my-20">
      <h5 class="d-flex align-center">
          <img class="mr-10" :src="`${$iconURL}union-12.svg`" width="26px">
          Health policy</h5>
      <template v-if="vendor.healthPolicy">
          <div class="rule font-bold-extra my-20">
              <span class="color-vendor">COVID 19</span>
              - Exceptional Policy
          </div>
          <p class="width-66">
              {{vendor.healthPolicy}}
          </p>
      </template>
      <template v-if="vendor.guaranteed && vendor.guaranteed.length">
          <div class="mt-30 font-bold-extra">Guaranteed with every staff member:</div>
          <div class="md-layout mt-20">
              <div v-for="option in guaranteedOptions" class="md-layout-item md-size-30 py-10" :key="option.value"
                   :style="{display: vendor.guaranteed.includes(option.value)? '': 'none'}">
                  <div v-if="vendor.guaranteed.includes(option.value)" class="d-flex align-center">
                      <img class="mr-10" :src="`${$iconURL}common/checked-circle-purple.svg`" width="20px">
                      {{option.label}}
                  </div>
              </div>
          </div>
      </template>
    </div>
    <div class="section">
      <h5 class="subtitle">Our cancellation approach</h5>
      <div id="Policy">
        <div class="rules">
          <div class="rule" v-for="(policy, yIndex) in cancellationData" :key="yIndex">
            <div class="item">
              <span class="font-bold-extra">If</span> {{ policy.notice }}
              <span class="font-bold-extra">Then</span>
              {{ policy.vendorPayout }} <span class="font-bold-extra">and</span> {{ policy.cancellationFee }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "underscore";
import { capitalize } from "@/utils/string.util";
import { GuaranteedOptions, CancellationData } from "@/constants/options";
export default {
  props: {
    vendor: {
      type: Object,
      default: () => {},
    },
    service: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      cancellationData: CancellationData,
      guaranteedOptions: GuaranteedOptions,
    };
  },
  methods: {
    mergeStringItems(items) {
      let naItems = "";
      _.each(items, (n) => {
        if (n.constructor.name == "Object") {
          naItems += `${capitalize(n.name)}s, `;
        } else {
          naItems += `${capitalize(n)}s, `;
        }
      });
      naItems = naItems.substring(0, naItems.length - 2);
      return "All " + naItems;
    },
    dontWorkDays() {
      let selectedDates = "";
      _.each(this.service.dontWorkDays, (s) => {
        selectedDates += `${s.date}, `;
      });
      selectedDates = selectedDates.substring(0, selectedDates.length - 2);
      return selectedDates;
    },
    dontWorkTime() {
      return `${this.service.dontWorkTime.startTime.hh}:${this.service.dontWorkTime.startTime.mm}:${this.service.dontWorkTime.amPack.start} ~ ${this.service.dontWorkTime.endTime.hh}:${this.service.dontWorkTime.endTime.mm}:${this.service.dontWorkTime.amPack.end}`;
    },
  },
  computed: {
    validPolicy() {
      if (this.service.policies)
        return this.service.policies.filter((item) => item.value || (item.type === "Including" && item.cost));
      return null;
    },
    additionalRules() {
      return this.service.additionalRules;
    },
  },
};
</script>
<style lang="scss" scoped>
.policy-cont {
  .rules {
    margin: 3rem 0;
    .rule {
      padding: 2rem 0;
      border-bottom: 1px solid #dddddd;
      font: 600 16px Manrope-Regular, sans-serif;
      display: flex;
      align-items: center;

      .item {
        flex: 1;

        img {
          width: 30px;
        }
      }
      &:first-child {
        border-top: 1px solid #dddddd;
      }
    }
  }
  .not-allowed {
    h5 {
      font: 800 20px Manrope-Regular, sans-serif;
    }
    p {
      font: normal 16px Manrope-Regular, sans-serif;
    }
  }
  .dont-work {
    h5 {
      font: 800 20px Manrope-Regular, sans-serif;
    }
    .item {
      margin-bottom: 1rem;
      display: flex;
      img {
        width: 21px;
        margin-right: 1rem;
      }
    }
  }
  .healthy-policy{
    border-top: 1px solid #dddddd;
    h5 {
      font: 800 20px Manrope-Regular, sans-serif;
    }
    .item {
      margin-bottom: 1rem;
      display: flex;
      img {
          width: 21px;
          margin-right: 1rem;
      }
    }
  }
  .section {
    h5.subtitle {
      margin: 0;
      padding: 15px 53px 20px 55px;
      margin-left: -60px;
      background-color: #ededed;
      display: inline-block;
      font-size: 20px;
      font-weight: 800;
      text-transform: none;
    }
    h6 {
      font-size: 20px;
      font-weight: 800;
      margin-top: 30px;
      margin-bottom: 8px;
      text-transform: none;
    }
    p {
      font-size: 16px;
      margin: 0;
    }
    .semi-column {
      display: flex;
      margin-top: 35px;
      p {
        flex: 1;
        margin: 0;
        font-size: 16px;
        strong {
          font-size: 20px;
          font-weight: 800;
        }
      }
    }
    .additional {
      margin-top: 60px;

      h6 {
        font-size: 16px;
        font-weight: 800;
      }
      p {
        margin-top: 13px;
        font-size: 16px;
      }
    }
    .signature-wrapper {
      display: grid;
      grid-gap: 20%;
      grid-template-columns: 40% 40%;
      padding-top: 60px;

      .half-side {
        text-align: center;
        h6 {
          text-transform: capitalize;
          text-decoration: underline;
          font-size: 16px;
          font-weight: 800;
          margin: 0;
        }

        .signature-client {
          margin-top: 23px;
          min-width: 350px;
          min-height: 270px;
          border: 1px dashed #f51355 !important;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &:first-child {
          h6 {
            text-align: left;
          }
        }

        .upload-cont {
          a {
            margin: 0.5rem auto;
            display: inline-block;
            font: 800 14px Manrope-Regular, sans-serif;
            border: 1px solid #f51355;
            padding: 0.5rem;
            color: #f51355;
            cursor: pointer;
            img {
              width: 10px;
            }
          }
          .sign-here {
            .save,
            .clear {
              background-color: #ffffff;
              font: 800 14px Manrope-Regular, sans-serif;
              border: 1px solid #f51355;
              padding: 0.5rem;
              color: #f51355;
              cursor: pointer;
              margin-bottom: 0.5rem;
            }
          }
        }

        img {
          width: 100%;
          max-height: 162px;

          &.remove {
            width: 18px;
            cursor: pointer;
            position: absolute;
            right: 1rem;
            bottom: 3rem;
          }
        }
      }
    }
  }
}
</style>
