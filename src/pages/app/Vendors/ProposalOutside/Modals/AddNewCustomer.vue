<template>
  <modal class="add-new-customer" containerClass="modal-container sm">
    <template slot="header">
      <div class="position-relative width-100">
        <div class="maryoku-modal-header pl-0">
            <h2>Customer information</h2>
        </div>
        <md-button
            class="position-absolute md-simple"
            style="right: 0;top: 0"
            @click="onCancel"
        >
            <md-icon>close</md-icon></md-button>
      </div>

    </template>
    <template slot="body">
      <div class="text-left">
        <div class="mt-30 text-left">
          <label class="font-bold">Company Name</label>
          <maryoku-input inputStyle="company" class="width-80 mt-5 form-input" v-model="company"></maryoku-input>
        </div>
        <div class="mt-30 text-left">
          <label class="font-bold">Who to contact</label>
          <maryoku-input inputStyle="username" class="width-80 mt-5 form-input" v-model="customer"></maryoku-input>
        </div>
        <div class="mt-30 text-left">
          <label class="font-bold">Email</label>
          <maryoku-input
              inputStyle="email"
              data-vv-name="email"
              v-validate="'required|email|unique'"
              class="width-80 mt-5 form-input"
              v-model="email"></maryoku-input>
        </div>
        <div class="md-error color-red font-size-14" v-if="errors.has('email')">{{ errors.first('email') }}</div>
        <div class="mt-30 text-left">
          <label class="font-bold">Phone</label>
          <maryoku-input inputStyle="phone" class="width-80 mt-5 form-input" v-model="phone"></maryoku-input>
        </div>
        <md-checkbox v-model="addToCustomerList" class="md-vendor">
          Add to customer list
        </md-checkbox>
      </div>
    </template>
    <template slot="footer">
      <md-button class="md-button md-black md-simple add-category-btn" @click="onCancel()">Cancel</md-button>
      <md-button class="md-vendor md-bold add-category-btn" @click="saveCustomer">Send</md-button>
    </template>
  </modal>
</template>

<script>
import { Modal, MaryokuInput } from "@/components";
import { postReq, getReq } from "@/utils/token";
import Customer from "@/models/Customer";
import { Validator } from "vee-validate";

export default {
  name: "sharing-modal",
  components: {
    Modal,
    MaryokuInput,
  },
  props: {
    show: [Boolean],
    value: [Number],
  },
  data: () => {
    return {
      company: null,
      customer: null,
      addToCustomerList: false,
      email: null,
      phone: null,
    };
  },
  created() {
    console.log('AddNewCustomer');
    const isUnique = async value => {
      let customer = await getReq(`/1/customers?email=${value}`);

      if (!customer.data || Array.isArray(customer.data) && !customer.data.length) {
          return {valid: true}
      } else {
          return {
              valid: false,
              data: {message: `Email already exists.`}
          }
      }
    }
    Validator.extend("unique", {
      validate: isUnique,
      getMessage: (field, params, data) => data.message
    });
  },
  methods: {
    saveCustomer() {
      console.log('saveCustomer', this.$validator)
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
            const customer = {
                companyName: this.company,
                name: this.customer,
                email: this.email,
                phone: this.phone,
                vendorId: this.vendor.id,
                type: 1,
            };
            new Customer(customer).save().then((res) => {
                console.log('saveCustomer', res);
                this.$emit("save", res);
            });
        }
      })

    },

    onCancel: function (e) {
      this.$emit("cancel");
    },
  },
  computed: {
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    },
  },
};
</script>
<style lang="scss" scoped>
.maryoku-modal-body {
  padding: 0 5px;
}
.add-category-btn {
  margin-right: 20px;
}
.sharing-role {
  margin-left: 10px;
  align-items: center;
}
.email-role-button {
  border: solid 1px #ffa4bc;
  margin-left: 15px;
  border-radius: 3px;
  max-height: 56px;
}
.spacer {
  border-bottom: solid 1px #dddddd;
  width: 100%;
  margin: 30px 15px;
}
.vue-input-tag-wrapper {
  .new-tag {
    box-shadow: none !important;
  }
}
textarea {
  padding: 20px 20px !important;
  min-height: 100px !important;
}
.checkbox-wrapper {
  min-width: 165px;
  margin-left: 10px;
}
.add-new-customer {
  .sharelink {
    input.sharing {
      padding-right: 60px !important;
      height: 60px;
    }
  }
  .form-input {
    width: 80%;
  }
}
</style>
