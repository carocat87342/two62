<template>
    <div class="md-layout event-details-overview edit-event-details bg-white" style="padding-left: 450px" v-if="!isLoading">
<!--        <comment-editor-panel-->
<!--            v-if="showCommentEditorPanel"-->
<!--            :commentComponents="commentComponents"-->
<!--            @saveComment="saveComment"-->
<!--            @updateComment="updateComment"-->
<!--            @deleteComment="deleteComment"-->
<!--            @updateCommentComponent="updateCommentComponent"-->
<!--        >-->
<!--        </comment-editor-panel>-->
        <div class="event-page-header md-layout-item md-size-100">
            <div class="header-title">
                <div class="d-flex align-center">
                    Created on {{ getFormattedDate }}
                    <md-button class="md-simple md-red" style="color: white">
                        See event history
                        <img
                            class="ml-5"
                            src="https://s3.amazonaws.com/static.maryoku.com/storage/icons/Event%20Page/Group%2010036.svg"
                            width="10"
                        />
                    </md-button>
                </div>
                <h3>
                    <img
                        class="mr-10"
                        src="https://s3.amazonaws.com/static.maryoku.com/storage/icons/Event%20Page/Group%20793.svg"
                        width="25"
                    />
                    YOUR EVENT
                </h3>
            </div>
            <header-actions @toggleCommentMode="toggleCommentMode" @share="share"></header-actions>
        </div>
        <div class="md-layout">
            <div id="control-panel" style="width: 1px; height: 100%; float: left; margin-left: -1px"></div>
            <div class="md-layout-item md-size-100">
                <event-overview-date :section="eventDateSection" @change="changeEvent"></event-overview-date>
                <event-overview-section
                    v-for="(section, index) in sections"
                    :key="index"
                    :section="section"
                    @change="changeEvent"
                ></event-overview-section>
            </div>
        </div>
        <div class="event-footer-container" id="footer-panel">
            <div class="ml-20">
                <md-button class="md-bold add-category-btn md-black md-simple"> <md-icon>arrow_back</md-icon>Back </md-button>
                <md-button class="md-simple md-just-icon md-black">
                    <md-icon style="font-size: 40px">expand_less</md-icon>
                </md-button>
            </div>

            <div class="ml-auto mr-50">
                <md-button class="md-bold add-category-btn md-black md-simple ml-auto mr-20">
                    <img
                        class="mr-10"
                        src="https://static-maryoku.s3.amazonaws.com/storage/icons/Requirements/delete-dark.svg"
                        @click="cancelEvent"
                    />Cancel Event</md-button
                >
                <md-button class="md-red md-bold add-category-btn" @click="updateEvent">Save changes</md-button>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
    import CalendarEvent from "@/models/CalendarEvent";

    import moment from "moment";
    import Swal from "sweetalert2";
    import { MaryokuInput } from "@/components";
    import VueElementLoading from "vue-element-loading";
    import { FunctionalCalendar } from "vue-functional-calendar";
    import { LabelEdit, AnimatedNumber, StatsCard, ChartCard, Modal, LocationInput } from "@/components";
    import HeaderActions from "@/components/HeaderActions";
    // import CommentEditorPanel from "./CommentEditorPanel";
    import {CommentMixins, ShareMixins} from "@/mixins";
    import Multiselect from "vue-multiselect";
    import EventOverviewSection from "./EventOverviewSection";
    import EventOverviewDate from "./EventOverviewDate";
    import Calendar from "@/models/Calendar";
    export default {
        name: "event-overview",
        components: {
            VueElementLoading,
            FunctionalCalendar,
            HeaderActions,
            // CommentEditorPanel,
            LocationInput,
            MaryokuInput,
            Multiselect,
            EventOverviewSection,
            EventOverviewDate,
        },
        props: {
            // event: Object,
            // eventComponents: [Array, Function]
        },
        mixins: [CommentMixins, ShareMixins],
        data() {
            return {
                // auth: auth,
                calendar: null,
                editEvent: null,
                eventId: null,
                percentage: 0,
                isLoading: true,
                iconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewLandingPage/",
                timlineIconsURL: `${this.$iconURL}Timeline-New/`,
                menuIconsURL: `${this.$iconURL}menu%20_%20checklist/SVG/`,
                isEdit: false,
                showEditDetailModal: false,
                showCommentEditorPanel: false,
                reCalculate: false,
                reSchedule: false,
                eventDateSection: null,
                sections: [],
            };
        },
        methods: {
            updateEvent() {
                let places = this.event.places.map((p) => p.toUpperCase());

                const updatedEvent = new CalendarEvent({
                    id: this.event.id,
                    calendar: new Calendar({
                        id: this.event.calendar.id,
                    }),
                    location: this.event.location,
                    locationId: this.event.locationId,
                    places: places,
                    numberOfParticipants: this.event.numberOfParticipants,
                    eventType: this.event.eventType,
                    occasion: this.event.occasion,
                    eventStartMillis: this.event.eventStartMillis,
                    eventEndMillis: this.event.eventEndMillis,
                    guestType: this.event.guestType,
                    timeline: this.event.timeline,
                    timelineDates: this.event.timelineDates,
                    reSchedule: this.reSchedule,
                    reCalculate: this.reCalculate,
                });

                const arrow = `<i data-v-a76b6a56="" style="color:#050505" class="md-icon md-icon-font md-theme-default">arrow_back</i>`;
                const description = `<div class="description">Your edits changed the event, do you want to change it?</div>`;

                Swal.fire({
                    title: `<div class="text-left">${arrow}<div>Are Your Sure?</div>${description}</div>`,
                    showCancelButton: true,
                    confirmButtonClass: "md-button md-success",
                    cancelButtonClass: "md-button md-danger",
                    confirmButtonText: "Yes I'm sure",
                    cancelButtonText: "No, take me back",
                    buttonsStyling: false,
                }).then((result) => {
                    if (result.dismiss != "cancel") {
                        this.$store.dispatch("event/saveEventAction", updatedEvent).then((res) => {
                            Swal.fire({
                                title: "Success to save your changes!",
                                confirmButtonClass: "md-button md-success confirm-btn-bg ",
                                cancelButtonClass: "md-button md-danger cancel-btn-bg",
                                buttonsStyling: false,
                                timer: 3000,
                            });
                            this.reSchedule = false;
                            this.reCalculate = false;
                        });
                    }
                });
            },
            toggleCommentMode(mode) {
                this.showCommentEditorPanel = !this.showCommentEditorPanel;
            },
            changeEvent(e) {
                if (e.hasOwnProperty("dateData")) {
                    this.event.eventStartMillis = new Date(e.dateData.started_at).getTime();
                    this.event.eventEndMillis = new Date(e.dateData.ended_at).getTime();
                    this.event.timeline = e.timeline;
                    this.event.timelineDates = e.timelineDates;
                    this.reSchedule = true;
                } else if (e.hasOwnProperty("location")) {
                    this.event.location = e.location.name;
                    this.event.locationId = e.location.id;
                } else if (e.hasOwnProperty("inOutDoor")) {
                    this.event.places = e.inOutDoor;
                    this.reCalculate = true;
                } else if (e.hasOwnProperty("numberOfParticipants")) {
                    this.reCalculate = true;
                    this.event.numberOfParticipants = e.numberOfParticipants;
                } else if (e.hasOwnProperty("guestType")) {
                    this.event.guestType = e.guestType;
                } else if (e.hasOwnProperty("eventType")) {
                    let eventType = this.eventTypeList.find((it) => it.name === e.eventType);
                    if (!this.event.eventType) this.event.eventType = {};
                    this.event.eventType.name = eventType.name;
                    this.event.eventType.key = eventType.key;
                    this.event.eventType.id = eventType.id;
                    this.reCalculate = true;
                } else if (e.hasOwnProperty("occasion")) {
                    this.event.occasion = e.occasion;
                } else if (e.hasOwnProperty("holiday")) {
                    this.event.holiday = e.holiday;
                }

                this.setSection();
            },
            cancelEvent() {
                console.log("cancelEvent");
            },
            setSection() {
                let places = this.event.places ? this.event.places.map((p) => p.toLowerCase()) : [];

                this.eventDateSection = {
                    title: "Date",
                    key: "date",
                    img_src: `${this.$secondIconURL}Event Page/Group 8708.svg`,
                    warning: "Changing the time on your status might cause price changes",
                    started_at: this.event.eventStartMillis,
                    ended_at: this.event.eventEndMillis,
                    timelineDates: this.event.timelineDates,
                    more_one_day: null,
                };
                this.sections = [
                    {
                        title: "Location",
                        key: "location",
                        img_src: `${this.$secondIconURL}Event Page/Group 10492.svg`,
                        warning: "Changing the address on your status might cause price changes",
                        location: this.event.location,
                        inOutDoor: places,
                    },
                    {
                        title: "Number OF Guests",
                        key: "number_of_guest",
                        img_src: `${this.$secondIconURL}Event Page/Group 10482.svg`,
                        warning: "Changing the number of guests on your status might cause price changes",
                        numberOfParticipants: this.event.numberOfParticipants,
                        guestType: this.event.guestType ? this.event.guestType : "",
                    },
                    {
                        title: "Event type",
                        key: "event_type",
                        img_src: `${this.$secondIconURL}Event Page/Group 10495.svg`,
                        warning: null,
                        eventType: this.event.eventType ? this.event.eventType.name : "",
                        occasion: this.event.occasion ? this.event.occasion : "",
                        holiday: this.event.holiday ? this.event.holiday : "",
                    },
                ];
            },
            init() {
                if (this.eventTypeList.length) {
                    this.isLoading = false;
                    this.setSection();
                }
            },
        },
        mounted() {
            if (!this.eventTypeList.length) {
                this.$store.dispatch("event/getEventTypes", {
                    data: this.$store.state.auth.user.profile.defaultCalendarId,
                    ctx: this,
                });
            }

            this.init();
        },
        watch: {
            event(newVal, oldVal) {
                this.$root.$emit("set-title", this.event, this.routeName === "EditBuildingBlocks", true);
            },
            eventTypeList(newVal) {
                this.init();
            },
        },
        filters: {
            formatDate: function (date) {
                return moment(date).format("MMM Do YYYY");
            },
            formatTime: function (date) {
                return moment(date).format("h:00 A");
            },
            formatDuration: function (startDate, endDate) {
                return moment(endDate).diff(startDate, "hours");
            },
            withComma(amount) {
                return amount ? amount.toLocaleString() : 0;
            },
        },
        computed: {
            ...mapGetters({
                eventTypeList: "event/getEventTypesList",
            }),
            event(){
                return this.$store.state.EventGuestVuex.eventData;
            },
            getFormattedDate() {
                if (!this.event) return "";
                return moment(new Date(this.event.dateCreated)).format("DD MMM YYYY");
            },
            // check permission
            permission() {
                try {
                    return this.event.permit;
                } catch (e) {
                    return "edit";
                }
            },
            canComment() {
                return this.permission === "edit" || this.permission === "comment";
            },
            canEdit() {
                return this.permission === "edit";
            },
        },
    };
</script>
<style lang="scss">
    @import "../../../styles/EventDetailsOverview";
</style>
