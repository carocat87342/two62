<template>
  <div class="vendor-signup-final-form-wrapper">
    <div class="inside-cont">
      <div class="title-cont">
        <div class="half text-center">
          <img :src="`${iconUrl}Group 5278 (2).svg`" />
        </div>
        <div class="half">
          <h3>almost done!</h3>
          <p>Just add a password and start creating proposals</p>
        </div>
      </div>
      <div class="card">
        <div class="text-center my-30">
          <md-button class="md-black md-maryoku md-simple md-google" @click="authenticate('google')">
              <img :src="`${$iconURL}Signup/google-icon.jpg`" class="mr-20"/>
              <span>Sign up with Google</span>
          </md-button>
        </div>
        <p>Email</p>
        <input class="field" placeholder="Type your email here" v-model="email" />
        <p>Set Password</p>
        <input
          class="field"
          :class="{ 'red-border': password != confirmPassword && confirmPassword }"
          placeholder="Type password here"
          type="password"
          v-model="password"
        />
        <p>Confirm Password</p>
        <input
          class="field"
          :class="{ 'red-border': password != confirmPassword }"
          placeholder="Type password here"
          type="password"
          v-model="confirmPassword"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import VueElementLoading from "vue-element-loading";
import Vendors from "@/models/Vendors";

//COMPONENTS
import Icon from "@/components/Icon/Icon.vue";
import VendorServiceItem from "../components/VendorServiceItem.vue";

export default {
  name: "vendor-signup-final-form",
  props: {
    categories: Array,
    icon: String,
    vendor: Object,
  },
  components: {
    VueElementLoading,
    VendorServiceItem,
  },
  data() {
    return {
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/Vendor Signup/",
      serverURL: process.env.SERVER_URL,
    };
  },
  created() {},
  mounted() {},
  methods: {
    authenticate(provider) {
      let action = this.$route.query.action;
      let tenantId = this.$authService.resolveTenantId();

      let callback = btoa(
          `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/vendor/signedin?vendorId=${this.vendor.id}&token=`,
      );

      console.log(`${this.$data.serverURL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`);
      document.location.href = `${this.$data.serverURL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`;
    },
    updateVendor(fieldName) {
      this.$root.$emit("update-vendor-value", fieldName, this.vendor[fieldName]);
    },
  },
  computed: {
    email: {
      get() {
        return this.$store.state.vendorSignup.email;
      },
      set(value) {
        this.$store.commit("vendorSignup/setField", { field: "email", value });
      },
    },
    password: {
      get() {
        return this.$store.state.vendorSignup.password;
      },
      set(value) {
        this.$store.commit("vendorSignup/setField", { field: "password", value });
      },
    },
    confirmPassword: {
      get() {
        return this.$store.state.vendorSignup.confirmPassword;
      },
      set(value) {
        this.$store.commit("vendorSignup/setField", { field: "confirmPassword", value });
      },
    },
  },
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-signup-final-form-wrapper {
  font-family: Manrope-Regular, sans-serif;

  .inside-cont {
    width: 50%;
    max-width: 640px;
    margin: 0 auto;

    .title-cont {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40px;

      .half {
        flex: 1;
        img {
          width: 200px;
        }
        h3 {
          margin: 0 0 20px 0;
          text-transform: uppercase;
          color: #f51355;
          font: 800 30px Manrope-Regular, sans-serif;
        }
        p {
          margin: 0;
          color: #050505;
          font: normal 20px Manrope-Regular, sans-serif;
          max-width: 280px;
        }
        &.text-center {
          text-align: center;
        }
      }
    }
    .card {
      background-color: #ffffff;
      box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
      padding: 30px 60px;

      p {
        margin: 0 0 14px 0;
        font: 800 16px Manrope-Regular, sans-serif;
      }
      .field {
        margin-bottom: 30px;
        // padding: 22px 28px;
        width: 100%;
        /*max-width: 500px;*/
        font: normal 16px Manrope-Regular, sans-serif;
        border: 1px solid #dddddd;
      }
    }
  }
  .red-border {
    border: 1px solid #f51355 !important;
  }
}
</style>
