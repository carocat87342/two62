<template>
  <div class="vendor-account-notification">
    <div>
      <notification-setting-item
        class="notification-settiong-item"
        v-for="setting in settings"
        :key="setting.name"
        :setting="setting"
        @change="changeNotification"
      ></notification-setting-item>
    </div>
    <div class="p-60">
      <phone-box :phoneNumer="vendorData.contactPhoneNumber"></phone-box>
    </div>
  </div>
</template>
<script>
import NotificationSettingItem from "../../components/NotificationSettingItem.vue";
import PhoneBox from "./PhoneBox.vue";
export default {
  components: { NotificationSettingItem, PhoneBox },
  data() {
    return {
      settings: [
        {
          name: "Messages",
          description: "Receive messages from Maryoku on new proposals requests",
          settingName: "messages",
          options: [
            { name: "Email", enabled: true, field: "email" },
            { name: "Text messages", enabled: false, field: "textMessage" },
          ],
        },
        {
          name: "Reminders",
          settingName: "reminders",
          description:
            "Receive proposal’s deadlines reminders, cancellations, pricing notices, and other reminders related to your activities on Maryoku.",
          options: [
            { name: "Email", enabled: true, field: "email" },
            { name: "Text messages", enabled: false, field: "textMessage" },
          ],
        },
        {
          name: "Promotions and tips",
          settingName: "promotionsAndTips",
          description:
            "Receive coupons, promotions, surveys, product updates, and inspiration from Maryuko and Maryoku’s partners.",
          options: [
            { name: "Email", enabled: true, field: "email" },
            { name: "Text messages", enabled: false, field: "textMessage" },
          ],
        },
        {
          name: "Policy and community",
          settingName: "policyAndCommunity",
          description:
            "Receive updates on events regulations and stay informed about advocacy efforts to create fair, responsible events laws in your community.",
          options: [
            { name: "Email", enabled: true, field: "email" },
            { name: "Text messages", enabled: false, field: "textMessage" },
          ],
        },
        {
          name: "Account support",
          settingName: "accountSupport",
          description:
            "Receive messages about your account, your events, legal notifications, security and privacy matters, and customer support requests. For your security, you cannot disable email notifications and we may contact you by phone or other means if needed.",
          options: [
            { name: "Email", enabled: true, field: "email" },
            { name: "Text messages", enabled: false, field: "textMessage" },
          ],
        },
      ],
    };
  },
  computed: {
    vendorData() {
      return this.$store.state.vendor.profile;
    },
  },
  created() {
    this.settings.forEach((setting) => {
      let storedSetting = this.vendorData.notificationSettings[setting.settingName];
      if (storedSetting) {
        setting.options.forEach((option) => {
          option.enabled = storedSetting[option.field];
        });
      }
    });
  },
  methods: {
    changeNotification(setting, option, value) {
      let notificationSettings = this.vendorData.notificationSettings;
      if (!notificationSettings) notificationSettings = {};
      if (!notificationSettings[setting]) {
        notificationSettings[setting] = { email: true, textMessage: false };
      }
      notificationSettings[setting][option] = value;
      this.$store.dispatch("vendor/updateProfile", { notificationSettings, id: this.vendorData.id });
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-account-notification {
  display: flex;
  flex-basis: 60% 40%;
  .notification-settiong-item {
    border-bottom: solid 2px #dbdbdb;
  }
}
</style>