<template>
  <div class="event-vison">
    <div class="event-vision-wrapper p-40 white-card proposal-add-personal-message-wrapper mt-40">
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
    <div class="mt-40 white-card p-40" v-if="vendor.vendorCategory === 'venuerental'">
      <div class="d-flex justify-content-start align-center">
        <img :src="`${$iconURL}common/seating-purple.png`" />
        <div class="ml-20">
          <div class="font-size-30 font-bold">Requested seating arrangement</div>
          <div>Please select up to 2 options</div>
        </div>
      </div>
      <div class="special-request-section-options mt-40">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-100 mt-20 mb-20"
            v-for="(option, index) in sittingArrangement.options"
            :key="index"
          >
            <div>
              <md-checkbox class="md-simple md-vendor" v-model="option.selected" @change="changeItem">
                <span>{{ option.item }}</span>
              </md-checkbox>
              <div class="ml-30 color-gray">
                <span class="font-bold">Popular for:</span>
                {{ option.popular }}
                <div>
                  <img :src="`${$iconURL}Requirements/${option.icon}`" />
                </div>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-50 md-small-size-100">
            <div class="d-flex">
              <md-checkbox class="md-simple md-vendor" v-model="sittingArrangement.hasOtherOption">
                <span class="font-bold">Other:</span>
              </md-checkbox>
              <maryoku-input class="flex-1" v-model="sittingArrangement.otherOptionContent"></maryoku-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import S3Service from "@/services/s3.service";
import ProposalInspirationalPhotos from "./ProposalInspirationalPhotos.vue";
import { SeatingOptions } from "@/constants/specialData";
import MaryokuInput from "@/components/Inputs/MaryokuInput.vue";

export default {
  components: {
    vueDropzone: vue2Dropzone,
    ProposalInspirationalPhotos,
    MaryokuInput,
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
      editingNewSeating: false,
    };
  },
  methods: {
    async imageSelected(file) {
      const imageData = await getBase64(file);
      const extension = file.type.split("/")[1];
    },
    changeItem() {
      this.$store.commit("proposalForNonMaryoku/setSeatingData", this.sittingArrangement);
    },
  },
  computed: {
    seatingData(){
      return this.$store.state.proposalForNonMaryoku.seatingData;
    },
    sittingArrangement() {
      console.log('sittingArrangement', this.seatingData);
      if (this.seatingData) {
        return this.seatingData
      } else {
        return {options: SeatingOptions}
      }
    },
    eventVision: {
      get() {
        return this.$store.state.proposalForNonMaryoku.eventVision;
      },
      set(value) {
        this.$store.commit("proposalForNonMaryoku/setValue", { key: "eventVision", value });
      },
    },
    vendor() {
      return this.$store.state.proposalForNonMaryoku.vendor;
    }
  },
};
</script>
<style lang="scss" scoped>
.event-vison {
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
  .seat-type {
    margin-right: 30px;
    position: relative;
    padding: 10px;
    &.suggested-seat {
      display: flex;
      justify-content: start;
      align-items: center;
    }
    &::after {
      content: "Or";
      position: absolute;
      left: 100%;
      top: 50%;
    }
    &:last-child::after {
      content: "";
      display: none !important;
    }
  }
}
</style>
