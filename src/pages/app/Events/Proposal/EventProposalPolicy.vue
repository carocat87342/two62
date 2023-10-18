<template>
    <div>
        <CollapsePanel  :spacing="10">
            <template slot="header">
                <div class="p-20 font-size-18 font-bold-extra bg-light-gray border-top">
                    Health Policy
                </div>
            </template>
            <template slot="content">
                <md-divider></md-divider>
                <div class="px-20">
                    <template v-if="proposal.vendor.healthPolicy">
                        <p class="m-0 py-10 font-size-14">What would you like to take from our suggested services?</p>
                        <div class="font-bold-extra font-size-14">
                            <span>COVID 19</span>
                            - Exceptional Policy
                        </div>
                        <p class="m-0 py-10 font-size-14">
                            {{ proposal.vendor.healthPolicy }}
                        </p>
                    </template>
                    <template v-if="proposal.vendor.guaranteed && proposal.vendor.guaranteed.length">
                        <md-divider></md-divider>
                        <div class="mt-10 font-bold-extra">Guaranteed with every staff member:</div>
                        <div class="md-layout mt-10">
                            <div
                                v-for="option in guaranteedOptions"
                                class="md-layout-item md-size-30 md-small-size-100 py-10"
                                :key="option.value"
                                :style="{ display: proposal.vendor.guaranteed.includes(option.value) ? '' : 'none' }"
                            >
                                <div v-if="proposal.vendor.guaranteed.includes(option.value)" class="d-flex align-center font-size-14">
                                    <img class="mr-10" :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`" width="24px" />
                                    {{ option.label }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

            </template>
        </CollapsePanel>
        <CollapsePanel :spacing="10">
            <template slot="header">
                <div class="p-20 font-size-18 font-bold-extra border-top">
                    Our Policy
                </div>
            </template>
            <template slot="content">
                <md-divider></md-divider>
                <div class="policy-content px-20">
                    <div class="font-size-14 py-10"><b>We charge deposit of</b>:50% of the total event</div>
                    <div class="bg-light-pink pl-10 py-10 font-size-14">
                        Our Policy
                    </div>
                    <div class="rules mt-10">
                        <div class="rule" v-for="(policy, yIndex) in validPolicy" :key="yIndex">
                            <div class="item font-siz">{{ policy.name }}</div>
                            <div class="item" v-if="policy.type === 'MultiSelection'">
                <span class="mr-10" v-for="(v, vIndex) in policy.value">{{
                        `${v}${vIndex == policy.value.length - 1 ? "" : ","}`
                    }}</span>
                            </div>
                            <div class="item" v-else-if="policy.type === 'Including'">
                                <span class="mr-10" v-if="policy.value"> Yes </span>
                                <span class="mr-10" v-if="!policy.value && policy.cost"> {{ `$ ${policy.cost}` }} </span>
                            </div>
                            <div class="item text-right" v-else>
                                <span v-if="policy.type === 'Number' && !policy.isPercentage && policy.unit !== 'hour'">$</span>
                                <span v-if="policy.type === 'Boolean'">
                                  <img
                                      v-if="policy.value === true"
                                      :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`"
                                      class="page-icon"
                                  />
                                  <img v-else :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`" class="page-icon"/>
                                                    <!-- {{ policy.value === true ? "Yes" : "No" }} -->
                                </span>
                                                <span v-else>
                                  <img
                                      class="page-icon"
                                      v-if="policy.value === true"
                                      :src="`${$iconURL}Vendor Signup/Group 5479 (2).svg`"
                                  />
                                  <img
                                      class="page-icon"
                                      v-else-if="policy.value === false"
                                      :src="`${$iconURL}Vendor Signup/Group 5489 (4).svg`"
                                  />
                                  <span v-else>{{ policy.value }}</span>
                                </span>
                                <span v-if="policy.unit === 'hour'">Hour{{ policy.value > 1 ? "s" : "" }}</span>
                                <span v-if="policy.isPercentage">%</span>
                                <span class="ml-50" v-if="policy.hasOwnProperty('attendees')"> {{ policy.attendees }} attendees </span>
                            </div>
                        </div>
                    </div>
                    <div class="rules" v-if="additionalRules && additionalRules.length > 0">
                        <h5 class="font-bold font-size-20">Additional Rules</h5>
                        <div class="rule" v-for="(policy, yIndex) in additionalRules" :key="yIndex">
                            <div class="item">Event must be {{ policy }}</div>
                        </div>
                    </div>

                    <div class="bg-light-pink pl-10 py-10 mt-10 font-size-14">Our cancellation approach</div>


                    <div class="font-size-14 py-10">
                        <b>We allow free cancellation until:</b>
                        30 days before the event
                    </div>

                    <CancellationPolicy></CancellationPolicy>

                    <div class="side-label">
                        <div class="label-value">Act of God</div>
                    </div>
                    <div class="rules">
                        <span class="font-bold"> {{ proposal.vendor.companyName }}</span>
                        is not liable for any acts of God, dangerous incident to the sea, fires, acts of government or other
                        authorities, wars, acts of terrorism, civil unrest, strikes, riots, thefts, pilferage, epidemics,
                        quarantines, other diseases, climatic aberrations, or from any other cause beyond company’s control.
                    </div>

                    <div class="signature-section">
                        <div class="signature-section__vendor">
                            {{ proposal.vendor.vendorDisplayName }}
                        </div>
                        <div class="signature-section__image">
                            <img :src="proposal.vendor.signature" />
                        </div>
                    </div>
                </div>
            </template>
        </CollapsePanel>
        <CollapsePanel :spacing="10">
            <template slot="header">
                <div class="p-20 font-size-18 font-bold-extra bg-light-gray border-top">
                    Attachments
                </div>
            </template>
            <template slot="content">
                <md-divider></md-divider>
                <div v-if="attachments && attachments.length > 0" class="md-layout py-20 px-30">
                    <div class="md-layout-item md-size-30 md-small-size-100">
                        <div
                            class="attachment-tag my-5"
                            v-for="(attachment, index) in attachments.filter((attachement) => attachement.url)"
                            :key="index"
                        >
                            <img :src="`${$iconURL}common/pin-red.svg`" width="20px"/>
                            <a class="color-red font-size-16" :href="attachment.url" target="_blank">{{ attachment.name }}</a>
                        </div>
                    </div>
                </div>
            </template>
        </CollapsePanel>
    </div>
</template>
<script>
import { GuaranteedOptions } from "@/constants/options";

const components = {
    CollapsePanel: () => import("@/components/CollapsePanel.vue"),
    CancellationPolicy: () => import("@/components/CancellationPolicy"),
}

export default {
    components,
    props: {
        proposal: {
            type: Object,
        }
    },
    data(){
        return {
            guaranteedOptions: GuaranteedOptions,
        }
    },
    computed: {
        additionalRules() {
            return this.proposal.vendor.additionalRules;
        },
        validPolicy() {
            if (this.proposal.vendor.policies)
                return this.proposal.vendor.policies.filter(
                    (item) => item.hasOwnProperty("value") || (item.type === "Including" && item.cost),
                );
            return null;
        },
        attachments() {
            console.log('attachments', this.proposal.vendor.attachments);
            if (this.proposal.attachments && this.proposal.attachments.length > 0)
                return this.proposal.attachments;
            if (this.proposal.vendor.attachments && this.proposal.vendor.attachments.length > 0)
                return this.proposal.vendor.attachments;
            return [];
        },
    }
}
</script>
<style lang="scss" scoped>
.policy-content {
    margin-top: 1.5em;
    background: #fff;
    .rules {
        .rule {
            border-top: solid 1px #ddd;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0px;
            &:last-child {
                border-bottom: solid 1px #ddd;
            }

            .item{
                font-size: 14px;
            }
        }
    }
}
.signature-section {
    margin-top: 20px;

    &__vendor {
        font-size: 14px;
        font-weight: 800;
        color: #050505;
        text-decoration: underline;
    }
    &__image {
        img {
            width: 200px;
        }
    }
}

.attachment-tag {
    border: solid 1px #f51355;
    display: inline-block;
    padding: 15px;
    border-radius: 3px;
    margin-right: 10px;
}

.border-top{
    border: 1px solid #e7e9eb;
}
.bg-light-gray{
    background-color: #f8fafb;
}
</style>
