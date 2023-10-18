import vendorRoutes from "./vendor";
import DashboardLayout from "@/pages/Dashboard/Layout/DashboardLayout.vue";
import AuthLayout from "@/pages/Dashboard/Pages/AuthLayout.vue";
import CreateEvent from "@/pages/Dashboard/Layout/CreateEvent.vue";
import HomeLayout from "@/pages/Dashboard/Layout/HomeLayout.vue";
import CustomerEventLayout from "@/pages/Dashboard/Layout/CustomerEventLayout.vue";
import NewEventLayout from "@/pages/Dashboard/Layout/NewEventLayout.vue";
import WorkspaceLayout from "@/pages/Dashboard/Layout/WorkspaceLayout.vue";
import LandingPageLayout from "@/pages/Dashboard/Layout/LandingPageLayout.vue";
import MainLayoutWithBottomLogo from "@/pages/Dashboard/Layout/MainLayoutWithBottomLogo.vue";

import authService from "@/services/auth.service";

// testUI
const TestUI = () => import("@/TestUI");

const NotFound = () => import("@/pages/NotFound");
const Events = () => import("@/pages/app/Events/Events.vue");
const EventProposal = () => import("@/pages/app/Events/EventProposal.vue");
const VendorDetail = () => import("@/pages/app/Vendors/VendorDetail.vue");
const AddEditVendor = () => import("@/pages/app/Vendors/AddEditVendor.vue");
const VendorsPoolNew = () => import("@/pages/app/Vendors/VendorsPoolNew.vue");
const NonMaryokuProposal = () => import("@/pages/Dashboard/Pages/NonMaryokuProposal");
// Profile Pages
import Profile from "@/pages/app/Planner/Profile/Layout.vue";
const ProfileOverview = () => import("@/pages/app/Planner/Profile");

// Event Pages
const EventDetailsBudget = () => import("@/pages/app/Events/EventDetailsBudget.vue");
const EventPlan = () => import("@/pages/app/Events/EventPlan.vue");
const GuestEventPlan = () => import("@/pages/app/Guest/GuestEventPlan.vue");
const EventDetailsOverview = () => import("@/pages/app/Events/components/EventDetailsOverview");
const GuestEventOverview = () => import("@/pages/app/Guest/overview");
const EventProposalDetails = () => import("@/pages/app/Events/Proposal/EventProposalDetails.vue");
const EventProposalCompare = () => import("@/pages/app/Events/Proposal/ProposalCompare.vue")
const EventDetailsTimeline = () => import("@/pages/app/Events/EventDetailsTimeline");
const EventConceptChoose = () => import("@/pages/app/Events/components/EventConceptChoose");
const BookingEvent = () => import("@/pages/app/Events/components/BookingEvent");
const EventBudgetRequirement = () => import("@/pages/app/Events/components/EventBudgetRequirement.vue");
const EventCampaign = () => import("@/pages/app/Campaign/CampaignMainLayout.vue");
const PlanningBoard = () => import("@/pages/app/Events/PlanningBoard/index.vue");
const GuestPlanningBoard = () => import("@/pages/app/Guest/PlanningBoard");
const ChooseVendor = () => import("@/pages/app/Events/ChooseVendor");
const ChooseGuestVendor = () => import("@/pages/app/Guest/ChooseVendor");
const CreateWorkspace = () => import("@/pages/Dashboard/Pages/CreateWorkspace");
const ChooseWorkspace = () => import("@/pages/Dashboard/Pages/ChooseWorkspace");

// OnBoardingPages
const EventWizardStart = () => import("@/pages/app/CreateEvent/EventWizardStart.vue");
const EventWizardDay = () => import("@/pages/app/CreateEvent/EventWizardDay.vue");
const EventWizardDateFlexibility = () => import("@/pages/app/CreateEvent/EventWizardDateFlexibility.vue");
const EventWizardGuests = () => import("@/pages/app/CreateEvent/EventWizardGuests.vue");
const EventWizardGuestsType = () => import("@/pages/app/CreateEvent/EventWizardGuestsType.vue");
const EventWizardLocation = () => import("@/pages/app/CreateEvent/EventWizardLocation.vue");
const EventWizardBuilding = () => import("@/pages/app/CreateEvent/EventWizardBuilding.vue");
const EventWizardType = () => import("@/pages/app/CreateEvent/EventWizardType.vue");
const EventWizardCelebrating = () => import("@/pages/app/CreateEvent/EventWizardCelebrating.vue");
const EventWizardVibes = () => import("@/pages/app/CreateEvent/EventWizardVibes.vue");
const EventWizardReligion = () => import("@/pages/app/CreateEvent/EventWizardReligion.vue");

// RSVP

const RSVPEvent = () => import("@/pages/app/RSVP/RSVPEvent.vue");
const EventCreatePage = () => import("@/pages/app/CreateEvent/EventWizardCreate.vue");

const FeedbackLandingPage = () => import("@/pages/app/Events/FeedbackLandingPage.vue");
// User authentication pages
const SignInSignUp = () => import("@/pages/app/Planner/SignInSignUp.vue");
const SignUp = () => import("@/pages/app/Planner/SignUp.vue");
const ForgotPassword = () => import("@/pages/app/Planner/ForgotPassword.vue");
const ResetPassword = () => import("@/pages/app/Planner/ResetPassword.vue");
const SignOut = () => import("@/pages/app/Planner/SignOut.vue");
const SignedIn = () => import("@/pages/app/Planner/SignedIn.vue");
const Invited = () => import("@/pages/Dashboard/Pages/Invited.vue");

const Vendors = () => import("@/pages/Dashboard/Pages/VendorsList.vue");
const WelcomeEventPage = () => import("@/pages/Dashboard/Pages/WelcomeEvent.vue");
const ConceptDetail = () => import("@/pages/Dashboard/Pages/ConceptDetail.vue");

const ProposalFinalStep = () => import("@/pages/app/Vendors/ProposalFinalStep.vue");
const CalendarSync = () => import("@/pages/app/CalendarSync.vue");

const Checkout = () => import("@/pages/app/Events/Proposal/Checkout")

let testUI = {
    path: '/testui',
    component: TestUI,
    name: 'TestUI'
}

let authPages = {
    path: "/",
    component: AuthLayout,
    name: "Authentication",
    children: [
        {
            path: "/signin",
            name: "SignIn",
            component: SignInSignUp,
            meta: {
                requiresAuth: false,
                gtm: "SignIn",
            },
        },
        {
            path: "/signup",
            name: "SignUp",
            component: SignUp,
            meta: {
                requiresAuth: false,
                gtm: "SignUp",
            },
        },
        {
            path: "/guest/signin",
            name: "Guest Signin",
            component: SignInSignUp,
            meta: {
                requiresAuth: false,
                title: "Guest Signin",
                gtm: "Guest Signin",
                isVendor: true
            },
        },
        {
            path: "/guest/signup",
            name: "SignUp",
            component: SignUp,
            meta: {
                requiresAuth: false,
                gtm: "SignUp",
            },
        },
        {
            path: "/forgot-password",
            name: "ForgotPassword",
            component: ForgotPassword,
            meta: {
                requiresAuth: false,
                gtm: "ForgotPassword",
            },
        },
        {
            path: "/reset-password",
            name: "ResetPassword",
            component: ResetPassword,
            meta: {
                requiresAuth: false,
                gtm: "ResetPassword",
            },
        },
        {
            path: "/signout",
            name: "SignOut",
            component: SignOut,
            meta: {
                requiresAuth: false,
                title: "Sign Out",
                gtm: "SignOut",
                isVendor: false
            },

        },
        {
            path: "/vendor/signout",
            name: "Vendor SignOut",
            component: SignOut,
            meta: {
                requiresAuth: false,
                title: "Sign Out",
                gtm: "SignOut",
                isVendor: true
            },
        },
        {
            path: "/signedin",
            name: "SignedIn",
            component: SignedIn,
            meta: {
                requiresAuth: false,
                title: "Signed In",
                gtm: "SignedIn",
            },
        },
        {
            path: "/invited",
            name: "Invited",
            component: Invited,
            meta: {
                requiresAuth: false,
                title: "Invited",
                gtm: "Invited",
            },
        },
    ],
};

let workspacePages = {
    path: "/",
    component: WorkspaceLayout,
    name: "Authentication",
    children: [
        {
            path: "/create-workspace",
            name: "CreateWorkspace",
            component: CreateWorkspace,
            meta: {
                requiresAuth: false,
                title: "Create Workspace",
                gtm: "CreateWorkspace",
            },
        },
        {
            path: "/choose-workspace",
            name: "ChooseWorkspace",
            component: ChooseWorkspace,
            meta: {
                requiresAuth: false,
                title: "Choose Workspace",
                gtm: "ChooseWorkspace",
            },
        },
    ],
};

let appPages = {
    path: "/app",
    component: DashboardLayout,
    name: "App",
    children: [
        {
            path: "/vendors-pool",
            name: "VendorsPoolNew",
            component: VendorsPoolNew,
            meta: {
                gtm: "VendorsPoolNew",
                requiresAuth: true,
            },
        },
        {
            path: "/vendors/:id/detail",
            name: "VendorDetails",
            component: VendorDetail,
            meta: {
                title: "Vendor Page",
                gtm: "Vendor Details",
                opaque: false,
                requiresAuth: true,
            },
        },
        {
            path: "/vendors/:id/edit",
            name: "EditVendor",
            component: AddEditVendor,
            meta: {
                title: "Edit Vendor Details",
                gtm: "Edit Vendor Details",
                requiresAuth: true,
            },
        },
    ],
};

let ProfilePages = {
    path: "/",
    component: Profile,
    name: "Profile",
    children: [
        {
            path: "/profile/:pageName",
            name: "overview",
            component: ProfileOverview,
            meta: {
                requiresAuth: true,
                title: "Profile",
                gtm: "Profile",
            },
        },
    ],
};

let EventPages = {
    path: "/events",
    component: NewEventLayout,
    name: "Events",
    children: [
        {
            path: "proposal",
            name: "EventProposal",
            component: EventProposal,
            meta: {
                requiresAuth: true,
                title: "Event Proposal",
            },
        },
        {
            path: ":id/edit/budget",
            name: "EventDetailsBudget",
            component: EventDetailsBudget,
            meta: {
                title: "Event Details",
                gtm: "Event Edit",
                opaque: false,
                requiresAuth: true,
            },
        },
        {
            path: "/events/:id/overview",
            redirect: "/events/:id/booking/overview",
            name: "EventDetail",
            meta: {
                title: "Event Details",
                gtm: "Event Edit",
                opaque: false,
                requiresAuth: true,
            },
        },
        {
            path: "/events/:id/booking",
            name: "Plan Event",
            component: EventPlan,
            children: [
                {
                    path: "overview",
                    name: "EventPlan",
                    component: EventDetailsOverview,
                    meta: {
                        title: "Event Details",
                        gtm: "Event Details",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "concept",
                    name: "EventPlan",
                    component: EventConceptChoose,
                    meta: {
                        title: "Event Concept",
                        gtm: "Event Concept",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "budget",
                    name: "EventPlan",
                    component: EventBudgetRequirement,
                    meta: {
                        title: "Event Concept",
                        gtm: "Event Concept",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "campaign",
                    name: "Campaign",
                    component: EventCampaign,
                    meta: {
                        title: "Event Campaign",
                        gtm: "Event Campaign",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "timeline",
                    name: "Timeline",
                    component: EventDetailsTimeline,
                    meta: {
                        title: "Event Timeline",
                        gtm: "Event Timeline",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "planningboard",
                    name: "Plan Event",
                    component: PlanningBoard,
                    meta: {
                        title: "Plan Event",
                        gtm: "Plan Event",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "choose-vendor",
                    name: "Choose Vendor",
                    component: ChooseVendor,
                    meta: {
                        title: "Choose Vendor",
                        gtm: "Choose Vendor",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId",
                    name: "EventPlan",
                    component: BookingEvent,
                    meta: {
                        title: "Plan Event",
                        gtm: "Plan Event",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId/proposals/compare",
                    name: "EventProposalCompare",
                    component: EventProposalCompare,
                    meta: {
                        title: "EventProposalCompare",
                        gtm: "Event Proposal Compare",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId/proposals/:proposalId",
                    name: "EventProposalDetails",
                    component: EventProposalDetails,
                    meta: {
                        title: "EventProposalDetails",
                        gtm: "Event Proposal Details",
                        opaque: false,
                        requiresAuth: true,
                    },
                },

            ]
        },

    ],
};

let UserEventPages = {
    path: "/user-events",
    component: CustomerEventLayout,
    name: "Events",
    children: [{
            path: "/user-events/:id/booking",
            name: "Plan Event",
            component: GuestEventPlan,
            children: [
                {
                    path: "overview",
                    name: "Guest Event Overview",
                    component: GuestEventOverview,
                    meta: {
                        title: "Event Details",
                        gtm: "Event Details",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "planningboard",
                    name: "Plan Event",
                    component: GuestPlanningBoard,
                    meta: {
                        title: "Plan Event",
                        gtm: "Plan Event",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: "choose-vendor",
                    name: "Choose Vendor",
                    component: ChooseGuestVendor,
                    meta: {
                        title: "Choose Vendor",
                        gtm: "Choose Vendor",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId",
                    name: "EventPlan",
                    component: BookingEvent,
                    meta: {
                        title: "Plan Event",
                        gtm: "Plan Event",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId/proposals/compare",
                    name: "EventProposalCompare",
                    component: EventProposalCompare,
                    meta: {
                        title: "EventProposalCompare",
                        gtm: "Event Proposal Compare",
                        opaque: false,
                        requiresAuth: true,
                    },
                },
                {
                    path: ":blockId/proposals/:proposalId",
                    name: "EventProposalDetails",
                    component: EventProposalDetails,
                    meta: {
                        title: "EventProposalDetails",
                        gtm: "Event Proposal Details",
                        opaque: false,
                        requiresAuth: true,
                    },
                },

            ]
        },

    ],
};

let PublicCreateEvent = {
    path: "/app-public",
    component: CreateEvent,
    name: "CreateEvent",
    meta: {
        requiresAuth: false,
    },
    children: [
        {
            path: "/create-event-wizard",
            name: "EventWizardStart",
            component: EventWizardStart,
            meta: {
                title: "Event Wizard",
                gtm: "Event Wizard",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-day",
            name: "EventWizardDay",
            component: EventWizardDay,
            meta: {
                title: "Event Day",
                gtm: "Event Day",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-flexibility",
            name: "EventWizardDateFlexibility",
            component: EventWizardDateFlexibility,
            meta: {
                title: "Event Day Flexibility",
                gtm: "Event Day Flexibility",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-guests",
            name: "EventWizardGuests",
            component: EventWizardGuests,
            meta: {
                title: "Event Guests",
                gtm: "Event Guests",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-guests-type",
            name: "EventWizardGuestsType",
            component: EventWizardGuestsType,
            meta: {
                title: "Event Guests Type",
                gtm: "Event Guests",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-location",
            name: "EventWizardLocation",
            component: EventWizardLocation,
            meta: {
                title: "Event  Location",
                gtm: "Event Location",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-building",
            name: "EventWizardBuilding",
            component: EventWizardBuilding,
            meta: {
                title: "Event Building",
                gtm: "Event Building",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-type",
            name: "EventWizardType",
            component: EventWizardType,
            meta: {
                title: "Event  Type",
                gtm: "Event Type",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-celebrating",
            name: "EventWizardCelebrating",
            component: EventWizardCelebrating,
            meta: {
                title: "Event celebrating",
                gtm: "Event celebrating",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-religion",
            name: "EventWizardReligion",
            component: EventWizardReligion,
            meta: {
                title: "Event Guests Religion",
                gtm: "Event Religion",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-vibes",
            name: "EventWizardVibes",
            component: EventWizardVibes,
            meta: {
                title: "Event Guests Religion",
                gtm: "Event Religion",
                requiresAuth: false,
            },
        },
        {
            path: "/event-wizard-create",
            name: "EventCreatePage",
            component: EventCreatePage,
            meta: {
                title: "EventCreatePage",
                gtm: "Event Create",
                opaque: false,
            },
        },
    ],
};

let HomePages = {
    path: "/app2",
    component: HomeLayout,
    name: "HomePageLayout",
    children: [
        {
            path: "/events",
            name: "Events",
            component: Events,
            meta: {
                title: "Our Events",
                gtm: "Events",
                requiresAuth: true,
            },
        },
    ],
};

let landingPages = {
    path: "/app2",
    component: LandingPageLayout,
    name: "LandingPageLayout",
    children: [
        {
            path: "/rsvp/:tenantId/:rsvpRequestId",
            name: "RSVP",
            component: RSVPEvent,
            meta: {
                title: "Our Events",
                gtm: "Events",
                requiresAuth: false,
            },
            // path: "/rsvp/:rsvpRequestId",
            // name: "RSVP",
            // component: RSVPEvent,
            // meta: {
            //     title: "Our Events",
            //     gtm: "Events",
            // },
        },
    ],
};

let feedbackPages = {
    path: "/app2",
    component: LandingPageLayout,
    name: "LandingPageLayout",
    children: [
        {
            path: "/landingpage/feedback/form/:eventId",
            name: "Event Feedback",
            component: FeedbackLandingPage,
            meta: {
                title: "Feedback Form",
                gtm: "Feedback",
            },
        },
        {
            path: "/feedback/:feedbackId",
            name: "Event Feedback",
            component: FeedbackLandingPage,
            meta: {
                title: "Feedback",
                gtm: "Feedback",
            },
        },
    ],
};

let others = {
    path: "/app2",
    component: MainLayoutWithBottomLogo,
    name: "MainLayoutWithBottomLogo",
    children: [
        {
            path: "/completed-bidding",
            name: "What's next?",
            component: ProposalFinalStep,
            meta: {
                requiresAuth: false,
                title: "ProposalFinalStep",
                gtm: "ProposalFinalStep",
            },
        },
    ],
};

let vendorListPage = {
    path: "/admin/vendorlist",
    name: "VendorList",
    component: Vendors,
    meta: {
        title: "Vendors",
        gtm: "Vendors",
    },
};
let checkoutPageWithVendor = {
    path: "/checkout/proposal/:proposalId/:proposalType",
    name: "CheckoutWithVendor",
    component: Checkout,
    meta: {
        title: "Plan Event",
        gtm: "Plan Event",
        opaque: false,
        requiresAuth: false,
    },
}

let checkoutPageWithCart = {
    path: "/checkout/event/:eventId",
    name: "CheckoutWithCart",
    component: Checkout,
    meta: {
        title: "Plan Event",
        gtm: "Plan Event",
        opaque: false,
        requiresAuth: true,
    },
}

let calendarSyncPage = {
    path: "/calendar/sync/:calendarName",
    name: "CalendarSyncPage",
    component: CalendarSync,
    meta: {
        title: "Calendar Synchroniztion",
        gtm: "Calendar Synchroniztion",
    },
};

let welcomeEventPage = {
    path: "/welcome/event",
    name: "Welcome",
    component: WelcomeEventPage,
    meta: {
        title: "Welcome to your first event",
        gtm: "welcom event",
    },
};

const rememberMe = authService.getCookie("rememberMe");
const homeLink = rememberMe === "true" ? "/events" : "/signin";
const proposalForUnregisterPlanner = {
    path: "/unregistered/proposals/:proposalId",
    name: "Non Maryoku proposal",
    component: NonMaryokuProposal,
    meta: {
        title: "Proposal for non maryoku evnt",
        gtm: "welcom event",
        requiresAuth: false,
    },
};
const routes = [
    // {
    //     path: "/",
    //     redirect: "/signin",
    //     name: "Root",
    //     meta: {
    //         gtm: "Root",
    //     },
    // },
    {
        path: "/concepts/:conceptId",
        name: "Concept Detail",
        component: ConceptDetail,
        meta: {
            title: "Concept Detail",
            gtm: "concept detail",
        },
    },
    testUI,
    authPages,
    workspacePages,
    appPages,
    PublicCreateEvent,
    HomePages,
    ProfilePages,
    EventPages,
    UserEventPages,
    landingPages,
    vendorListPage,
    feedbackPages,
    welcomeEventPage,
    others,
    calendarSyncPage,
    checkoutPageWithVendor,
    checkoutPageWithCart,
    proposalForUnregisterPlanner,
    ...vendorRoutes,
    {
        path: '*',
        name: 'Not Found',
        component: NotFound
    },
];

export default routes;
