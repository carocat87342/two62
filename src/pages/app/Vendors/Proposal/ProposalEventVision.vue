<template>
  <div class="event-vision-wrapper proposal-add-personal-message-wrapper mt-40">
    <template v-if="event.concept">
      <div class="conceptTitle font-size-40 line-height-1 mb-20">{{ event.concept.name }}</div>
      <div class="d-flex concept-image-wrapper">
        <div
          v-for="(color, index) in event.concept.colors"
          :key="index"
          class="concept-color"
          :style="`background: ${color.color || '#EDEDED'}`"
        >
          <img class="concept-image" v-if="event.concept.images[index]" :src="`${event.concept.images[index].url}`" />
        </div>
      </div>
      <div class="concept-description mt-30 mb-30">
        {{ event.concept.description }}
      </div>
    </template>
    <div class="font-size-30 font-bold-extra mt-30 mb-30">
      <img :src="`${$iconURL}Vendor+Landing+Page/Asset+491.svg`" class="page-icon" />
      How does your vision of the event fit in with the concept?
    </div>
    <textarea placeholder="Write your intentions here…." v-model="eventVision"></textarea>
    <div class="mt-50">
      <div>
        <span class="font-size-30 font-bold-extra">
          <img :src="`${$iconURL}Vendor+Landing+Page/art.svg`" class="page-icon mr-10" />
          Upload Inspirational Photos
        </span>
        <span style="padding: 5px">(15 photos under 5M each)</span>
      </div>
      <div style="padding: 10px 10px 30px 40px">Photos that could fit in with the concept</div>
      <proposal-inspirational-photos></proposal-inspirational-photos>
    </div>
  </div>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";
import ProposalInspirationalPhotos from "./ProposalInspirationalPhotos.vue";

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ProposalInspirationalPhotos,
  },
  props: {
    event: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 10,
      },
    };
  },
  methods: {
    async imageSelected(file) {
      const imageData = await getBase64(file);
      const extension = file.type.split("/")[1];
      // S3Service.fileUpload(file, logoName, "logos").then((res) => {
      //   this.$store.dispatch("campaign/setLogo", { logoUrl: `${this.$uploadURL}logos/${logoName}.${extension}` });
      // });
    },
  },
  computed: {
    eventVision: {
      get() {
        return this.$store.state.vendorProposal.eventVision;
      },
      set(value) {
        this.$store.commit("vendorProposal/setValue", { key: "eventVision", value });
      },
    },
  },
  watch: {
    eventVision:{
        handler(newVal) {
          console.log('eventVision', newVal);
        },
        deep: true,
    }
  }
};
</script>
<style lang="scss" scoped>
.event-vision-wrapper {
  .concept-image-wrapper {
    width: 80%;
    .concept-color {
      width: 25%;
      padding: 2em;
      text-align: center;
      .concept-image {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        object-fit: cover;
        transition: 0.2s;
        &:hover {
          border-radius: 3px;
          transform: scale(2);
          transition: 0.5s;
        }
      }
    }
  }
  .concept-description {
    width: 80%;
  }
  textarea {
    width: 100%;
    resize: none;
    font-size: 16px;
    border-radius: 3px;
    border: solid 0.5px #707070;
    padding: 21px 18px;
    margin-bottom: 15px;
    min-height: 150px;
  }
  .vue-dropzone {
    border: dashed 2px #f51355;
    width: 100%;
    margin: auto;
  }
}
</style>
