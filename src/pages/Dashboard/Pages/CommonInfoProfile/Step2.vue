<template>
  <div class="md-layout" style="margin-left: 160px; margin-right: 160px;">
    <vue-element-loading :active="loading" spinner="ring" color="#FF547C" isFullScreen />
    <div class="md-layout-item">
      <h2 class="title text-center" slot="title" style="text-align: center;">Oh, wow so that's you</h2>
      <signup-card
        style="padding-top: 32px; padding-bottom: 2px; padding-left: 0;min-width: 680px;"
      >
        <div class="md-layout-item md-size-5" slot="content-left"></div>
        <div class="md-layout-item md-size-80" slot="content-middle">
          <!-- Full Name -->
          <div class="md-layout">
            <div class="md-layout-item">
              <md-field>
                <label>First Name</label>
                <md-input
                  v-focus
                  v-model="firstName"
                  type="text"
                  autofocus
                  required
                  data-vv-name="firstName"
                  v-validate="modelValidations.firstName"
                ></md-input>
              </md-field>
              <md-field>
                <label>Last Name</label>
                <md-input
                  v-model="lastName"
                  type="text"
                  autofocus
                  required
                  data-vv-name="lastName"
                  v-validate="modelValidations.lastName"
                ></md-input>
              </md-field>
            </div>
          </div>

          <!-- Email Address -->
          <!--<div class="md-layout">
                        <label class="md-layout-item md-size-35 md-form-label">
                            Email Address
                        </label>
                        <div class="md-layout-item">
                            <md-field>
                                <md-input v-model="email" type="text" required data-vv-name="email" v-validate="modelValidations.email"></md-input>
                            </md-field>
                        </div>
          </div>-->

          <!-- Birthday -->

          <div class="md-layout" style="display: none;">
            <label class="md-layout-item md-size-35 md-form-label">Birthday</label>
            <div class="md-layout-item">
              <md-datepicker :name="birthday" autofocus></md-datepicker>
            </div>
          </div>

          <!-- First Day at work -->

          <div class="md-layout" style="display: none;">
            <label class="md-layout-item md-size-35 md-form-label">First day at work</label>
            <div class="md-layout-item">
              <md-datepicker :name="firstDayAtWork"></md-datepicker>
            </div>
          </div>

          <!-- Phone number -->
          <div class="md-layout" style="display: none;">
            <label class="md-layout-item md-size-35 md-form-label">Phone Number</label>
            <div class="md-layout-item">
              <!-- <vue-phone-number-input v-model="phoneNumber" @update="updatePhoneNumber" /> -->
            </div>
          </div>
        </div>

        <div class="md-layout-item md-size-5" slot="content-right"></div>

        <div
          class="md-layout-item md-size-100"
          style="text-align: right; padding-top: 48px;"
          slot="footer"
        >
          <div class="md-layout">
            <div class="md-layout-item md-size-100">
              <md-button class="md-simple pull-left" @click="skip">Skip</md-button>
              <md-button class="md-success pull-right" @click="next">Next</md-button>
              <md-button class="md-simple md-danger pull-right" @click="back">Back</md-button>
            </div>
          </div>
        </div>
      </signup-card>
    </div>
  </div>
</template>
<script>
// MAIN MODULES
import LightBox from 'vue-image-lightbox'
import { mapGetters } from 'vuex'

// HELPER FUNC
import { isWrong } from '@/utils/helperFunction'

// MODELS
import VueElementLoading from 'vue-element-loading'
import Me from '@/models/Me'
// import auth from '@/auth';

// COMPONENTS
import InputText from '@/components/Inputs/InputText.vue'
import Select from '@/components/Select/Select.vue'
import Title from '@/components/Title/Title.vue'
import Button from '@/components/Button/Button.vue'
import Autocomplete from '@/components/Autocomplete/Autocomplete.vue'
import { SignupCard } from '@/components'
import Places from 'vue-places'

export default {
  name: 'Employee',
  components: {
    InputText,
    Select,
    Title,
    Button,
    Autocomplete,
    LightBox,
    Places,
    SignupCard,
    VueElementLoading
  },
  data () {
    return {
      // auth: auth,
      loading: false,

      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      formattedNumber: '',
      birthday: 0,
      firstDayAtWork: 0,
      isError: false,
      touched: {
        email: false,
        firstName: false,
        lastName: false
      },
      modelValidations: {
        firstName: {
          required: true,
          min: 2
        },
        lastName: {
          required: true,
          min: 2
        },
        email: {
          required: true,
          email: true
        }
      }
    }
  },
  attributes () {
    return {
      ...this.$attrs,
      type: this.type,
      id: this.id,
      name: this.name,
      disabled: this.disabled,
      required: this.required,
      placeholder: this.placeholder,
      readonly: this.readonly,
      maxlength: this.maxlength
    }
  },
  mounted: function () {
    this.$auth.currentUser(this, true, () => {
      let user = this.$auth.user
      this.firstName = user.firstName
      this.lastName = user.lastName
      this.email = user.email
      /* this.phoneNumber = user.me.phoneNumber;
                this.formattedNumber = user.me.phoneNumber;
                this.birthday = user.me.birthday;
                this.firstDayAtWork = user.me.companyStartDate; */
    })
  },
  computed: {
    ...mapGetters({
      industryList: 'user/getIndustryList'
    })
  },

  methods: {
    updatePhoneNumber (data) {
      this.formattedNumber = data.formattedNumber
    },
    next () {
      this.loading = true
      new Me({
        id: this.$auth.user.id,
        onboarded: true,
        emailAddress: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        birthday: this.birthday,
        phoneNumber: this.formattedNumber,
        companyStartDate: this.firstDayAtWork
      })
        .save()
        .then(response => {
          this.$router.push({ name: 'GetStarted' })
        })
    },
    back () {
      this.loading = true
      this.$router.push({ name: 'Company' })
    },
    skip () {
      this.loading = true
      new Me({ id: this.$auth.user.id, onboarded: true })
        .save()
        .then(response => {
          this.$router.push({ name: 'AnnualPlanner' })
        })
    },
    openPicker () {
      this.$refs.inputFile.click()
    },
    submitForm: function () {
      this.validFunc(this)
      if (this.isError === false) {
        const info = isWrong(this, [
          'company_name',
          'main_office_adddress',
          'number_of_employees',
          'industry',
          'website'
        ])
        this.$store.dispatch('user/sendCompanyInfo', info)
        this.$router.push('/invite')
      }
    },
    onChange: function (selectedIndustry) {
      this.industry = selectedIndustry
    },
    validFunc: function (ctx, required) {
      const errorsObj = []
      if (ctx['company_name'] === '') {
        errorsObj.push('company_name')
      }
      if (ctx['main_office_adddress'] === '') {
        errorsObj.push('main_office_adddress')
      }
      if (errorsObj.length !== 0) {
        ctx.isError = true
      } else {
        ctx.isError = false
      }
    },
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length) return
      this.createImage(files[0])
    },
    createImage (file) {
      let reader = new FileReader()
      let _this = this
      console.log(file)
      reader.onload = e => {
        if (true) {
          this.isImageShow = true
          this.logo_name = file.name
          const newImage = {
            src: e.target.result,
            thumb: e.target.result
          }
          this.images.push(newImage)

          //     this.isModalLoading = true;
          //     let _calendar = new Calendar({id: this.$store.state.calendarId});
          //     let editedEvent = new CalendarEvent({id: this.event.id});
          this.logo_name = file.name
          console.log(e.target)
          return new CustomerFile({ customerFile: e.target.result })
            .save()
            .then(result => {
              _this.uploadedImages.push({
                src: e.target.result,
                thumb: e.target.result,
                id: result.id
              })
              this.isImageShow = true
              this.logo_name = file.name
              const newImage = {
                src: e.target.result,
                thumb: e.target.result
              }
              this.images.push(newImage)
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          _this.uploadedImages.push({
            src: e.target.result,
            thumb: e.target.result
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>
<style lang="scss" scope>
input[type="file"] {
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  position: absolute;
  clip: rect(0 0 0 0);
  border: 0;
}

.md-datepicker i {
  display: none;
}
.md-field.md-form-group:after,
.md-field.md-form-group:before,
.md-field.md-datepicker:after,
.md-field.md-datepicker:before {
  width: 100%;
}
.md-field > .md-icon ~ label {
  left: 0;
}
.md-field > .md-icon ~ .md-input {
  margin: 0;
}
/*.modal-container {*/
  /*max-width: 570px;*/
/*}*/
</style>
