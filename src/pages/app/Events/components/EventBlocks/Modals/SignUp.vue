<template>
    <div class="signup-modal">
        <div class="md-layout">
            <modal v-if="signUpModal">
                <template slot="header">
                    <div class="md-layout d-flex text-center">
                        <h2>I am {{isGoing === 'no' ? 'not' : ''}} going<br>to the event.
                        </h2>
                    </div>
                    <md-button class="md-simple md-just-icon md-round modal-default-button" @click="closeModal">
                        <md-icon>clear</md-icon>
                    </md-button>
                </template>
                <template slot="body">

                    <md-field :class="[{'md-valid': !errors.has('username') && touched.username},{'md-error': errors.has('username')}]">
                        <md-icon>face</md-icon>
                        <label>First Name</label>
                        <md-input v-model="username" data-vv-name="username" required v-validate="modelValidations.username"></md-input>
                    </md-field>

                    <md-field :class="[{'md-valid': !errors.has('email') && touched.email},{'md-error': errors.has('email')}]">
                        <md-icon>email</md-icon>
                        <label>Email</label>
                        <md-input type="email" v-model="email" data-vv-name="email" required v-validate="modelValidations.email"></md-input>
                    </md-field>

                    <md-field :class="[{'md-valid': !errors.has('password') && touched.password},{'md-error': errors.has('password')}]">
                        <md-icon>lock</md-icon>
                        <label>Password</label>
                        <md-input type="password" v-model="password" data-vv-name="password" required v-validate="modelValidations.password"></md-input>
                    </md-field>

                    <md-button class="md-info signup-btn md-round" @click="signup">
                        Sign up
                    </md-button>

                    <h4 class="mt-3">or sign up using Google / Linkedin</h4>
                    <md-button class="md-just-icon-social md-google" @click="authenticate('google')">
                        <i class="fab fa-google-plus-g" style="font-size: 42px !important;width: 80px;height: 42px;"></i>
                    </md-button>
                    <!--<md-button class="md-just-icon-social md-circle md-linkedin" @click="authenticate('linkedin')">
                        <i class="fab fa-linkedin" style="font-size: 42px !important;width: 80px;height: 42px;"></i>
                    </md-button>-->

                </template>
            </modal>
        </div>
    </div>
</template>
<script>

import { Modal } from '@/components'

export default {
  components: {
    Modal
  },
  props: {
    event: Object,
    isGoing: [Boolean, String],
    signUpModal: false

  },
  data: () => ({

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
  }),

  created () {

  },
  mounted () {

  },
  methods: {
    closeModal () {
      this.setSignUpModal({showModal: false})
    },
    authenticate (provider) {
      this.loading = true
      const callback = btoa(`${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/signedin?token=`)
      document.location.href = `${this.$data.serverURL}/oauth/authenticate/${provider}?callback=${callback}`
    },
    signup () {
      this.$parent.isLoading = true

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$auth.signupOrSignin(this, this.email, this.password, (data) => {
            this.$auth.login(this, {username: this.email, password: this.password}, (success) => {
              // this.$router.push({ path: '/signedin', query: {token: success.access_token} });
              // hide singup modal
              this.closeModal()

              // show Dietary Constraints Modal
              this.setDietaryConstraintsModal({showModal: true})

              this.$parent.isLoading = false
            }, (failure) => {
              this.$parent.isLoading = false
              if (failure.response.status === 401) {
                this.error = 'Sorry, wrong password, try again.'
              } else {
                this.error = 'Temporary failure, try again later'
                console.log(JSON.stringify(failure.response))
              }
            })
          })
        } else {
          this.loading = false
        }
      })
    }
  },
  computed: {

  },
  watch: {
    email () {
      this.touched.email = true
    },
    password () {
      this.touched.password = true
    },
    username () {
      this.touched.username = true
    }
  }

}
</script>
<style lang="scss" scope>
    .md-datepicker {
        .md-icon.md-date-icon {
            display: none;
            & ~ label {
                left: 0;
            }
        }
        input {
            margin-left: 0 !important;
        }
        &.md-field::before,
        &.md-field::after {
            width: 100%;
        }
    }

    .md-field > .md-icon ~ .md-input {
        margin: 0;
    }

    .modal-container {
        max-width: 400px;
    }

    .modal-z-index {
        z-index: 5;
    }

    .large-z-index {
        z-index: 6;
        position: relative;
    }

    .move-center {
        margin: 0 auto !important;;
    }

    .move-left {
        margin-left: 0 !important;
        margin-right: auto !important;
    }

    .move-right {
        margin-right: 0 !important;
        margin-left: auto !important;
    }

    .text-center {
        text-align: center;
    }

    .d-flex {
        display: flex;
    }

    .items-center-v {
        align-items: center;
    }

    .items-center-g {
        justify-content: center;
    }

    .justify-beetwen {
        justify-content: space-between
    }

    .md-field .md-error {
        text-align: left;
    }

    .swal2-container {
        z-index: 10000;
    }
</style>
