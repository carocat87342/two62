<template>
  <div class="md-layout">
    <vue-element-loading :active="loading" spinner="ring" color="#FF547C" isFullScreen/>
    <div class="md-layout-item">
      <div class="text-center font-size-40" style="text-align: center;color:#050505;">Reset Password</div>
      <signup-card>
        <div v-if="!inValidToken" class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
          <template v-if="succeded">
            <div class="font-size-20 text-center">
              Your password updated successfully.
              <br/>
              You can sign in with new password
            </div>
            <div>
              <md-button class="md-simple normal-btn md-red" @click="toSignin">Go to Signin</md-button>
            </div>
          </template>
          <template v-else>
            <maryoku-input class="form-input" type="password" v-validate="modelValidations.password" inputStyle="password" v-model="password" placeholder="Type new password here..."></maryoku-input>
            <div class="md-error">{{error}}</div>
            <div class="form-buttons">
              <md-button @click="updatePassword" class="md-default md-red md-maryoku mt-4" slot="footer">Update Password</md-button>
            </div>
          </template>

        </div>
        <div v-if="inValidToken" class="text-center md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
          <div class="font-size-20">
            The current token is expired.
          </div>
          <br/>
          <md-button @click="toSignin" class="md-red md-default normal-btn md-simple">Signin</md-button>
        </div>
      </signup-card>
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
  methods: {
    updatePassword () {
      const email = this.$route.query.email
      const token = this.$route.query.resetToken
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
      this.$router.push({ path: '/signup' })
    },
    toSignin() {
      this.$router.push({ path: '/signin' })
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
          this.inValidToken = true;
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
  data () {
    return {
      inValidToken: false,
      error: '',
      loading: false,
      firstname: null,
      terms: false,
      password: null,
      succeded: false,
      isForgot: false,
      serverURL: process.env.SERVER_URL,
      // auth: auth,
      touched: {
        password: false,
        password: false
      },
      modelValidations: {
        password: {
          required: true,
          min: 8
        }
      },
      submitted:false
    }
  }
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
