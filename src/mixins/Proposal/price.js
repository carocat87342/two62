import { costByService, extraCost, discounting, addingTax } from "@/utils/price";
export default {
    data(){
        return {

        }
    },
    created() {
    },
    methods: {
    },
    computed: {
        checkedAllBundledOffers() {
            return (
                this.proposal.bundleDiscount.services &&
                this.proposal.bundleDiscount.services.length &&
                this.proposal.bookedServices.length &&
                this.proposal.bundleDiscount.services.every((it) => this.proposal.bookedServices.includes(it))
            );
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

            if (!this.checkedAllBundledOffers) return 0;
            this.proposal.bundleDiscount.services.forEach((serviceCategory) => {
                const sumOfService = costByService(this.proposal.costServices[serviceCategory]);

                bundledServicePrice += sumOfService;
            });

            return (bundledServicePrice * this.proposal.bundleDiscount.percentage) / 100 || 0;
        },

        totalPriceOfProposal() {
            let totalPrice = 0;

            this.proposal.bookedServices.forEach((serviceCategory) => {
                const sumOfService = costByService(this.proposal.costServices[serviceCategory]);
                totalPrice += sumOfService;
            });

            // added service item price
            Object.keys(this.addedServices).forEach((serviceCategory) => {
                const sumOfService = extraCost(this.addedServices[serviceCategory]);
                totalPrice += sumOfService;
            });
            return totalPrice;
        },
        discounedAndTaxedPrice() {

            let price = this.totalPriceOfProposal;

            // discount
            price = discounting(price, this.discount);

            // bundled discount
            price -= this.bundledDiscountPrice;

            // adding tax
            price = addingTax(price, this.tax);


            return price;
        },
    }
}
