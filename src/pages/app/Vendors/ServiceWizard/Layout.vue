<template>
  <div class="vendor-signup-layout-wrapper">
    <section class="header-wrapper" v-if="step > 0">
      <a href="https://www.maryoku.com">
        <img src="/static/img/maryoku-logo-dark.png" />
      </a>
      <v-signup-steps :step="step"></v-signup-steps>
    </section>
    <router-view></router-view>
    <section class="footer-wrapper">
      <div class="left d-flex align-center">
        <md-button class="md-vendor-signup md-simple md-vendor" @click="prev()">
          <md-icon class="color-red font-size-30">keyboard_arrow_left</md-icon>
          Back
        </md-button>
        <md-button
          v-if="step != 6"
          @click="scrollToTop()"
          class="md-button md-button md-simple md-just-icon md-theme-default scroll-top-button md-theme-default"
        >
          <span>
            <img :src="`${$iconURL}common/arrow-right-purple.svg`" class="upward-button" />
          </span>
        </md-button>
      </div>
      <div class="right">
        <md-button class="save md-vendor-signup md-simple md-vendor md-outlined" @click="saveDraft()">
          <img :src="`${$iconURL}common/save-purple.svg`" class="label-icon mr-10" />
          Save for later
        </md-button>
        <md-button class="approve md-vendor-signup md-vendor" @click="next">{{ nextLabel }}</md-button>
      </div>
    </section>
    <modal v-if="status" class="saved-it-modal" container-class="modal-container sm">
      <template slot="header">
        <div class="saved-it-modal__header">
          <h3>
            <img :src="`${proposalIconsUrl}Asset 588.svg`" />
            {{ status.title }}
          </h3>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${proposalIconsUrl}Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="saved-it-modal__body">
          <p>{{ status.message }}</p>
        </div>
      </template>
      <template slot="footer">
        <div class="saved-it-modal__footer">
          <button class="cool" @click="hideModal()">Ok, Thanks</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import VSignupSteps from "./VSignupSteps.vue";
import { Modal } from "@/components";
import Vendors from "@/models/Vendors";
import VendorService from "@/models/VendorService";
import Swal from "sweetalert2";
import { mapMutations, mapGetters } from "vuex";
import vendorServiceModule from "./state";
export default {
  components: {
    VSignupSteps,
    Modal,
  },
  data() {
    return {
      savedItModal: false,
      iconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      proposalIconsUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
    };
  },
  methods: {
    ...mapMutations("vendorService", ["setVendor", "setEditing", "setStep"]),
    goTo(router) {
      this.$router.push(router);
    },
    approve() {
      if (this.$store.state.vendorService.isEditing) {
        this.setStep(1);
      } else {
        if (this.validateBasicFields) {
          this.$set(this.vendor, "vendorCategory", this.vendor.vendorCategories[0]);
          this.$set(this.vendor, "vendorAddressLine1", this.vendor.vendorAddresses[0]);
          this.$set(this.vendor, "isEditing", true);
          this.$store
            .dispatch("vendorService/saveVendor", this.vendor)
            .then((res) => {
              this.setEditing(true);
              this.setStep(1);
            })
            .catch((error) => {
              if (error.message.indexOf("companyName") >= 0) {
                Swal.fire({
                  title: `Sorry, Company Name is duplicated. Please choose another.`,
                  buttonsStyling: false,
                  confirmButtonClass: "md-button md-success",
                }).then(() => {});
              } else {
                Swal.fire({
                  title: `An account with the name you entered already exists. Please choose a different name.`,
                  buttonsStyling: false,
                  confirmButtonClass: "md-button md-success",
                }).then(() => {});
              }
            });
        } else {
        }
        this.scrollToTop();
      }
    },
    next() {
      if (this.step < 6) {
        if (this.step === 5) {
          this.addService();
        }
        this.setStep(this.step + 1);
      } else {
        if (this.vendor.password == this.vendor.confirmPassword) {
          this.savedItModal = true;
          this.setStep(this.step + 1);
        } else {
        }
      }
      this.scrollToTop();
    },
    prev() {
      if (this.step > 1) {
        this.setStep(this.step - 1);
      } else {
        this.$router.push("/vendor/profile/services");
      }

      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    saveDraft() {
      // this.savedItModal = true;
      // this.addService();
      const title = "Success to save for later!";
      new Vendors({ ...this.vendor, isEditing: true })
        .save()
        .then((res) => {
          Swal.fire({
            title,
            buttonsStyling: false,
            confirmButtonClass: "md-button md-success",
          }).then(() => {});
        })
        .catch((error) => {});
    },
    hideModal() {
      this.$store.dispatch("vendorService/resetStatus");
    },
    camelize(str) {
      let temp = str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
      });
      return temp.charAt(0).toLowerCase() + temp.slice(1);
    },
    async addService() {
      let title = null;

      if (this.step === 7) {
        title = "Thank you for your sign up!";
      } else {
        title = "Success to save for later!";
      }

      new VendorService({
        ...this.service,
        vendor: { id: this.vendor.id },
      })
        .for(new Vendors({ id: this.vendor.id }))
        .save()
        .then((res) => {
          this.$router.push(`/vendor/profile/services`);
        });
    },
  },
  created() {
    this.$store.commit("vendorService/setStep", 1);
    this.$store.commit("vendorService/initState");
  },
  beforeCreate() {
    this.$store.registerModule("vendorService", vendorServiceModule);
  },
  beforeDestroy() {
    this.$store.unregisterModule("vendorService");
  },
  computed: {
    ...mapGetters({
      vendor: "vendorService/getVendor",
      step: "vendorService/getStep",
      validateBasicFields: "vendorService/validateBasicFields",
    }),
    nextLabel() {
      if (this.step == 5) {
        return "Sign Up";
      } else {
        return "Next";
      }
    },
    status() {
      return this.$store.getters["vendorService/getStatus"];
    },
    vendor() {
      return this.$store.state.vendorService.vendor;
    },
    service() {
      return this.$store.state.vendorService.service;
    },
  },
  watch: {
    step(newVal) {
      if (this.step === 7) this.addService();
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-signup-layout-wrapper {
  section.header-wrapper {
    width: 100%;
    border-radius: 3px;
    background-color: #ffffff;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    display: flex;
    z-index: 9999;

    a {
      margin: 68px 350px 68px 123px;
      flex: 0 0 113px;
      display: inline-block;
      img {
        width: 100%;
      }
    }
  }
  section.footer-wrapper {
    z-index: 9999;
    width: 100%;
    padding: 33px 124px;
    background-color: #ffffff;
    border-radius: 3px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
    text-align: right;
    display: flex;
    justify-content: space-between;
    a {
      display: inline-block;
      padding: 17px 55px;
      cursor: pointer;
      border-radius: 3px;
      font: 800 20px Manrope-Regular, sans-serif;
      display: inline-block;
      min-width: 268px;
      text-align: center;

      &.approve {
        border: 1px solid #f51355;
        color: #ffffff;
        background-color: #f51355;

        &.disabled {
          box-shadow: none;
          background-color: #818080;
          border: none;
          opacity: 0.5;
          pointer-events: none;
        }
        &:hover {
          color: #dddddd !important;
        }
      }
    }
    .upward-button {
      width: 20px;
      height: 15px;
      transform: rotate(-90deg);
    }
    &.approved {
      display: flex;
      justify-content: space-between;

      .left {
        a {
          &.back {
            color: #050505;
            font: 800 16px Manrope-Regular, sans-serif;
            img {
              width: 24px;
              transform: rotate(180deg);
            }
          }
        }
        span {
          cursor: pointer;
          width: 24px;
          box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);
          border-radius: 50%;
          img {
            width: 12px;
            transform: rotate(270deg);
          }
        }
      }
      .right {
        a {
          &.save {
            color: #f51355;
            border: 1px solid #f51355;
            margin-right: 40px;
            font: bold 20px Manrope-Regular, sans-serif;
            border-radius: 3px;
            img {
              width: 24px;
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
  .saved-it-modal {
    &__header {
      width: 100%;
      padding: 55px 31px 24px 31px;
      text-align: center;
      h3 {
        font-size: 30px;
        font-weight: bold;
        color: #f51355;

        img {
          width: 55px;
          height: 55px;
          margin-right: 15px;
        }
      }
      .header-description {
        max-width: 550px;
        margin: 0 auto;
        text-align: left;
        font-size: 20px;
        color: #050505;

        &.text-center {
          text-align: center;
        }
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 60px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      p {
        font: 800 20px Manrope-Regular, sans-serif;
      }
    }
    &__footer {
      padding: 10px 40px 40px 40px;
    }
  }
  .cool {
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    background-color: #f51355;
    border-radius: 3px;
    padding: 8px 36px;
    cursor: pointer;
    border: none;
  }
}
</style>
