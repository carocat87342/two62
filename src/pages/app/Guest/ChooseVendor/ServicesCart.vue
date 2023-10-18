<template>
  <div class="requirements-cart">
    <div class="requirements-cart-header">
      <div class="font-size-18 font-bold-extra">
          {{`MY CART (${cartItems.length} ITEM${cartItems.length > 1 ? 'S' : ''})`}}
      </div>

      <md-button class="md-simple close-btn" @click="close">
        <md-icon>close</md-icon>
      </md-button>
    </div>
    <div>
      <table width="100%">
          <tr v-for="item in cartItems"
              :key="`price-${item.key}`"
              class="d-flex align-center"
          >
              <td width="70%" class="d-flex align-center pl-40 py-20">
                  <img :src="`${$iconURL}Budget+Elements/${item.icon}`" style="width: 30px"/>
                  <div class="ml-10">
                      <p class="mb-5 font-size-14 font-bold-extra">{{ item.fullTitle }}</p>
                      <p class="m-0 font-size-14 color-black-middle">{{ cart[item.key].proposal.vendor.companyName }}</p>
                  </div>

              </td>
              <td width="20%" class="py-20">
                  ${{cart[item.key].proposal.cost | withComma}}
              </td>
              <td width="10%" class="pr-40 py-20">
                  <md-menu md-size="auto" class="action-menu" :md-offset-x="-300" :md-offset-y="-36" @md-opened="isOpened">
                      <md-button md-menu-trigger class="edit-btn md-simple" style="height: 30px">
                          <md-icon style="font-size: 30px !important">more_vert</md-icon>
                      </md-button>
                      <md-menu-content>
                          <md-menu-item @click="toFavorite(cart[item.key])" class="md-red">
                            <span>
                              <img :src="`${$iconURL}comments/SVG/heart-dark.svg`" class="label-icon-40 mr-10" />
                              Move to Favorite</span>
                          </md-menu-item>
                          <md-menu-item @click="removeCart(cart[item.key])" class="md-red">
                            <span>
                              <img :src="`${$iconURL}VendorsProposalPage/group-11314.svg`" class="label-icon ml-10 mr-20" />
                              Remove from Cart
                            </span>
                          </md-menu-item>
                      </md-menu-content>
                  </md-menu>
              </td>
          </tr>

          <tr class="d-flex align-center" style="background-color: #f8f8f8">
              <td class="py-20 font-size-16 font-bold-extra" width="70%" style="padding-left: 85px!important;">Total</td>
              <td class="py-20 font-bold-extra" width="20%">${{totalPrice | withComma}}</td>
              <td width="10%" class="py-20"></td>
          </tr>
      </table>
      <div class="mt-20 p-20 d-flex align-center justify-content-center">
          <md-button class="md-simple md-black maryoku-btn mr-10">Clear Selections</md-button>
          <md-button class="md-red maryoku-btn" @click="bookCart">Proceed To Checkout</md-button>
      </div>

      <vsa-list>
        <vsa-item>
          <vsa-heading>
              MY FAVORITE
          </vsa-heading>
          <vsa-content>
              <table width="100%">
                  <tr v-for="proposal in proposals"
                      :key="`${proposal.id}`"
                      class="d-flex align-center"
                  >
                      <td width="75%" class="d-flex align-center py-20">
                          <img :src="`${$iconURL}Budget+Elements/${serviceCategory(proposal.vendor.vendorCategory).icon}`" style="width: 30px"/>
                          <div class="ml-10">
                              <p class="mb-5 font-size-14 font-bold-extra">{{ proposal.vendor.companyName }}</p>
                              <p class="m-0 font-size-14 color-black-middle">{{ serviceCategory(proposal.vendor.vendorCategory).fullTitle }}</p>
                          </div>

                      </td>
                      <td width="25%" class="py-20">
                          ${{proposal.cost | withComma}}
                      </td>
                      <td width="10%" class="py-20">
                          <md-menu md-size="auto" class="action-menu" :md-offset-x="-300" :md-offset-y="-36" @md-opened="isOpened">
                              <md-button md-menu-trigger class="edit-btn md-simple" style="height: 30px">
                                  <md-icon style="font-size: 30px !important">more_vert</md-icon>
                              </md-button>
                              <md-menu-content>
                                  <md-menu-item @click="toCart(proposal)" class="md-red">
                            <span>
                              <img :src="`${$iconURL}comments/SVG/heart-dark.svg`" class="label-icon-40 mr-10" />
                              Move to Cart</span>
                                  </md-menu-item>
                                  <md-menu-item @click="removeFavorite(proposal)" class="md-red">
                            <span>
                              <img :src="`${$iconURL}VendorsProposalPage/group-11314.svg`" class="label-icon ml-10 mr-20" />
                              Remove from Favorite
                            </span>
                                  </md-menu-item>
                              </md-menu-content>
                          </md-menu>
                      </td>
                  </tr>


              </table>
          </vsa-content>
        </vsa-item>
        <vsa-item>
          <vsa-heading>
              VENDORS YOU ALREADY BOOKED
          </vsa-heading>
          <vsa-content>
              vendors
          </vsa-content>
        </vsa-item>
      </vsa-list>
    </div>
  </div>
</template>
<script>
import { VsaList, VsaItem, VsaHeading, VsaContent, VsaIcon } from "vue-simple-accordion";
import "vue-simple-accordion/dist/vue-simple-accordion.css";
import ProgressRadialBar from "./components/ProgressRadialBar";
import RequirementTagItem from "./components/RequirementTagItem.vue";
import _ from "underscore";

export default {
  components: {
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon,
    ProgressRadialBar,
    RequirementTagItem,
  },
  data() {
    return {
      listOfItems: [
        { heading: "Venue", content: "ASFASDFAs" },
        { heading: "Catering", content: "ASFASDFAs" },
        { heading: "Photography", content: "ASFASDFAs" },
      ],
      subCategorySections: [],
    };
  },
  created() {
  },
  methods: {
    close() {
      this.$emit("close");
    },
    removeSelectedType(type) {
      console.log(type);
    },
    hasBudget(categoryKey) {
      return !!this.event.components.find((item) => item.componentId == categoryKey);
    },
    isOpened() {
      setTimeout((_) => {
          $("li.md-list-item").hover(
              function (el) {
                  $(this).find("img").attr("style", "filter:brightness(0) invert(1)");
              },
              function () {
                  $(this).find("img").attr("style", "filter:brightness(0) invert(0)");
              },
          );
      }, 0);
    },
    toFavorite(item){
      this.$store.dispatch('event/updateProposal', {
          proposal: {...item.proposal, isFavorite: true},
          category: item.category,
      });
    },
    toCart(proposal){
      this.$store.dispatch('planningBoard/updateCartItem',{
        category: proposal.vendor.vendorCategory,
        event: {id: this.event.id},
        proposalId: proposal.id,
      })
      this.$store.dispatch('event/updateProposal', {
        proposal: {...proposal, isFavorite: false},
        category: proposal.vendor.vendorCategory,
      });
    },
    removeCart(item){
      this.$store.dispatch('planningBoard/removeCartItem', {id: item.id, event: this.event});
    },
    removeFavorite(proposal){
      this.$store.dispatch('event/updateProposal', {
          proposal: {...proposal, isFavorite: false},
          category: proposal.vendor.vendorCategory,
      });
    },
    bookCart(){
      this.$router.push({name: 'CheckoutWithCart', params:{eventId: this.event.id}});
    },
    serviceCategory(category) {
      return this.$store.state.common.serviceCategories.find(it => it.key === category);
    },
  },

  computed: {
    event() {
      return this.$store.state.event.eventData;
    },
    proposals(){
      let proposals = [];
      Object.keys(this.$store.state.event.proposals).map(key => {
          proposals = proposals.concat(this.$store.state.event.proposals[key]);
      })
      return proposals.filter(p => !!p.isFavorite);
    },
    cartItems() {
      const categoryKeys = Object.keys(this.$store.state.planningBoard.cart);
      const cartItems = [];
      categoryKeys.forEach((categoryKey) => {
        if(!this.$store.state.planningBoard.cart[categoryKey].proposal.isFavorite){
          const category = this.serviceCategory(categoryKey);
          if (category) {
            cartItems.push(category);
          }
        }
      });
      cartItems.sort((a, b) => a.order - b.order);
      return cartItems;
    },
    cart() {
      return this.$store.state.planningBoard.cart;
    },
    totalPrice(){
      if(!this.cartItems.length) return 0;
      return this.cartItems.reduce((s, item) => {
          return s + this.cart[item.key].proposal.cost;
      }, 0);
    },
    percentOfBudgetCategories() {
      return Object.keys(this.cart).length;
    },
  },
  watch:{
    proposal(newVal){}
  }
};
</script>
<style lang="scss" scoped>
.requirements-cart {
  position: fixed;
  width: 600px;
  height: 100vh;
  background-color: white;
  top: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  overflow: auto;
  .category-icon {
    width: 30px;
  }
  &-header {
    padding: 40px;
    display: flex;

    .close-btn {
      position: absolute;
      top: 10px;
      right: 0px;
    }
  }
  .vsa-list {
    --vsa-heading-padding: 1rem 2.5rem;
    --vsa-content-padding: 1rem 2.5rem;
    border: none;
    .vsa-item {
      border: none;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
      margin-top: 8px;
    }
    /deep/ .vsa-item__heading {
      border: none;
      cursor: pointer;
      .vsa-item__trigger {
        background-color: white;
        color: black;
      }
    }
    /deep/ .vsa-item__trigger__icon--is-default:after,
    /deep/ .vsa-item__trigger__icon--is-default:before {
      content: "";
      height: 2px;
      position: absolute;
      top: 0px;
      transition: all 0.13333s ease-in-out;
      width: 16px;
      background-color: #818080;
    }
    /deep/ .vsa-item__trigger__icon--is-default:after {
      transform: rotate(-50deg) translate3d(-24px, 14px, 0);
    }
    /deep/ .vsa-item__trigger__icon--is-default:before {
      transform: rotate(50deg) translate3d(24px, 14px, 0);
    }
    /deep/ .vsa-item--is-active {
      .vsa-item__trigger__icon--is-default {
        transform: rotate(-180deg);
      }
    }
  }
  .requirement-grid {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .requirement-item {
      margin-bottom: 20px;
      text-transform: capitalize;
      padding-right: 15px;
      min-width: 30%;
      padding-right: 20px;
      display: inline-block;
    }
  }
  .checkmark {
    display: inline-block;
    margin-right: 5px;
    margin-top: 0.4em;
    &:after {
      /*Add another block-level blank space*/
      content: "";
      display: block;

      /*Make it a small rectangle so the border will create an L-shape*/
      width: 6px;
      height: 10px;

      /*Add a white border on the bottom and left, creating that 'L' */
      border: solid #f51355;
      border-width: 0 3px 3px 0;
      border-radius: 1px;

      /*Rotate the L 45 degrees to turn it into a checkmark*/
      transform: rotate(45deg);
    }
  }
}
</style>
