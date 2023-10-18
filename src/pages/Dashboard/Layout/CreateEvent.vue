<template>
  <div class="create-event">
    <div class="top-header">
      <div class="header-content md-layout">
        <div class="logo md-layout-item md-size-50 md-small-size-40">
          <a href="https://www.maryoku.com">
            <img :src="`${$iconURL}Onboarding/maryoku-logo-dark%402x%403x.png`" width="200" />
          </a>
        </div>
        <div class="header-actions md-layout-item md-size-50 md-small-size-60">
          <ul class="actions-list unstyled">
            <md-button v-if="!isLoggedIn" class="md-simple md-black md-maryoku" @click="showSingupDialog">
              Already A User?
            </md-button>
            <md-menu v-else md-size="medium" md-align-trigger>
              <md-button class="md-simple md-black md-maryoku normal-btn" md-menu-trigger>
                {{ tenantUser.name ? tenantUser.name : tenantUser.username }}
              </md-button>
              <md-menu-content class="user-menu-content">
                <md-menu-item @click="logout">Logout</md-menu-item>
              </md-menu-content>
            </md-menu>
            <!-- <md-button v-else class="md-simple md-black md-maryoku"> {{tenantUser.name}}</md-button> -->
            <md-button class="md-simple md-just-icon question" @click="showSingupDialog">
              <img :src="`${$iconURL}Onboarding/question-dark.svg`" />
            </md-button>
          </ul>
        </div>
      </div>
    </div>

    <FadeTransition :duration="200" mode="out-in">
      <!-- your content here -->
      <router-view></router-view>
    </FadeTransition>

    <md-dialog :md-active.sync="shoWSignupModal" class="singin-form">
      <vue-element-loading :active="signUpLoading">
        <img src="/static/img/maryoku-loader.gif" />
      </vue-element-loading>
      <md-dialog-title class="text-center">
        Sign in
        <button class="close-btn" @click="closeSingupModal">
          <md-icon>close</md-icon>
        </button>
      </md-dialog-title>
      <md-dialog-content>
          <div class="social-line text-center">
              <md-button class="md-black md-maryoku md-simple md-google" @click="authenticate('google')">
                  <img :src="`${$iconURL}Signup/google-icon.jpg`" />
                  <span>Sign in with Google</span>
              </md-button>
              <div>Or</div>
          </div>
          <maryoku-input
              class="form-input"
              data-vv-name="email"
              v-validate="modelValidations.email"
              inputStyle="email"
              v-model="email"
              placeholder="Type email address here..."
          ></maryoku-input>
          <maryoku-input
              class="form-input"
              data-vv-name="password"
              v-validate="modelValidations.password"
              type="password"
              inputStyle="password"
              v-model="password"
              placeholder="Type password here..."
          ></maryoku-input>
          <div class="terms-and-conditions">
              <md-checkbox v-model="keepMe">Keep me signed in</md-checkbox>
          </div>
          <div class="md-error">{{ error }}</div>
          <md-button class="md-default md-red md-maryoku md-sm md-square custom-btn" @click="singup">Sign In</md-button>
          <div class="text-center">
              <!-- <a href class="forget-password">Forgot your password ?</a> -->
              <md-button class="md-black md-maryoku mt-4 md-simple mt-4">Forgot my password?</md-button>
          </div>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { MaryokuInput, SignInContent } from "@/components";
import AuthService from "@/services/auth.service";

export default {
  components: {
    FadeTransition,
    MaryokuInput,
    SignInContent,
  },
  data() {
    return {
      signUpLoading: false,
      showDialog: false,
      email: null,
      password: null,
      department: null,
      touched: {
        email: false,
        password: false,
        department: false,
      },
      modelValidations: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          min: 8,
        },
        department: {
          required: true,
        },
      },
      serverURL: process.env.SERVER_URL,
      keepMe: false,
      error: "",
    };
  },
  methods: {
    ...mapMutations("PublicEventPlanner", ["setEventProperty", "setSingupModal"]),
    closeSingupModal() {
      this.setSingupModal({ showModal: false });
    },
    showSingupDialog() {
      this.setSingupModal({ showModal: true });
    },
    goToSignin() {
      this.$router.push("/signin");
    },
    singup() {
      console.log('signup', this.email, this.password);
      this.loading = true;

      if (this.email && this.password) {
        this.$store
          .dispatch("auth/login", {
            email: this.email,
            password: this.password,
          })
          .then(
            () => {
              this.setSingupModal({ showModal: false });
              // this.redirectPage();
            },
            (error) => {
              this.loading = false;
              this.error = "Invalid email or wrong password, try again.";
              this.setSingupModal({ showModal: false });
            },
          );
      }

    },
    authenticate(provider) {
      this.loading = true;
      let tenantId = document.location.hostname.replace(".maryoku.com", "").replace(".", "_");
      const callback = btoa(
        `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/signedin?token=`,
      );
      document.location.href = `${this.$data.serverURL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`;
    },
    logout() {
      AuthService.logout()
        .then(() => {
          this.$store.dispatch("auth/logout");
        })
        .catch((err) => {
          this.$store.dispatch("auth/logout");
        });
    },
  },
  computed: {
    ...mapState("PublicEventPlanner", ["publicEventData", "shoWSignupModal", "currentStep"]),
    isLoggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    tenantUser() {
      return this.$store.state.auth.user;
    },
  },
  watch: {
    email() {
      this.touched.email = true;
    },
    password() {
      this.touched.password = true;
    },
    department() {
      this.touched.department = true;
    },
  },
  beforeRouteUpdate(to, from, next) {
    next();
  },
};
</script>
<style lang="scss">
$baseColor: #5c2153;

@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700|Rubik:400,500,700&display=swap");
.md-dialog.singin-form {
  border-radius: 10px;
  padding: 2em 40px;
  width: 428px;
  z-index: 9999999;
  height: auto;

  .md-dialog-container {
  }

  .md-dialog-title {
    color: $baseColor;
    position: relative;
    padding: 0;

    button {
      position: absolute;
      right: 0;
    }
  }
  .social-line {
    img {
      margin-right: 10px;
    }
  }
  .form-input {
    margin: 20px 0;
  }

  .md-dialog-content {
    padding: 0;
    overflow-x: hidden;
  }

  .custom-btn {
    width: 100%;
  }

  .close-btn {
    background: none !important;
    border: none !important;
    padding: 0;

    .md-icon {
      color: $baseColor !important;
    }
  }

  .md-dialog-actions {
    padding: 8px 0;
    margin-top: 3em;
  }
}
.create-event {
  .md-overlay {
    z-index: 21 !important;
  }
  .container {
    display: block !important;
    min-height: calc(100vh - 268px) !important;
  }

  .md-datepicker-dialog.md-theme-default {
    box-shadow: none;
    border: 1px solid #606060;
    border-radius: 14px;
    z-index: 999999999999999;
    height: auto;

    .md-datepicker-header {
      display: none;
    }
    .md-datepicker-body-footer {
      display: none;
    }

    .md-datepicker-days .md-datepicker-day-button {
      border-radius: 10px;
      width: 35px;
      min-width: 35px;
      height: 35px;
      line-height: 35px;
      &.md-datepicker-selected {
        background-color: $baseColor !important;
        box-shadow: none;
      }
    }
  }
  .user-menu-content {
    min-width: 150px;
    .md-list-item-content {
      font-size: 16px !important;
    }
  }

  .forget-password {
    text-align: center;
    margin: 0.7em auto;
    color: $baseColor !important;
    font-size: 14px;
    font-weight: 500;
    display: block;
  }
  .top-header {
    // background: #5c2153;
    height: 100px;
    //border-radius: 0 0 50% 50%;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 2em;
    }

    .logo {
      color: #fff;
      font-size: 22px;
    }
    .header-actions {
      text-align: right;
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        li {
          display: inline-block;

          &.user-info span {
            color: #fff;
            display: inline-block;
            padding: 0 1em;
          }
        }

        .md-button.question {
          box-shadow: 0 3px 17px 0 rgba(0, 0, 0, 0.15);
          background-color: #ffffff !important;
          border-radius: 50%;
        }
      }
    }
  }

  .md-field {
    font-family: "Open Sans", sans-serif;
  }

  .md-field.purple-field {
    border-radius: 10px;
    padding: 0.5em 6px 0.4em;
    border: 1px solid #aaaaaa;
    min-height: 52px;

    label {
      top: 13px;
      color: #606060 !important;
      font-size: 15px;
      left: 43px;
    }

    .md-icon.md-theme-default.md-icon-font {
      color: #606060 !important;
      &:after {
        background: none !important;
      }
    }

    &.md-autocomplete {
      > .md-icon {
        position: absolute;
      }

      .md-menu {
        padding-left: 2.2em;
      }
    }
    .md-error:not(.md-input) {
      right: 13px;
      left: auto;
      top: 19px;
    }

    .md-input-action {
      background: none !important;
      box-shadow: none;
      top: 8px;
    }

    &:hover {
      border-color: $baseColor !important;
      cursor: pointer;

      .md-icon.md-theme-default.md-icon-font,
      label {
        color: $baseColor !important;
      }
    }

    &:not(.md-disabled):after {
      background: none !important;
    }
    &.md-theme-default:before {
      background: none !important;
    }
    .md-input {
      opacity: 0;
    }

    &.md-focused,
    &.md-has-value {
      background: #fff;
      padding: 0.4em 6px 0;
      border: 1px solid $baseColor;

      label {
        color: $baseColor !important;
        top: 13px;
      }
      .md-input {
        opacity: 1;
        padding: 0;
        margin-top: 6px;
        -webkit-text-fill-color: $baseColor !important;
      }
      .md-select-value {
        padding-left: 0.7em;
      }

      .md-icon.md-theme-default.md-icon-font {
        color: $baseColor !important;
      }
    }

    &.with-icon.md-focused label,
    &.with-icon.md-has-value label {
      top: 4px;
      font-size: 12px;
      color: gray !important;
      left: 2.6rem;
    }

    &:not(.with-icon) {
      label {
        left: 2em;
      }
      .md-input {
        padding-left: 1em;
      }

      &.md-focused,
      &.md-has-value {
        label {
          color: #818181 !important;
          top: 5px;
          font-size: 11px;
        }
      }
    }
  }
  .md-radio.md-checked .md-radio-container {
    border: 1px solid $baseColor !important;
    &:after {
      background-color: $baseColor !important;
    }
  }

  .md-radio.with-border {
    border: 1px solid #aaaaaa;
    padding: 1em 1em;
    border-radius: 10px;

    label {
      color: #606060;
      width: 100%;
      display: inline-block;
    }
    .md-radio-container {
      width: 23px;
      height: 23px;
      min-width: auto;
      top: 0;
    }

    &.md-checked {
      border: 1px solid $baseColor;

      .md-radio-label {
        color: $baseColor;
      }
    }
  }

  .section-header {
    // background: #5c2153;
    padding: 0.5em 0 1em;
    border-radius: 0 0 50% 50%;
    text-align: center;
    margin-bottom: 3em;
    font-family: "Rubik", sans-serif;

    .section-title {
      color: #fff;
      font-size: 30px;
      font-family: "Rubik", sans-serif;
      margin-top: 0;
    }
  }

  .steps-wizard-items {
    display: flex;
    flex: 1;
    flex-direction: row;
    background: #903482;
    border-radius: 20px;
    list-style: none;
    width: 200px;
    margin: 0 auto 20px;
    padding: 0;

    li {
      height: 3px;
      background: #fff;
      width: 14.2%;

      &:last-child:not(:first-child) {
        border-radius: 0 20px 20px 0;
      }

      &:first-child {
        border-radius: 20px 0 0 20px;
      }
    }
  }

  .form-section {
    position: relative;
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.13);
    background-color: #ffffff;
    .form-actions {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }

  .maryoku-field {
    margin: 0.5em 0 0;
    border: 1px solid #aaa;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-family: "Open Sans", sans-serif;
    cursor: pointer;
    position: relative;
    height: 56px;

    .md-error:not(.md-input) {
      position: absolute;
      font-size: 12px;
      right: 33px;
      left: auto;
      top: 18px;
      color: red;
      width: auto;
      display: block;
    }

    .md-icon {
      position: absolute;
      left: 8px;
      z-index: 2;
    }

    > label {
      position: absolute;
      left: 30px;
      margin: 0;
      font-size: 15px;
      pointer-events: none;
      z-index: 2;
    }

    .v-select {
      width: 100%;
    }

    .vs--open + label,
    .has-value + label {
      top: 4px;
      font-size: 12px;
      color: gray !important;
      left: 1.4rem;
    }

    .vs--open {
      .vs__selected {
        color: #efefef;
      }
      .vs__open-indicator {
        display: none;
      }
    }

    .vs__selected {
      position: absolute;
      top: 21px;
      left: 23px;
      z-index: 2;
      color: $baseColor;
    }

    .vs__selected-options {
      position: relative;

      input {
        background: none;
        font-size: 15px;
        padding: 1.5em 6px 0.9em 23px;
        border-radius: 10px;
        width: 100%;
        height: 100%;
        border: none !important;
        -webkit-appearance: none;

        &:focus {
          outline: none;
          box-shadow: none;
          background: #fff;
        }
      }
    }

    &.with-icon {
      > label {
        left: 43px;
      }

      .vs--open + label,
      .has-value + label {
        left: 2.6rem;
      }
      .vs__selected-options {
        input {
          padding: 1.5em 6px 0.9em 42px;
        }
      }

      .vs__selected {
        left: 41px;
      }
    }

    .vs__actions {
      position: absolute;
      top: 15px;
      right: 13px;
      z-index: 2;

      .vs__clear {
        background: none !important;
        border: none !important;
        opacity: 0.3;
        margin-right: -9px;
      }
    }

    .vs__dropdown-menu {
      position: absolute;
      background: #fff !important;
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      z-index: 9999999999999999999999999999 !important;
      border: 1px solid #aaa;
      border-radius: 10px;
      color: #606060;
      font-size: 16px;
      li {
        padding: 0.8em 1em;
        &:not(:last-child) {
          border-bottom: 1px solid #aaa;
        }
        &:hover {
          background: #f51355;
        }
      }
    }

    &.has-value {
      background: #fff;
      border-color: $baseColor !important;

      .vs__open-indicator {
        display: none;
      }

      .md-icon {
        color: $baseColor;
      }
    }
    &:hover {
      border-color: $baseColor;
      > label,
      .md-icon {
        color: $baseColor;
      }
    }
  }

  .md-menu-content:not(.md-select-menu),
  .md-select-menu {
    box-shadow: none;
    padding: 0;
    margin: 0;
    width: 350px !important;
    z-index: 9999999999999999999999 !important;
    max-width: none;

    .md-menu-content-container {
      margin: 0.5em 0 0;
      border: 1px solid #606060;
      border-radius: 10px;

      .md-list {
        padding: 0;

        .md-list-item {
          margin: 0;
          padding: 0.2em 0.5em;

          &:not(:last-child) {
            margin-bottom: 5px;
            border-bottom: 1px solid #aaaaaa;
          }

          .md-list-item-button {
            background-color: transparent;
            //color: $gray-dark !important;
            border-radius: 3px;

            &:hover {
              background: none !important;
              color: $baseColor !important;
              box-shadow: none;
            }

            .md-list-item-content {
              min-height: 38px;
              font-size: 14px;
              color: #606060;

              span {
                top: auto;
                left: auto;
                right: 0;
                padding-left: 15px;
                padding-right: 0px;
                font-weight: bold;
                color: #606060;
              }
            }
          }

          &:hover {
            background: none !important;
            color: $baseColor !important;
            box-shadow: none;
          }
        }
      }
    }
  }

  .back-section {
    position: absolute;
    top: 130px;
    height: calc(100% - 130px);
    width: 100px;
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: 0.4s cubic-bezier(0.55, 0, 0.55, 0.2);
    cursor: pointer;

    &:after {
      content: " ";
      position: absolute;
      left: -11px;
      height: 80%;
      width: 20px;
      border-radius: 50%;
      background-color: #aaa;
      z-index: 999999;
      opacity: 0.2;
    }

    .back-text {
      display: none;
      color: #606060;
    }

    &:hover {
      .back-text {
        display: inline-block;
      }

      &:after {
        left: -241px;
        width: 430px;
      }
    }
  }

  .md-select-menu .md-list-item.md-selected .md-list-item-button {
    box-shadow: none !important;

    .md-ripple {
      .md-list-item-text {
        color: $baseColor !important;
      }
    }
  }

  .form-group {
    position: relative;

    .md-checkbox {
      position: absolute;
      left: 104%;
      top: 0;
      width: 200px;
    }
  }

  .divider-or {
    position: relative;
    color: #aaa;
    font-size: 16px;
    font-weight: 500;

    &:before {
      content: " ";
      position: absolute;
      left: 0;
      top: 50%;
      width: 42%;
      height: 1px;
      background: #aaa;
    }
    &:after {
      content: " ";
      position: absolute;
      right: 0;
      top: 50%;
      width: 42%;
      height: 1px;
      background: #aaa;
    }
  }

  .google-singup {
    .md-ripple {
      background: #bababa;
      font-weight: bold;
    }

    .md-button-content {
      width: 100%;
      justify-content: center;
    }

    .md-icon {
      position: absolute;
      left: 0;
      top: 0;

      img {
        width: 44px !important;
        max-width: inherit;
      }
    }
  }

  .setting-title {
    font-family: "Manrope-bold";
    font-size: 30px;
    text-transform: uppercase;
  }
  .event-basic-info {
    text-align: center;
  }
  .indicator {
    margin-right: 20px;
    margin-top: -20px;
  }
  .title {
    font-family: "Manrope-Bold";
    font-size: 40px;
    text-align: center;
    line-height: 1.2em;
    margin: 20px;
    text-transform: uppercase;
    .step {
      padding: 20px;
      display: inline-block;
    }
  }
  .md-button.custom-btn {
    width: 256px;
    height: 56px;
    border-radius: 6px;
    min-width: 256px;

    .md-ripple {
      font-size: 15px;
      text-transform: initial;
      font-weight: bold;
    }
    &.md-default {
      margin-right: 1em;
    }

    &.disabled,
    &.opacity-btn {
      opacity: 0.3;
    }
  }
}

@media screen and (max-width: 500px) {
  .create-event {
    .top-header {
      height: 60px;
      .logo {
        img {
          width: 80px;
        }
      }
      .header-actions {
        padding: 0;

        ul {
          .md-button {
            border: none;
            box-shadow: none;

            .md-ripple {
              padding: 6px 0 !important;
            }
          }
          li.user-info {
            span {
              font-size: 12px;
              padding: 0;
            }
          }
        }
      }

      .header-content {
        padding: 0.5em;
        align-items: center;
      }
    }

    .container {
      padding: 10px 10px;
      display: block;
    }

    .md-button.custom-btn {
      width: 100%;
    }

    .form-group {
      .md-checkbox {
        position: relative;
        top: auto;
        left: auto;
        width: 100%;
      }
    }

    .section-header {
      border-radius: 0;
      margin-bottom: 1em;

      .section-title {
        font-size: 20px;
        margin-top: 0;
        padding: 0 1em;
      }
    }

    .back-section {
      margin: 0;
      height: 30px;
      width: 30px;
      left: 1em;
      right: 0;
      border-radius: 50%;
      background-color: #aaaaaa8c;
      top: 40px;

      .md-icon {
        color: #fff;
      }

      &:after {
        display: none;
      }
    }

    .start-working-item .md-checkbox {
      padding: 0 0.5em;
    }

    .form-section {
      width: 100% !important;
      padding: 15px !important;
      padding-bottom: 60px !important;
    }

    .form-actions {
      float: left;
      width: 100%;
      margin-top: 2em !important;

      &.two-btns {
        .md-button.custom-btn {
          min-width: auto;
          width: 100%;
        }
      }
    }
    .start-working-item .md-checkbox label {
      padding-left: 54px !important;
    }
    .vibe-item {
      width: 100% !important;
      margin-right: 0;
      margin-bottom: 1em;
      padding-right: 1em;
      display: flex !important;
      flex-direction: row;

      .md-radio.with-border {
        width: 76% !important;
        margin-bottom: 0;
      }
      > span {
        display: flex;
        text-align: center;
        flex: 1;
        justify-content: center;
        align-items: center;
        .md-icon {
          float: none;
          margin: 0;
        }
      }
      .md-radio.with-border label {
        font-size: 14px !important;
        width: 80% !important;
      }
    }

    .movie-item {
      width: 48% !important;
    }

    .section-header {
      margin-top: -1px;
    }

    .range-item .option {
      font-size: 12px !important;
    }

    .start-working-item {
      width: 100% !important;

      .md-checkbox {
        margin-right: 0;
      }
    }

    .event-created {
      .page-banner {
        h3 {
          font-size: 26px !important;
        }
      }
      .page-content {
        font-size: 16px !important;
        padding: 0 2em;
      }
    }
    .md-dialog.singin-form {
      bottom: auto;
      top: 10%;
      width: 90%;
    }

    .no-padding-mobile {
      padding: 0px;
    }
    .title {
      font-size: 30px;
      margin: 15px;
      .step {
        padding: 10px;
      }
    }
    .setting-title {
      font-size: 20px;
    }
    .indicator {
      width: 20px;
      margin-right: 10px;
      margin-top: -10px;
    }
  }
}

@media screen and (max-width: 380px) {
  .create-event {
    .maryoku-field,
    .md-checkbox,
    .md-radio,
    .md-field {
      input,
      label,
      .md-input {
        font-size: 13px !important;
      }
    }
    .md-datepicker .md-icon.md-date-icon ~ label {
      font-size: 13px !important;
    }

    .md-field.purple-field:not(.with-icon) {
      .md-input {
        padding-left: 0.8em !important;
      }
      label {
        left: 1.4em;
      }
    }
    .maryoku-field > label {
      left: 20px;
    }
    .md-dialog.singin-form {
      padding: 2em 20px;
      .custom-btn {
        min-width: initial;
      }
    }
    .md-dialog-container,
    .md-dialog-container .md-tabs {
      width: 100%;
    }
  }
}
</style>
