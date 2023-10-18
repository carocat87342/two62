<template>
    <div class="position-relative">
        <md-button
            class="md-simple position-absolute"
            style="top: 0;right:0"
            @click="$emit('close')"
        >
            <md-icon>close</md-icon>
        </md-button>
        <div class="text-left">
            <h3 class="font-size-24 font-bold-extra m-0">Customer Details</h3>
            <p class="font-size-14">You can input the information by clicking on it</p>
            <div class="md-layout">
                <div class="md-layout-item pl-0 md-size-45 mt-30">
                    <label>Company Name</label>
                    <maryoku-input
                        class="mt-5 form-input"
                        placeholder="Type the company name here..."
                        v-model="customerModel.companyName"></maryoku-input>
                </div>
                <div class="md-layout-item pl-0 md-size-45 mt-30 ml-auto">
                    <label>Contact Name</label>
                    <maryoku-input
                        placeholder="Type the contact name here..."
                        class="mt-5 form-input"
                        v-model="customerModel.name"
                    ></maryoku-input>
                </div>
                <div class="md-layout-item pl-0 md-size-45 mt-30">
                    <label>Location</label>
                    <location-input
                        class=" mt-5"
                        placeholder="Type the location here..."
                        theme="purple"
                        :value="customerModel.location"
                        v-model="customerModel.location">
                    </location-input>
                </div>
                <div class="md-layout-item pl-0 md-size-45 mt-30 ml-auto">
                    <label>EIN:</label>
                    <maryoku-input
                        placeholder="Type the EIN here..."
                        class="mt-5 form-input"
                        v-model="customerModel.ein"></maryoku-input>
                </div>

                <div class="md-layout-item pl-0 md-size-100 mt-30">
                    <label>Phone Number</label>
                    <maryoku-input
                        inputStyle="phone"
                        placeholder="Type the phone number here..."
                        class="mt-5"
                        v-model="customerModel.phone"
                    ></maryoku-input>
                </div>
                <div class="md-layout-item pl-0 md-size-100 mt-30">
                    <label>Email:</label>
                    <maryoku-input
                        class="mt-5"
                        inputStyle="email"
                        data-vv-name="email"
                        placeholder="Type the email address here..."
                        v-validate="'required|email|unique'"
                        v-model="customerModel.email"
                    ></maryoku-input>
                </div>
                <div class="md-error color-red font-size-14" v-if="errors.has('email')">{{ errors.first('email') }}</div>
                <div class="d-flex align-center mt-30 width-100">
                    <md-button class="md-simple md-black ml-auto mr-20" @click="$emit('close')">Cancel</md-button>
                    <md-button class="md-vendor" @click="save">{{action === 'create' ? 'Save' : 'Save Changes'}} </md-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { MaryokuInput, LocationInput } from "@/components";
    import { postReq, getReq } from "@/utils/token";
    import {Validator} from "vee-validate";

    export default {
        components: {
            MaryokuInput,
            LocationInput,
        },
        props:{
            customer:{
                type: Object,
                default: null,
            },
            name:{
                type: String,
            },
            vendorId:{
                type: String,
                default: null,
            },
            action:{
                type: String,
                default: 'create',
            }
        },
        data(){
            return {
                showBookedVendorModal: true,
                customerModel: this.action === 'edit' ? this.customer : {
                    companyName: null,
                    ein: null,
                    location : null,
                    name: this.name,
                    phone: null,
                    email: null,
                },
            }
        },
        mounted() {
            const isUnique = async value => {
                let customer = await getReq(`/1/customers?email=${value}&vendorId=${this.vendorId}`);

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
        methods:{
            changeAddress(address){
                console.log('changeAddress', address);
                this.customerModel.location = address;
            },
            save(){
                this.$validator.validateAll().then((isValid) => {
                    if (isValid) {
                        console.log('validate');
                        this.$emit('save', this.customerModel);
                    }
                })

            }
        },
        watch:{
            name(newVal){this.customerModel.name = newVal}
        }
    }
</script>
<style lang="scss" scoped>
</style>
