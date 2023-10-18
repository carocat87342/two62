<template>
    <div class="md-layout" style="max-height: 100vh;">
        <vue-element-loading :active="working" spinner="ring" color="#FF547C"/>
        <div class="md-layout-item md-small-size-10 md-size-5" style="padding: 0; margin: 0;">
            <h4 class="md-title">
                <md-button @click="closePanel" class="md-button md-theme-default md-simple md-just-icon"><md-icon>arrow_back</md-icon></md-button>
            </h4>
        </div>
        <div class="md-layout-item md-small-size-90 md-size-95" style="max-height: 90vh; ">
            <h4 class="md-title" style="margin-bottom: 0; line-height: 51px;">
                Sign In to complete RSVP
            </h4>

            <div class="md-layout" style="overflow: auto; max-height: 90vh; margin-top: 24px;">
                <div class="md-layout-item mx-auto text-center">

                    <md-button class="md-just-icon-social md-google" @click="authenticate('google')">
                        <i class="fab fa-google-plus-g" style="font-size: 42px !important;width: 80px;height: 42px;"></i>
                    </md-button>

                    <h4 class="mt-3">or continue with your work email address</h4>

                    <md-field :class="[{'md-valid': !errors.has('email') && touched.email},{'md-error': errors.has('email')}]">
                        <label>Email Address</label>
                        <md-input v-model="email" type="email" data-vv-name="email" required v-validate="modelValidations.email" v-focus></md-input>
                    </md-field>
                    <md-field :class="[{'md-valid': !errors.has('password') && touched.password},{'md-error': errors.has('password')}]">
                        <label>Password</label>
                        <md-input v-model="password" type="password" data-vv-name="password" required v-validate="modelValidations.password"></md-input>
                        <div class='md-error' style="text-align: center; width: 100%;">{{error}}</div>
                    </md-field>

                    <div class="button-container">
                        <md-button @click="signup" class="md-success md-round mt-4" slot="footer">Continue</md-button>
                    </div>

                    <div class="title">
                        By signing up you agree to our <br/> <a href="https://www.maryoku.com/terms" target="_blank" style="background-color: #f2f2f2;">Terms of Use</a> and <a href="https://www.maryoku.com/privacy" target="_blank" style="background-color: #f2f2f2;">Privacy Policy</a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
  name: 'sign-in-sign-up-panel',
  components: {},
  props: {
    eventId: String
  },
  data () {
    return {
      serverURL: process.env.SERVER_URL,
      working: false,
      error: '',
      email: null,
      password: null,
      username: null,
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          min: 8
        },
        username: {
          required: true
        }
      },
      touched: {
        email: false,
        password: false,
        username: false
      }
    }
  },
  mounted () {

  },
  methods: {
    closePanel () {
      this.$emit('closePanel')
    },
    authenticate (provider) {
      this.loading = true
      const callback = btoa(`${document.location.href}?token=`)
      document.location.href = `${this.serverURL}/oauth/authenticate/${provider}?callback=${callback}`
    },
    signup () {
      this.working = true

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$auth.guestSignupOrSignin(this, {email: this.email, password: this.password, role: 'view', eventId: this.eventId}, (res) => {
            let statusCode = res.status || (res.response && res.response.status) || 401

            if (statusCode === 406) {
              this.error = 'This email is not listed for this event.'
              this.$forceUpdate()
              this.working = false
            } else if (statusCode === 401) {
              this.error = 'Sorry, wrong password, try again.'
              this.$forceUpdate()
              this.working = false
            } else if (statusCode === 200) {
              this.$auth.login(this, {
                email: this.email,
                password: this.password
              }, (success) => {
                // this.$router.push({ path: '/signedin', query: {token: success.access_token} });
                // hide singup modal

                this.$root.$emit('signed-in', success.access_token)
                this.closePanel()
                this.working = false
                // show Dietary Constraints Modal
                // this.setDietaryConstraintsModal({showModal : true});
              }, (failure) => {
                this.working = false
                if (failure.response.status === 401) {
                  this.error = 'Sorry, wrong password, try again.'
                  this.$forceUpdate()
                } else {
                  this.error = 'Temporary failure, try again later'
                  console.log(JSON.stringify(failure.response))
                  this.$forceUpdate()
                }
              })
            }
          })
        } else {
          this.working = false
        }
      })
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/md/_colors.scss';
</style>
