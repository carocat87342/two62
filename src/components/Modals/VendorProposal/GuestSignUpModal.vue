<template>
  <modal :container-class="showSignupModal ? 'modal-container guest-signup bg-white w-max-450' :
         'modal-container guest-signup bg-white w-max-1100'" >
    <template slot="header">
      <md-button class="md-simple md-just-icon md-round modal-default-button" @click="close">
        <md-icon>clear</md-icon>
      </md-button>
    </template>
    <template slot="body">
      <div>
          <div class="md-layout" v-if="!showSignupModal">
              <div class="md-layout-item md-size-65">
                  <div class="w-max-450 mx-auto py-100">
                      <h2 class="font-size-30 font-bold-extra my-40" >Continue as a Guest</h2>
                      <MaryokuInput
                          inputStyle="username py-20"
                          v-model="name"
                          placeholder="Enter Your Name..."
                      ></MaryokuInput>
                      <div class="terms-and-conditions my-20">
                          <md-checkbox v-model="terms" class="mt-30">
                              <div>
                                  I agree
                                  <a
                                      href="https://www.maryoku.com/terms"
                                      target="_blank"
                                      class="font-size-18 font-bold-extra color-black ml-5">Terms & Conditions</a>
                              </div></md-checkbox>
                      </div>
                      <md-button class="md-red md-maryoku px-40 mt-20" @click="handle">Continue</md-button>
                  </div>

              </div>
              <div class="md-layout-item md-size-35 bg-light-pink">
                  <div class="d-flex flex-column align-center py-100">
                      <h2 class="font-size-30 font-bold-extra my-40">Member Login</h2>
                      <md-button class="md-simple md-outlined md-red md-white-back mx-auto py-5 mt-10"
                                 style="width: 250px;background-color: white!important;"
                                 @click="auth('signin')">Sign in</md-button>
                      <div class="line d-flex text-center mt-30 mb-10 py-10">
                          <span class="px-15">Or</span>
                      </div>
                      <md-button class="md-simple md-red py-5"
                                 style="width: 250px"
                                 @click="auth('signup')">Sign Up</md-button>
                      <p class="font-size-16">Create a new account, free of charge, to enjoy special offers & discounts!</p>
                  </div>
              </div>
          </div>
          <sign-in-content
              v-else
              :page="page"
              @signIn="signIn"
              @signUp="signUp"
              @changePage="changePage"
              @authenticate="authenticate"
          ></sign-in-content>
      </div>
    </template>
  </modal>
</template>
<script>
import { Modal } from "@/components";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";
import { SignInContent } from "@/components";

export default {
  components: {
    Modal,
    SignInContent,
    MaryokuInput,
  },
  props: {
    onlyAuth: {
      type: Boolean,
      default: false,
    }
  },
  created() {
  },
  data() {
    return {
      name: null,
      terms: false,
      page: '',
      showSignupModal: this.onlyAuth,
    }
  },
  methods: {
    close() {
      this.$emit("cancel");
    },
    addMoreMoney() {},
    auth(action){
      this.showSignupModal = true
      this.page = action;
    },
    changePage(){
      this.page = this.page === 'signin' ? 'signup' : 'signin';
    },
    signIn({email, password}){
      this.$emit('signIn', {email, password});
    },
    signUp({email, password, name, company}){
        this.$emit('signUp', {email, password, name, company});
    },
    handle(){
        console.log('save', this.terms, this.name)
        if(!this.terms || !this.name) return;
        this.$emit('save', this.name);
    },
    authenticate(provider){
      console.log('authenticate', provider);
      this.$emit('authenticate', provider);
    }
  },
  computed: {
  },
};
</script>
<style lang="scss" scoped>
div.line{
 &:before, &:after{
   display: inline-block;
   content: "";
   border-top: 1px solid #707070;
   width: 130px;
   margin-top: 25px;
   transform: translateY(-1rem);
 }
}
</style>
