<template>
    <functional-calendar
        v-if="!updated"
        :is-date-range="multiple"
        :is-date-picker="!multiple"
        :change-month-function="true"
        :change-year-function="true"
        dateFormat="yyyy-mm-dd"
        v-model="dateData"
        @changedMonth="changeMonth"
        v-on:dayClicked="selectDay($event)"
    ></functional-calendar>
</template>
<script>
    import moment from "moment";
    import { FunctionalCalendar } from "vue-functional-calendar";
    export default {
        name: 'maryoku-calendar',
        components: {
            FunctionalCalendar
        },
        props: {
            initDate: {
                type: Object,
                default: null,
            },
            multiple: {
                type: Boolean,
                default: true,
            },
            changeYearFunction: {
                type: Boolean,
                default: true,
            },
            changeMonthFunction: {
                type: Boolean,
                default: true,
            }
        },
        data(){
            return {
                updated: false,
                dateData: this.initDate ? this.initDate : {
                    currentDate: new Date(),
                    dateRange: {
                        start: { date: false, dateTime: false, hour: "00", mintue: "00" },
                        end: { date: false, dateTime: false, hour: "00", mintue: "00" },
                    },
                    selectedDate: moment().format('YYYY-M-D'),
                    selectedDatesItem: "",
                    selectedHour: "00",
                    selectedMinute: "00",
                    selectedDates: [],
                },
            }
        },
        created(){this.init()},
        methods: {
            init(){
                console.log('init', this.initDate);
                if (this.initDate )this.dateData = this.initDate;
            },
            selectDay(e) {
                this.$emit('select', this.dateData)
                this.$forceUpdate();
            },
            changeMonth(){
                this.$forceUpdate();
            },
            renderCalendar(){
                // console.log('renderCal');
                $(".vfc-day").each(function (index, day) {
                    if (
                        $(day).find("span.vfc-span-day").hasClass("vfc-marked") ||
                        $(day).find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
                    ) {
                        if (
                            ($(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
                                $(day).prev().find("span.vfc-span-day").hasClass("vfc-marked")) ||
                            ($(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
                                $(day).prev().find("span.vfc-cursor-not-allowed").hasClass("vfc-cursor-not-allowed")) ||
                            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
                                $(day).prev().find("span.vfc-span-day").hasClass("vfc-marked")) ||
                            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
                                $(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed"))
                        ) {
                            $(day).find("span.vfc-span-day").removeClass("vfc-end-marked");
                            $(day).find("span.vfc-span-day").removeClass("vfc-start-marked");
                            $(day).find("div.vfc-base-start").remove();
                            $(day).find("div.vfc-base-end").remove();
                            $(day).find("span.vfc-span-day").addClass("selected");
                        }

                        if (
                            ($(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") ||
                                $(day).next().find("span.vfc-span-day").hasClass("vfc-marked")) &&
                            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") &&
                            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
                        ) {
                            $(day).find("span.vfc-span-day").addClass("vfc-start-marked");
                            if (!$(day).find("div.vfc-base-start").length) $(day).prepend("<div class='vfc-base-start'></div>");
                        }

                        if (
                            !$(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
                            !$(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
                            ($(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") ||
                                $(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed"))
                        ) {
                            // console.log('vfc-end-mark', day)
                            $(day).find("span.vfc-span-day").addClass("vfc-end-marked");
                            if (!$(day).find("div.vfc-base-end").length) $(day).prepend("<div class='vfc-base-end'></div>");
                        }

                        if (
                            !$(day).next().find("span.vfc-span-day").hasClass("vfc-marked") &&
                            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-marked") &&
                            !$(day).next().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed") &&
                            !$(day).prev().find("span.vfc-span-day").hasClass("vfc-cursor-not-allowed")
                        ) {
                            // console.log("alone", day);
                            $(day).find("span.vfc-span-day").addClass("vfc-end-marked");
                            $(day).find("div.vfc-base-start").remove();
                            $(day).find("div.vfc-base-end").remove();
                        }
                    } else {
                        $(day).find("div.vfc-base-start").remove();
                        $(day).find("div.vfc-base-end").remove();
                    }
                });
            },
        },
        watch:{
            multiple(newVal, oldVal){

               this.updated = true;
               setTimeout(_ => {
                   this.updated = false;
               }, 10)
            },
        },
        mounted() {
        },
        updated() {
            this.renderCalendar();
        }
    }
</script>
<style lang="scss">
    .input-default{
        border: none;
        padding: 15px;
        width: 100%;
        border-bottom: 1px solid #e4e4e4
    }
    .required-logo{
        color:red;
    }
</style>
