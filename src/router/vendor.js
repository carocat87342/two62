const VendorSignupLayout = () => import("@/pages/app/Vendors/Signup/Layout.vue");
const VendorMainLayout = () => import("@/pages/app/Vendors/VendorMainLayout.vue");

const VendorProfileOverview = () => import("@/pages/app/Vendors/Profile");
const VendorProposalBoard = () => import("@/pages/app/Vendors/ProposalBoard");
const VendorCustomers = () => import("@/pages/app/Vendors/Customers");
const VendorDashboard = () => import("@/pages/app/Vendors/VendorDashboard")
const VendorSignup = () => import("@/pages/app/Vendors/Signup");
const VendorSignin = () => import("@/pages/app/Vendors/VendorSignin.vue");
const ForgotPassword = () => import("@/pages/app/Vendors/VendorForgotPassword.vue");
const ResetPassword = () => import("@/pages/app/Vendors/VendorResetPassword.vue");
const VendorSignedin = () => import("@/pages/app/Vendors/VendorSignedin.vue");

// New Vendor Pages
const ForVendorLayout = () => import("@/pages/Dashboard/Layout/ForVendorLayout.vue");
const ForVendors = () => import("@/pages/app/Vendors/ForVendors.vue");
const ProposalLayout = () => import("@/pages/app/Vendors/Proposal/ProposalLayout.vue");
const ProposalContent = () => import("@/pages/app/Vendors/Proposal");
const ProposalForOutsideClientLayout = () => import("@/pages/app/Vendors/ProposalOutside/ProposalLayout.vue");
const ProposalForOutsideClientContent = () => import("@/pages/app/Vendors/ProposalOutside");

const ServiceWizardLayout = () => import("@/pages/app/Vendors/ServiceWizard/Layout.vue");
const ServiceWizard = () => import("@/pages/app/Vendors/ServiceWizard")
const OfferVendors = () => import("@/pages/app/OfferVendors")

export default [
    {
        path: "/vendor",
        name: "Vendor",
        component: VendorSignupLayout,
        children: [
            {
                path: "signup",
                name: "VendorSignup",
                component: VendorSignup,
                meta: {
                    requiresAuth: false,
                    title: "Vendor Signup",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },

            {
                path: "edit/:id",
                name: "VendorSignup",
                component: VendorSignup,
                meta: {
                    requiresAuth: false,
                    title: "Vendor Signup",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },
        ],
    },
    {
        path: "/vendor",
        name: "Vendor",
        component: ServiceWizardLayout,
        children: [
            {
                path: ":id/service/add",
                name: "Add New Service",
                component: ServiceWizard,
                meta: {
                    requiresAuth: true,
                    title: "Add New Service",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },
            {
                path: ":id/service/edit/:serviceId",
                name: "Add New Service",
                component: ServiceWizard,
                meta: {
                    requiresAuth: true,
                    title: "Edit Service",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },
        ],
    },

    {
        path: "/",
        name: "Vendor",
        component: VendorSignupLayout,
        children: [
            {
                path: "/vendor-signup",
                name: "VendorSignup",
                component: VendorSignup,
                meta: {
                    requiresAuth: false,
                    title: "Vendor Signup",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },
            {
                path: "/vendor-signup/edit/:id",
                name: "VendorSignup",
                component: VendorSignup,
                meta: {
                    requiresAuth: false,
                    title: "Vendor Signup",
                    gtm: "VendorSignup",
                    isVendor: true
                },
            },
        ],
    },
    {
        path: "/vendor/signin",
        name: "Vendor Signin",
        component: VendorSignin,
        meta: {
            requiresAuth: false,
            title: "Vendor Signin",
            gtm: "Vendor Signin",
            isVendor: true
        },
    },
    {
        path: "/vendor/signedin",
        name: "Vendor Signed In",
        component: VendorSignedin,
        meta: {
            requiresAuth: true,
            title: "Vendor Signed in",
            gtm: "Vendor Signed in",
            isVendor: true
        },
    },
    {
        path: "/vendor/forgot-password",
        name: "ForgotPassword",
        component: ForgotPassword,
        meta: {
            requiresAuth: false,
            title: "Vendor Forgot Password",
            gtm: "ForgotPassword",
            isVendor: true
        },
    },
    {
        path: "/vendor/reset-password",
        name: "ResetPassword",
        component: ResetPassword,
        meta: {
            requiresAuth: false,
            gtm: "ResetPassword",
            title: "Vendor Reset Password",
            isVendor: true,
        },
    },
    {
        path: "/vendor",
        component: VendorMainLayout,
        name: "Vendor",
        children: [
            {
                path: "profile/:pageName",
                name: "overview",
                component: VendorProfileOverview,
                meta: {
                    requiresAuth: true,
                    title: "Profile",
                    gtm: "Profile",
                    isVendor: true
                },
            },
            {
                path: "proposals",
                name: "proposals",
                component: VendorProposalBoard,
                meta: {
                    requiresAuth: true,
                    title: "Proposal Board",
                    gtm: "Proposal Board",
                    isVendor: true
                },
            },
            {
                path: "customers",
                name: "customers",
                component: VendorCustomers,
                meta: {
                    requiresAuth: true,
                    title: "Customers",
                    gtm: "Customers",
                    isVendor: true
                },
            },
            {
                path: "dashboard",
                name: "proposals",
                component: VendorDashboard,
                meta: {
                    requiresAuth: true,
                    title: "Dashboard",
                    gtm: "Dashboard",
                    isVendor: true
                },
            },
        ],
    },
    {
        path: "/",
        component: ForVendorLayout,
        name: "ForVendors",
        children: [
            {
                path: "/vendors/:vendorId/proposal-request/:rfpId",
                name: "VendorProposal",
                component: ForVendors,
                meta: {
                    requiresAuth: false,
                    title: "For Vendors",
                    gtm: "ForVendors",
                    isVendor: true
                },
            },
        ],
    },

    {
        path: "/",
        component: ProposalLayout,
        name: "ProposalLayout",
        children: [
            {
                path: "/vendors/:vendorId/proposal-request/:id/form/:type",
                name: "proposalEdit",
                component: ProposalContent,
                meta: {
                    requiresAuth: false,
                    title: "For Proposals",
                    gtm: "ForProposals",
                    isVendor: true
                },
            },
            {
                path: "/proposal-request/:id/form",
                name: "ForProposals",
                component: ProposalContent,
                meta: {
                    requiresAuth: false,
                    title: "For Proposals",
                    gtm: "ForProposals",
                    isVendor: true
                },
            },
            {
                path: "/vendors/:vendorId/events/:eventId/proposal-request/:id/form",
                name: "ForProposals",
                component: ProposalContent,
                meta: {
                    requiresAuth: false,
                    title: "For Proposals",
                    gtm: "ForProposals",
                    isVendor: true
                },
            },
        ],
    },

    {
        path: "/",
        component: ProposalForOutsideClientLayout,
        name: "ProposalLayoutForUnregisteredUser",
        children: [
            {
                path: "/vendor/:vendorId/proposal/non-registered",
                name: "outsideProposalCreate",
                component: ProposalForOutsideClientContent,
                meta: {
                    requiresAuth: true,
                    title: "For Proposals",
                    gtm: "ForProposals",
                    isVendor: true
                },
            },
            {
                path: "/vendor/:vendorId/proposal/:id/non-registered/:type",
                name: "outsideProposalEdit",
                component: ProposalForOutsideClientContent,
                meta: {
                    requiresAuth: false,
                    title: "For Proposals",
                    gtm: "ForProposals",
                    isVendor: true
                },
            },
        ],
    },
    {
        path: "/vendor/offer/:proposalId",
        name: "OfferVendors",
        component: OfferVendors,
        meta: {
            requiredAuth: false,
            title: "Offer Vendors",
            gtm: "OfferVendors"
        }
    }
];
