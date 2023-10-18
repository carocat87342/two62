<template>
  <div class="md-layout ">
    <div class="md-layout md-layout-item md-size-100 md-offset">
      <div class="md-layout-item md-size-75">
        <h2>Proposal for <span class="text-rose">{{ proposalData.name }}</span></h2>
      </div>
      <div class="md-layout-item md-size-25 ml-auto ranking">
        Vendor Ranking - <span class="text-rose">{{ proposalData.rate }}<md-icon>star</md-icon></span>
      </div>
    </div>

    <div class="md-layout  md-layout-item md-size-100">
      <div class="md-layout-item md-size-75">
        <div class="big-pic">
          <img v-if="currentImage" :src="currentImage.src" @click="openGallery(currentIndex)">
        </div>
        <ul class="gallery-list-wrapper">
          <li v-for="(image, index) in images"
              :key="'gallery-images-'+index"
              :class="{'active': index === currentIndex }"
              class="gallery-item"
              style="display: inline-block">
            <img style="height: 100px"
                 @click="changeCurrentImage(index)">
          </li>
        </ul>
        <LightBox :images="images"
                  ref="lightbox"
                  :show-caption="true"
                  :show-light-box="false">
        </LightBox>
      </div>

      <div class="md-layout-item md-size-25 ml-auto">
        <div class="proposal-sidebar-wrapper">
          <div class="md-layout md-layout-item md-size-100 text-center">
            <h2 class="mb0">${{ proposalData.budget }}</h2>
          </div>
          <div class="md-layout md-layout-item md-size-100 text-center total-text">
            Total Cost for Event
          </div>
          <div class="md-layout-item md-size-100">
            <slider v-model="sliderCheaper" disabled></slider>
            <div class="text text-center offer-text">
              This offer is {{ sliderCheaper }}% cheaper than the lowest offer you have
            </div>
          </div>
          <div class="md-layout-item md-size-100 text-center terms-text">
            Terms and conditions text, including for how long the offer is relevant, terms for cancellation and terms for payment and installments
          </div>

          <hr/>
          <div class="md-layout-item md-size-100">
            <h3>Included in Price</h3>
            <div class="md-layout-item md-size-100" v-for="(item, index) in proposalData.included" :key="'proposalData-'+index">
              <md-checkbox v-model="checked" class="readonly" :key="item">{{ item }}</md-checkbox>
            </div>
          </div>

        </div>
        <div class="md-layout">
          <md-button class="md-success sidebar-button">Save to Event Option</md-button>
        </div>
        <div class="md-layout">
          <md-button class="md-info sidebar-button">Chat With Vendor</md-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
import LightBox from 'vue-image-lightbox'
import { Slider } from '@/components'

Vue.use(VueLazyLoad)
export default {
  components: {
    LightBox,
    Slider
  },
  methods: {
    openGallery (index) {
      this.$refs.lightbox.showImage(index)
    },
    changeCurrentImage (index) {
      this.currentImage = this.images[index]
      this.currentIndex = index
    }
  },
  data () {
    return {
      proposalData: {
        name: null,
        rate: null,
        budget: null,
        cheaper: null,
        includes: null
      },
      images: [
        {
          thumb: 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
          src: 'https://s3-us-west-1.amazonaws.com/powr/defaults/image-slider2.jpg',
          caption: '<h4>Elephant</h4>'
        },
        {
          thumb: 'https://i-kinhdoanh.vnecdn.net/2018/06/18/1-1529296929_680x0.jpg',
          src: 'https://i-kinhdoanh.vnecdn.net/2018/06/18/1-1529296929_680x0.jpg',
          caption: '<h4>Messi</h4>'
        },
        {
          thumb: 'https://i-thethao.vnecdn.net/2018/05/27/775162441-MR-2031-8E033EFCEBB928DC12A2A0AA3CEC4C33-21885-1527376486_680x0.jpg',
          src: 'https://i-thethao.vnecdn.net/2018/05/27/775162441-MR-2031-8E033EFCEBB928DC12A2A0AA3CEC4C33-21885-1527376486_680x0.jpg',
          caption: '<h4>Bale and Marcelo</h4>'
        },
        {
          thumb: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379562_680x0.png',
          src: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379562_680x0.png',
          caption: '<h4>Madrid crowd</h4>'
        },
        {
          thumb: 'https://i-thethao.vnecdn.net/2018/05/27/000-15E0DG-1527379049_680x0.jpg',
          src: 'https://i-thethao.vnecdn.net/2018/05/27/000-15E0DG-1527379049_680x0.jpg',
          caption: '<h4>Zidane</h4>'
        },
        {
          thumb: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379346_680x0.png',
          src: 'https://i-thethao.vnecdn.net/2018/05/27/Screen-Shot-2018-05-27-at-7-1527379346_680x0.png',
          caption: '<h4>Bale kissed the cup</h4>'
        }

      ],
      currentImage: null,
      currentIndex: null,
      sliderCheaper: null,
      checked: true
    }
  },
  mounted () {
    this.currentImage = this.images[0]
    this.currentIndex = 0
    this.proposalData = {
      name: 'Event name',
      rate: 7.2,
      budget: 3100,
      cheaper: 50,
      included: [
        'Premium Bar',
        '500 Guests',
        'Event Manager',
        'Cleaning Services',
        'Internet',
        'Sound and Light'
      ]
    }
    this.sliderCheaper = this.proposalData.cheaper
  }
}
</script>

<style lang="scss">
  @import 'vue-image-lightbox/dist/vue-image-lightbox.min.css';

  .gallery-list-wrapper {
    padding-left: 0;
    margin-left: -5px;

    .gallery-item {
      margin: 5px;
      cursor: pointer;

      &.active {
        outline: 2px solid #00d3ee;
        cursor: default;
      }
    }
  }
  .big-pic {
    height: 350px;

    img {
      max-height: 100%;
      cursor: pointer;
    }
  }
  .proposal-sidebar-wrapper {
    border: 2px solid #00d3ee;
    margin-bottom: 20px;

    .readonly {
      pointer-events: none;
    }
  }
  .sidebar-button {
    width: 100%;
  }
  .text-center {
    text-align: center;
  }
  .ranking {
    text-align: right;
    font-size: 20px;
  }
  .total-text {
    font-size: 20px;
  }
  .terms-text {
    font-size: 14px;
    margin-bottom: 15px;
    margin-top: 30px;
  }
  .mb0 {
    margin-bottom: 0;
    margin-top: 10px;
  }
</style>
