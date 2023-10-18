import { postReq, getReq } from "@/utils/token";

export default {
    data(){
        return {
        }
    },
    methods:{
        async share(args){
            console.log('share.mixins', args);
            let res;
            if (args.page === 'event'){
                res = await postReq("/1/eventShare", {
                    ...args
                })
            } else if(args.page === 'proposal'){
                let { proposalId, emails, cb } = args;
                res = await postReq(`/1/proposals/${proposalId}/sendEmail`, {
                    proposalId: proposalId,
                    emails: emails,
                    type: 'share'
                })
                cb({success: true});
            }
            console.log('res', res);

        }
    },
    computed: {
    },
    async created(){
        console.log('share.mixin.created');
    }
}
