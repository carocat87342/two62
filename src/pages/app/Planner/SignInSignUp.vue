<template>
  <div class="md-layout">
    <loader :active="loading" :isFullScreen="true"/>
    <div class="md-layout-item">
      <signup-card>
        <div
          class="md-layout-item md-size-100 md-medium-size-100 md-small-size-100 signin-contain"
          slot="content-right"
        >
          <div class="social-line text-center">
            <md-button class="md-black md-maryoku md-simple md-google" @click="authenticate('google')">
              <img :src="`${$iconURL}Signup/google-icon.jpg`" />
              <span>Sign in with Google</span>
            </md-button>
            <h4 class="mt-1">Or</h4>
          </div>
          <maryoku-input
            class="form-input"
            v-validate="modelValidations.email"
            inputStyle="email"
            v-model="user.email"
            placeholder="Type email address here..."
          ></maryoku-input>
          <maryoku-input
            class="form-input"
            v-validate="modelValidations.password"
            type="password"
            inputStyle="password"
            v-model="user.password"
            placeholder="Type password here..."
          ></maryoku-input>
          <div class="md-error">
            <div v-if="notFoundUser" class="font-size-16">
              Sorry, we couldn’t find you.
              <br />
              If you are not a user please sign up <span class="signupLink" @click="toSingUp">here</span>.
            </div>
            <div>{{ error }}</div>
          </div>
          <div class="terms-and-conditions mt-2">
            <md-checkbox v-model="keepMe"> Keep me signed in </md-checkbox>
          </div>
          <div class="form-buttons">
            <div>
              <md-button @click="signIn" class="md-default md-red md-maryoku mt-4" slot="footer">Sign In</md-button>
              <md-button @click="toSingUp" class="md-black md-maryoku mt-4 md-simple mt-4" slot="footer">
                Sign Up
              </md-button>
            </div>
            <md-button @click="toForgotPassword" class="md-black md-maryoku mt-4 md-simple mt-4" slot="footer">
              Forgot my password?
            </md-button>
          </div>
        </div>
      </signup-card>
    </div>
  </div>
</template>

<script>
import { SignupCard, MaryokuInput, Modal, Loader } from "@/components";
import { USER_TYPE } from "@/constants/user";
import InputText from "@/components/Inputs/InputText.vue";
import TenantUser from "@/models/TenantUser";
import CalendarEvent from "@/models/CalendarEvent";
import eventService from "@/services/event.service";
export default {
  name: "SignIn",
  components: {
    SignupCard,
    Modal,
    InputText,
    Loader,
    MaryokuInput,
  },
  mounted() {
    // console.log('mounted', this.$router.currentRoute);
  },
    methods: {
    authenticate(provider) {
      let action = this.$route.query.action;
      let isGuest = this.$router.currentRoute.path.indexOf('guest') !== -1;

      this.loading = true;
      let tenantId = this.$authService.resolveTenantId();

      let callback = btoa(
              `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/signedin?${isGuest?'userType=guest&token=':'userType=planner&token='}`,
      );

      if (action) {
        callback = btoa(
                `${document.location.protocol}//${document.location.hostname}:${document.location.port}/#/signedin?action=${action}${isGuest?'&userType=guest&token=':'&userType=guest&token='}`,
        );
      }

      document.location.href = `${this.$data.serverURL}/oauth/authenticate/${provider}?tenantId=${tenantId}&callback=${callback}`;
    },
    signIn() {
      this.loading = true;
      let isGuest = this.$router.currentRoute.path.indexOf('guest') !== -1;
      let that = this;
      this.$validator.validateAll().then((isValid) => {
        console.log(this.$validator);
        if (isValid) {
          if (this.user.email && this.user.password) {
            const userData = {
              email: `${this.user.email}/${isGuest ? 'guest' : 'planner'}`,
              password: this.user.password,
            };
            this.$store.dispatch("auth/login", userData).then(
              () => {
                if (this.keepMe) {
                  document.cookie = `rememberMe=true; path=/;`;
                }
                this.redirectPage();
              },
              (error) => {
                this.loading = false;
                this.notFoundUser = true;
                this.error = "";
              },
            );
          }
        } else {
          that.notFoundUser = false;
          that.error = "Sorry, invalid email or password, please check and try again";
          that.loading = false;
        }
      });
    },
    toSingUp() {
      let action = this.$route.query.action;
      if (action) {
        this.$router.push({ path: `/signup?action=${action}` });
      } else {
        this.$router.push({ path: `/signup` });
      }
    },
    toForgotPassword() {
      this.$router.push({ path: "/forgot-password" });
    },
    async redirectPage() {
      console.log("redirect.page", this.$route.query.action, this.currentUser);

      let action = this.$route.query.action;
      const tenantId = this.$authService.resolveTenantId();

      if (this.currentUser) {
        if (action === this.$queryEventActions.planner) {
          if (tenantId.toLowerCase() === "default" || !this.tenantUser.tenants || !this.tenantUser.tenants.includes(tenantId)) {
            const callback = btoa("/events");
            this.$router.push({ path: `/create-workspace?action=${action}&callback=${callback}` });
          } else {
            this.$router.push({ path: "/event-wizard-create" });
          }
        } else {
          if (this.currentUser.currentTenant === 'DEFAULT' && this.currentUser.tenants.length > 1) {
              this.$router.push({ path: "/choose-workspace" });
          }
          if (this.currentUser.currentTenant) {
            console.log("redirect.events");
            if(this.currentUser.currentUserType === USER_TYPE.PLANNER) { // get last event
                CalendarEvent.get().then((events) => {
                    if (events.length > 0) {
                        const gotoLink = eventService.getFirstTaskLink(events[0]);
                        this.$router.push({path: gotoLink});
                    } else this.$router.push({path: `/create-event-wizard`});
                });
            } else if (this.currentUser.currentUserType === USER_TYPE.GUEST) { // get last customer event
                let res = await this.$http.get(`${process.env.SERVER_URL}/1/events`, {
                        params: {filters:{myEvents: true}},
                    })
                let events = res.data;
                console.log('events', events);
                if (events.length > 0) {
                    this.$router.push({path: `/user-events/${events[0].id}/booking/choose-vendor`});
                }

            }
          } else if (this.currentUser.tenants.length === 0) {
            console.log("redirect.create-event-wizard");
            const callback = btoa("/create-event-wizard");
            this.$router.push({ path: `/create-workspace?callback=${callback}` });
          } else if (this.currentUser.tenants.length > 1) {
            this.$router.push({ path: "/choose-workspace" });
          } else if (this.currentUser.tenants.length == 1) {
            const firstWorksapce = `${this.$authService.getAppUrl(this.currentUser.tenants[0])}/#/events`;
            location.href = firstWorksapce;
          } else {
            this.$router.push({ path: "/error" });
          }
        }
      }
    },
  },
  data() {
    return {
      error: "",
      loading: false,
      user: new TenantUser("", ""),
      keepMe: false,
      serverURL: process.env.SERVER_URL,
      modelValidations: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          min: 8,
        },
      },
      forgotPasswordValidations: {
        email: {
          required: true,
          email: true,
        },
      },
      notFoundUser: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    tenantUser() {
      return this.$store.state.auth.user;
    },
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
};
</script>
<style lang="scss" scoped>
p.description {
  font-size: 16px;
}

h4.info-title {
  font-size: 18px;
  font-weight: 400;
}

.sorry-modal {
  font-family: "Rubik", sans-serif;

  &__header {
    width: 100%;
    padding: 8px 8px 0;
    display: flex;
    justify-content: center;

    h3 {
      text-align: center;
      margin: 0;
      color: #641956;
      font-size: 32px;
      font-weight: 400;
    }

    & + .close {
      background: transparent;
      border: none;
      position: absolute;
      top: 48px;
      right: 54px;
      color: #641956;
      cursor: pointer;

      i {
        color: #641956;
      }
    }
  }
  &__body {
    padding: 10px 40px;

    .forgot {
      display: block;
      color: #641956;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
    }
  }
  &__footer {
    width: 100%;
    padding: 10px 20px 20px 20px;
    .or-divider-wrapper {
      padding-bottom: 20px;
      color: #aaaaaa;
      display: flex;
      justify-content: center;
      align-items: center;

      .divider-item {
        height: 2px;
        background-color: #aaaaaa;
        width: 100%;
      }
      .or {
        padding: 0 22px;
        font-weight: bold;
      }
    }
    .cancel {
      width: 100%;
      height: 56px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      background-color: transparent;
      border-radius: 12px;
      cursor: pointer;
      border: none;
      margin-bottom: 56px;
    }
    .send {
      width: 100%;
      height: 56px;
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      background: #ff0066 0% 0% no-repeat padding-box !important;
      border-radius: 12px;
      padding: 8px 36px;
      cursor: pointer;
      border: none;
      box-shadow: 0px 12px 24px #ff006633;
    }
  }
}
.signin-page .md-card-signup {
  box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.13);
}
.md-error {
  color: red;
}
.form-input {
  margin: 30px 0px;
  min-width: 250px;
}
.form-buttons {
  text-align: center;
}
.signin-contain {
  padding: 20px 50px;
  max-width: 400px;
  .signupLink {
    cursor: pointer;
    text-decoration: underline;
  }
}
.md-google {
  span {
    padding-left: 20px;
  }
}
.ml-auto {
  background: #fff0f4;
  padding: 20px 30px 20px;
}
@media screen and (max-width: 500px) {
  .signin-contain {
    padding: 20px 20px;
  }
}
</style>
