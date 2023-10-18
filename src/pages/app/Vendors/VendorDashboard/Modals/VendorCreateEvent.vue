<template>
  <modal class="vendor-create-event">
    <template slot="header">
      <div class="add-category-model__header">
        <h2 class="font-size-20 font-bold-extra">Give us a few details of the event</h2>
      </div>
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div class="position-relative">
        <Loader :active="isLoading" page="vendor"></Loader>
        <div class="row">
          <p class="mb-5 text-left text-bold">Date Of The Event</p>
          <maryoku-input
            :value="date"
            class="form-input width-50"
            placeholder="Choose date…"
            inputStyle="date"
            v-model="date"
            theme="purple"
          ></maryoku-input>
        </div>
        <div class="md-layout mt-30">
          <div class="md-layout-item md-size-50 p-0">
            <p class="mb-5 text-left text-bold">
              <img :src="`${iconUrl}Asset 522.svg`" class="mr-10" width="16" />From
            </p>
            <div class="event-time d-flex align-center">
              <vue-timepicker
                manual-input
                input-class="time-class"
                hide-dropdown
                format="hh:mm"
                v-model="startTime"
                hide-clear-button
              />
              <div class="am-field" @click="updateStartA()">
                <input type="text" v-model="amPack.start" readonly />
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-50 p-0">
            <p class="mb-5 text-left text-bold"><img class="mr-10" :src="`${iconUrl}Asset 522.svg`" width="16" />To</p>
            <div class="event-time d-flex align-center">
              <vue-timepicker
                manual-input
                input-class="time-class"
                hide-dropdown
                format="hh:mm"
                v-model="endTime"
                hide-clear-button
              />
              <div class="am-field" @click="updateEndA()">
                <input type="text" v-model="amPack.end" readonly />
              </div>
            </div>
          </div>
        </div>
        <div class="md-layout mt-30">
          <div class="md-layout-item md-size-50 p-0 text-left">
            <md-checkbox class="md-simple md-checkbox-circle md-vendor" v-model="isRegisteredCustomer" :value="true">
              Selection from the customer list
            </md-checkbox>
          </div>
          <div class="md-layout-item md-size-50 p-0 text-left">
            <md-checkbox class="md-simple md-checkbox-circle md-vendor" v-model="isRegisteredCustomer" :value="false">
              Unregistered customer
            </md-checkbox>
          </div>
        </div>
        <div class="mt-30 text-left" v-if="isRegisteredCustomer">
          <label class="font-bold">Company / Customer Name *</label>
          <autocomplete
            class="width-50 mt-5 md-purple medium-selector"
            placeholder="Type name of customer here..."
            :options="customers"
            :selectedValue="selectedCustomer"
            :label="['companyName', 'name']"
            @change="selectCustomer"
          ></autocomplete>
        </div>
        <div v-else class="text-left">
          <div class="mt-30 text-left">
            <label class="font-bold">Company Name</label>
            <maryoku-input inputStyle="company" class="width-50 mt-5 form-input" v-model="company"></maryoku-input>
          </div>
          <div class="mt-30 text-left">
            <label class="font-bold">Customer Name</label>
            <maryoku-input inputStyle="username" class="width-50 mt-5 form-input" v-model="customer"></maryoku-input>
          </div>
          <div class="mt-30 text-left">
            <label class="font-bold">Email *</label>
            <maryoku-input inputStyle="email" class="width-50 mt-5 form-input" v-model="email"></maryoku-input>
          </div>
          <md-checkbox v-model="addToCustomerList" class="md-vendor"
            >Add this customer to your regular customer list</md-checkbox
          >
        </div>
        <div class="text-left mt-30">
          <label class="font-bold">Number of Guests</label>
          <maryoku-input
            class="width-50 mt-5 form-input"
            v-model="guests"
            inputStyle="users"
            placeholer="Type the amount of guests here..."
          ></maryoku-input>
        </div>
        <div class="text-left mt-30">
          <label class="font-bold">Event Location</label>
          <div class="width-50 location-input">
            <location-input v-model="location"></location-input>
          </div>
        </div>
        <div class="form-group text-left mt-30 proposal">
          <label>Upload proposal *</label>
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            :useCustomSlot="true"
            @vdropzone-file-added="fileAdded"
            class="file-drop-zone upload-section text-center"
            v-if="!fileName"
          >
            <md-button class="md-outlined md-simple md-vendor md-sm">
              <img class="mr-5" :src="`${$iconURL}common/pin-dark.svg`" width="15" />
              Attach file
            </md-button>
            <div>Or</div>
            <div class="note">Drag your file here</div>
          </vue-dropzone>
          <div class="form-group attach-file text-left mt-30" v-else>
            <img class="mr-5" :src="`${$iconURL}common/pin-dark.svg`" width="15" />
            <a :href="`${fileUrl}`" class="color-black" target="_blank">{{ fileName }}</a>
            <span class="attach-trash" @click="fileName = null"><md-icon>close</md-icon></span>
          </div>
        </div>
        <div v-if="showError" class="md-error">{{ this.errorMessage }}</div>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-default md-simple cancel-btn md-bold" @click="close">Cancel</md-button>
      <md-button class="md-vendor add-category-btn md-bold" @click="createEvent">Done</md-button>
    </template>
  </modal>
</template>
<script>
import VueGoogleAutocomplete from "vue-google-autocomplete";
import { Modal, MaryokuInput } from "@/components";
import LocationInput from "../LocationInput";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import UserEvent from "@/models/UserEvent";
import moment from "moment";
import Autocomplete from "@/components/Autocomplete";
import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";
import Loader from "@/components/loader/Loader.vue";

export default {
  components: {
    Loader,
    Modal,
    MaryokuInput,
    VueTimepicker,
    LocationInput,
    Autocomplete,
    VueGoogleAutocomplete,
    vueDropzone: vue2Dropzone,
  },
  props: {
    defaultData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      date: null,
      startTime: {
        hh: "12",
        mm: "00",
      },
      endTime: {
        hh: "12",
        mm: "00",
      },
      amPack: {
        start: "AM",
        end: "AM",
      },
      isLoading: false,
      isRegisteredCustomer: true,
      company: null,
      customer: null,
      email: null,
      guests: null,
      location: null,
      link_proposal: null,
      attachment: null,
      addToCustomerList: false,
      customers: [],
      selectedCustomer: null,
      fileUrl: null,
      fileName: null,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 5,
        headers: { "My-Awesome-Header": "header value" },
      },
      showError: false,
      errorMessage: "",
    };
  },
  async created() {
    console.log("vendorCreateEvent.created", this.defaultData);
    this.isLoading = true;
    this.customers = await this.getVendorCustomers();
    this.companyName = this.defaultData.company;
    this.company = this.defaultData.companyName;
    this.location = this.defaultData.location;
    this.isRegisteredCustomer = this.defaultData.isRegisteredCustomer === false ? false : true;
    this.guests = this.defaultData.guests;
    this.email = this.defaultData.customer ? this.defaultData.customer.email : "";
    this.customer = this.defaultData.customer ? this.defaultData.customer.name : "";
    this.date = moment(this.defaultData.date || new Date()).format("MM.DD.YYYY");
    this.startTime.hh = moment(this.defaultData.startTime).format("hh");
    this.startTime.mm = moment(this.defaultData.startTime).format("mm");
    this.amPack.start = moment(this.defaultData.startTime).format("A");

    this.endTime.hh = moment(this.defaultData.endTime).format("hh");
    this.endTime.mm = moment(this.defaultData.endTime).format("mm");
    this.amPack.end = moment(this.defaultData.endTime).format("A");

    this.selectedCustomer = this.defaultData.customer;
    this.isLoading = false;
    console.log('selectedCustomer', this.selectedCustomer);
  },
  methods: {
    async getVendorCustomers() {
      let res = await this.$http
              .get(`${process.env.SERVER_URL}/1/vendors/${this.vendor.id}/customers?status=0&sort=&order=`);

      return res.data.customers;
    },
    selectCustomer(selectedCustomer) {
      this.selectedCustomer = selectedCustomer;
    },
    updateStartA() {
      if (this.amPack.start == "AM") {
        this.amPack.start = "PM";
      } else {
        this.amPack.start = "AM";
      }
    },
    updateEndA() {
      if (this.amPack.end == "AM") {
        this.amPack.end = "PM";
      } else {
        this.amPack.end = "AM";
      }
    },
    changeDate(date) {},
    close() {
      this.$emit("cancel");
    },
    validateValues() {
      if (!this.fileName) {
        this.showError = true;
        this.errorMessage = "You shoud upload proposal";
        return;
      }
    },
    createEvent() {
      if (!this.fileName) {
      }
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
        date: moment(this.date, "DD.MM.YYYY").format("YYYY-MM-DD"),
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
        vendorId: this.vendor.id,
      };
      if (this.selectedCustomer) {
        userEvent.customer = { id: this.selectedCustomer.id };
        userEvent.companyName = this.selectedCustomer.companyName;
        userEvent.customerName = this.selectedCustomer.name;
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
  },
  computed: {
    vendor() {
      return this.$store.state.vendor.profile;
    },
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
.attach-file {
  .attach-trash {
    cursor: pointer;
    display: none;
    background-color: white;
    border-radius: 50%;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    padding: 5px;
    margin-left: 10px;
  }
  &:hover {
    .attach-trash {
      display: inline;
    }
  }
}

.upload-section {
  border-color: #641856 !important;
}
</style>
