import Vue from "vue";
import Vuex from "vuex";
import common from "./modules/common"
import user from "./modules/user";
import event from "./modules/event";
import comment from "./modules/comment";
import auth from "./modules/auth";
import modal from "./modules/modal";
import PublicEventPlanner from "./modules/PublicEventPlanner";
import vendor from "./modules/vendor";
import campaign from "./modules/campaign";
import vendorProposal from "./modules/vendorProposal"
import planningBoard from "./modules/planningBoard"
import customer from "./modules/customer"
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        user,
        modal,
        event,
        comment,
        vendor,
        PublicEventPlanner,
        campaign,
        vendorProposal,
        common,
        customer,
        planningBoard,
    },
});
