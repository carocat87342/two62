<template>
    <div class="md-layout justify-content-center align-center height-100vh">
        <vue-element-loading :active="loading" spinner="ring" color="#FF547C" isFullScreen/>
        <div class="md-layout-item md-size-30">
            <div class="d-flex flex-column">
                <img class="mx-auto" :src="`${$iconURL}Vendor%20Signup/Group%2019453.svg`"/>
                <div class="text-center font-size-30 font-bold color-black my-20">Reset Password</div>
            </div>
            <signup-card>
                <div v-if="!inValidToken" class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
                    <template v-if="succeded">
                        <div class="font-size-16 text-center font-bold">
                            Your password updated successfully.
                            <br/>
                            You can sign in with new password
                        </div>
                        <div class="d-flex justify-content-center">
                            <md-button class="md-simple normal-btn md-vendor mt-20" @click="toSignin">Go to Signin</md-button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="maryoku_input">
                            <input
                                class="form-input my-15"
                                type="password"
                                v-validate="'required|min:8'"
                                name="password"
                                placeholder="New password"
                                v-model="password"
                                ref="password"
                                @input="change"
                            />
                            <span class="md-error color-red" v-if="errors.has('password')">{{ errors.first('password') }}</span>
                        </div>
                        <div class="maryoku_input">
                            <input
                                class="form-input my-15"
                                type="password"
                                v-validate="'required|min:8|confirmed:password'"
                                name="pw_confirm"
                                v-model="confirm_password"
                                data-vv-as="password"
                                placeholder="Confirm password"
                                @input="change"
                            />
                            <span class="md-error color-red" v-if="errors.has('pw_confirm')">{{ errors.first('pw_confirm') }}</span>
                        </div>
                        <div class="form-buttons">
                            <md-button @click="updatePassword" class="md-default md-vendor md-maryoku mt-4" slot="footer">Update Password</md-button>
                        </div>
                    </template>

                </div>
                <div v-if="inValidToken" class="text-center md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
                    <div class="font-size-16 font-bold text-center">
                        The current token is expired.
                    </div>
                    <br/>
                    <md-button @click="toSignin" class="md-vendor md-default normal-btn md-simple">Signin</md-button>
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
                inValidToken: false,
                error: '',
                loading: false,
                firstname: null,
                terms: false,
                password: null,
                confirm_password: null,
                succeded: false,
                isForgot: false,
                serverURL: process.env.SERVER_URL,
                // auth: auth,
                touched: {
                    password: false,
                },
                submitted:false
            }
        },
        methods: {
            updatePassword () {
                console.log(this.$validator)
                const email = this.$route.query.email
                const token = this.$route.query.resetToken
                if (this.password !== this.confirm_password) return
                this.$validator.validateAll().then(isValid => {
                    console.log(this.$validator)
                    if (isValid) {
                        this.$http.post(`${process.env.SERVER_URL}/1/reset-password`, { username : email, token : token, password: this.password}, { 'ContentType': 'application/json' })
                            .then((resp) => {
                                console.log(resp)
                                this.loading = false
                                if (resp.status) {
                                    this.succeded = true
                                } else {
                                    this.error = resp.message
                                }
                            })
                            .catch((error) => {
                                console.error(error)
                                this.loading = false
                                if (error.response.status === 401) {
                                    this.error = 'Sorry, No such user name or password address.'
                                } else {
                                    this.error = 'Temporary failure, try again later'
                                }
                            })
                    } else  {
                        this.error = 'Invalid password. Minimum length is 8 letters.'
                    }
                })

            },
            toSingUp() {
                this.$router.push({ path: '/vendor/signup' })
            },
            toSignin() {
                this.$router.push({ path: '/vendor/signin' })
            },
            change(){
                this.error = '';
            }
        },
        watch: {
            password () {
                this.touched.password = true
            }
        },
        created () {
            const token = this.$route.query.resetToken
            this.$http.post(`${process.env.SERVER_URL}/1/check-password-token`, { token: token }, { 'ContentType': 'application/json' })
                .then((resp) => {
                    console.log(resp)
                    this.loading = false
                    if (resp.data.isValid) {
                        this.inValidToken = false
                    } else {
                        this.inValidToken = false;
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
                });
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
