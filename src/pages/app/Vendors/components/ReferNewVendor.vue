<template>
  <div class="refer-new-vendor-wrapper">
    <h6>If you can't, Maybe someone else you know can?</h6>
    <div class="refer-cont">
      <div class="img-cont">
          <img :src="`${$iconURL}Submit Proposal/group-17528.svg`" />
      </div>
      <div class="left-side">
        <h4>
          Refer a new vendor
          <br />and get a commission
        </h4>
        <p>You have a chance to help us, the client & another vendor.</p>
      </div>
      <div class="right-side">
        <p>If the vendor you refer us to will be hired for this event, your will get a commision for your help</p>
        <a @click="referModal = true">
          refer a vendor
          <md-icon>navigate_next</md-icon>
        </a>
      </div>
    </div>
    <modal v-if="referModal" class="refer-vendor-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="refer-vendor-modal__header">
          <div class="title-cont">
            <img :src="`${$iconURL}Submit Proposal/group-17528.svg`" />
            <h3>
              Refer a new vendor
              <br />and get a commission!!
            </h3>
          </div>
          <div class="header-description">
            <p>Mark the related service and fill the vendor's details</p>
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconUrl}Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="body">
        <div class="refer-vendor-modal__body">
          <refer-modal-item
            v-for="(service, index) in referringServices"
            :category="service"
            :key="index"
            :iconUrl="iconUrl"
            :img="`${$iconURL}Budget Elements/${service.icon}`"
            @set="setVendorInfo"
            @cancel="removeVendorInfo"
          />
          <!-- <refer-modal-item :category="`Bar`" :iconUrl="iconUrl" :img="`${iconUrl}Asset 606.svg`" />
          <refer-modal-item :category="`Dj`" :iconUrl="iconUrl" :img="`${iconUrl}Asset 605.svg`" /> -->
        </div>
      </template>
      <template slot="footer">
        <div class="refer-vendor-modal__footer">
          <a class="cancel" @click="hideModal()">Cancel</a>
          <a class="cool" @click="referVendors()">Refer</a>
        </div>
      </template>
    </modal>
    <modal v-if="thanksModal" class="thank-you-modal" container-class="modal-container sl">
      <template slot="header">
        <div class="thank-you-modal__header">
          <div class="title-cont">
            <img :src="`${iconUrl}Group 5676 (2).svg`" />
          </div>
          <div class="header-description">
            <h3>Thank You!</h3>
            <p>We will let you know if this vendor is hired & credit you for your help!</p>
          </div>
        </div>
        <button class="close" @click="hideModal()">
          <img :src="`${iconUrl}Group 3671 (2).svg`" />
        </button>
      </template>
      <template slot="footer">
        <div class="thank-you-modal__footer">
          <button class="cool" @click="hideModal()">OK, Cool</button>
        </div>
      </template>
    </modal>
  </div>
</template>
<script>
import { Modal } from "@/components";
import ReferModalItem from "./ReferModalItem.vue";
import Vendors from "@/models/Vendors";
export default {
  name: "refer-new-vendor",
  components: {
    Modal,
    ReferModalItem,
  },
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    vendor: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      referModal: false,
      thanksModal: false,
      iconUrl: "https://static-maryoku.s3.amazonaws.com/storage/icons/NewSubmitPorposal/",
      referredVendors: {},
    };
  },
  methods: {
    showThanksModal() {
      this.referModal = false;
      this.thanksModal = true;
    },
    hideModal() {
      this.referModal = false;
      this.thanksModal = false;
    },
    setVendorInfo(vendorInfo) {
      // this
      console.log("vendorInfo", vendorInfo);
      this.referredVendors[vendorInfo.vendorCategory] = vendorInfo;
    },
    async referVendors() {
      console.log(this.referredVendors);
      for (let i = 0; i < Object.keys(this.referredVendors).length; i++) {
        const vendorCategory = Object.keys(this.referredVendors)[i];
        await this.$http.post(
          `${process.env.SERVER_URL}/1/vendors/refer/${this.referredVendors[vendorCategory].componentId}`,
          {
            isEditing: true,
            // referingVendor: new Vendors({ id: this.vendor.id }),
            referringVendorId: this.vendor.id,
            ...this.referredVendors[vendorCategory],
          },
        );
      }
      this.showThanksModal();
      this.referredVendors = {};
    },
    removeVendorInfo(category) {
      delete this.referredVendors[category];
    },
  },
  created() {
    console.log("Refer Modal", this.event);
  },
  mounted() {},
  computed: {
    referringServices() {
      return this.event.components.filter(
        (item) => item.componentId !== this.vendor.vendorCategory && item.componentId !== "unexpected",
      );
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.refer-new-vendor-wrapper {
  font-family: "Manrope-Regular", sans-serif;
  color: #050505;

  h6 {
    font-size: 16px;
    font-weight: bold;
    text-transform: none;
    margin-top: 60px;
    margin-bottom: 30px;
  }
  .refer-cont {
    display: flex;
    padding: 55px;
    background-color: #ffffff;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.08);

    .img-cont {
      margin-right: 33px;

      img {
        width: 84px;
        margin-right: 33px;
      }
    }
    .left-side {
      padding-right: 36px;
      border-right: 1px solid #641856;
      width: 60%;

      h4 {
        color: #641856;
        font-size: 30px;
        font-weight: 800;
        text-transform: capitalize;
        margin-top: 0;
        margin-bottom: 28px;
      }
      p {
        font-size: 14px;
        margin: 0;
      }
    }
    .right-side {
      padding-left: 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      p {
        font-size: 20px;
        color: #050505;
        width: 40%;
        margin: 0;
        line-height: 1.55;
      }
      a {
        color: #641856;
        font-size: 16px;
        font-weight: 600;
        text-transform: capitalize;
        cursor: pointer;

        i {
          color: #641856;
        }
      }
    }
  }

  .refer-vendor-modal {
    &__header {
      width: 100%;
      padding: 1rem;
      .title-cont {
        display: flex;
        align-items: center;

        img {
          width: 84px;
          margin-right: 30px;
        }
      }
      h3 {
        font-size: 30px;
        color: #641856;
        font-weight: 800;
        margin: 0;
        text-transform: capitalize;
        img {
          width: 84px;
        }
      }
      .header-description {
        p {
          font-size: 16px;
          font-weight: bold;
          line-height: 1.29;
          margin-top: 43px;
          margin-bottom: 7px;
        }
      }
      & + .close {
        background: transparent;
        border: none;
        position: absolute;
        top: 61px;
        right: 50px;
        color: #050505;
        cursor: pointer;
        img {
          width: 20px;
        }
      }
    }
    &__body {
      padding: 0 1rem;
    }
    &__footer {
      width: 100%;
      text-align: right;
      margin: 0 1.5rem;
      margin-top: -2rem;
      padding: 2rem 0 1rem 0;
      .cancel {
        font-size: 16px;
        font-weight: bold;
        color: #050505;
        background-color: transparent;
        padding: 8px 36px;
        cursor: pointer;
        border: none;
      }
    }
  }
  .thank-you-modal {
    &__header {
      width: 100%;
      display: flex;
      padding: 1rem;

      .title-cont {
        img {
          width: 90px;
          margin-right: 50px;
        }
      }
      .header-description {
        h3 {
          font-size: 30px;
          font-weight: 800;
          color: #641856;
          margin: 0;
          margin-bottom: 20px;
        }
        p {
          text-align: left;
          font-size: 20px;
          line-height: 1.55;
          margin: 0;
          margin-top: -4px;
          max-width: 400px;
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
      padding-left: 53px;
    }
    &__footer {
      margin-top: -6rem;
      padding: 1rem 2rem;
    }
  }
  .cool {
    font-size: 16px;
    font-weight: 800;
    color: #ffffff;
    background-color: #641856;
    border-radius: 3px;
    padding: 8px 36px;
    cursor: pointer;
    border: none;
  }
}
</style>
