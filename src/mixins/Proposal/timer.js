import { NEGOTIATION_REQUEST_STATUS, NEGOTIATION_REQUEST_TYPE } from "@/constants/status";
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
        targetTime() {
            return new Date(this.proposal.expiredDate);
        },
        negotiationProcessed() {
            if (!this.proposal.nonMaryoku) return false;
            return (
                !!this.proposal.negotiations.length &&
                this.proposal.negotiations.every(
                    (it) =>
                        it.status === NEGOTIATION_REQUEST_STATUS.APPROVED &&
                        it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME &&
                        it.remainingTime > 0,
                )
            );
        },
        negotiationDeclined() {
            if (!this.proposal.nonMaryoku) return false;
            return (
                !!this.proposal.negotiations.length &&
                this.proposal.negotiations.every(
                    (it) =>
                        it.status === NEGOTIATION_REQUEST_STATUS.DECLINE &&
                        it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME &&
                        it.remainingTime > 0,
                )
            );
        },
        negotiationPending() {
            return (
                !!this.proposal.negotiations.length &&
                this.proposal.negotiations.some(
                    (it) =>
                        it.status === NEGOTIATION_REQUEST_STATUS.NONE &&
                        it.type === NEGOTIATION_REQUEST_TYPE.ADD_MORE_TIME &&
                        it.remainingTime > 0,
                )
            );
        },
    }
}
