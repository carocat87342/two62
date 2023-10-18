<template>
  <div>
    <div class="md-layout">
      <div class="md-layout-item md-small-size-100">
        <!--<div class="picture-container">-->
        <!--<div class="picture">-->
        <!--<div v-if="!image">-->
        <!--<img :src="avatar" class="picture-src" title="">-->
        <!--</div>-->
        <!--<div v-else>-->
        <!--<img v-model="image" :src="image"/>-->
        <!--</div>-->
        <!--<input type="file" @change="onFileChange">-->
        <!--</div>-->
        <!--<h6 class="description">Choose Picture</h6>-->
        <!--</div>-->
        <!--</div>-->
        <div class="md-layout-item md-size-95 md-small-size-100">
          <md-field
            :class="[
          {'md-valid': !errors.has('firstName') && touched.firstName},
          {'md-form-group': true},
          {'md-error': errors.has('firstName')}]"
          >
            <label>First Name</label>
            <md-input
              v-model="firstName"
              data-vv-name="firstName"
              type="text"
              name="firstName"
              required
              v-validate="modelValidations.firstName"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('firstName')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('firstName') && touched.firstName">done</md-icon>
            </slide-y-down-transition>
          </md-field>

          <!--<md-field :class="[-->
          <!--{'md-valid': !errors.has('userName') && touched.userName},-->
          <!--{'md-form-group': true},-->
          <!--{'md-error': errors.has('userName')}]">-->
          <!--<md-icon>face</md-icon>-->
          <!--<label>User Name</label>-->
          <!--<md-input-->
          <!--v-model="userName"-->
          <!--data-vv-name="firstName"-->
          <!--type="text"-->
          <!--name="userName"-->
          <!--required-->
          <!--v-validate="modelValidations.userName">-->
          <!--</md-input>-->
          <!--<slide-y-down-transition>-->
          <!--<md-icon class="error" v-show="errors.has('userName')">close</md-icon>-->
          <!--</slide-y-down-transition>-->
          <!--<slide-y-down-transition>-->
          <!--<md-icon class="success" v-show="!errors.has('userName') && touched.firstName">done</md-icon>-->
          <!--</slide-y-down-transition>-->
          <!--</md-field>-->

          <!--<md-field :class="[-->
          <!--{'md-valid': !errors.has('password') && touched.password},-->
          <!--{'md-form-group': true},-->
          <!--{'md-error': errors.has('password')}]">-->
          <!--<md-icon>face</md-icon>-->
          <!--<label>Password</label>-->
          <!--<md-input-->
          <!--v-model="password"-->
          <!--data-vv-name="password"-->
          <!--type="password"-->
          <!--name="password"-->
          <!--required-->
          <!--v-validate="modelValidations.password">-->
          <!--</md-input>-->
          <!--<slide-y-down-transition>-->
          <!--<md-icon class="error" v-show="errors.has('password')">close</md-icon>-->
          <!--</slide-y-down-transition>-->
          <!--<slide-y-down-transition>-->
          <!--<md-icon class="success" v-show="!errors.has('password') && touched.firstName">done</md-icon>-->
          <!--</slide-y-down-transition>-->
          <!--</md-field>-->

          <md-field
            :class="[
          {'md-valid': !errors.has('lastName') && touched.lastName},
          {'md-form-group': true},
          {'md-error': errors.has('lastName')}]"
          >
            <label>Last Name</label>
            <md-input
              v-model="lastName"
              data-vv-name="lastName"
              type="text"
              name="lastName"
              required
              v-validate="modelValidations.lastName"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('lastName')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('lastName') && touched.lastName">done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>

        <div class="md-layout-item md-size-95 md-small-size-100">
          <md-field
            :class="[
          {'md-valid': !errors.has('email') && touched.email},
          {'md-form-group': true},
          {'md-error': errors.has('email')}]"
          >
            <label>Email</label>
            <md-input
              v-model="emailAddress"
              data-vv-name="emailAddress"
              type="text"
              name="email"
              required
              v-validate="modelValidations.emailAddress"
            ></md-input>
            <slide-y-down-transition>
              <md-icon class="error" v-show="errors.has('email')">close</md-icon>
            </slide-y-down-transition>
            <slide-y-down-transition>
              <md-icon class="success" v-show="!errors.has('email') && touched.email">done</md-icon>
            </slide-y-down-transition>
          </md-field>
        </div>
        <div class="md-layout-item md-size-95 md-small-size-100">
          <md-field>
            <label for="select">Single Select</label>
            <md-select v-model="role" name="select">
              <md-option value="guest">Guest</md-option>
              <md-option value="collaborator">Collaborator</md-option>
            </md-select>
          </md-field>
        </div>
        <div class="md-layout-item md-size-95 md-small-size-100">
          <md-field>
            <label for="movies">Permission</label>
            <md-select v-model="permissions" name="permissions" id="permissions" multiple>
              <md-option value="View">View</md-option>
              <md-option value="Manage">Manage</md-option>
              <md-option value="Vote">Vote</md-option>
            </md-select>
          </md-field>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { SlideYDownTransition } from "vue2-transitions";
import teamVuexModule from "../../team.vuex";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: {
    SlideYDownTransition,
  },
  props: {
    avatar: {
      type: String,
      default:
        "https://static-maryoku.s3.amazonaws.com/storage/img/default-avatar.png",
    },
  },
  data() {
    return {
      name: "MultipleSelect",
      single: null,
      email: "",
      touched: {
        firstName: false,
        lastName: false,
      },
      modelValidations: {
        firstName: {
          required: true,
          min: 5,
        },
        lastName: {
          required: true,
          min: 5,
        },
        emailAddress: {
          required: true,
          email: true,
        },
        //                    username: {
        //                        required: true,
        //                        min: 5
        //                    },
        //                    password: {
        //                        required: true,
        //                        min: 5
        //                    }
      },
    };
  },
  computed: {
    ...mapState("teamVuex", ["teamMemberData"]),
    firstName: {
      get() {
        return this.teamMemberData.firstName;
      },
      set(value) {
        this.setMemberProperty({ key: "firstName", actualValue: value });
      },
    },
    lastName: {
      get() {
        return this.teamMemberData.lastName;
      },
      set(value) {
        this.setMemberProperty({ key: "lastName", actualValue: value });
      },
    },
    emailAddress: {
      get() {
        return this.teamMemberData.emailAddress;
      },
      set(value) {
        this.setMemberProperty({ key: "emailAddress", actualValue: value });
        this.setMemberProperty({ key: "username", actualValue: value });
      },
    },
    role: {
      get() {
        return this.teamMemberData.role;
      },
      set(value) {
        this.setMemberProperty({ key: "role", actualValue: value });
      },
    },
    permissions: {
      get() {
        return this.teamMemberData.permissions;
      },
      set(value) {
        this.setMemberProperty({ key: "permissions", actualValue: value });
      },
    },
    //                userName: {
    //                    get() {
    //                        return this.teamMemberData.userName
    //                    },
    //                    set(value) {
    //                        this.setMemberProperty({key: 'username', actualValue: value})
    //                    }
    //                },
    //            password: {
    //                get() {
    //                    return this.teamMemberData.password
    //                },
    //                set(value) {
    //                    this.setMemberProperty({key: 'password', actualValue: value})
    //                }
    //            },
    //          image: {
    //            get() {
    //              return this.teamMemberData.pictureUrl
    //            },
    //            set(value) {
    //              this.setMemberProperty({key: 'pictureUrl', actualValue: value})
    //            }
    //          }
  },
  created() {
    this.$store.registerModule("teamVuex", teamVuexModule);
  },
  methods: {
    ...mapMutations("teamVuex", ["setMemberProperty"]),
    handlePreview(file) {
      this.model.imageUrl = URL.createObjectURL(file.raw);
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      return this.$validator.validateAll().then((res) => {
        this.$emit("on-validated", res);
        return res;
      });
    },
    //                onFileChange(e) {
    //                var files = e.target.files || e.dataTransfer.files;
    //                if (!files.length) return;
    //                this.createImage(files[0]);
    //            }
    //            ,
    //            createImage(file) {
    //                var reader = new FileReader();
    //                var vm = this;
    //
    //                reader.onload = e => {
    //                    vm.image = e.target.result;
    //                };
    //                reader.readAsDataURL(file);
    //            }
  },
  watch: {
    firstName() {
      this.touched.firstName = true;
    },
    lastName() {
      this.touched.lastName = true;
    },
    email() {
      this.touched.email = true;
    },
    //            username() {
    //                this.touched.username = true;
    //            },
    //            password() {
    //                this.touched.password = true;
    //            }
  },
};
</script>
<style>
</style>
