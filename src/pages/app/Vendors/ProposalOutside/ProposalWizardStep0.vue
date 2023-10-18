<template>
  <div class="white-card p-40">
    <Loader :active="isLoading" is-full-screen page="vendor"></Loader>
    <div class="font-size-30 font-bold">Tell us a little bit about the event</div>
    <div class="md-layout mt-30 selection-wrapper">
      <div class="md-layout-item md-size-50 p-0 text-left">
        <md-checkbox class="md-simple md-checkbox-circle md-vendor" v-model="isRegisteredCustomer" :value="true">
          Select from customer list
        </md-checkbox>
      </div>
      <div class="md-layout-item md-size-50 p-0 text-left">
        <md-checkbox class="md-simple md-checkbox-circle md-vendor" v-model="isRegisteredCustomer" :value="false">
          New customer
        </md-checkbox>
      </div>
    </div>
    <div class="mt-30 text-left">
      <label class="font-bold">Company / Customer Name</label>
      <Autocomplete
        class="width-50 mt-5 md-purple medium-selector"
        placeholder="Type name of customer here..."
        :options="customers"
        :label="['companyName', 'name']"
        :selectedValue="selectedCustomer"
        @change="selectCustomer"
        @input="searchCustomer"
      ></Autocomplete>
    </div>

    <div class="d-flex mt-40">
      <SelectableCard
        label="Corporate Event"
        value="corporation"
        :selected="eventOption"
        :icon="`${$iconURL}VendorsProposalPage/Group 17122.svg`"
        theme="purple"
        @change="eventOption = 'corporation'"
      ></SelectableCard>
      <SelectableCard
        label="Social Event"
        value="social"
        :icon="`${$iconURL}VendorsProposalPage/Group 17394.svg`"
        :selected="eventOption"
        @change="eventOption = 'social'"
        theme="purple"
      ></SelectableCard>
    </div>
    <div v-if="eventOption === 'corporation'" class="text-left mt-30">
      <label class="font-bold">Type of event:</label>
      <Multiselect
        class="width-50 mt-5 form-input md-purple"
        v-model="eventType"
        :options="eventTypes"
        :close-on-select="true"
        :clear-on-select="true"
        tag-placeholder="Add this as new tag"
        placeholder="Type to search category"
        label="name"
        track-by="key"
        :key="eventTypes.length"
      ></Multiselect>
    </div>
    <div class="text-left mt-30">
      <label class="font-bold">Number of guests</label>
      <MaryokuInput
        class="width-50 mt-5 form-input"
        v-model="numberOfParticipants"
        inputStyle="users"
        placeholer="Type the amount of guests here..."
      ></MaryokuInput>
    </div>
    <div class="text-left mt-30">
      <label class="font-bold">Event location</label>
      <div class="width-50 location-input">
        <location-input v-model="location" theme="purple"></location-input>
      </div>
    </div>

    <div class="row">
      <p class="mb-5 text-left text-bold">Date of the event</p>
      <CalendarInput
        :value="eventDate"
        class="form-input width-50"
        placeholder="Choose date…"
        inputStyle="date"
        theme="purple"
        @input="handleChangeDate"
      ></CalendarInput>
    </div>
    <div class="md-layout mt-30 width-50">
      <div class="md-layout-item md-size-50 p-0">
        <p class="mb-5 text-left text-bold"><img :src="`${iconUrl}Asset 522.svg`" class="mr-10" width="16" />From</p>
        <div class="event-time d-flex align-center">
          <VueTimepicker
            manual-input
            input-class="time-class"
            hide-dropdown
            format="hh:mm"
            v-model="from"
            @input="handleTimeChange('start')"
            hide-clear-button
          />
          <div class="am-field" @click="handleChangeAMPM('start')">
            <input type="text" v-model="amPack.start" readonly />
          </div>
        </div>
      </div>
      <div class="md-layout-item md-size-50 p-0">
        <p class="mb-5 text-left text-bold"><img class="mr-10" :src="`${iconUrl}Asset 522.svg`" width="16" />To</p>
        <div class="event-time d-flex align-center">
          <VueTimepicker
            manual-input
            input-class="time-class"
            hide-dropdown
            format="hh:mm"
            v-model="to"
            @input="handleTimeChange('end')"
            hide-clear-button
          />
          <div class="am-field" @click="handleChangeAMPM('end')">
            <input type="text" v-model="amPack.end" readonly />
          </div>
        </div>
      </div>
    </div>
    <modal v-if="showNewCustomerModal" container-class="modal-container customer-form bg-white">
      <template slot="body">
          <CustomerForm
              v-if="showNewCustomerModal"
              :vendorId="vendorData.id"
              :name="candidateName"
              @save="saveCustomer"
              @close="showNewCustomerModal = false" />
      </template>
    </modal>
  </div>
</template>
<script>
import moment from "moment";
import Customer from "@/models/Customer";
import UserEvent from "@/models/UserEvent";
import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";

const components = {
    Loader: () => import('@/components/loader/Loader.vue'),
    Modal: () => import('@/components/Modal.vue'),
    MaryokuInput: () => import('@/components/Inputs/MaryokuInput.vue'),
    CalendarInput: () => import('@/components/Inputs/CalendarInput.vue'),
    LocationInput: () => import('../VendorDashboard/LocationInput.vue'),
    VueTimepicker: () => import('vue2-timepicker/src/vue-timepicker.vue'),
    Autocomplete: () => import('@/components/Autocomplete/index.vue'),
    SelectableCard: () => import('@/components/SelectableCard.vue'),
    CustomerForm: () => import('../Form/CustomerForm.vue'),
    Multiselect: () => import('vue-multiselect'),
}

export default {
  components,
  props: {
    defaultData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      date: null,
      isLoading: false,
      isRegisteredCustomer: true,
      guests: null,
      link_proposal: null,
      attachment: null,
      fileUrl: null,
      fileName: null,
      candidateName: null,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 5,
        headers: { "My-Awesome-Header": "header value" },
      },
      from: { hh: "12", mm: "00" },
      to: { hh: "12", mm: "00" },
      eventOption: "corporation",
      showNewCustomerModal: false,
      selectedEventType: null,
    };
  },
  async created() {
    const vendorId = this.$route.params.vendorId;

    const payload = {
        vendorId: vendorId,
        params: {
            status: 0,
        }
    }
    await this.$store.dispatch("customer/getCustomers", payload);
    await this.$store.dispatch("common/getEventTypes");

    this.setEventTime();

  },
  mounted() {
      console.log('mounted.step0', this.selectedCustomer);
      const customerId = this.$route.query.customerId;
      if (customerId) {
          let customer = this.customers.find(it => it.id === customerId);
          let event = {...this.$store.state.proposalForNonMaryoku.eventData, customer}
          this.$store.commit("proposalForNonMaryoku/setValue", {
              key: "eventData",
              value: event,
          });
      }
  },
  methods: {
    setEventTime(){

      if (!this.$store.state.proposalForNonMaryoku.eventData || !this.eventDate[0] || !this.eventDate[1]) return;
      this.from = {
        hh: moment(this.$store.state.proposalForNonMaryoku.eventData.startTime * 1000).format("hh"),
        mm: moment(this.$store.state.proposalForNonMaryoku.eventData.startTime * 1000).format("mm"),
      };
      this.to = {
        hh: moment(this.$store.state.proposalForNonMaryoku.eventData.endTime * 1000).format("hh"),
        mm: moment(this.$store.state.proposalForNonMaryoku.eventData.endTime * 1000).format("mm"),
      };

    },
    handleChangeDate({multiple, date}){
      // console.log('handleChangeDate', multiple, date);
      let eventData = this.$store.state.proposalForNonMaryoku.eventData;

      if(multiple) {
        if (!date.dateRange.start.date || !date.dateRange.end.date) return;

        this.$store.commit("proposalForNonMaryoku/setValue", {key: 'eventData', value: {...eventData,
            startTime: this.getTimeFromFormat(date.dateRange.start.date, this.from, this.amPack.start, "YYYY-MM-D hh:mm a"),
            endTime: this.getTimeFromFormat(date.dateRange.end.date, this.to, this.amPack.end, "YYYY-MM-D hh:mm a"),
          }})

      } else {

        this.$store.commit("proposalForNonMaryoku/setValue", {key: 'eventData', value: {...eventData,
            startTime: this.getTimeFromFormat(date.selectedDate, this.from, this.amPack.start, "YYYY-MM-D hh:mm a"),
            endTime: this.getTimeFromFormat(date.selectedDate, this.to, this.amPack.end, "YYYY-MM-D hh:mm a"),
          }});
      }
    },
    handleTimeChange(type){

      if (!this.eventDate[0] || !this.eventDate[1]) return;

      let startDate = moment(this.eventDate[0]).format('YYYY-MM-DD');
      let endDate = moment(this.eventDate[1]).format('YYYY-MM-DD');

      let eventData = this.$store.state.proposalForNonMaryoku.eventData;
      if ( type === 'start' ) {
        let startTime = this.getTimeFromFormat(startDate, this.from, this.amPack.start, 'YYYY-MM-D hh:mm a');
        this.$store.commit('proposalForNonMaryoku/setValue', {key: 'eventData', value: {...eventData, startTime}})
      } else {
        let endTime = this.getTimeFromFormat(endDate, this.to, this.amPack.end, 'YYYY-MM-D hh:mm a');
        this.$store.commit('proposalForNonMaryoku/setValue', {key: 'eventData', value: {...eventData, endTime}})
      }
    },
    handleChangeAMPM(type) {

      if (!this.eventDate[0] || !this.eventDate[1]) return;

      let startDate = moment(this.eventDate[0]).format('YYYY-MM-DD');
      let endDate = moment(this.eventDate[1]).format('YYYY-MM-DD');

      let eventData = this.$store.state.proposalForNonMaryoku.eventData;

      if (type === 'start') {

        let arco  = this.amPack.start === 'am' ? 'pm' : 'am';
        let startTime = this.getTimeFromFormat(startDate, this.from, arco, 'YYYY-MM-D hh:mm a');
        this.$store.commit('proposalForNonMaryoku/setValue', {key: 'eventData', value: {...eventData, startTime}})

      } else {

        let arco = this.amPack.end === 'am' ? 'pm' : 'am';
        let endTime = this.getTimeFromFormat(endDate, this.to, arco, 'YYYY-MM-D hh:mm a');
        this.$store.commit('proposalForNonMaryoku/setValue', {key: 'eventData', value: {...eventData, endTime}})

      }

    },
    async saveCustomer(customer) {
      this.isLoading = true;
      this.showNewCustomerModal = false;
      let query  = new Customer({...customer, vendorId: this.vendorData.id, type: 1})
      let res = await query.save();

      this.customers.push(res);
      this.selectCustomer(res);
      this.$store.commit("proposalForNonMaryoku/setValue", {
        key: "customer",
        value: res,
      });

      this.isLoading = false;
    },
    searchCustomer(e){
      this.candidateName = e.target.value;
      let timeout = null;

      // show customer form modal if customer doesn't exist in search text
      let customers = this.customers.filter(c => c.name.toLowerCase().indexOf(this.candidateName.toLowerCase()) !== -1);

      if ( !customers.length && this.candidateName.length > 2) {
        timeout = setTimeout(_ => {
          this.showNewCustomerModal = true;
        }, 1000)
      } else {
        clearTimeout(timeout);
      }
    },
    selectCustomer(selectedCustomer) {
      this.selectedCustomer = selectedCustomer;
    },
    close() {
      this.$emit("cancel");
    },
    createEvent() {
      const startDate = moment(
        `${this.date} ${this.startTime.hh}:${this.startTime.mm} ${this.amPack.start}`,
        "DD.MM.YYYY hh:mm a",
      );
      const endDate = moment(
        `${this.date} ${this.endTime.hh}:${this.endTime.mm} ${this.amPack.end}`,
        "DD.MM.YYYY hh:mm a",
      );
      var dt = new Date();
      var tz = dt.getTimezoneOffset();
      const userEvent = {
        company: this.company,
        date: endDate.format("YYYY-MM-DD"),
        startTime: startDate,
        endTime: endDate,
        companyName: this.company,
        customerName: this.customer,
        email: this.email,
        guests: this.guests,
        location: this.location,
        eventType: this.eventType,
        timezone: tz,
        isRegisteredCustomer: this.isRegisteredCustomer,
        fileName: this.fileName,
        fileUrl: this.fileUrl,
      };
      if (this.selectedCustomer) {
        userEvent.customer = { id: this.selectedCustomer.id };
        userEvent.companyName = this.selectedCustomer.company;
      }
      new UserEvent(userEvent).save().then((res) => {
        this.$emit("save", res);
      });
    },
    getAddressData(addressData, placeResultData, id) {
      this.location = `${addressData.route}, ${addressData.administrative_area_level_1}, ${addressData.country}`;
    },
    async fileAdded(file) {
      const extension = file.type.split("/")[1];
      let fileName = new Date().getTime();
      this.fileName = file.name;
      let fileUrl = `https://maryoku.s3.amazonaws.com/events/proposal/${fileName}.${extension}`;

      S3Service.fileUpload(file, `${fileName}`, `events/proposal`).then((res) => {
        this.isLoading = false;
        this.fileUrl = fileUrl;
      });
    },
    getTimeFromFormat(date, time, a, format) {
      return moment(`${date} ${time.hh}:${time.mm} ${a}`, format).unix();
    },
  },
  computed: {
    eventData(){
      return this.$store.state.proposalForNonMaryoku.eventData;
    },
    vendorData() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
    eventTypes() {
      return this.$store.state.common.eventTypes;
    },
    selectedCustomer: {
      get() {
        return this.$store.state.proposalForNonMaryoku.eventData.customer;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setEventProperty", { key: "customer", value });
      },
    },
    eventType: {
      get() {
        return this.$store.state.proposalForNonMaryoku.eventData.eventType;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setEventProperty", { key: "eventType", value });
      },
    },
    location: {
      get() {
        return this.$store.state.proposalForNonMaryoku.eventData.location;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setEventProperty", { key: "location", value });
      },
    },
    numberOfParticipants: {
      get() {
        return this.$store.state.proposalForNonMaryoku.eventData.numberOfParticipants;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setEventProperty", { key: "numberOfParticipants", value });
      },
    },
    eventDate () {
        if (this.$store.state.proposalForNonMaryoku.eventData.startTime && this.$store.state.proposalForNonMaryoku.eventData.startTime)
          return [this.$store.state.proposalForNonMaryoku.eventData.startTime * 1000, this.$store.state.proposalForNonMaryoku.eventData.endTime * 1000];
        else return [null, null];
    },
    amPack () {
        if (
          this.$store.state.proposalForNonMaryoku.eventData.startTime &&
          this.$store.state.proposalForNonMaryoku.eventData.endTime
        )
          return {
            start: moment(this.$store.state.proposalForNonMaryoku.eventData.startTime * 1000).format("a"),
            end: moment(this.$store.state.proposalForNonMaryoku.eventData.endTime * 1000).format("a"),
          };
        else return { start: "am", end: "am" };
    },
    customers() {
        return this.$store.state.customer.customers;
    },
  },
  watch: {
    isRegisteredCustomer(newValue, oldValue) {
      if (!newValue) {
        this.showNewCustomerModal = true;
      }
    },
    eventData(newVal){this.setEventTime()}
  },
};
</script>
<style lang="scss" scoped>
.vendor-create-event {
  z-index: 40 !important;
  .location-input {
    position: relative;
    img {
      width: 20px;
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
    input {
      padding-left: 50px;
    }
  }
  /deep/ .picker-panel .purple span.vfc-span-day.vfc-today {
    background-color: transparent !important;
  }
  /deep/ .vfc-week .vfc-day span.vfc-span-day.vfc-hover:hover,
  .vfc-week .vfc-day span.vfc-span-day.vfc-hovered {
    background-color: #641856 !important;
    color: white !important;
    z-index: 100;
  }
}
.selection-wrapper {
  width: 70%;
}
.event-time {
  /deep/ .time-picker {
    width: unset;
    input {
      text-align: center;
      width: 110px;
      height: 45px;
      border-radius: 3px;
      font: normal 18px Manrope-Regular, sans-serif;
      border: solid 0.5px #bcbcbc !important;
    }
    .dropdown ul li:not([disabled]).active,
    .dropdown ul li:not([disabled]).active:hover,
    .dropdown ul li:not([disabled]).active:focus {
      background: #641856;
      color: #fff;
    }
  }

  .am-field {
    position: relative;
    cursor: pointer;

    &:before {
      position: absolute;
      content: ">";
      transform: translateX(50%) translateY(calc(100% + 1.2rem)) rotate(90deg);
      left: 40%;
      font-size: 20px;
      font-weight: 800;
    }
    input {
      width: 80px;
      height: 45px;
      cursor: pointer;
      border-radius: 3px;
      font: normal 18px Manrope-Regular, sans-serif;
      margin-left: 0.5rem;
      border: solid 0.5px #bcbcbc !important;
      text-align: center;
    }
  }
}
.upload-section {
  border-color: #641856 !important;
}
</style>
