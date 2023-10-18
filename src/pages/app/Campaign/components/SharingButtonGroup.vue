<template>
  <div class="d-flex sharing-button-group-content">
    <ul class="d-flex sharing-button-group">
      <li @click="shareSocial('linkedin')" data-social="linkedin">
        <img :src="`${$iconURL}Campaign/Image+170.png`" />
      </li>
      <li>
        <!--  -->
        <a
          v-if="sharingData"
          :href="`http://www.pinterest.com/pin/create/button/?url=${encodeURI(sharingData.pageUrl)}&media=${encodeURI(
            sharingData.mediaUrl,
          )}&description=test`"
          target="_blank"
          class="pinterest-anchor pinterest-hidden"
        >
          <img :src="`${$iconURL}Campaign/Image+169.png`" />
          <!-- <div class="pinterest-logo"></div> -->
        </a>
        <!-- <img src="<picture url>" data-pin="pinIt" alt="tess" /> -->
      </li>
      <li @click="shareSocial('gmail')" data-social="gamil"><img :src="`${$iconURL}Campaign/Image+75.png`" /></li>
      <li @click="shareSocial('whatsapp')" data-social="whatsapp"><img :src="`${$iconURL}Campaign/Image+74.png`" /></li>
      <li @click="shareSocial('outlook')" data-social="outlook"><img :src="`${$iconURL}Campaign/Image+76.png`" /></li>
      <li @click="shareSocial('facebook')" data-social="facebook">
        <img :src="`${$iconURL}Campaign/Image+168.png`" />
      </li>
    </ul>
    <md-button class="md-simple md-red normal-btn" v-if="copyLink">
      <img :src="`${$iconURL}Campaign/Path 2639.svg`" /><span>Copy Link</span>
    </md-button>
  </div>
</template>
<script>
export default {
  props: {
    copyLink: {
      type: Boolean,
      default: true,
    },
    sharingData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      socialLinks: {
        linkedin: "https://linkedin.com",
        pinterest: "https://pinterest.com",
        gmail: "https://gmail.com",
        whatsapp: "whatsapp://send?text=The text to share!",
        outlook: "https://outlook.com",
        facebook: "https://facebook.com",
      },
    };
  },
  methods: {
    shareSocial(socialType) {
      if (socialType === "linkedin") {
        var title = "Maryoku RSVP";
        var text = "Replace this with your share copy.";
        window.open(
          `http://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            sharingData.pageUrl,
          )}&title=${title}`,
          "",
          "left=0,top=0,width=650,height=420,personalbar=0,toolbar=0,scrollbars=0,resizable=0",
        );
      } else if (socialType === "whatsapp") {
        window.open(`whatsapp://send?text=${this.sharingData.pageUrl}`);
      } else {
        var win = window.open(this.socialLinks[socialType], "_blank");
        win.focus();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.sharing-button-group {
  padding: 0;
  list-style: none;
  border: solid 1px #999999;
  border-radius: 3px;
  width: max-content;
  li {
    width: 64px;
    text-align: center;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  li:not(:last-child) {
    border-right: solid 1px #999999;
  }
}
@media only screen and (max-width: 959px) {
  .sharing-button-group {
    width: 100%;
    flex-flow: wrap;
    li {
      border: none !important;
      width: 33%;
    }
  }
}
</style>
