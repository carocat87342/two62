<template>
    <div class="md-layout justify-content-center align-center height-100vh">
        <vue-element-loading :active="loading" spinner="ring" color="#FF547C" isFullScreen/>
        <div class="md-layout-item md-size-35">
            <div class="d-flex flex-column">
                <img class="mx-auto" :src="`${$iconURL}Vendor%20Signup/Group%2019453.svg`"/>
                <div v-if="!submitted" class="text-center font-size-30 font-bold color-black my-20">Forgot your Password?</div>
                <div v-else class="text-center font-size-30 font-bold color-black my-20">Check your email</div>
            </div>
            <signup-card>
                <div class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
                    <p class="font-size-16 text-center font-bold" v-if="!submitted">Please enter the email address you used to create your Maryoku account:</p>
                    <p class="font-size-16 font-bold" v-else>We have sent a temporary password & instructions to your email.</p>
                    <maryoku-input
                        :disabled="submitted"
                        class="form-input mb-10"
                        v-validate="modelValidations.email"
                        inputStyle="email"
                        v-model="email"
                        @change="changeEmail"
                        placeholder="Email address"
                    ></maryoku-input>
                    <div v-if="submitted" class="color-red font-size-14">Please check your email</div>
                    <div v-if="error" class="md-error">{{error}}</div>
                    <div class="form-buttons">
                        <md-button
                            @click="forgotPassword"
                            class="md-default md-vendor md-maryoku mt-4"
                            slot="footer"
                            :disabled="submitted"
                        >Send</md-button>
                    </div>
                    <div v-if="!submitted">
                        <p class="text-center">
                          If your email address is in our records, you will receive an email enabling you to create a temporary password that will be valid for 24 hours. Simply sign in using this temporary password and then replace it with a new permanent one.
                        </p>
                    </div>
                    <div class="d-flex flex-column" v-else>
                        <p class="text-center font-size-16 font-bold">Did not receive the email?</p>
                        <span class="text-center font-size-16 font-bold">Check your spam filter, or
                            <a class="color-vendor font-size-18" @click="reset">try another email address</a></span>
                    </div>
                </div>
            </signup-card>
            <div class="d-flex flex-column">
                <img class="mx-auto mt-100" :src="`${$iconURL}common/maryoku-logo-purple-1.png`">
            </div>
        </div>
    </div>
</template>

<script>
    import { SignupCard, MaryokuInput } from '@/components'
    import InputText from '@/components/Inputs/InputText.vue'
    import VueElementLoading from 'vue-element-loading'
    import Tenant from '@/models/Tenant'

    export default {
        components: {
            SignupCard,
            InputText,
            VueElementLoading,
            MaryokuInput
        },
        data () {
            return {
                error: '',
                loading: false,
                firstname: null,
                terms: false,
                email: null,
                password: null,
                isForgot: false,
                serverURL: process.env.SERVER_URL,
                // auth: auth,
                touched: {
                    email: false,
                    password: false
                },
                modelValidations: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                forgotPasswordValidations: {
                    email: {
                        required: true,
                        email: true
                    },
                },
                submitted:false
            }
        },
        methods: {
            forgotPassword () {
                this.$http.post(`${process.env.SERVER_URL}/1/forgot-password`, { email:this.email, field:'vendor' }, { 'ContentType': 'application/json' })
                    .then((resp) => {
                        console.log(resp)
                        this.loading = false
                        if (resp.data.status) {
                            this.submitted = true
                        } else {
                            this.error = resp.data.message
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                        this.loading = false
                        if (error.response.status === 401) {
                            this.error = 'Sorry, No such user name or email address.'
                        } else {
                            this.error = 'Temporary failure, try again later'
                        }
                    })
            },
            changeEmail(){
              this.error = null;
            },
            reset(){
              this.email = null;
              this.submitted = false;
            },
            toSingUp() {
                this.$router.push({ path: '/signup' })
            }
        },
        watch: {
            email () {
                this.touched.email = true
            }
        },
    }
</script>
<style lang="scss" scoped>
    p.description {
        font-size: 16px;
    }
    .md-error {
        color: red;
    }
    .form-input{
        margin:30px 0px;
        min-width: 300px;
    }
    .form-buttons {
        text-align: center;
    }
    .signin-contain {
        padding: 20px 60px;
    }
</style>
