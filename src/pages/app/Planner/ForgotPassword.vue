<template>
  <div class="md-layout">
    <vue-element-loading :active="loading" spinner="ring" color="#FF547C" isFullScreen/>
    <div class="md-layout-item">
      <div class="text-center font-size-40" style="text-align: center;color:#050505;">Reset Password</div>
      <signup-card>
        <div v-if="!submitted" class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
          <!-- <div class="social-line text-center">
            <h4 class="mt-3">Forgot Password</h4>
          </div> -->
          <maryoku-input class="form-input" v-validate="modelValidations.email" inputStyle="email" v-model="email" placeholder="Type email address here..."></maryoku-input>
          <div class="md-error">{{error}}</div>
          <div class="form-buttons">
            <md-button @click="forgotPassword" class="md-default md-red md-maryoku mt-4" slot="footer">ResetPassword</md-button>
            <!-- <br/>
            <md-button @click="isForgot=true" class="md-black md-maryoku mt-4  md-simple mt-4" slot="footer">Forgot my password?</md-button> -->
          </div>
        </div>
        <div v-else class="font-size-20 md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain" slot="content-right">
          You will get an email, and follow instructions in order reset your password.
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
    forgotPassword () {
      this.$http.post(`${process.env.SERVER_URL}/1/forgot-password`, { email:this.email }, { 'ContentType': 'application/json' })
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
    toSingUp() {
      this.$router.push({ path: '/signup' })
    }
  },
  watch: {
    email () {
      this.touched.email = true
    }
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
