<template>
  <div class="plannig-service-category-card white-card" :class="{ 'longer-card': isLong }">
    <template v-if="!isSentRequest || selectedServices.length === 0">
      <carousel v-if="!musicPlayer" :items="1" :margin="0" :nav="false" :loop="true" class="header-carousel">
        <template slot="prev">
          <span class="prev handle-btn">
            <md-icon>keyboard_arrow_left</md-icon>
          </span>
        </template>
        <div v-for="(image, index) in serviceCategory.images" :key="image" class="carousel-item">
          <md-button
            class="md-simple md-icon-button md-raised save-btn"
            :class="{ isSelected: selectedServices.includes(serviceCategory.imageTitles[index]) }"
            @click="addService(serviceCategory.imageTitles[index])"
            v-show="hasBudget"
          >
            <img
              v-if="!selectedServices.includes(serviceCategory.imageTitles[index])"
              class="non-selected"
              :src="`${$iconURL}comments/SVG/heart-dark.svg`"
            />
            <img v-else :src="`${$iconURL}Requirements/Group+16153.svg`" />
          </md-button>
          <img class="carousel-image" :src="`${$storageURL}RequirementsImages/thumbnails/${image}`" />
          <label>{{ serviceCategory.imageTitles[index] }}</label>
        </div>

        <template slot="next">
          <span class="next handle-btn">
            <md-icon>keyboard_arrow_right</md-icon>
          </span>
        </template>
      </carousel>
      <carousel v-else :items="1" :margin="0" :nav="false" :loop="true" class="header-carousel">
        <template slot="prev">
          <span class="prev handle-btn d-none" ref="prevButton">
            <md-icon>keyboard_arrow_left</md-icon>
          </span>
        </template>
        <div v-for="(clip, index) in serviceCategory.clips" :key="clip" class="carousel-item">
          <md-button
            class="md-simple md-icon-button md-raised save-btn"
            :class="{ isSelected: selectedServices.includes(serviceCategory.imageTitles[index]) }"
            @click="addService(serviceCategory.imageTitles[index])"
            v-show="hasBudget"
          >
            <img
              v-if="!selectedServices.includes(serviceCategory.imageTitles[index])"
              class="non-selected"
              :src="`${$iconURL}comments/SVG/heart-dark.svg`"
            />
            <img v-else :src="`${$iconURL}Requirements/Group+16153.svg`" />
          </md-button>
          <img
            class="carousel-image"
            :src="`${$storageURL}RequirementsImages/thumbnails/Music Images/${serviceCategory.images[index]}`"
          />
          <music-player
            class="player"
            :title="serviceCategory.clipTitles[index]"
            :src="`${$storageURL}RequirementsImages/thumbnails/${clip}`"
            @next="next"
            @prev="prev"
          ></music-player>
        </div>

        <template slot="next">
          <span class="next handle-btn d-none" ref="nextButton">
            <md-icon>keyboard_arrow_right</md-icon>
          </span>
        </template>
      </carousel>
      <div class="p-20 font-bold d-flex align-center justify-content-between card-info">
        <span class="service-name">{{ serviceCategory.name }}</span>
        <template v-if="hasBudget">
          <md-button v-show="selectedServices.length > 0" class="md-red maryoku-btn" @click="getSpecification">
            Get Specific
          </md-button>
        </template>
        <template v-else>
          <md-button class="md-simple edit-btn md-red" @click="showAddBudgetConfirm = true"> Add To Budget </md-button>
        </template>
      </div>
    </template>
    <div class="issued-card flex-1 d-flex" v-else>
      <div class="flex-1 icon-section d-flex align-center flex-column justify-content-center">
        <img :src="`${$iconURL}${popperIcons[serviceCategory.serviceCategory]}`" />
        <div class="service-name color-red font-size-20 font-bold">{{ serviceCategory.name }}</div>
      </div>
      <div class="p-20 font-bold d-flex align-center justify-content-center card-info">
        <md-button v-show="selectedServices.length > 0" class="md-red maryoku-btn md-simple" @click="getSpecification">
          Change specifications
        </md-button>
      </div>
    </div>
    <add-budget-modal
      v-if="showAddNewCategory"
      :serviceCategory="serviceCategory"
      @cancel="showAddNewCategory = false"
      @save="saveBudget"
    ></add-budget-modal>
    <add-budget-confirm-modal
      v-if="showAddBudgetConfirm"
      :serviceCategory="serviceCategory"
      @cancel="showAddBudgetConfirm = false"
      @addNewBudget="addBudget"
    >
    </add-budget-confirm-modal>
  </div>
</template>
<script>
import carousel from "vue-owl-carousel";
import Popper from "vue-popperjs";
import "vue-popperjs/dist/vue-popper.css";
import MusicPlayer from "./MusicPlayer.vue";
import { camelize } from "@/utils/string.util";
import AddBudgetModal from "./modals/AddBudget.vue";
import AddBudgetConfirmModal from "./modals/AddBudgetConfirm";
export default {
  components: {
    carousel,
    Popper,
    MusicPlayer,
    AddBudgetModal,
    AddBudgetConfirmModal,
  },
  data() {
    return {
      showAddNewCategory: false,
      showAddBudgetConfirm: false,
      selected: false,
      selectedServices: [],
      popperIcons: {
        venuerental: "SentReqIcn/Group 18964.svg",
        decor: "SentReqIcn/Group 18012.svg",
        foodandbeverage: "SentReqIcn/group-18973.svg",
        entertainment: "SentReqIcn/Group 18967.svg",
        swag: "SentReqIcn/Group 18008.svg",
        audiovisualstagingservices: "SentReqIcn/Group 18015.svg",
        administration: "SentReqIcn/Group 18026.svg",
        transportation: "SentReqIcn/Group 18016.svg",
        giveaways: "SentReqIcn/Group 18014.svg",
        meetingorganizationfees: "SentReqIcn/Group 18008.svg",
        shipping: "SentReqIcn/Group 18008.svg",
        signageprinting: "SentReqIcn/Group 19854.svg",
        securityservices: "SentReqIcn/Group 19857.svg",
        videographyandphotography: "SentReqIcn/Group 18009.svg",
        equipmentrentals: "SentReqIcn/Group 18010.svg",
      },
    };
  },
  props: {
    serviceCategory: {
      type: Object,
      default: () => {},
    },
    isLong: {
      type: Boolean,
      default: false,
    },
    hasBudget: {
      type: Boolean,
      default: false,
    },
    musicPlayer: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Array,
      default: () => [],
    },
    isSentRequest: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.selectedServices = [...this.defaultData];
  },
  methods: {
    selectSave() {},
    prev() {
      this.$refs.prevButton.click();
    },
    next() {
      this.$refs.nextButton.click();
    },
    getSpecification() {
      this.$emit("showSpecific", { category: this.serviceCategory, services: this.selectedServices });
    },
    addService(serviceName) {
      const serviceIndex = this.selectedServices.findIndex((item) => item === serviceName);
      if (serviceIndex < 0) {
        this.selectedServices.push(serviceName);
      } else {
        this.selectedServices.splice(serviceIndex, 1);
      }
      this.$emit("update", {
        category: this.serviceCategory,
        services: this.selectedServices,
        type: camelize(this.serviceCategory.name),
      });
    },
    addBudget() {
      this.showAddBudgetConfirm = false;
      this.showAddNewCategory = true;
    },
    saveBudget() {
      this.showAddNewCategory = false;
    },
  },
  watch:{
    defaultData(newVal){
        console.log('defaultData.watch', newVal);
        this.selectedServices = [...this.defaultData];
    }
  }
};
</script>
<style lang="scss" scoped>
.plannig-service-category-card {
  border-radius: 3px;
  position: relative;
  height: 400px;
  display: flex;
  flex-direction: column;
  .issued-card {
    flex-direction: column;
    .icon-section {
      background-color: #f3f7fd;
      width: 100%;
    }
  }
  .header-carousel {
    flex: 1;
    max-height: calc(100% - 80px);
  }
  .service-name {
    display: inline-block;
    line-height: 46px;
  }
  &.longer-card {
    height: 600px;
    img.carousel-image {
      height: 100%;
      width: 100%;
      max-height: 100%;
      max-width: 100%;
      object-fit: cover;
    }
  }
  img.carousel-image {
    height: 100%;
    object-fit: cover;
  }
  .carousel-item {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.4;
    }
    label,
    .player {
      position: absolute;
      left: 50%;
      top: 50%;
      color: white;
      font-weight: bold;
      line-height: 1.2em;
      transform: translate(-50%, -50%);
      font-size: 30px;
      text-align: center;
    }
    .player {
      width: 100%;
      padding: 50px;
    }
  }
  .save-btn {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 50px;
    height: 50px;
    z-index: 2;
    background: white !important;
    border-radius: 50%;
    &.isSelected {
      background-color: transparent !important;
      padding: 0;
      // /deep/ .md-ripple {
      //   padding: 0 !important;
      // }
      // border: solid 1px #f51355;
    }
    /deep/ .md-ripple {
      padding: 0px;
    }
    img.non-selected {
      padding: 3px;
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
  .header-carousel {
    position: relative;
    /deep/ span[id*="carousel_prev_"] {
      display: block !important;
    }

    /deep/ .carousel-item,
    /deep/ .owl-item,
    /deep/ .owl-carousel,
    /deep/ .owl-stage,
    /deep/ .owl-stage-outer {
      height: 100%;
    }
    /deep/ .owl-dots {
      position: absolute;
      margin-top: -40px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      .owl-dot {
        &.active {
          span {
            background-color: #f51355;
          }
        }
        span {
          background-color: white;
          margin: 5px;
        }
      }
    }
    .handle-btn {
      background-color: white !important;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      cursor: pointer;
      i {
        color: #050505;
      }
      &.next {
        right: 20px;
      }
      &.prev {
        left: 20px;
      }
    }
  }
  .popper-content {
    padding: 40px;
    box-shadow: 0 3px 41px 0 rgba(0, 0, 0, 0.26);
    text-align: left;
  }
  .card-info {
    min-height: 80px;
  }
}
</style>
