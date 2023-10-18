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
        <p>Email</p>
        <input class="field" placeholder="Type your email here" v-model="vendor.email" @input="updateVendor('email')" />
        <p>Set Password</p>
        <input
          class="field"
          :class="{ 'red-border': password != confirmPassword && confirmPassword }"
          placeholder="Type password here"
          type="password"
          v-model="vendor.password"
          @input="updateVendor('password')"
        />
        <p>Confirm Password</p>
        <input
          class="field"
          :class="{ 'red-border': password != confirmPassword }"
          placeholder="Type password here"
          type="password"
          v-model="vendor.confirmPassword"
          @input="updateVendor('confirmPassword')"
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
      password: null,
      confirmPassword: null,
    };
  },
  created() {},
  mounted() {},
  methods: {
    updateVendor(fieldName) {
      this.$root.$emit("update-vendor-value", fieldName, this.vendor[fieldName]);
    },
  },
  computed: {},
  filters: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.vendor-signup-final-form-wrapper {
  font-family: Manrope-Regular, sans-serif;

  .inside-cont {
    width: 50%;
    max-width: 740px;
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
      padding: 60px 60px 30px 60px;

      p {
        margin: 0 0 14px 0;
        font: 800 16px Manrope-Regular, sans-serif;
      }
      .field {
        margin-bottom: 30px;
        padding: 22px 28px;
        width: 100%;
        max-width: 500px;
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
