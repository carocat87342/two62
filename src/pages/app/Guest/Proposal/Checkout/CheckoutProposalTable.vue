<template>
    <collapse-panel :defaultStatus="false" class="checkout-proposal-table" v-if="extraServices && extraServices.length">
        <template slot="header">
            <div class="price-header">
                <div class="d-flex align-center">
                    <img class="mr-10" :src="`${$iconURL}Budget+Elements/${serviceCategory.icon}`" width="35px"/>
                    {{serviceCategory.fullTitle}}
                </div>
                <div class="ml-auto">
                    <div class="element-price">${{ finalPrice | withComma }}</div>
                </div>
            </div>
        </template>
        <template slot="content" v-if="extraServices && extraServices.length">
            <div class="proposal-table-content">

                <div>Would you like to upgrade & add one of those?</div>
                <div class="mb-30" v-if="proposal.serviceCategory">
                    You have $ {{ (proposal.serviceCategory.allocatedBudget - proposal.cost) | withComma }} left over from
                    your original defined budget.
                </div>
                <div class="mt-10 mb-10">
                    Simply select anything that you would like to add. Please note that any item or service you choose here
                    will be added to the overall vendor cost.
                </div>
                <div
                    class="pt-10 pb-10"
                    v-for="service in extraServices"
                    :key="service.subCategory"
                >
                    <div class="d-flex align-center">
                        <div class="d-flex align-center">
                            <md-checkbox class="m-0 mr-10" v-model="service.addedOnProposal"></md-checkbox>
                            <span>{{ service.requirementTitle }}</span>
                        </div>
                        <div class="ml-auto pr-100">
                            <div class="element-price">${{ service.price | withComma }}</div>
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </collapse-panel>
    <div v-else class="checkout-proposal-table">
        <div class="price-header">
            <div class="d-flex align-center">
                <img class="mr-10" :src="`${$iconURL}Budget+Elements/${serviceCategory.icon}`" width="35px"/>
                {{serviceCategory.fullTitle}}
            </div>
            <div class="ml-auto">
                <div class="element-price">${{ finalPrice | withComma }}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import CollapsePanel from "@/components/CollapsePanel.vue";
    import CheckoutPriceTable from "./CheckoutPriceTable";
    export default {
        components: { CollapsePanel, CheckoutPriceTable },
        props: {
            proposal: {
                type: Object,
                default: () => {},
            },
            category: {
                type: String,
                default: "",
            },
        },
        data(){
            return{
                feePercentail: 3.2,
            }
        },
        computed: {
            categories() {
                return this.$store.state.common.serviceCategories;
            },
            serviceCategory(){
                return this.categories.find(it => it.key === this.category);
            },
            extraServices(){
                return  this.proposal.extraServices[this.category].filter(
                    (item) => !item.added && item.price)
            },
            tax() {
                if (!this.proposal.taxes) return { percentage: 0, price: 0 };
                let tax = this.proposal.taxes["total"];
                if (!tax) {
                    tax = { price: 0, percentage: 0 };
                }
                return tax;
            },
            discount() {
                if (!this.proposal.discounts) return { percentage: 0, price: 0 };
                let discount = this.proposal.discounts["total"];
                if (!discount) {
                    discount = { price: 0, percentage: 0 };
                }
                return discount;
            },
            bundledDiscountPrice() {
                let bundledServicePrice = 0;
                if (!this.proposal.bundleDiscount.services || !this.proposal.bundleDiscount.services.length || !this.proposal.bookedServices.length ||
                    !this.proposal.bundleDiscount.services.every(it => this.proposal.bookedServices.includes(it))) return 0;
                this.proposal.bundleDiscount.services.forEach((serviceCategory) => {
                    const sumOfService = this.proposal.costServices[serviceCategory].reduce((s, service) => {
                        if (service.isComplimentary) {
                            return 0;
                        }
                        return s + service.requirementValue * service.price;
                    }, 0);
                    bundledServicePrice += sumOfService;
                });
                return (bundledServicePrice * this.proposal.bundleDiscount.percentage) / 100 || 0;
            },

            totalPriceOfProposal() {
                let totalPrice = 0;
                let services = this.proposal.additionalServices.length ? this.proposal.bookedServices :
                    Object.keys(this.proposal.costServices);
                services.map(serviceCategory => {
                    const sumOfService = this.proposal.costServices[serviceCategory].reduce((s, service) => {
                        return service.isComplimentary ? s : s + service.requirementValue * service.price;
                    }, 0);
                    totalPrice += sumOfService;
                })

                const addedPrice = this.proposal.extraServices[this.category].reduce((s, service) => {
                    if (!service.addedOnProposal) return s;
                    return s + service.requirementValue * service.price;
                }, 0);

                console.log("totalPrice", totalPrice);
                return totalPrice + (addedPrice || 0);
            },
            discounedAndTaxedPrice() {
                const eventDays = 1;
                const discounted =
                    this.totalPriceOfProposal -
                    (this.totalPriceOfProposal * (this.discount.percentage || 0)) / 100 -
                    this.bundledDiscountPrice;
                let price = discounted + (discounted * (this.tax.percentage || 0)) / 100;
                if (this.onDayCordinator) {
                    price += eventDays * 1000;
                }
                return price;
            },

            feePrice() {
                return (this.discounedAndTaxedPrice * this.feePercentail) / 100;
            },

            finalPrice() {
                return this.discounedAndTaxedPrice + this.feePrice;
            },
        },
    };
</script>
<style lang="scss" scoped>
    .checkout-proposal-table {
        border-bottom: solid 2px #d4d4d4;

        .price-header {
            padding: 30px;
            font-weight: 900;
            font-size: 22px;
            display: flex;
            align-items: center;
            padding-right: 100px;
            img {
                width: 30px;
            }
            .element-price {
                text-align: left;
                width: 120px;
            }
        }
        .proposal-table-content {
            padding: 0 30px;
            .border-top{
                border-top: solid 2px #e0e0e0;
            }
        }
        .element-price {
            text-align: right;
        }
    }
</style>
