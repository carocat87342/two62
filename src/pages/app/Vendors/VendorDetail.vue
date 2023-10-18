<template>
  <div class="vendor-detail-page">
      <comment-editor-panel
          v-if="showCommentEditorPanel"
          :commentComponents="commentComponents"
          @saveComment="saveComment"
          @updateComment="updateComment"
          @deleteComment="deleteComment"
          @updateCommentComponent="updateCommentComponent"
      >
      </comment-editor-panel>
    <div class="vendor-detail-header">
      <div class="vendor-detail-title">
        <span style="vertical-align: middle" class="font-size-40 font-bold">{{ vendor.companyName }}</span>
        <span style="vertical-align: middle" class="ml-10">
          <md-icon style="color: #ffc001">star</md-icon> {{ vendor.rank }}
          <span class="color-gray ml-10">(no reviews)</span>
          <span class="color-red font-bold ml-20"> This vendor didn't any event yet!</span>
        </span>
      </div>
      <div class="vendor-detail-basic">
        <ul class="d-flex">
          <li>
            <img :src="`${$iconURL}NewSubmitPorposal/Asset 593.svg`" />
            <span>{{ vendor.vendorMainEmail }}</span>
          </li>
          <li>
            <img :src="`${$iconURL}NewSubmitPorposal/Asset 573.svg`" />
            <span>{{ vendor.vendorAddressLine1 }}</span>
          </li>
          <li v-if="vendor.vendorMainPhoneNumber">
            <img :src="`${$iconURL}NewSubmitPorposal/Asset 591.svg`" />
            <span>{{ vendor.vendorMainPhoneNumber }}</span>
          </li>
          <template v-for="social in socialList">
            <li v-if="vendor.social && vendor.social[social.name]" :key="social.name">
              <a :href="vendor.social[social.name]" target="_blank"
                ><img :src="`${$iconURL}Vendor Signup/${social.icon}`"
              /></a>
            </li>
          </template>
        </ul>
      </div>
      <header-actions @toggleCommentMode="toggleCommentMode" @share="share"></header-actions>
    </div>
    <div class="vendor-detail-tab-wrapper">
      <div class="tabs">
        <div class="tab text-center font-bold active">
          <img class="page-icon" :src="`${$iconURL}Budget Elements/${vendor.eventCategory.icon}`" />
          {{ vendor.eventCategory.fullTitle }}
        </div>
      </div>
    </div>
    <vendor-detail-content :vendor="vendor"></vendor-detail-content>
    <div class="vendor-detail-footer">
      <md-button @click="scrollToTop" class="md-button md-simple md-just-icon md-theme-default scroll-top-button">
        <img :src="`${$iconURL}Budget+Requirements/Asset+49.svg`" width="17" />
      </md-button>
      <md-button class="md-simple maryoku-btn md-black" @click="$router.push(('/vendors-pool'))">
        <md-icon>keyboard_backspace</md-icon>
        Back</md-button
      >
    </div>
  </div>
</template>
<script>
import Vendors from "@/models/Vendors";
import CommentEditorPanel from "@/pages/app/Events/components/CommentEditorPanel";
import {CommentMixins, ShareMixins} from "@/mixins";
import { socialIcons } from "@/constants/links.js";
import { Tabs, Modal } from "@/components";
import VendorDetailContent from "./VendorDetailContent";
import HeaderActions from "@/components/HeaderActions";
export default {
  components: {
    CommentEditorPanel,
    Tabs,
    VendorDetailContent,
    HeaderActions,
  },
  mixins: [CommentMixins, ShareMixins],
  data() {
    return {
      showCommentEditorPanel: false,
      vendor: {},
      socialList: socialIcons,
    };
  },
  created() {
    this.getVendorData();
  },
  methods: {
    getVendorData() {
      const vendorId = this.$route.params.id;
      Vendors.find(vendorId).then((res) => {
        console.log("vendor", res);
        this.vendor = res;
      });
    },
    toggleCommentMode(mode) {
      this.showCommentEditorPanel = mode;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
  computed: {
    availableSocials() {
      return Object.keys(this.vendor.social).filter((item) => item);
    },
  },
};
</script>
<style lang="scss" scoped>
.vendor-detail-page {
  .vendor-detail-header {
    .header-actions {
      position: absolute;
      right: 60px;
      top: 60px;
    }
    background-color: #fff;
    padding: 60px 60px 60px 120px;
    .vendor-detail-basic {
      ul {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0;
        margin-top: 20px;
        li {
          font-size: 16px;
          margin-right: 40px;
          span {
            text-decoration: underline;
          }
          img {
            width: 26px;
            height: 26px;
            margin-right: 14px;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .vendor-detail-tab-wrapper {
    border-top: solid 1px #818080;
    background-color: white;
    .tabs {
      margin-left: 120px;
      .tab {
        min-height: 60px;
        line-height: 60px;
        width: 300px;
        border-right: solid 1px #818080;
        border-left: solid 1px #818080;
        &.active {
          border-bottom: solid 3px #f51355;
        }
      }
    }
  }
  .vendor-detail-footer {
    background-color: white;
    padding: 20px 120px;
  }
}
</style>
