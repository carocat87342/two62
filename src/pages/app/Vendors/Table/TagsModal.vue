<template>
  <div class="md-layout">
    <modal v-if="tagsModalOpen" @close="noticeModalHide" container-class="modal-container">
      <template slot="body">
        <h3 class="title">Tagging</h3>
        <div class="md-layout">
          <div class="md-layout-item md-size-95 mt-4 md-small-size-100">
            <div class="md-layout-item">
              <md-field>
                <label for="tag">Tags</label>
                <md-select v-model="tag" name="select">
                  <md-option v-for="(option, index) in tags" :key="index" :value="option">{{ option }}</md-option>
                </md-select>
              </md-field>
            </div>
          </div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import vendorsVuex from "../vendors.vuex";
import { Modal } from "@/components";
import Swal from "sweetalert2";
import Vendors from "@/models/Vendors";
import { SlideYDownTransition } from "vue2-transitions";

export default {
  components: {
    Modal,
    SlideYDownTransition,
  },
  props: {},
  data() {
    return {
      tagsModalOpen: false,
      tags: [],
      tag: " ",
    };
  },
  created() {
    this.$store.registerModule("vendors", vendorsVuex);
  },
  destroyed() {
    this.$store.unregisterModule("vendors", vendorsVuex);
  },
  computed: {
    ...mapState("vendors", ["vendorsMemberData"]),

    //      name: {
    //        get() {
    //          return this.vendorsMemberData.vendorDisplayName
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'vendorDisplayName', actualValue: value})
    //        },
    //
    //      },
    //
    //      address: {
    //        get() {
    //          return this.vendorsMemberData.vendorAddressLine1
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'vendorAddressLine1', actualValue: value})
    //        },
    //
    //      },
    //      email: {
    //        get() {
    //          return this.vendorsMemberData.vendorMainEmail
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'vendorMainEmail', actualValue: value})
    //        }
    //      },
    //      category: {
    //        get() {
    //          return this.vendorsMemberData.productsCategory
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'productsCategory', actualValue: value})
    //        }
    //      },
    //      web: {
    //        get() {
    //          return this.vendorsMemberData.vendorWebsite
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'vendorWebsite', actualValue: value})
    //        }
    //      },
    //      phoneNumber: {
    //        get() {
    //          return this.vendorsMemberData.vendorMainPhoneNumber
    //        },
    //        set(value) {
    //          this.setMemberProperty({key: 'vendorMainPhoneNumber', actualValue: value})
    //        }
    //      }
  },
  methods: {
    ...mapMutations("vendors", ["setMemberProperty"]),
    noticeModalHide: function () {
      this.tagsModalOpen = false;
    },
    toggleModal: function (show) {
      this.tagsModalOpen = show;
    },
  },
};
</script>
<style lang="scss">
</style>
