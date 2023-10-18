<template>
  <div class="white-card mt-40 delivery-setting">
    <collapse-panel>
      <template slot="header">
        <div class="d-flex align-center p-50">
          <img class="mr-30" :src="`${$iconURL}Campaign/Group 9136.svg`" />
          <div>
            <div class="font-size-30 font-bold-extra color-red">Delivery settings</div>
            <div class="mt-2 d-flex align-center">
              <span class="font-bold-extra font-size-30 pr-20">{{ inviteesCount }}</span>

              <span>In your invitees list</span>
            </div>
          </div>
        </div>
      </template>
      <template slot="content">
        <div class="delivery-setting-content pb-50">
          <div class="setting-item">
            <div class="check-wrapper">
              <md-checkbox v-model="settingData.phone.selected" class="md-checkbox-narrow"></md-checkbox>
              <div>
                <img :src="`${$iconURL}Campaign/group-9439.svg`" class="mr-10 ml-10" />
                <span class="font-size-22 font-bold-extra mr-30">By text message</span>
                <span>WhatsApp or sms </span>
              </div>
              <md-button class="md-icon-button md-simple collapse-button">
                <md-icon class="icon" v-if="settingData.phone.selected">keyboard_arrow_down</md-icon>
                <md-icon class="icon" v-if="!settingData.phone.selected">keyboard_arrow_right</md-icon>
              </md-button>
            </div>
            <div
              class="mt-50"
              v-if="
                settingData.phone.selected &&
                (currentCampaign.campaignStatus == 'EDITING' ||
                  currentCampaign.campaignStatus == 'TESTING' ||
                  currentCampaign.campaignStatus == 'SAVED')
              "
            >
              <div class="font-bold">To</div>
              <div class="d-flex align-start width-100">
                <div class="flex-1 position-relative">
                  <maryoku-textarea
                    type="phones"
                    placeholder="Paste all phone numbers here…"
                    hint="###-##-#######"
                    inputStyle="phone"
                    v-model="settingData.phone.numberString"
                    @change="handleInputEmails"
                  ></maryoku-textarea>
                  <invalid-address-panel
                    type="phone"
                    class="mt-30"
                    v-if="invalidPastedPhones"
                    :content="invalidPastedPhones"
                  ></invalid-address-panel>
                  <span class="ml-20 mt-10 input-tooltip-wrapper position-relative">
                    <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
                    <md-tooltip>
                      <div class="font-size-14 input-tooltip">###-##-#######</div>
                    </md-tooltip>
                  </span>
                </div>
                <span class="font-size-16" style="padding: 20px 40px">Or</span>
                <md-button
                  class="md-outlined md-simple maryoku-btn"
                  @click="choosePhoneExcel"
                  v-if="!settingData.phone.excelFileName"
                >
                  <img :src="`${$iconURL}Campaign/Group 9241.svg`" class="mr-10" />
                  <span class="color-red">Upload Excel list file</span>
                </md-button>
                <div v-else class="uploadedFile border-gray-1">
                  <div class="font-bold text-underline mb-10">
                    {{ settingData.phone.excelFileName }}
                  </div>
                  <md-button class="md-simple edit-btn" @click="choosePhoneExcel">
                    <span class="color-red">change</span>
                  </md-button>
                  <md-button class="md-simple edit-btn" @click="removeExcel('phone')">
                    <span class="color-red">remove</span>
                  </md-button>
                </div>
                <span class="ml-20 mt-10">
                  <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
                  <md-tooltip>
                    <div class="font-size-14 input-tooltip">
                      {{ tooltips.phoneExcel }}
                    </div>
                  </md-tooltip>
                </span>
              </div>
              <div class="mt-50 font-bold">How would you like to send your text?</div>
              <div class="mt-10">
                <md-checkbox
                  v-model="settingData.phone.smsOrWhatsapp"
                  class="md-checkbox-circle md-red mr-50"
                  value="sms"
                >
                  <span
                    :class="{
                      'font-bold': settingData.phone.smsOrWhatsapp === 'sms',
                    }"
                    class="p-5"
                    >By SMS</span
                  >
                </md-checkbox>
                <md-checkbox
                  v-model="settingData.phone.smsOrWhatsapp"
                  class="md-checkbox-circle md-red ml-50"
                  value="whatsapp"
                  disabled
                >
                  <img :src="`${$iconURL}Campaign/Image+74.png`" />
                  <span
                    :class="{
                      'font-bold': settingData.phone.smsOrWhatsapp === 'whatsapp',
                    }"
                    >By WhatsApp</span
                  >
                </md-checkbox>
              </div>
            </div>
            <div
              class="mt-50"
              v-if="
                (settingData.phone.selected && currentCampaign.campaignStatus == 'STARTED') ||
                currentCampaign.campaignStatus == 'SCHEDULED'
              "
            >
              <div class="mt-50">
                <div class="font-bold mb-10 line-height-2">
                  Sent to ({{ currentCampaign.guestSMS ? currentCampaign.guestSMS.length : 0 }})
                </div>
                <div class="d-flex align-start width-100">
                  {{ currentCampaign.settings.phone.numberString }}
                </div>
                <div class="font-bold mb-10 line-height-2 mt-50" v-if="settingData.phone.smsOrWhatsapp">
                  By {{ settingData.phone.smsOrWhatsapp }}
                </div>
                <div class="mt-20">
                  <md-button class="md-simple md-red edit-btn" @click="downloadUsersPhone">
                    <img :src="`${$iconURL}Campaign/excel.png`" class="mr-10" />Download Full Guests list
                  </md-button>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="check-wrapper">
              <md-checkbox v-model="settingData.email.selected" class="md-checkbox-narrow"></md-checkbox>
              <div>
                <img :src="`${$iconURL}Campaign/group-9437.svg`" class="mr-10 ml-10" />
                <span class="font-size-22 font-bold-extra mr-30">By email</span>
                <span>Enter recipients emails or upload Microsoft excel or Google sheets with guests list</span>
              </div>
              <md-button class="md-icon-button md-simple collapse-button">
                <md-icon class="icon" v-if="settingData.email.selected">keyboard_arrow_down</md-icon>
                <md-icon class="icon" v-if="!settingData.email.selected">keyboard_arrow_right</md-icon>
              </md-button>
            </div>
            <div
              v-if="
                settingData.email.selected &&
                (currentCampaign.campaignStatus == 'EDITING' ||
                  currentCampaign.campaignStatus == 'TESTING' ||
                  currentCampaign.campaignStatus == 'SAVED')
              "
            >
              <div class="mt-50">
                <label class="font-bold mb-10 line-height-2">Subject</label>
                <div class="width-60 position-relative">
                  <maryoku-input
                    placeholder="Type your email subject here…"
                    v-model="settingData.email.subject"
                  ></maryoku-input>
                </div>
              </div>
              <div class="mt-50">
                <label class="font-bold mb-10 line-height-2">From</label>
                <div class="width-60 position-relative">
                  <maryoku-input placeholder="Your email address…" v-model="settingData.email.from"></maryoku-input>
                  <span class="ml-20 mt-10 input-tooltip-wrapper position-relative">
                    <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
                    <md-tooltip class="emailTooltip">
                      Pick the email from which you wish the guests to get this mail
                    </md-tooltip>
                  </span>
                </div>
              </div>
              <div class="mt-50 font-size-14">
                <label class="mb-10 line-height-2">
                  <span class="font-bold mr-10 font-size-16">To</span>Make sure to put space / comma between each
                  address
                </label>
                <div class="d-flex align-start width-100">
                  <div class="width-60 position-relative">
                    <maryoku-textarea
                      placeholder="Paste all emails here…"
                      type="input"
                      inputStyle="emails"
                      hint="example : example@mail.com"
                      v-model="settingData.email.addressString"
                      @change="handleInputEmails"
                    ></maryoku-textarea>
                    <span class="ml-20 mt-10 input-tooltip-wrapper position-relative">
                      <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
                      <md-tooltip>
                        <div class="font-size-14 input-tooltip">example : example@mail.com</div>
                      </md-tooltip>
                    </span>
                    <invalid-address-panel
                      type="email"
                      class="mt-30"
                      v-if="invalidPastedEmails"
                      :content="invalidPastedEmails"
                    ></invalid-address-panel>
                  </div>
                  <span class="font-size-16" style="padding: 20px 40px">Or</span>

                  <!-- Emails Excel File Upload  -->
                  <md-button
                    v-if="!settingData.email.excelFileName"
                    class="md-outlined md-simple maryoku-btn"
                    @click="chooseEmailExcel"
                  >
                    <img :src="`${$iconURL}Campaign/Group 9241.svg`" class="mr-10" />
                    <span class="color-red">Upload Excel list file</span>
                  </md-button>
                  <div v-else class="uploadedFile border-gray-1">
                    <div class="font-bold text-underline mb-10">
                      {{ settingData.email.excelFileName }}
                    </div>
                    <md-button class="md-simple edit-btn mr-10" @click="chooseEmailExcel">
                      <span class="color-red">change</span>
                    </md-button>
                    <span class="ml-10 mr-10"></span>
                    <md-button class="md-simple edit-btn ml-10" @click="removeExcel('email')">
                      <span class="color-red">remove</span>
                    </md-button>
                  </div>
                  <span class="ml-20 mt-10">
                    <img class="ml-20" :src="`${$iconURL}Campaign/Group 9087.svg`" />
                    <md-tooltip>
                      <div class="font-size-14 input-tooltip">
                        {{ tooltips.emailExcel }}
                      </div>
                    </md-tooltip>
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="
                settingData.email.selected &&
                (currentCampaign.campaignStatus == 'STARTED' || currentCampaign.campaignStatus == 'SCHEDULED')
              "
            >
              <div class="mt-50">
                <div class="font-bold mb-10 line-height-2">Subject</div>
                <div class="width-60 position-relative">
                  {{ settingData.email.subject }}
                </div>
              </div>
              <div class="mt-50">
                <div class="font-bold mb-10 line-height-2">From</div>
                <div class="width-60 position-relative">
                  {{ settingData.email.from }}
                </div>
              </div>
              <div class="mt-50">
                <div class="font-bold mb-10 line-height-2">
                  Sent to ({{ currentCampaign.guestEmails ? currentCampaign.guestEmails.length : 0 }})
                </div>
                <div class="d-flex align-start width-100">
                  {{ currentCampaign.settings.email.addressString }}
                </div>
                <div class="mt-20">
                  <md-button class="md-simple md-red edit-btn" @click="downloadUsersEmailList">
                    <img :src="`${$iconURL}Campaign/excel.png`" class="mr-10" />Download Full Guests list
                  </md-button>
                </div>
              </div>
            </div>
          </div>

          <input
            style="display: none"
            id="execelFileInput"
            name="attachment"
            type="file"
            multiple="multiple"
            @change="onFileChange"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </div>
      </template>
    </collapse-panel>
  </div>
</template>
<script>
import { Modal, MaryokuInput, LocationInput, MaryokuTextarea, MaryokuResizableTextarea } from "@/components";
import CollapsePanel from "./CollapsePanel";
import InvalidAddressPanel from "./components/InvalidAddressPanel";
import { validateEmail, validPhoneNumber } from "@/utils/validation.util";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  components: {
    MaryokuInput,
    CollapsePanel,
    MaryokuTextarea,
    InvalidAddressPanel,
    MaryokuResizableTextarea,
  },
  props: {
    defaultSettings: {
      type: Object,
      default: () => ({
        phone: {
          selected: false,
          status: "ready",
          numberString: "",
          numberArray: [],
          excelFileName: "",
          excelFilePath: "",
          smsOrWhatsapp: "",
        },
        email: {
          selected: false,
          status: "ready",
          subject: "",
          from: "",
          addressString: "",
          addressArray: [],
          excelFileName: "",
          excelFilePath: "",
        },
      }),
    },
    campaign: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      settingData: {
        email: {
          addressString: "",
        },
        phone: {
          numberString: "",
        },
      },
      invalidPastedEmails: null,
      invalidPastedPhones: null,
      tooltips: {
        phoneExcel: "Please upload a csv file containing only phone numbers in a valid format.",
        emailExcel: "Please upload a csv file containing only email addresses in a valid format.",
      },
      fileInputType: "",
    };
  },
  created() {
    this.settingData = this.defaultSettings;
    // set default subject for email
    this.settingData.email.from = this.$store.state.auth.user.email || this.$store.state.auth.user.username;
    this.settingData.email.subject = this.emailSubject;
    this.settingData.phone.smsOrWhatsapp = "sms";
  },
  methods: {
    handleInputEmails({ value, type }) {
      const addresses = value.split(/[\s,]+/);
      let invalidEmails = "";
      if (type == "emails") {
        addresses.forEach((address) => {
          if (address && address.trim() && !validateEmail(address)) {
            if (!invalidEmails) invalidEmails = address;
            else invalidEmails = `${invalidEmails},${address}`;
          }
        });
        this.invalidPastedEmails = invalidEmails;
      } else if (type == "phone") {
        addresses.forEach((address) => {
          if (address && address.trim() && !validPhoneNumber(address)) {
            if (!invalidEmails) invalidEmails = address;
            else invalidEmails = `${invalidEmails},${address}`;
          }
        });
        this.invalidPastedPhones = invalidEmails;
      }
    },
    chooseEmailExcel() {
      document.getElementById("execelFileInput").click();
      this.fileInputType = "email";
    },
    choosePhoneExcel() {
      document.getElementById("execelFileInput").click();
      this.fileInputType = "phone";
    },
    removeExcel(type) {
      this.settingData[type].excelFileName = "";
      const input = document.getElementById("execelFileInput");
      input.value = "";
      if (type === "email") {
        this.settingData.email.addressString = "";
      } else {
        this.settingData.phone.numberString = "";
      }
    },
    onFileChange(event) {
      this.settingData[this.fileInputType].excelFileName = event.target.files[0].name;
      this.previewFiles(event.target.files[0]);
      //handle validation excel files.
      // this.coverImage = await getBase64(event.target.files[0])
    },
    previewFiles(file) {
      var reader = new FileReader();
      reader.onload = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        let sheetName = workbook.SheetNames[0];
        /* DO SOMETHING WITH workbook HERE */
        let worksheet = workbook.Sheets[sheetName];
        const arrayOfRecords = XLSX.utils.sheet_to_json(worksheet);
        const key = Object.keys(arrayOfRecords[0])[0];
        const values = [];

        // if the list start at header, then add the key
        if (validateEmail(key)) {
          values.push(key);
        }
        arrayOfRecords.forEach((r) => {
          const val = r[key];
          values.push(val);
        });
        if (this.fileInputType === "email") {
          this.settingData.email.addressString = values.join();
        } else this.settingData.phone.numberString = values.join();
      };
      reader.readAsArrayBuffer(file);
    },
    downloadUsersPhone() {
      this.exportXls(this.currentCampaign.guestSMS, "phonenumbers");
    },
    downloadUsersEmailList() {
      if (this.currentCampaign.guestEmails) {
        if (this.campaign.name === "RSVP") {
          this.$http.get(`${process.env.SERVER_URL}/1/rsvp/guests-excel/${this.event.id}`).then((res) => {
            const rsvpUsers = res.data;
            const guestData = [];
            this.currentCampaign.guestEmails.forEach((guest) => {
              if (rsvpUsers.findIndex((it) => it.email === guest.email) < 0) {
                guestData.push(guest);
              }
            });
            this.exportXls(rsvpUsers.concat(guestData), "emails");
          });
        } else {
          this.exportXls(this.currentCampaign.guestEmails, "emails");
        }
      }
    },
    exportXls(csvData, fileName) {
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";

      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, this.currentCampaign.campaignType + "_" + fileName + fileExtension);
    },
  },
  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    emailSubject() {
      const campaignData = this.$store.state.campaign;
      switch (this.campaign.name) {
        case "SAVING_DATE":
          return `Save the date - ${campaignData.SAVING_DATE ? campaignData.SAVING_DATE.title : this.event.title}`;
          break;
        case "RSVP":
          return `RSVP - ${campaignData.RSVP ? campaignData.RSVP.title : this.event.title}`;
          break;
        case "COMING_SOON":
          return `Coming soon - ${campaignData.COMING_SOON ? campaignData.COMING_SOON.title : this.event.title}`;
          break;
        case "FEEDBACK":
          return `Feedback - ${campaignData.FEEDBACK ? campaignData.FEEDBACK.title : this.event.title}`;
          break;
        default:
          return "";
      }
    },
    currentCampaign() {
      const currentCampaign = this.$store.state.campaign[this.campaign.name];
      if (!currentCampaign) return {};
      return currentCampaign;
    },
    inviteesCount() {
      if (this.currentCampaign) {
        const emailInvitees = this.currentCampaign.guestEmails ? this.currentCampaign.guestEmails.length : 0;
        const phoneInvitees = this.currentCampaign.guestSMS ? this.currentCampaign.guestSMS.length : 0;

        return emailInvitees + phoneInvitees;
      }
      return "";
    },
  },
  watch: {
    settingData: {
      handler(newValue) {
        this.$emit("change", newValue);
      },
      deep: true,
    },
    defaultSettings: {
      handler(newValue) {
        this.settingData = newValue;
        this.settingData.email.subject = this.emailSubject;
        if (!this.settingData.email.from)
          this.settingData.email.from = this.$store.state.auth.user.email || this.$store.state.auth.user.username;
      },
      deep: true,
    },
    emailSubject(newValue) {
      this.settingData.email.subject = newValue;
    },
  },
};
</script>
<style lang="scss" scoped>
.delivery-setting {
  &-content {
    margin: 0px 50px 0px 50px;
    .setting-item {
      padding: 40px 0;
      margin: 0 50px;
      border-top: solid 1px #767676;
      position: relative;
      .check-wrapper {
        display: flex;
        align-items: center;
      }
    }
  }
  .collapse-button {
    position: absolute;
    right: 0;
    .icon {
      font-size: 35px !important;
    }
  }
  .uploadedFile {
    padding: 10px 20px;
    text-align: center;
    border-radius: 3px;
    min-width: 200px;
  }
}
.input-tooltip {
  max-width: 250px !important;
  white-space: break-spaces;
  text-align: left;
}
.input-tooltip-wrapper {
  position: absolute;
  right: 10px;
  top: 5px;
}
</style>